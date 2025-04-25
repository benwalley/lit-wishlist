# Edit Item Feature

The edit item feature allows users to modify existing wishlist items from either the item detail page or the list page.

## Components

1. **Edit Item Modal** (`/src/components/add-to-list/edit-item-modal.js`): 
   - A modal dialog that opens when a user wants to edit an item
   - Listens for the `EDIT_ITEM_EVENT` custom event
   - Contains the edit item form

2. **Edit Item Form** (`/src/components/add-to-list/edit-item-form.js`):
   - Provides form fields for editing item details
   - Pre-fills fields with existing item data
   - Handles updating the item in the database

## Usage

### Triggering the Edit Modal

The edit modal can be triggered in two ways:

1. Use the `openEditItemModal` helper function:
   ```js
   import { openEditItemModal } from '../../add-to-list/edit-item-modal.js';
   
   // Pass the item data object
   openEditItemModal(itemData);
   ```

2. Dispatch the custom event directly:
   ```js
   import { EDIT_ITEM_EVENT } from '../../events/custom-events.js';
   
   const event = new CustomEvent(EDIT_ITEM_EVENT, {
     detail: { itemData },
     bubbles: true,
     composed: true
   });
   
   document.dispatchEvent(event);
   ```

### Adding the Modal to a Component

To add the edit functionality to a component:

1. Import the necessary dependencies:
   ```js
   import '../../add-to-list/edit-item-modal.js';
   import { openEditItemModal } from '../../add-to-list/edit-item-modal.js';
   ```

2. Add the modal component in your template:
   ```js
   <edit-item-modal></edit-item-modal>
   ```

3. Create a handler to open the modal:
   ```js
   _handleEditItem() {
     if (this.itemData) {
       openEditItemModal(this.itemData);
     }
   }
   ```

4. Add a button or UI element to trigger editing:
   ```js
   <button @click="${this._handleEditItem}" class="button">
     <edit-icon></edit-icon> Edit Item
   </button>
   ```

## Implementation Details

- The modal loads all existing item data and populates the form fields
- When the form is submitted, it makes a PUT request to update the item
- After a successful update, it triggers the `triggerUpdateItem` event to refresh any components displaying the item
- It also invalidates cache entries for the item to ensure fresh data is loaded

## Data Flow

1. User clicks edit button on an item
2. Edit modal opens with pre-filled data
3. User makes changes and submits the form
4. Backend updates the item data
5. UI is refreshed to show the updated item data