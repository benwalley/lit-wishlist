import {cachedFetch} from "../caching.js";

/**
 * Fetches the user's contribution data including items they're contributing to or getting
 * @returns {Promise<{contributionsData: Array, error: string}>} Object containing contribution data or error
 */
export async function fetchUserGiftTrackingData() {
    try {
        // Fetch items user is contributing to
        const response = await cachedFetch('/giftTracking', {}, true);
        return response;

    } catch (error) {
        console.error('Error in fetchUserGiftTrackingData:', error);
        return {
            contributionsData: [],
            error: 'An error occurred while fetching your gift tracking data.'
        };
    }
}

/**
 * NOT USING THIS RIGHT NOW
 */
async function enrichContributionsWithDetails(contributionsData) {
    // Create maps to avoid duplicate requests
    const itemDetailsMap = new Map();
    const listDetailsMap = new Map();

    // Collect all needed item IDs and list IDs
    const itemIds = contributionsData.map(contribution => contribution.itemId);
    const listIds = contributionsData.map(contribution => contribution.listId);

    // Batch fetch item details
    const itemFetches = itemIds.map(async itemId => {
        if (!itemDetailsMap.has(itemId)) {
            try {
                const response = await cachedFetch(`/listItems/${itemId}`, {}, true);
                if (!response?.responseData?.error) {
                    itemDetailsMap.set(itemId, response);
                }
            } catch (error) {
                console.error(`Error fetching details for item ${itemId}:`, error);
            }
        }
    });

    // Batch fetch list details
    const listFetches = listIds.map(async listId => {
        if (!listDetailsMap.has(listId)) {
            try {
                const response = await cachedFetch(`/lists/${listId}`, {}, true);
                if (!response?.responseData?.error) {
                    listDetailsMap.set(listId, response);
                }
            } catch (error) {
                console.error(`Error fetching details for list ${listId}:`, error);
            }
        }
    });

    // Wait for all fetches to complete
    await Promise.all([...itemFetches, ...listFetches]);

    // Enrich the contribution data with item and list details
    return contributionsData.map(contribution => {
        const itemDetails = itemDetailsMap.get(contribution.itemId) || {};
        const listDetails = listDetailsMap.get(contribution.listId) || {};

        return {
            ...contribution,
            item: itemDetails,
            list: listDetails
        };
    });
}
