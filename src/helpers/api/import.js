import {customFetch} from "../fetchHelpers.js";

/**
 * Import items from an Amazon wishlist
 * @param {string} wishlistUrl - The Amazon wishlist URL to import from
 * @returns {Promise<{success: boolean, data: Object}|{success: boolean, error: Error}>}
 */
export async function importAmazonWishlist(wishlistUrl) {
    try {
        if (!wishlistUrl) {
            throw new Error('Amazon wishlist URL is required');
        }

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url: wishlistUrl
            }),
        };

        const result = await customFetch('/wishlistImport/fetch-wishlist', options, true);
        return result;
    } catch (error) {
        console.error('Error importing Amazon wishlist:', error);
        return { success: false, error };
    }
}
