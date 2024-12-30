import { envVars } from '../config.js';

// Constants for commonly accessed properties
export const TOKEN_NAME = 'jwt';                   // Property name for the JWT in the storage object
export const REFRESH_TOKEN_NAME = 'refreshToken';  // Property name for the refresh token in the storage object

/**
 * Get the full storage object from localStorage.
 *
 * @returns {Object} The parsed object from localStorage, or an empty object if not found or invalid.
 */
export function getLocalStorageItem() {
    try {
        const data = localStorage.getItem(envVars.STORAGE_ITEM_NAME);
        return data ? JSON.parse(data) : {};
    } catch (error) {
        console.warn('Failed to parse localStorage item:', error);
        return {};
    }
}

/**
 * Update the entire storage object in localStorage.
 *
 * @param {Object} data - The object to store in localStorage.
 */
export function setLocalStorageItem(data) {
    localStorage.setItem(envVars.STORAGE_ITEM_NAME, JSON.stringify(data));
}

/**
 * Generic getter for any key in the storage object.
 *
 * @param {string} key - The key in the storage object.
 * @returns {*} The value associated with `key`, or null if it doesn't exist.
 */
export function getItem(key) {
    const storageObj = getLocalStorageItem();
    return storageObj[key] ?? null;
}

/**
 * Generic setter for any key in the storage object.
 *
 * @param {string} key - The key in the storage object to update.
 * @param {*} value - The value to store.
 */
export function setItem(key, value) {
    const storageObj = getLocalStorageItem();
    storageObj[key] = value;
    setLocalStorageItem(storageObj);
}

/**
 * Get the JWT from the storage object.
 * Uses the generic `getItem` method under the hood.
 *
 * @returns {string|null} The JWT or null if it doesn't exist.
 */
export function getJwt() {
    return getItem(TOKEN_NAME);
}

/**
 * Set the JWT in the storage object.
 * Uses the generic `setItem` method under the hood.
 *
 * @param {string} token - The JWT to store.
 */
export function setJwt(token) {
    setItem(TOKEN_NAME, token);
}

/**
 * Get the refresh token from the storage object.
 * Uses the generic `getItem` method under the hood.
 *
 * @returns {string|null} The refresh token or null if it doesn't exist.
 */
export function getRefreshToken() {
    return getItem(REFRESH_TOKEN_NAME);
}

/**
 * Set the refresh token in the storage object.
 * Uses the generic `setItem` method under the hood.
 *
 * @param {string} token - The refresh token to store.
 */
export function setRefreshToken(token) {
    setItem(REFRESH_TOKEN_NAME, token);
}
