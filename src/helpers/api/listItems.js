import {customFetch} from "../fetchHelpers.js";
import {cachedFetch} from "../caching.js";

/**
 * Get a public list item by its ID (no authentication required)
 * @param {string} itemId - The ID of the item to fetch
 * @returns {Promise<Object>} - Returns the response directly from the API
 */
export async function getPublicListItemById(itemId) {
    try {
        if (!itemId) {
            throw new Error('Item ID is required');
        }

        const response = await cachedFetch(`/listItems/public/${itemId}`, {}, false);
        return response;
    } catch (error) {
        console.error('Error fetching public list item:', error);
        return {success: false, error};
    }
}

/**
 * Delete a list item
 * @param {string} itemId - The ID of the item to delete
 * @returns {Promise<{success: boolean, data: Object}|{success: boolean, error: Error}>}
 */
export async function deleteItem(itemId) {
    try {
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        };

        const result = await customFetch(`/listItems/${itemId}`, options, true);
        return result
    } catch (error) {
        console.error('Error deleting item:', error);
        return { success: false, error };
    }
}

/**
 * Bulk add items to a list
 * @param {string|number} listId - The ID of the list to add items to
 * @param {Array<string|number>} itemIds - Array of item IDs to add to the list
 * @returns {Promise<{success: boolean, data: Object}|{success: boolean, error: Error}>}
 */
export async function bulkAddToList(listId, itemIds) {
    try {
        if (!listId) {
            return { success: false, error: 'List ID is required' };
        }

        if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
            return { success: false, error: 'At least one item ID is required' };
        }

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                listId,
                itemIds
            })
        };

        const result = await customFetch('/listItems/bulk-add-to-list', options, true);
        return result;
    } catch (error) {
        console.error('Error adding items to list:', error);
        return { success: false, error };
    }
}

/**
 * Bulk create items
 * @param {Array<Object>} items - Array of items to create
 * @param {Array<number>} listIds - Optional array of list IDs to associate items with
 * @returns {Promise<{success: boolean, data: Object}|{success: boolean, error: Error}>}
 */
export async function bulkCreateItems(items, listIds = []) {
    try {
        if (!items || !Array.isArray(items) || items.length === 0) {
            return { success: false, error: 'At least one item is required' };
        }

        // Validate that each item has a name (required field)
        for (const item of items) {
            if (!item.name || typeof item.name !== 'string' || item.name.trim() === '') {
                return { success: false, error: 'Each item must have a name' };
            }
        }

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                items,
                listIds
            })
        };

        const result = await customFetch('/listItems/bulk-create', options, true);
        return result;
    } catch (error) {
        console.error('Error creating items:', error);
        return { success: false, error };
    }
}

/**
 * Fetch all items that belong to the current user
 * @param {Array} excludedItemIds - Optional array of item IDs to exclude from results
 * @returns {Promise<{success: boolean, data: Array}|{success: boolean, error: Error}>}
 */
export async function fetchMyItems(excludedItemIds = []) {
    try {
        const response = await cachedFetch('/listItems/my-items', {}, true);

        if (response?.responseData?.error) {
            throw new Error(response?.responseData?.error);
        }

        if (response?.success) {
            let items = Array.isArray(response.data) ? response.data : [];

            // Filter out excluded items if provided
            if (excludedItemIds && excludedItemIds.length > 0) {
                items = items.filter(item => !excludedItemIds.includes(item.id));
            }

            return { success: true, data: items };
        }

        return { success: false, error: 'Failed to fetch items' };
    } catch (error) {
        console.error('Error fetching items:', error);
        return { success: false, error };
    }
}

/**
 * Bulk update publicity and priority for multiple items
 * @param {Array<{id: number, isPublic: boolean, priority: number}>} items - Array of items to update
 * @returns {Promise<{success: boolean, data: Object}|{success: boolean, error: Error}>}
 */
export async function bulkUpdatePublicityAndPriority(items) {
    try {
        if (!items || !Array.isArray(items) || items.length === 0) {
            return { success: false, message: 'At least one item is required' };
        }

        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                items: items
            })
        };

        const result = await customFetch('/listItems/bulk-update-publicity-priority', options, true);
        return result;
    } catch (error) {
        return { success: false, message: error };
    }
}

/**
 * Search for items by query string
 * @param {string} query - The search query
 * @returns {Promise<{success: boolean, data: Array}|{success: boolean, error: Error}>}
 */
export async function searchItems(query) {
    try {
        if (!query || typeof query !== 'string' || query.trim() === '') {
            return { success: true, data: [] };
        }

        const encodedQuery = encodeURIComponent(query.trim());
        const response = await customFetch(`/listItems/search/${encodedQuery}`, {}, true);
        
        if (response?.success) {
            return { success: true, data: response.data || [] };
        }

        return { success: false, error: response?.error || 'Failed to search items' };
    } catch (error) {
        console.error('Error searching items:', error);
        return { success: false, error };
    }
}
