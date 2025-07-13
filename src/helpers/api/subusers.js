import {customFetch} from "../fetchHelpers.js";
import {cachedFetch} from "../caching.js";

export async function getSubusers() {
    try {
        const response = await cachedFetch('/users/subusers', {}, true);
        return response;
    } catch (error) {
        console.error('Error fetching subusers:', error);
        return { success: false, error: error.message };
    }
}

export async function createSubuser(subuserData) {
    try {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(subuserData),
        };

        const response = await customFetch('/users/subuser', options, true);
        return response;
    } catch (error) {
        console.error('Error creating subuser:', error);
        return { success: false, error: error.message };
    }
}

export async function updateSubuser(subuserId, subuserData) {
    try {
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(subuserData),
        };

        const response = await customFetch(`/users/subuser/${subuserId}`, options, true);
        return response;
    } catch (error) {
        console.error('Error updating subuser:', error);
        return { success: false, error: error.message };
    }
}

export async function updateSubuserGroups(subuserId, groupIds) {
    try {
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ groupIds }),
        };

        const response = await customFetch(`/users/subuser/${subuserId}/groups`, options, true);
        return response;
    } catch (error) {
        console.error('Error updating subuser groups:', error);
        return { success: false, error: error.message };
    }
}

export async function deleteSubuser(subuserId) {
    try {
        const options = {
            method: 'DELETE',
        };

        const response = await customFetch(`/users/subuser/${subuserId}`, options, true);
        return response;
    } catch (error) {
        console.error('Error deleting subuser:', error);
        return { success: false, error: error.message };
    }
}
