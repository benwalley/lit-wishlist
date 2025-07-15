import {customFetch} from "../fetchHelpers.js";
import {cachedFetch} from "../caching.js";
import {triggerUpdateMoney} from "../../events/eventListeners.js";

/**
 * Create a new money owed record
 * @param {Object} moneyData - The money owed data
 * @param {number} moneyData.amount - The amount owed
 * @param {number|null} moneyData.owedFromId - ID of the person who owes money
 * @param {string} moneyData.owedFromName - Name of the person who owes money
 * @param {number|null} moneyData.owedToId - ID of the person who is owed money
 * @param {string} moneyData.owedToName - Name of the person who is owed money
 * @param {string} [moneyData.note] - Optional note about the money owed
 * @param {number|null} [moneyData.itemId] - Optional ID of the related item
 * @returns {Promise<{success: boolean, data: Object}|{success: boolean, error: Error}>}
 */
export async function createMoneyOwed(moneyData) {
    try {
        // Validate required fields
        if (!moneyData.amount || !moneyData.owedFromName || !moneyData.owedToName) {
            return { success: false, error: 'Amount, owedFromName, and owedToName are required' };
        }

        // Validate amount is a valid number
        const amount = parseFloat(moneyData.amount);
        if (isNaN(amount) || amount <= 0) {
            return { success: false, error: 'Amount must be a valid positive number' };
        }

        const requestData = {
            amount: amount,
            owedFromId: moneyData.owedFromId || null,
            owedFromName: moneyData.owedFromName,
            owedToId: moneyData.owedToId || null,
            owedToName: moneyData.owedToName,
            note: moneyData.note || '',
            itemId: moneyData.itemId || null
        };

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        };

        const result = await customFetch('/money/', options, true);
        
        if (result.success) {
            triggerUpdateMoney();
        }
        
        return result;
    } catch (error) {
        console.error('Error creating money owed record:', error);
        return { success: false, error };
    }
}

/**
 * Fetch all money owed records for the current user
 * @returns {Promise<{success: boolean, data: Array}|{success: boolean, error: Error}>}
 */
export async function getMoneyOwedRecords() {
    try {
        const response = await cachedFetch('/money/', {}, true);
        
        if (response?.success) {
            return { success: true, data: response.data || [] };
        }

        return { success: false, error: response?.error || 'Failed to fetch money owed records' };
    } catch (error) {
        console.error('Error fetching money owed records:', error);
        return { success: false, error };
    }
}

/**
 * Update an existing money owed record
 * @param {number} recordId - The ID of the record to update
 * @param {Object} moneyData - The updated money owed data
 * @returns {Promise<{success: boolean, data: Object}|{success: boolean, error: Error}>}
 */
export async function updateMoneyOwed(recordId, moneyData) {
    try {
        if (!recordId) {
            return { success: false, error: 'Record ID is required' };
        }

        // Validate required fields
        if (!moneyData.amount || !moneyData.owedFromName || !moneyData.owedToName) {
            return { success: false, error: 'Amount, owedFromName, and owedToName are required' };
        }

        // Validate amount is a valid number
        const amount = parseFloat(moneyData.amount);
        if (isNaN(amount) || amount <= 0) {
            return { success: false, error: 'Amount must be a valid positive number' };
        }

        const requestData = {
            amount: amount,
            owedFromId: moneyData.owedFromId || null,
            owedFromName: moneyData.owedFromName,
            owedToId: moneyData.owedToId || null,
            owedToName: moneyData.owedToName,
            note: moneyData.note || '',
            itemId: moneyData.itemId || null
        };

        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        };

        const result = await customFetch(`/money/${recordId}`, options, true);
        
        if (result.success) {
            triggerUpdateMoney();
        }
        
        return result;
    } catch (error) {
        console.error('Error updating money owed record:', error);
        return { success: false, error };
    }
}

/**
 * Delete a money owed record
 * @param {number} recordId - The ID of the record to delete
 * @returns {Promise<{success: boolean}|{success: boolean, error: Error}>}
 */
export async function deleteMoneyOwed(recordId) {
    try {
        if (!recordId) {
            return { success: false, error: 'Record ID is required' };
        }

        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        };

        const result = await customFetch(`/money/${recordId}`, options, true);
        
        if (result.success) {
            triggerUpdateMoney();
        }
        
        return result;
    } catch (error) {
        console.error('Error deleting money owed record:', error);
        return { success: false, error };
    }
}