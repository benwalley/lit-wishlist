import { getJwt, setJwt, getRefreshToken } from '../localStorage/tokens.js';
import { envVars } from '../config.js';

// Global variable to track ongoing token refresh
let tokenRefreshPromise = null;

/**
 * Main function to perform a fetch request, with optional authentication and retries.
 *
 * @param {string} url - The resource URL.
 * @param {Object} options - Options to pass to fetch (method, headers, body, etc.).
 * @param {boolean} [useAuth=false] - Whether to include the JWT in the Authorization header.
 * @returns {Promise<any>} - Resolved promise with JSON data or rejected promise with an Error.
 */
export async function customFetch(url, options = {}, useAuth = false) {
    try {
        const requestOptions = await prepareRequestOptions(options, useAuth);
        const response = await fetchWithRetry(url, requestOptions, useAuth);
        return await parseResponse(response);
    } catch (error) {
        handleError(error);
    }
}

/**
 * Prepares the request options, including adding JWT to headers if `useAuth` is true.
 *
 * @param {Object} options - The fetch options object.
 * @param {boolean} useAuth - Whether to include the JWT.
 * @returns {Object} - Updated options with headers and JWT if applicable.
 */
async function prepareRequestOptions(options, useAuth) {
    const headers = options.headers || {};
    if (useAuth) {
        const token = getJwt();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }
    return { ...options, headers, credentials: 'include' };
}

/**
 * Performs the fetch request with retry logic in case of a 401 status and `useAuth` enabled.
 *
 * @param {string} url - The resource URL.
 * @param {Object} options - Options to pass to fetch (method, headers, body, etc.).
 * @param {boolean} useAuth - Whether the request is authenticated.
 * @returns {Response} - The response object from the fetch call.
 */
async function fetchWithRetry(url, options, useAuth) {
    try {
        const fullUrl = `${envVars.API_URL}${url}`;
        let response = await fetch(fullUrl, options);

        if (useAuth && response.status === 401) {
            console.warn('Token expired. Attempting to refresh token...');
            const refreshed = await refreshAuthToken();
            if (refreshed) {
                // Retry the request with the new token
                const newOptions = await prepareRequestOptions(options, true);
                response = await fetch(fullUrl, newOptions);
                return response;
            } else {
                // handle token failed, retry necessary
                console.log('refreshed token failed. Retry login')
                return {error: 'user doesnt exist'};
            }
        }

        return response;
    } catch(e) {
        console.log('there was an error fetching ' + url);
        return {error: e, message: `Error fetching ${url}`};
    }

}

/**
 * Parses the fetch response and handles JSON conversion.
 *
 * @param {Response} response - The response object from fetch.
 * @returns {Promise<any>} - Parsed JSON data.
 */
async function parseResponse(response) {
    let responseData;
    // If the response is not ok (i.e., status code is not 2xx)
    if (!(response.ok || response.success)) {
        const error = new Error(`Request failed with status ${response.status} (${response.statusText})`);

        try {
            // Try to parse JSON if the response body is JSON
            const contentType = response.headers.get("Content-Type");
            if (contentType && contentType.includes("application/json")) {
                responseData = await response.json();
            } else {
                responseData = await response.text(); // Fallback to text if it's not JSON
            }
            console.log(error)
            return responseData;
        } catch (e) {
            // If parsing fails (e.g., the body is empty or malformed), handle the fallback here
            console.log(error)
            return error;
        }
    }

    // If response is OK, parse the JSON
    const contentType = response.headers?.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
        return await response.json();
    }

    // Fallback if response is not JSON
    return await response.text();
}

/**
 * Handles token refreshing when a 401 error is encountered.
 * Ensures only one refresh request happens at a time by using a shared promise.
 *
 * @returns {Promise<boolean>} - Resolves to true if the token was refreshed, false otherwise.
 */
async function refreshAuthToken() {
    // If a token refresh is already in progress, wait for it to complete
    if (tokenRefreshPromise) {
        console.log('Token refresh already in progress. Waiting for completion...');
        return await tokenRefreshPromise;
    }

    const refreshToken = getRefreshToken();

    if (!refreshToken) {
        console.warn('No refresh token available.');
        return false;
    }

    // Create a new refresh promise and store it globally
    tokenRefreshPromise = performTokenRefresh(refreshToken);

    try {
        return await tokenRefreshPromise;
    } finally {
        // Clear the promise when done (success or failure)
        tokenRefreshPromise = null;
    }
}

/**
 * Performs the actual token refresh API call.
 *
 * @param {string} refreshToken - The refresh token to use.
 * @returns {Promise<boolean>} - Resolves to true if successful, false otherwise.
 */
async function performTokenRefresh(refreshToken) {
    try {
        const response = await fetch(`${envVars.API_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) {
            console.warn('Failed to refresh token:', response.statusText);
            return false;
        }

        const tokenData = await response.json();

        const token = tokenData?.data?.jwtToken || tokenData?.jwtToken;
        console.log('New token received:', token ? 'Yes' : 'No');

        if (token) {
            // Save the new JWT
            setJwt(token);
            return true;
        } else {
            console.warn('No token received in refresh response');
            return false;
        }
    } catch (error) {
        console.error('Error refreshing token:', error);
        return false;
    }
}

/**
 * Handles global error processing for fetch requests.
 *
 * @param {Error} error - The error object to process.
 */
function handleError(error) {
    console.error('customFetch encountered an error:', error);
    // Add global error handling logic here, e.g., logging, notifications, etc.
}
