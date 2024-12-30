import {customFetch} from "../fetchHelpers.js";
import {getRefreshToken} from "../../localStorage/tokens.js";

export async function getCurrentUser() {
    try {
        const currentUser = await customFetch('/users/current', {}, true);
        if(currentUser?.id) {
            return currentUser;
        }
        return false;

    } catch (error) {
        console.error('Error fetching current user:', error);
    }
}

/**
 *
 * @param email
 * @param password
 * @returns {Promise<{error}|*>}
 */
export async function login(email, password) {
    try {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Set the content type to JSON
            },
            body: JSON.stringify({ email, password }), // Add username and password to the body
        };

        const userData = await customFetch('/auth/login', options, false);
        return userData;
    } catch(e) {
        return {error: e}
    }
}

// Example using Fetch API
export async function logout() {
    try {
        const refreshToken = getRefreshToken();
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({refreshToken}), // Send necessary data if any
        }
        const response = await customFetch('/auth/logout', options, false)
        return response;
    } catch (error) {
        return {error, message: 'logout failed'};
    }
}


