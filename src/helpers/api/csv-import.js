import { customFetch } from "../fetchHelpers.js";

/**
 * Import items from a CSV file (legacy synchronous method)
 * @param {File} csvFile - The CSV file to import from
 * @returns {Promise<{success: boolean, data: Object}|{success: boolean, error: string}>}
 */
export async function importCsvWishlist(csvFile) {
    try {
        if (!csvFile) {
            throw new Error('CSV file is required');
        }

        if (!csvFile.name.toLowerCase().endsWith('.csv')) {
            throw new Error('Please select a valid CSV file');
        }

        if (csvFile.size > 5 * 1024 * 1024) { // 5MB limit
            throw new Error('CSV file must be smaller than 5MB');
        }

        const formData = new FormData();
        formData.append('csvFile', csvFile);

        const options = {
            method: 'POST',
            body: formData
        };

        const result = await customFetch('/wishlistImport/csv', options, true);
        return result;
    } catch (error) {
        console.error('Error importing CSV wishlist:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Import items from a CSV file using async job pattern
 * @param {File} csvFile - The CSV file to import from
 * @returns {Promise<{success: boolean, data: Object}|{success: boolean, error: string}>}
 */
export async function importCsvWishlistAsync(csvFile) {
    try {
        if (!csvFile) {
            throw new Error('CSV file is required');
        }

        if (!csvFile.name.toLowerCase().endsWith('.csv')) {
            throw new Error('Please select a valid CSV file');
        }

        if (csvFile.size > 5 * 1024 * 1024) { // 5MB limit
            throw new Error('CSV file must be smaller than 5MB');
        }

        const formData = new FormData();
        formData.append('csvFile', csvFile);

        const options = {
            method: 'POST',
            body: formData
        };

        // Start async CSV import job
        const startResponse = await customFetch('/csvImport/start', options, true);
        if (!startResponse.success) {
            throw new Error(startResponse.error || 'Failed to start CSV import job');
        }

        // Poll for completion
        const jobId = startResponse.jobId;
        let attempts = 0;
        const maxAttempts = 60;
        const baseDelay = 1000;
        const maxDelay = 3000;

        while (attempts < maxAttempts) {
            const response = await customFetch(`/csvImport/status/${jobId}`, {}, true);

            if (!response.success) {
                throw new Error(response.error || 'Failed to check job status');
            }

            if (response.status === 'completed') {
                return {
                    success: true,
                    data: response.data
                };
            }

            if (response.status === 'failed') {
                throw new Error(response.error || 'CSV import job failed');
            }

            // Wait before next poll with exponential backoff
            const delay = Math.min(baseDelay + (attempts * 200), maxDelay);
            await new Promise(resolve => setTimeout(resolve, delay));
            attempts++;
        }

        throw new Error('CSV import timed out after maximum attempts');

    } catch (error) {
        console.error('Error importing CSV wishlist async:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Validate CSV file client-side before upload
 * @param {File} file - The file to validate
 * @returns {Object} - Validation result with success flag and error message
 */
export function validateCsvFile(file) {
    if (!file) {
        return { success: false, error: 'Please select a file' };
    }

    if (!file.name.toLowerCase().endsWith('.csv')) {
        return { success: false, error: 'Please select a CSV file (.csv extension)' };
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
        return { success: false, error: 'File must be smaller than 5MB' };
    }

    if (file.size === 0) {
        return { success: false, error: 'File cannot be empty' };
    }

    return { success: true };
}

/**
 * Parse CSV content to preview before upload (client-side only, basic validation)
 * @param {File} file - The CSV file to preview
 * @returns {Promise<Object>} - Preview data with headers and row count
 */
export async function previewCsvFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const text = e.target.result;
                const lines = text.split('\n').filter(line => line.trim());

                if (lines.length < 2) {
                    reject(new Error('CSV file must have at least a header row and one data row'));
                    return;
                }

                const headers = lines[0].split(',').map(h => h.trim().replace(/['"]/g, ''));
                const dataRows = lines.slice(1).length;

                // Check for required 'name' column
                if (!headers.some(h => h.toLowerCase() === 'name')) {
                    reject(new Error('CSV file must include a "name" column'));
                    return;
                }

                resolve({
                    success: true,
                    headers,
                    rowCount: dataRows,
                    totalLines: lines.length
                });
            } catch (error) {
                reject(new Error('Failed to parse CSV file: ' + error.message));
            }
        };

        reader.onerror = () => reject(new Error('Failed to read CSV file'));
        reader.readAsText(file);
    });
}
