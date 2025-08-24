import { customFetch } from "../fetchHelpers.js";

/**
 * AsyncItemFetch - Handles long-running item fetch operations using async job pattern
 *
 * This class manages the async API flow:
 * 1. Start a job and get immediate jobId response
 * 2. Poll for job status with exponential backoff
 * 3. Handle completed/failed/timeout scenarios
 */
export class AsyncItemFetch {
    constructor() {
        this.maxAttempts = 60; // ~2 minutes max with exponential backoff
        this.baseDelay = 1000; // Start with 1 second
        this.maxDelay = 3000; // Cap at 3 seconds
    }

    /**
     * Start an async item fetch job
     * @param {string} url - The URL to fetch item data from
     * @returns {Promise<Object>} - The extracted item data
     */
    async fetchItem(url) {
        if (!url) {
            throw new Error('URL is required');
        }

        // 1. Start the job
        const startResponse = await this.startJob(url);
        if (!startResponse.success) {
            throw new Error(startResponse.error || 'Failed to start job');
        }

        // 2. Poll for status until completion
        return this.pollJobStatus(startResponse.jobId);
    }

    /**
     * Start the async job
     * @private
     */
    async startJob(url) {
        try {
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url })
            };

            return await customFetch('/itemFetch/start', options, true);
        } catch (error) {
            console.error('Error starting item fetch job:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Poll for job status with exponential backoff
     * @private
     */
    async pollJobStatus(jobId) {
        let attempts = 0;

        while (attempts < this.maxAttempts) {
            try {
                const response = await customFetch(`/itemFetch/status/${jobId}`, {}, true);

                if (!response.success) {
                    throw new Error(response.error || 'Failed to check job status');
                }

                // Handle different job statuses
                if (response.status === 'completed') {
                    return response.data;
                }

                if (response.status === 'failed') {
                    throw new Error(response.error || 'Job failed');
                }

                // Job is still processing, wait before next poll
                const delay = Math.min(
                    this.baseDelay + (attempts * 200),
                    this.maxDelay
                );

                await this.sleep(delay);
                attempts++;

            } catch (error) {
                console.error('Error polling job status:', error);
                throw error;
            }
        }

        throw new Error('Job timed out after maximum attempts');
    }

    /**
     * Cancel a running job
     * @param {string} jobId - The job ID to cancel
     * @returns {Promise<Object>} - Cancellation result
     */
    async cancelJob(jobId) {
        try {
            const options = {
                method: 'DELETE'
            };

            return await customFetch(`/itemFetch/cancel/${jobId}`, options, true);
        } catch (error) {
            console.error('Error canceling job:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Get list of user's jobs
     * @param {number} limit - Maximum number of jobs to return
     * @param {number} offset - Number of jobs to skip
     * @returns {Promise<Object>} - List of jobs
     */
    async getUserJobs(limit = 10, offset = 0) {
        try {
            const queryParams = new URLSearchParams({
                limit: limit.toString(),
                offset: offset.toString()
            });

            return await customFetch(`/itemFetch/jobs?${queryParams}`, {}, true);
        } catch (error) {
            console.error('Error fetching user jobs:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Utility function to sleep/delay
     * @private
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

/**
 * Singleton instance for easy import/use
 */
export const asyncItemFetch = new AsyncItemFetch();
