import {customFetch} from "../fetchHelpers.js";
import {cachedFetch} from "../caching.js";

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
 * @param {string} listId - The ID of the list to add items to
 * @param {string[]} itemIds - Array of item IDs to add to the list
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

        const result = await customFetch('/listItems/bulk-add', options, true);
        return result;
    } catch (error) {
        console.error('Error adding items to list:', error);
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
