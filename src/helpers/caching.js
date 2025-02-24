// cacheHelpers.js

import { customFetch } from "./fetchHelpers.js";

/**
 * A simple in-memory cache for fetched data. The keys are request URLs,
 * and the values are the parsed JSON responses (or any data you choose to store).
 */
const fetchCache = new Map();

/**
 * Tracks in-progress requests keyed by URL. If multiple calls are made for the same URL,
 * they will share the same promise.
 */
const inProgressRequests = new Map();

/**
 * Fetches data from the given URL and caches the result in memory.
 * Tracks in-progress requests so that concurrent requests for the same URL only perform one fetch.
 *
 * @param {string} url - The resource URL to fetch.
 * @param {object} [options={}] - Fetch options (method, headers, body, etc.).
 * @param {boolean} [auth=false] - Whether to include authentication.
 * @param {boolean} [forceRefresh=false] - If true, forces a fresh fetch even if cached.
 * @returns {Promise<any>} - Parsed JSON data (or any other data from the response).
 */
export async function cachedFetch(url, options = {}, auth = false, forceRefresh = false) {
    // Return cached value if available and not forcing a refresh.
    if (!forceRefresh && fetchCache.has(url)) {
        return fetchCache.get(url);
    }

    // If a request for the URL is already in progress, return its promise.
    if (inProgressRequests.has(url)) {
        return inProgressRequests.get(url);
    }

    // Otherwise, perform the fetch and track the in-progress promise.
    const fetchPromise = (async () => {
        try {
            const response = await customFetch(url, options, auth);
            // Store the successful result in the cache.
            fetchCache.set(url, response);
            return response;
        } finally {
            // Remove the in-progress tracker regardless of success or failure.
            inProgressRequests.delete(url);
        }
    })();

    // Track the in-progress request.
    inProgressRequests.set(url, fetchPromise);
    return fetchPromise;
}

/**
 * Invalidates the cache for the given URL pattern, or clears the entire cache if no pattern is passed.
 *
 * @param {string} [pattern] - Optional URL pattern to invalidate. If omitted, the entire cache is cleared.
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
