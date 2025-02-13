import {getItem, setItem } from "./helpers.js";
export const TOKEN_NAME = 'jwt';                   // Property name for the JWT in the storage object
export const REFRESH_TOKEN_NAME = 'refreshToken';  // Property name for the refresh token in the storage object


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
