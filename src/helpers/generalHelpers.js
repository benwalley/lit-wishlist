import {userListState} from "../state/userListStore.js";

let counter = 0

export function formatDate(dateString) {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'long',  // Full month name (e.g., March)
        day: 'numeric',  // Day of the month (e.g., 15)
        year: 'numeric'  // Full year (e.g., 2024)
    });
}

export function getUniqueId () {
    counter++;
    return `uid-${counter}`;
}

/**
 * Get a username by user ID from the userListState
 * @param {string|number} userId - The user ID to look up
 * @returns {string} - The username, or userId as fallback if not found
 */
export function getUsernameById(userId) {
    if (!userId) return '';

    const user = userListState.users.find(user => user.id === userId);
    return user ? user.name : '';
}

export function getUserDescriptionById(userId) {
    if (!userId) return '';

    const user = userListState.users.find(user => user.id === userId);
    return user ? user.publicDescription : '';
}

export function getUserImageIdByUserId(userId) {
    if (!userId) return 0;

    const user = userListState.users.find(user => user.id === userId);
    return user?.image || 0;
}

export function getEmailAddressByUserId(userId) {
    if (!userId) return '';

    const user = userListState.users.find(user => user.id === userId);
        return user?.email || '';
}
