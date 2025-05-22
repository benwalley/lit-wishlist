import {cachedFetch} from "../caching.js";

/**
 * Fetches the user's contribution data including items they're contributing to or getting
 * @returns {Promise<{contributionsData: Array, error: string}>} Object containing contribution data or error
 */
export async function fetchGiftsUserIsGetting() {
    try {
        // Fetch items user is contributing to
        const response = await cachedFetch('/giftTracking/getting', {}, true);
        return response;

    } catch (error) {
        console.error('Error in fetchUserGiftTrackingData:', error);
        return {
            contributionsData: [],
            error: 'An error occurred while fetching your gift tracking data.'
        };
    }
}
