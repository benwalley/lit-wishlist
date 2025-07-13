import { getItem, setItem } from '../../localStorage/helpers.js';

const VIEWED_ITEMS_QUEUE_KEY = 'viewedItemsQueue';

/**
 * Add an item ID to the pending viewed items queue
 * @param {string|number} itemId - The item ID to add to the queue
 */
export function addViewedItemToQueue(itemId) {
    if (!itemId) return;
    
    const currentQueue = getPendingViewedItems();
    
    // Only add if not already in queue (deduplicate)
    if (!currentQueue.includes(itemId)) {
        const updatedQueue = [...currentQueue, itemId];
        setItem(VIEWED_ITEMS_QUEUE_KEY, updatedQueue);
    }
}

/**
 * Get all pending viewed item IDs waiting to be sent to API
 * @returns {Array<string|number>} Array of item IDs
 */
export function getPendingViewedItems() {
    const queue = getItem(VIEWED_ITEMS_QUEUE_KEY);
    return Array.isArray(queue) ? queue : [];
}

/**
 * Clear all pending viewed items from the queue
 * Used after successful API sync
 */
export function clearPendingViewedItems() {
    setItem(VIEWED_ITEMS_QUEUE_KEY, []);
}

/**
 * Remove a specific item ID from the queue
 * @param {string|number} itemId - The item ID to remove
 */
export function removeItemFromQueue(itemId) {
    if (!itemId) return;
    
    const currentQueue = getPendingViewedItems();
    const updatedQueue = currentQueue.filter(id => id !== itemId);
    setItem(VIEWED_ITEMS_QUEUE_KEY, updatedQueue);
}

/**
 * Get the count of pending viewed items
 * @returns {number} Number of items in the queue
 */
export function getPendingViewedItemsCount() {
    return getPendingViewedItems().length;
}