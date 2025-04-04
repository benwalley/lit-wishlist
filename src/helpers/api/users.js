import {customFetch} from "../fetchHelpers.js";
import {getRefreshToken} from "../../localStorage/tokens.js";
import {userState} from "../../state/userStore.js";
import {triggerUpdateUser} from "../../events/eventListeners.js";

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


