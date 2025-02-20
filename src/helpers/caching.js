// cacheHelpers.js

import {customFetch} from "./fetchHelpers.js";

/**
 * A simple in-memory cache for fetched data. The keys are request URLs,
 * and the values are the parsed JSON responses (or any data you choose to store).
 */
const fetchCache = new Map();

/**
 * Fetches data from the given URL and caches the result in memory.
 *
 * @param {string} url - The resource URL to fetch.
 * @param {object} [options={}] - Fetch options (method, headers, body, etc.).
 * @param auth
 * @param forceRefresh
 * @returns {Promise<any>} - Parsed JSON data (or any other data from the response).
 */
export async function cachedFetch(url, options = {}, auth = false, forceRefresh = false) {
    // If we have it in the cache and we're not forcing a refresh, return the cached value.
    if (!forceRefresh && fetchCache.has(url)) {
        return fetchCache.get(url);
    }

    // Otherwise, do a fresh fetch
    const response = await customFetch(url, options, auth);

    // Store the result in the cache
    fetchCache.set(url, response);

    return response;
}

/**
 * Invalidates the cache for the given URL, or clears the entire cache if no URL is passed.
 *
 * @param {string} [url] - Optional URL to invalidate. If omitted, the entire cache is cleared.
 */
export function invalidateCache(pattern) {
    if (!pattern) {
        fetchCache.clear();
        return;
    }

    const regex = new RegExp('^' + pattern.split('*').join('.*') + '$');

    for (let key of fetchCache.keys()) {
        if (regex.test(key)) {
            fetchCache.delete(key);
        }
    }
}


/**
 * Checks if a particular URL is already cached.
 *
 * @param {string} url - The URL to check in the cache.
 * @returns {boolean} - True if cached, false otherwise.
 */
export function isCached(url) {
    return fetchCache.has(url);
}
