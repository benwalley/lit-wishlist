# Global Action Pattern

This document describes the "Global Action Pattern" used in the application for operations that can be triggered from multiple places.

## Overview

The Global Action Pattern is a design approach where actions (like delete, edit, share) that can be initiated from multiple places in the application are handled by a centralized component that's available application-wide.

Instead of duplicating action logic across multiple components, we:
1. Create a single global component that handles the action logic
2. Create buttons/triggers that dispatch events to activate the global component
3. Register the global component at the application root level

## Benefits

- **DRY (Don't Repeat Yourself)**: Logic for complex operations is defined in one place
- **Consistency**: The same behavior is guaranteed regardless of where the action is triggered
- **Maintainability**: Changes to the action logic are made in a single location
- **Decoupling**: UI components are decoupled from action implementation details

## Implementation

### 1. Global Action Component

A global component that:
- Listens for specific custom events (e.g., 'delete-list')
- Contains the business logic for the action
- Handles confirmations, API calls, and result notifications
- Usually has no visual representation (renders an empty template)

Example: `delete-list.js`

```javascript
export class DeleteList extends LitElement {
    constructor() {
        super();
        this._boundEventHandler = this._handleDeleteListEvent.bind(this);
    }

    connectedCallback() {
        super.connectedCallback();
        // Listen for global delete-list events
        window.addEventListener('delete-list', this._boundEventHandler);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        // Remove event listener on disconnect
        window.removeEventListener('delete-list', this._boundEventHandler);
    }

    async _handleDeleteListEvent(event) {
        const listData = event.detail?.listData;
        // Handle the delete action...
    }

    render() {
        // No visual representation
        return html``;
    }
}
```

### 2. Action Trigger Component

A button or UI element that:
- Accepts data relevant to the action (e.g., list ID to delete)
- Dispatches a custom event when activated
- Can be placed anywhere in the application

Example: `delete-list-button.js`

```javascript
export class DeleteListButton extends LitElement {
    static get properties() {
        return {
            listData: { type: Object }
        };
    }

    _handleClick() {
        this.dispatchEvent(new CustomEvent('delete-list', {
            detail: { listData: this.listData },
            bubbles: true,
            composed: true
        }));
    }

    render() {
        return html`
            <button @click="${this._handleClick}">
                Delete List
            </button>
        `;
    }
}
```

### 3. Registration in Application Root

The global action component is registered at the application root level:

```html
<!-- In auth-container or similar root component -->
<auth-container>
    <!-- Other components -->
    <delete-list></delete-list>
</auth-container>
```

## Examples in the Application

### Delete List Component

The Delete List functionality demonstrates the Global Action Pattern:

1. `delete-list.js`: Global component that handles list deletion logic
2. `delete-list-button.js`: Button component that can be placed anywhere
3. Registration in `auth-container.js`

### Usage

```html
<!-- In list view -->
<delete-list-button .listData=${this.listData}></delete-list-button>

<!-- In account page -->
<delete-list-button 
    .listData=${this.listData} 
    variant="link" 
    label="Remove List">
</delete-list-button>
```

## When to Use This Pattern

Use the Global Action Pattern when:

1. The same action needs to be available from multiple places in the application
2. The action involves complex logic (confirmations, API calls, state updates)
3. You want to ensure consistent behavior regardless of where the action is triggered
4. The action might need to be extended with additional capabilities in the future

## Future Applications

This pattern can be extended to other actions like:
- Edit operations
- Share functionality
- Export/import features
- Bulk operations