import {customFetch} from "../fetchHelpers.js";

/**
 * Import items from an Amazon wishlist
 * @param {string} wishlistUrl - The Amazon wishlist URL to import from
 * @returns {Promise<{success: boolean, data: Object}|{success: boolean, error: Error}>}
 */
// Development mode - set to true to use fake data instead of real API calls
const USE_FAKE_DATA = false;

// Fake wishlist data for development
const generateFakeWishlistData = (url) => {
    const fakeItems = [
        {
            name: "Wireless Bluetooth Headphones",
            price: "89.99",
            imageUrl: "https://via.placeholder.com/200x200/4a90e2/ffffff?text=Headphones",
            linkUrl: "https://amazon.com/dp/B123456789"
        },
        {
            name: "Ergonomic Office Chair",
            price: "249.00",
            imageUrl: "https://via.placeholder.com/200x200/7ed321/ffffff?text=Chair",
            linkUrl: "https://amazon.com/dp/B987654321"
        },
        {
            name: "Smart Water Bottle with Temperature Display",
            price: "34.95",
            imageUrl: "https://via.placeholder.com/200x200/f5a623/ffffff?text=Bottle",
            linkUrl: "https://amazon.com/dp/B456789123"
        },
        {
            name: "Mechanical Gaming Keyboard RGB",
            price: "129.99",
            imageUrl: "https://via.placeholder.com/200x200/d0021b/ffffff?text=Keyboard",
            linkUrl: "https://amazon.com/dp/B789123456"
        },
        {
            name: "Portable Phone Charger 20000mAh",
            price: "45.99",
            imageUrl: "https://via.placeholder.com/200x200/9013fe/ffffff?text=Charger",
            linkUrl: "https://amazon.com/dp/B321654987"
        },
        {
            name: "Stainless Steel Coffee Mug",
            price: "24.99",
            imageUrl: "https://via.placeholder.com/200x200/50e3c2/ffffff?text=Mug",
            linkUrl: "https://amazon.com/dp/B654987321"
        },
        {
            name: "LED Desk Lamp with USB Charging",
            price: "39.99",
            imageUrl: "https://via.placeholder.com/200x200/bd10e0/ffffff?text=Lamp",
            linkUrl: "https://amazon.com/dp/B147258369"
        },
        {
            name: "Noise Cancelling Sleep Mask",
            price: "19.95",
            imageUrl: "https://via.placeholder.com/200x200/417505/ffffff?text=Mask",
            linkUrl: "https://amazon.com/dp/B963852741"
        }
    ];

    return {
        success: true,
        message: "Successfully fetched 8 items from Amazon wishlist using AI parsing",
        data: {
            wishlistTitle: "My Development Test Wishlist",
            totalItems: fakeItems.length,
            items: fakeItems,
            sourceUrl: url,
            processingMethod: "ai_parsing",
            extractionMethod: "puppeteer",
            aiMetadata: {
                model: "gemini-2.5-flash",
                tokens_used: 15000,
                response_time_ms: 2500,
                attempt: 1,
                html_length: 100000,
                prompt_tokens: 12000,
                completion_tokens: 3000,
                total_tokens: 15000
            }
        }
    };
};

export async function importAmazonWishlist(wishlistUrl) {
    try {
        if (!wishlistUrl) {
            throw new Error('Amazon wishlist URL is required');
        }

        // Use fake data in development mode
        if (USE_FAKE_DATA) {
            console.log('Using fake data for development');
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            return generateFakeWishlistData(wishlistUrl);
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

