import {customFetch} from "../fetchHelpers.js";

/**
 * Fetch notifications for the current user
 * @returns {Promise<{success: boolean, data: Array}|{success: boolean, error: Error}>}
 */
export async function getMyNotifications() {
    try {
        const result = await customFetch('/notifications', {
            method: 'GET'
        }, true);
        return result;
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return { success: false, error };
    }
}

/**
 * Mark a notification as read
 * @param {number} notificationId - ID of the notification to mark as read
 * @returns {Promise<{success: boolean, data: Object}|{success: boolean, error: Error}>}
 */
export async function markNotificationAsRead(notificationId) {
    try {
        const result = await customFetch(`/notifications/${notificationId}/read`, {
            method: 'PUT'
        }, true);
        return result;
    } catch (error) {
        console.error('Error marking notification as read:', error);
        return { success: false, error };
    }
}