import { markItemsAsViewed } from './api.js';
import {
    addViewedItemToQueue,
    getPendingViewedItems,
    clearPendingViewedItems,
    getPendingViewedItemsCount,
    removeItemFromQueue
} from './localStorage.js';
import { triggerUpdateViewedItems, triggerUpdateList } from '../../events/eventListeners.js';
import { viewedItemsState } from '../../state/viewedItemsStore.js';

// Queue processor state
let queueProcessor = null;
const PROCESSING_INTERVAL = 5000; // 5 seconds

/**
 * Add an item to the viewed items queue
 * @param {string|number} itemId - The item ID to add
 */
export function addItemToQueue(itemId) {
    if (!itemId) return;
    addViewedItemToQueue(itemId);
}

/**
 * Start the queue processor that sends batched API requests every 5 seconds
 */
export function startQueueProcessor() {
    if (queueProcessor) {
        console.warn('Queue processor already running');
        return;
    }

    // Process any existing queue immediately
    processQueue();

    // Set up interval for periodic processing
    queueProcessor = setInterval(() => {
        processQueue();
    }, PROCESSING_INTERVAL);
}

/**
 * Stop the queue processor
 */
export function stopQueueProcessor() {
    if (queueProcessor) {
        clearInterval(queueProcessor);
        queueProcessor = null;
    }
}

/**
 * Process the current queue by sending items to API
 * @returns {Promise<boolean>} True if successful, false if failed
 */
export async function processQueue() {
    const pendingItems = getPendingViewedItems();

    if (pendingItems.length === 0) {
        return true; // Nothing to process
    }

    try {
        const result = await markItemsAsViewed(pendingItems);

        if (result.success) {
            // Update global state with newly viewed items
            const newViewedItems = pendingItems.map(itemId => itemId);

            viewedItemsState.viewedItems = [
                ...viewedItemsState.viewedItems,
                ...newViewedItems
            ];

            // Clear the queue and trigger updates
            clearPendingViewedItems();
            triggerUpdateViewedItems();
            triggerUpdateList();

            return true;
        } else {
            console.error('Failed to mark items as viewed:', result.error);
            
            // Remove failed items from localStorage to prevent infinite retry
            pendingItems.forEach(itemId => {
                removeItemFromQueue(itemId);
            });
            
            return false;
        }
    } catch (error) {
        console.error('Error processing viewed items queue:', error);
        
        // Remove failed items from localStorage on network/system errors
        pendingItems.forEach(itemId => {
            removeItemFromQueue(itemId);
        });
        
        return false;
    }
}

/**
 * Get the current status of the queue processor
 * @returns {Object} Status information
 */
export function getQueueStatus() {
    return {
        isRunning: queueProcessor !== null,
        pendingCount: getPendingViewedItemsCount(),
        processingInterval: PROCESSING_INTERVAL
    };
}
