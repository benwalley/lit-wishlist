import {customFetch} from "../fetchHelpers.js";
import {cachedFetch} from "../caching.js";

/**
 * Get all lists for a specific group
 * @param {string} groupId - The ID of the group
 * @returns {Promise<{success: boolean, data: Array}|{success: boolean, error: Error}>}
 */
export async function getGroupLists(groupId) {
    try {
        if (!groupId) {
            throw new Error('Group ID is required');
        }

        const lists = await cachedFetch(`/lists/group/${groupId}`, {}, true);
        return lists;
    } catch (error) {
        console.error('Error fetching group lists:', error);
        return { success: false, error };
    }
}

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
 * Get all lists the current user has access to
 * @returns {Promise<{success: boolean, data: Array}|{success: boolean, error: Error}>}
 */
export async function getAllAccessibleLists() {
    try {
        const lists = await cachedFetch('/lists/accessible', {}, true);
        return lists
    } catch (error) {
        console.error('Error fetching accessible lists:', error);
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

/**
 * Fetch all lists that belong to the current user
 * @returns {Promise<{success: boolean, data: Array}|{success: boolean, error: Error}>}
 */
export async function fetchMyLists() {
    try {
        const response = await cachedFetch('/lists/mine', {}, true);

        if (response?.responseData?.error) {
            throw new Error(response?.responseData?.error);
        }

        if (response?.success) {
            const lists = Array.isArray(response.data) ? response.data : [];
            return { 
                success: true, 
                data: lists.filter(list => list?.id > 0)
            };
        }
        
        return { success: false, error: 'Failed to fetch lists' };
    } catch (error) {
        console.error('Error fetching lists:', error);
        return { success: false, error };
    }
}
