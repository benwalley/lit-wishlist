# Async API Pattern

## Overview

The async API pattern is used for long-running operations that may exceed the 30-second timeout limit. Instead of waiting synchronously, the client immediately receives a job ID and polls for completion status.

## Usage

### Basic Item Fetch

```javascript
import { asyncItemFetch } from '../helpers/api/asyncItemFetch.js';

// Fetch item data from a URL
try {
    const itemData = await asyncItemFetch.fetchItem('https://example.com/product');
} catch (error) {
    console.error('Failed to fetch item:', error.message);
}
```

### Wishlist Import (Async)

```javascript
import { importAmazonWishlistAsync } from '../helpers/api/import.js';

try {
    const response = await importAmazonWishlistAsync('https://amazon.com/wishlist/...');
    if (response.success) {
        
    }
} catch (error) {
    console.error('Import failed:', error);
}
```

## How It Works

1. **Start Job**: Client calls the start endpoint and gets immediate `jobId` response
2. **Poll Status**: Client polls status endpoint every 1-3 seconds with exponential backoff  
3. **Handle Completion**: When status is `completed`, return data; if `failed`, throw error

## API Endpoints

### Item Fetch (Single URLs)
- `POST /itemFetch/start` - Start async item fetch job
- `GET /itemFetch/status/:jobId` - Get job status  
- `DELETE /itemFetch/cancel/:jobId` - Cancel job
- `GET /itemFetch/jobs` - Get user jobs

### Wishlist Import (Amazon/Other Sites)
- `POST /wishlistImport/start` - Start async wishlist import job
- `GET /wishlistImport/status/:jobId` - Get job status
- `DELETE /wishlistImport/cancel/:jobId` - Cancel job  
- `GET /wishlistImport/jobs` - Get user jobs

## Benefits

- **No Timeouts**: Eliminates 30-second timeout issues on slow operations
- **Better Error Handling**: Clear error messages instead of generic timeout failures
- **Backward Compatible**: Existing sync endpoints continue to work during migration

## Implementation Details

The `AsyncItemFetch` class handles:
- Exponential backoff polling (1s → 3s max delay)
- Timeout after 60 attempts (~2 minutes)
- Error handling for network issues and job failures
- Job cancellation and status monitoring

## Components Using Async Pattern

- **import-wishlist-container**: Uses `importAmazonWishlistAsync()` for wishlist imports
- **add-to-list-modal**: Uses `asyncItemFetch.fetchItem()` for URL-based item fetching
