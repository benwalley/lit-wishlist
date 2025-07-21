import {userListState} from "../state/userListStore.js";
import {userState} from "../state/userStore.js";
import {viewedItemsState} from "../state/viewedItemsStore.js";

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


export function isSubuser(userId) {
    if (!userId) return false;

    const user = userListState.users.find(user => user.id === userId);
    return user?.parentId || false;
}

export function isCurrentUserSubuser() {
    return !!userState?.userData?.parentId;
}

/**
 * Check if an item has been viewed by the current user
 * @param {string|number} itemId - The item ID to check
 * @returns {boolean} - True if the item has been viewed, false otherwise
 */
export function isItemViewed(itemId) {
    if (!itemId || !viewedItemsState.viewedItems) return false;

    return viewedItemsState.viewedItems.some(viewedItem =>
        viewedItem.itemId === itemId || viewedItem.id === itemId
    );
}

/**
 * Get viewed item details by item ID
 * @param {string|number} itemId - The item ID to look up
 * @returns {Object|null} - The viewed item object, or null if not found
 */
export function getViewedItemById(itemId) {
    if (!itemId || !viewedItemsState.viewedItems) return null;

    return viewedItemsState.viewedItems.find(viewedItem =>
        viewedItem.itemId === itemId || viewedItem.id === itemId
    ) || null;
}

export function getParentUserName(userId) {
    if (!userId) return '';

    const child = userListState.users.find(user => user.id === userId);
    const parent = userListState.users.find(user => user.id === child.parentId);
    return parent?.name || '';
}

export function getParentUserId(userId) {
    if (!userId) return 0;

    const child = userListState.users.find(user => user.id === userId);
    return child?.parentId || 0;
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

export function redirectToDefaultPage() {
    window.location.href = '/';
}

/**
 * Truncate a string to a maximum length and add ellipsis if needed
 * @param {string} text - The text to truncate
 * @param {number} maxLen - Maximum length before truncation
 * @returns {string} - The truncated text with ellipsis if needed
 */
export function maxLength(text, maxLen) {
    if (!text || typeof text !== 'string') return '';
    if (text.length <= maxLen) return text;
    return text.substring(0, maxLen) + '...';
}
