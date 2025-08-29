import {getItem, setItem} from "./helpers.js";

const RECIPIENT_COLLAPSED_STATE_NAME = 'eventRecipientCollapsed';

/**
 * Get the collapsed state for a specific event recipient
 * @param {string} eventId - The event ID
 * @param {string} userId - The recipient user ID
 * @returns {boolean} - True if collapsed, false if expanded (default)
 */
export function getRecipientCollapsedState(eventId, userId) {
    const allStates = getItem(RECIPIENT_COLLAPSED_STATE_NAME) || {};
    const key = `${eventId}-${userId}`;
    return allStates[key] ?? false; // Default to expanded (false)
}

/**
 * Set the collapsed state for a specific event recipient
 * @param {string} eventId - The event ID
 * @param {string} userId - The recipient user ID
 * @param {boolean} isCollapsed - True to collapse, false to expand
 */
export function setRecipientCollapsedState(eventId, userId, isCollapsed) {
    const allStates = getItem(RECIPIENT_COLLAPSED_STATE_NAME) || {};
    const key = `${eventId}-${userId}`;
    allStates[key] = isCollapsed;
    setItem(RECIPIENT_COLLAPSED_STATE_NAME, allStates);
}
