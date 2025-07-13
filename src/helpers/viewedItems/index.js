// API functions
export { getViewedItems, markItemsAsViewed, markItemAsViewed } from './api.js';

// Queue management
export { 
    addItemToQueue, 
    startQueueProcessor, 
    stopQueueProcessor,
    processQueue,
    getQueueStatus 
} from './queue.js';

// localStorage utilities (for internal use or debugging)
export { 
    getPendingViewedItems, 
    getPendingViewedItemsCount,
    clearPendingViewedItems 
} from './localStorage.js';