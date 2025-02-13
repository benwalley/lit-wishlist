import { envVars } from '../config.js';

// Constants for commonly accessed properties

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
