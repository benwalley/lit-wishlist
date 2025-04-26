import {customFetch} from "../fetchHelpers.js";

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
