import {customFetch} from "../fetchHelpers.js";
import {cachedFetch} from "../caching.js";

/**
 * Create a new list
 * @param {Object} listData - Data for creating a new list
 * @returns {Promise<{success: boolean, data: Object}|{success: boolean, error: Error}>}
 */
export async function createList(listData) {
    try {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(listData),
        };

        const result = await customFetch('/lists/create', options, true);
        return { success: true, data: result };
    } catch (error) {
        console.error('Error creating list:', error);
        return { success: false, error };
    }
}

/**
 * Get all lists for the current user
 * @returns {Promise<{success: boolean, data: Array}|{success: boolean, error: Error}>}
 */
export async function getUserLists() {
    try {
        const lists = await cachedFetch('/lists/current', {}, true);
        return { success: true, data: lists };
    } catch (error) {
        console.error('Error fetching user lists:', error);
        return { success: false, error };
    }
}

/**
 * Get a specific list by its ID
 * @param {string} listId - The ID of the list to fetch
 * @returns {Promise<{success: boolean, data: Object}|{success: boolean, error: Error}>}
 */
export async function getListById(listId) {
    try {
        const list = await cachedFetch(`/lists/${listId}`, {}, true);
        return { success: true, data: list };
    } catch (error) {
        console.error('Error fetching list:', error);
        return { success: false, error };
    }
}

/**
 * Update a list's information
 * @param {Object} listData - The list data to update
 * @returns {Promise<{success: boolean, data: Object}|{success: boolean, error: Error}>}
 */
export async function updateList(listData) {
    try {
        if (!listData.id) {
            throw new Error('List ID is required');
        }

        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(listData),
        };

        const result = await customFetch(`/lists/${listData.id}`, options, true);
        return { success: true, data: result };
    } catch (error) {
        console.error('Error updating list:', error);
        return { success: false, error };
    }
}

/**
 * Delete a list
 * @param {string} listId - The ID of the list to delete
 * @returns {Promise<{success: boolean, data: Object}|{success: boolean, error: Error}>}
 */
export async function deleteList(listId) {
    try {
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        };

        const result = await customFetch(`/lists/${listId}`, options, true);
        return { success: true, data: result };
    } catch (error) {
        console.error('Error deleting list:', error);
        return { success: false, error };
    }
}