# Bulk Add to List Modal

The Bulk Add to List Modal allows users to add multiple items to a list at once. This modal provides a user interface for selecting items and adding them to a specified list.

## Usage

Trigger the modal by using the provided event:

```javascript
import { triggerBulkAddToListModal } from '../../events/eventListeners';

// Call this function when you want to open the modal
// Make sure to pass the list object
triggerBulkAddToListModal(listObject);
```

Add the component to your application:

```html
<!-- In your main application or where modals are placed -->
<bulk-add-to-list-modal></bulk-add-to-list-modal>
```

## Component Structure

The component consists of:
1. A modal header displaying the list name
2. A scrollable content area with selectable items
3. Footer buttons for Cancel and Add actions

## Features

- Select multiple items at once
- Select all/clear selection functionality
- Items already in the list are automatically excluded
- Visual feedback for selected items
- Loading states during API operations

## API Integration

The component works with the following API functions:

```javascript
// Add items to a list in bulk
import { bulkAddToList } from '../../helpers/api/listItems.js';

// Example usage:
await bulkAddToList(listId, itemIds);
```

## Events

The component uses custom events for communication:

```javascript
// Listen for the modal to open
import { listenBulkAddToListModal } from '../../events/eventListeners';

// Trigger list updates when items are added
import { triggerUpdateList } from '../../events/eventListeners';
```

## Dependencies

This component depends on:
- `select-items.js` - For item selection functionality
- Custom events in `eventListeners.js`
- `bulkAddToList` API function in `listItems.js`