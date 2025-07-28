import {customFetch} from "../fetchHelpers.js";
import {getRefreshToken} from "../../localStorage/tokens.js";
import {cachedFetch} from "../caching.js";

/**
 * Get all groups for the current user
 * @returns {Promise<Array|{error}>} Array of groups or error object
 */
export async function getUserGroups() {
    try {
        const groups = await cachedFetch('/groups/current', {}, true);
        return groups;
    } catch (error) {
        console.error('Error fetching user groups:', error);
        return {error};
    }
}

/**
 * Get all groups the current user is invited to
 * @returns {Promise<{success: boolean, data: Array}|{success: boolean, error: Error}>} Array of groups or error object
 */
export async function getInvitedGroups() {
    try {
        const groups = await customFetch('/groups/invited', {}, true);
        return { success: true, data: groups };
    } catch (error) {
        console.error('Error fetching invited groups:', error);
        return { success: false, error };
    }
}

/**
 * Get a specific group by its ID
 * @param {string} groupId - The ID of the group to fetch
 * @returns {Promise<Object|{error}>} Group data or error object
 */
export async function getGroupById(groupId) {
    try {
        const group = await cachedFetch(`/groups/${groupId}`, {}, true);
        return {success: true, data: group};
    } catch (error) {
        console.error('Error fetching group:', error);
        return {error, success: false};
    }
}

/**
 *
 * @param groupData
 * @returns {Promise<{error}|*>}
 */
export async function createGroup(groupData) {
    try {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(groupData),
        };

        const group = await customFetch('/groups/create', options, true);
        return group;
    } catch(e) {
        return {error: e, success: false}
    }
}

/**
 * Invite a user to a group by email address
 * @param {string} groupId - The ID of the group
 * @param {string} email - Email address to invite
 * @returns {Promise<{success: boolean, data: Object}|{success: boolean, error: Error}>}
 */
export async function inviteUserToGroup(groupId, email) {
    try {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        };

        const result = await customFetch(`/groups/${groupId}/invite`, options, true);
        return result;
    } catch (error) {
        console.error('Error inviting user to group:', error);
        return { success: false, error };
    }
}

/**
 * Cancel a pending invitation to a group
 * @param {string} groupId - The ID of the group
 * @param {string} userId - User ID to cancel invitation for
 * @returns {Promise<{success: boolean, data: Object}|{success: boolean, error: Error}>}
 */
export async function cancelGroupInvitation(groupId, userId) {
    try {
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        return await customFetch(`/groups/${groupId}/invited/${userId}`, options, true);
    } catch (error) {
        console.error('Error canceling group invitation:', error);
        return { success: false, error };
    }
}

export async function getInvitedUsers(groupId) {
    try {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        };

        const result = await customFetch(`/groups/${groupId}/invited`, options, true);
        return { success: true, data: result };
    } catch (error) {
        console.error('Error fetching invited users:', error);
        return { success: false, error };
    }
}

/**
 * Delete a group
 * @param {string} groupId - The ID of the group to delete
 * @returns {Promise<{success: boolean, data: Object}|{success: boolean, error: Error}>}
 */
export async function deleteGroup(groupId) {
    try {
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        };

        const result = await customFetch(`/groups/${groupId}`, options, true);
        return { success: true, data: result };
    } catch (error) {
        console.error('Error deleting group:', error);
        return { success: false, error };
    }
}

/**
 * Leave a group
 * @param {string} groupId - The ID of the group to leave
 * @returns {Promise<{success: boolean, data: Object}|{success: boolean, error: Error}>}
 */
export async function leaveGroup(groupId) {
    try {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        };

        const result = await customFetch(`/groups/${groupId}/leave`, options, true);
        console.log({result})
        // if there is an error, there is result.responseData. Otherwise it is just in result
        return result;
    } catch (error) {
        console.error('Error leaving group:', error);
        return { success: false, error };
    }
}

/**
 * Accept a group invitation
 * @param {string} groupId - The ID of the group to accept invitation for
 * @returns {Promise<{success: boolean, data: Object}|{success: boolean, error: Error}>}
 */
export async function acceptGroupInvitation(groupId) {
    try {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        };

        const result = await customFetch(`/groups/accept/${groupId}`, options, true);
        return { success: true, data: result };
    } catch (error) {
        console.error('Error accepting group invitation:', error);
        return { success: false, error };
    }
}

/**
 * Decline a group invitation
 * @param {string} groupId - The ID of the group to decline invitation for
 * @returns {Promise<{success: boolean, data: Object}|{success: boolean, error: Error}>}
 */
export async function declineGroupInvitation(groupId) {
    try {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        };

        const result = await customFetch(`/groups/decline/${groupId}`, options, true);
        return { success: true, data: result };
    } catch (error) {
        console.error('Error declining group invitation:', error);
        return { success: false, error };
    }
}

/**
 * Update a group's information
 * @param {Object} groupData - The group data to update
 * @returns {Promise<{success: boolean, data: Object}|{success: boolean, error: Error}>}
 */
export async function updateGroup(groupData) {
    try {
        if (!groupData.id) {
            throw new Error('Group ID is required');
        }

        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(groupData),
        };

        const result = await customFetch(`/groups/${groupData.id}`, options, true);
        return { success: true, data: result };
    } catch (error) {
        console.error('Error updating group:', error);
        return { success: false, error };
    }
}

/**
 * Bulk share lists and questions with a group
 * @param {string} groupId - The ID of the group to share with
 * @param {Array} listIds - Array of list IDs to share with the group
 * @param {Array} questionIds - Array of question IDs to share with the group
 * @returns {Promise<{success: boolean, data: Object}|{success: boolean, error: Error}>}
 */
export async function bulkShareWithGroup(groupId, listIds = [], questionIds = []) {
    try {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ listIds, questionIds }),
        };

        const result = await customFetch(`/groups/${groupId}/bulk-share`, options, true);
        return { success: true, data: result };
    } catch (error) {
        console.error('Error sharing items with group:', error);
        return { success: false, error };
    }
}

/**
 * Make a user an admin of a group
 * @param {string|number} groupId - The ID of the group
 * @param {string|number} userId - The ID of the user to make admin
 * @param {Array} currentAdminIds - Current admin IDs array
 * @returns {Promise<{success: boolean, data: Object}|{success: boolean, error: Error}>}
 */
export async function makeUserGroupAdmin(groupId, userId, currentAdminIds = []) {
    try {
        // Make sure userId is included in adminIds
        const adminIds = [...(currentAdminIds || [])];
        if (!adminIds.includes(parseInt(userId))) {
            adminIds.push(parseInt(userId));
        }

        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ adminIds }),
        };

        const result = await customFetch(`/groups/${groupId}`, options, true);
        return { success: !!result.success, data: result };
    } catch (error) {
        console.error('Error making user admin:', error);
        return { success: false, error };
    }
}

/**
 * Remove admin privileges from a user
 * @param {string|number} groupId - The ID of the group
 * @param {string|number} userId - The ID of the user to remove admin privileges from
 * @param {Array} currentAdminIds - Current admin IDs array
 * @returns {Promise<{success: boolean, data: Object}|{success: boolean, error: Error}>}
 */
export async function removeUserGroupAdmin(groupId, userId, currentAdminIds = []) {
    try {
        // Filter out the userId from adminIds
        const adminIds = (currentAdminIds || []).filter(id => parseInt(id) !== parseInt(userId));

        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ adminIds }),
        };

        const result = await customFetch(`/groups/${groupId}`, options, true);
        return { success: !!result.success, data: result };
    } catch (error) {
        console.error('Error removing admin privileges:', error);
        return { success: false, error };
    }
}

/**
 * Remove a user from a group
 * @param {string|number} groupId - The ID of the group
 * @param {string|number} userId - The ID of the user to remove
 * @param {Array} currentMembers - Current members array
 * @param {Array} currentAdminIds - Current admin IDs array
 * @returns {Promise<{success: boolean, data: Object}|{success: boolean, error: Error}>}
 */
export async function removeUserFromGroup(groupId, userId, currentMembers = [], currentAdminIds = []) {
    try {
        // Filter out the userId from members and adminIds
        const members = (currentMembers || []).filter(id => parseInt(id) !== parseInt(userId));
        const adminIds = (currentAdminIds || []).filter(id => parseInt(id) !== parseInt(userId));

        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ members, adminIds }),
        };

        const result = await customFetch(`/groups/${groupId}`, options, true);
        return { success: !!result.success, data: result };
    } catch (error) {
        console.error('Error removing user from group:', error);
        return { success: false, error };
    }
}

