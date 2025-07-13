import {customFetch} from "../fetchHelpers.js";
import {getRefreshToken} from "../../localStorage/tokens.js";
import {userState} from "../../state/userStore.js";
import {triggerUpdateUser} from "../../events/eventListeners.js";
import {userListState} from "../../state/userListStore.js";
import {cachedFetch} from "../caching.js";

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
 * @param username - Optional username for subuser login
 * @returns {Promise<{error}|*>}
 */
export async function login(email, password, username = null) {
    try {
        const body = { email, password };
        if (username) {
            body.username = username;
        }

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Set the content type to JSON
            },
            body: JSON.stringify(body), // Add email, password, and optionally username to the body
        };

        const userData = await customFetch('/auth/login', options, false);
        return userData;
    } catch(e) {
        return {error: e}
    }
}

export async function updateUserData(data) {
    try {
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        };

        const userData = await customFetch('/users/', options, true);
        triggerUpdateUser()
        return {success: true, userData: userData}

    } catch (e) {
        return {success: false, message: 'There was an error saving your user. Please try again.'}
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

export async function getAccessibleUsers() {
    try {
        const users = await cachedFetch('/users/accessible', {}, true);
        return users;

    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

export async function getYourUsers() {
    try {
        const response = await cachedFetch(`/users/yours`, {}, true);
        return response;
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

/**
 * Get a user by their ID
 * @param {string} userId - The ID of the user to fetch
 * @returns {Promise<{success: boolean, data: Object}|{success: boolean, error: Error}>}
 */
export async function getUserById(userId) {
    try {
        if (!userId) {
            throw new Error('User ID is required');
        }

        const userData = await cachedFetch(`/users/${userId}`, {}, true);
        return userData
    } catch (error) {
        console.error('Error fetching user:', error);
        return { success: false, error };
    }
}

/**
 * Switch to a subuser account
 * @param {number} subuserID - The ID of the subuser to switch to
 * @returns {Promise<{success: boolean, user?: Object, tokens?: Object, error?: string}>}
 */
export async function switchToSubuser(subuserID) {
    try {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ subuserID }),
        };

        const response = await customFetch('/auth/switchUser', options, true);
        return response;
    } catch (error) {
        console.error('Error switching to subuser:', error);
        return { success: false, error: error.message };
    }
}
