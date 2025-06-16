import {cachedFetch} from "../caching.js";
import {customFetch} from "../fetchHelpers.js";

/**
 * Fetches the user's contribution data including items they're contributing to or getting
 * @returns {Promise<{contributionsData: Array, error: string}>} Object containing contribution data or error
 */
export async function fetchGiftsUserIsGetting() {
    try {
        const getting = await cachedFetch('/giftTracking/getting', {}, true);
        const acceptedProposals = await cachedFetch('/proposals/approved', {}, true);
        return {
            getting, acceptedProposals
        }
    } catch (error) {
        console.error('Error in fetchUserGiftTrackingData:', error);
        return {
            contributionsData: [],
            error: 'An error occurred while fetching your gift tracking data.'
        };
    }
}

export async function fetchUsersWithNoGiftGotten() {

}

export async function bulkUpdateGiftStatus(data) {
    try {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        };

        return await customFetch('/giftTracking/bulkSave', options, true);
    } catch (e) {
        return {publicMessage: e, success: false}
    }
}

/**
 * Updates the "getting" status for multiple users on a single item
 * @param {Array} data - Array of objects with {giverId, getterId, numberGetting, itemId}
 * @returns {Promise<{success: boolean, data?: any, error?: string, publicMessage?: string}>}
 */
export async function bulkUpdateGetting(data) {
    try {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        };

        return await customFetch('/giftTracking/bulkUpdateGetting', options, true);
    } catch (e) {
        return {publicMessage: e, success: false}
    }
}

/**
 * Updates the "participating/contributing" status for multiple users on a single item
 * @param {Array} data - Array of objects with {giverId, getterId, itemId, participating}
 * @returns {Promise<{success: boolean, data?: any, error?: string, publicMessage?: string}>}
 */
export async function bulkUpdateGoInOn(data) {
    try {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        };

        return await customFetch('/giftTracking/bulkUpdateGoInOn', options, true);
    } catch (e) {
        return {publicMessage: e, success: false}
    }
}


