import {customFetch} from "../fetchHelpers.js";
import {cachedFetch} from "../caching.js";

/**
 * Fetch all items that the current user has viewed
 * @returns {Promise<{success: boolean, data: Array}|{success: boolean, error: Error}>}
 */
export async function getViewedItems() {
    try {
        const response = await cachedFetch('/listItems/viewed', {}, true);
        
        if (response?.success) {
            return { success: true, data: Array.isArray(response.data) ? response.data : [] };
        }
        
        return { success: false, error: 'Failed to fetch viewed items' };
    } catch (error) {
        console.error('Error fetching viewed items:', error);
        return { success: false, error };
    }
}

/**
 * Bulk mark items as viewed
 * @param {Array<string|number>} itemIds - Array of item IDs to mark as viewed
 * @returns {Promise<{success: boolean, data: Object}|{success: boolean, error: Error}>}
 */
export async function markItemsAsViewed(itemIds) {
    try {
        if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
            return { success: false, error: 'At least one item ID is required' };
        }

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ itemIds })
        };

        const result = await customFetch('/listItems/mark-viewed', options, true);
        return result;
    } catch (error) {
        console.error('Error marking items as viewed:', error);
        return { success: false, error };
    }
}

/**
 * Mark a single item as viewed
 * @param {string|number} itemId - The ID of the item to mark as viewed
 * @returns {Promise<{success: boolean, data: Object}|{success: boolean, error: Error}>}
 */
export async function markItemAsViewed(itemId) {
    if (!itemId) {
        return { success: false, error: 'Item ID is required' };
    }
    
    return markItemsAsViewed([itemId]);
}