import {customFetch} from "../fetchHelpers.js";

/**
 * Bulk delete list items
 * @param {Array<string|number>} itemIds - Array of item IDs to delete
 * @returns {Promise<{success: boolean, data: Object}|{success: boolean, error: Error}>}
 */
export async function bulkDeleteItems(itemIds) {
    try {
        if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
            return { success: false, error: 'At least one item ID is required' };
        }

        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                itemIds
            })
        };

        const result = await customFetch('/listItems/bulk-delete', options, true);
        return result;
    } catch (error) {
        console.error('Error bulk deleting items:', error);
        return { success: false, error };
    }
}

/**
 * Bulk update delete date for list items
 * @param {Array<string|number>} itemIds - Array of item IDs to update
 * @param {string} deleteOnDate - ISO date string for when items should be deleted
 * @returns {Promise<{success: boolean, data: Object}|{success: boolean, error: Error}>}
 */
export async function bulkUpdateDeleteDate(itemIds, deleteOnDate) {
    try {
        if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
            return { success: false, error: 'At least one item ID is required' };
        }

        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                itemIds,
                deleteOnDate
            })
        };

        const result = await customFetch('/listItems/bulk-update-delete-date', options, true);
        return result;
    } catch (error) {
        console.error('Error bulk updating delete date:', error);
        return { success: false, error };
    }
}

/**
 * Bulk update visibility for list items
 * @param {Array<string|number>} itemIds - Array of item IDs to update
 * @param {Array<string|number>} visibleToGroups - Array of group IDs that can see the items
 * @param {Array<string|number>} visibleToUsers - Array of user IDs that can see the items
 * @returns {Promise<{success: boolean, data: Object}|{success: boolean, error: Error}>}
 */
export async function bulkUpdateVisibility(itemIds, visibleToGroups, visibleToUsers) {
    try {
        if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
            return { success: false, error: 'At least one item ID is required' };
        }

        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                itemIds,
                visibleToGroups: visibleToGroups || [],
                visibleToUsers: visibleToUsers || []
            })
        };

        const result = await customFetch('/listItems/bulk-update-visibility', options, true);
        return result;
    } catch (error) {
        console.error('Error bulk updating visibility:', error);
        return { success: false, error };
    }
}

/**
 * Bulk update lists for items
 * @param {Array<string|number>} itemIds - Array of item IDs to update
 * @param {Array<string|number>} lists - Array of list IDs to assign items to
 * @returns {Promise<{success: boolean, data: Object}|{success: boolean, error: Error}>}
 */
export async function bulkUpdateLists(itemIds, lists) {
    try {
        if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
            return { success: false, error: 'At least one item ID is required' };
        }

        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                itemIds,
                lists
            })
        };

        const result = await customFetch('/listItems/bulk-update-lists', options, true);
        return result;
    } catch (error) {
        console.error('Error bulk updating lists:', error);
        return { success: false, error };
    }
}
