# Popover API Implementation

## Overview

This document explains how the Popover API is implemented in the Lit-Wishlist application. The Popover API is a modern web platform feature that provides native, accessible popover elements without requiring custom JavaScript for positioning or focus management.

## Components Using Popover API

- **Action Dropdown** (`src/components/global/action-dropdown.js`)
  - A dropdown menu component that displays actions when clicked
  - Uses the Popover API with automatic fallback for unsupported browsers
  - Maintains consistent behavior across all environments

## How It Works

### Feature Detection

The component uses proper feature detection to determine if the Popover API is supported:

```javascript
const supportsPopover = 'HTMLElement' in window && 
                       'showPopover' in HTMLElement.prototype && 
                       'hidePopover' in HTMLElement.prototype;
```

### Implementation Approach

The component takes a progressive enhancement approach:

1. **Native Implementation (Modern Browsers)**
   - Uses `popover` attribute on the dropdown content element
   - Uses `popovertarget` attribute on the trigger button
   - Leverages native `showPopover()` and `hidePopover()` methods
   - Listens for the native `toggle` event to sync component state

2. **Fallback Implementation (Legacy Browsers)**
   - Uses absolute positioning with CSS
   - Implements manual show/hide through CSS classes
   - Adds document-level click listener for outside clicks
   - Maintains the same UX regardless of browser support

### Accessibility Features

- Proper ARIA attributes (`aria-haspopup`, `aria-expanded`)
- Keyboard accessibility (natively handled by Popover API)
- Focus management (natively handled by Popover API)
- Light dismiss behavior (configurable)

## Using the Action Dropdown

```javascript
import '../global/action-dropdown.js';

// In your component's render method:
render() {
  const dropdownItems = [
    {
      id: 'edit',
      label: 'Edit',
      icon: html`<edit-icon></edit-icon>`,
      action: () => this.handleEdit()
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: html`<delete-icon></delete-icon>`,
      danger: true,
      action: () => this.handleDelete()
    },
    {
      id: 'custom',
      label: 'Custom Action',
      icon: html`<share-icon></share-icon>`,
      customStyle: true,
      color: '#6366f1',
      hoverColor: 'rgba(99, 102, 241, 0.1)',
      action: () => this.handleCustomAction()
    }
  ];

  return html`
    <action-dropdown .items=${dropdownItems} ?lightDismiss=${true}>
      <dots-icon slot="toggle"></dots-icon>
    </action-dropdown>
  `;
}
```

## Component API

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `items` | Array | `[]` | Array of items to display in the dropdown |
| `open` | Boolean | `false` | Whether the dropdown is currently open |
| `placement` | String | `'bottom-end'` | Positioning of the dropdown |
| `lightDismiss` | Boolean | `true` | Whether clicking outside dismisses the dropdown |

### Events

| Event | Detail | Description |
|-------|--------|-------------|
| `action-selected` | `{id: string, label: string}` | Fired when an action is selected |

### Item Format

Each item in the `items` array should have the following properties:

```javascript
{
  id: 'unique-id',          // Unique identifier for the action
  label: 'Action Label',    // Display text
  icon: html`<some-icon>`,  // Optional icon (Lit HTML template)
  action: () => {},         // Function to call when clicked
  danger: false,            // Optional, styles item as dangerous action
  customStyle: false,       // Optional, enables custom styling
  color: '#hexcolor',       // Optional, sets text color (requires customStyle: true)
  hoverColor: '#hexcolor'   // Optional, sets hover background color (requires customStyle: true)
}
```

## Browser Support

The Popover API is supported in:
- Chrome 114+
- Edge 114+
- Safari 16.4+
- Firefox 119+

For browsers without support, the fallback implementation provides the same functionality.

## Benefits of the Popover API

1. **Native Implementation**
   - Uses the browser's built-in positioning engine
   - Handles edge cases like screen boundaries automatically

2. **Performance**
   - No JavaScript calculations for positioning
   - No additional libraries needed

3. **Accessibility**
   - Native keyboard navigation
   - Focus management handled by the browser
   - Proper screen reader integration

4. **Simplicity**
   - Significantly less code than custom solutions
   - More maintainable long-term

## References

- [MDN Web Docs: Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API)
- [HTML Living Standard: Popover](https://html.spec.whatwg.org/multipage/popover.html)
- [Open UI: Popover](https://open-ui.org/components/popover.research/)