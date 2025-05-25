# Tracking Status Component

The `tracking-status` component provides a clickable status tracker for managing an item's progress through the gifting lifecycle, with icons and visual indicators.

## Usage

```javascript
import './tracking-status.js';

// In your template
html`<tracking-status itemId="123" status="none"></tracking-status>`
```

## Features

- Interactive clickable cells that work like checkboxes
- Visual status tracking with icons and color-coding
- Seamless status updates with visual feedback
- Tooltips for status descriptions on hover
- Designed to work with or without backend API integration

## Status Options

The component offers five status options, each with its own icon and visual style:

1. **Not Started** - Default state (empty)
2. **Ordered** - The item has been ordered/purchased (order icon)
3. **Arrived** - The item has been received (delivery truck icon)
4. **Wrapped** - The item has been gift-wrapped (gift wrap icon)
5. **Given** - The item has been given to the recipient (heart gift icon)

## Checkbox-like Implementation

The component uses a grid of clickable cells that behave like radio buttons:

- Each cell represents a different status in the gifting process
- Clicking a cell selects that status and marks all previous statuses as completed
- Selected status is highlighted in green
- Completed statuses are shown in a lighter color
- Tooltips appear on hover to show the status name

## Implementation

The component is designed to work with a backend API for persisting tracking status. Currently, it maintains state locally but includes placeholder code for future API integration.

```javascript
// Example usage in gift-tracking-row
<div class="table-row">
    <div class="item-name">${this.item.name}</div>
    <tracking-status 
        itemId="${this.item.id}" 
        status="${this.item.status || 'none'}">
    </tracking-status>
    <div class="price-display">...</div>
</div>
```

## Events

The component dispatches events that you can listen for:

- When a status is updated, the component will eventually trigger the `updateItem` event using the `triggerUpdateItem` function from the event listeners

## Styling

The component uses CSS variables for colors and styling, maintaining consistency with the application's design system:

- Color-coded status indicators (green for selected, gray for completed)
- Custom hover states with animated transitions and tooltips
- Responsive design that works across different screen sizes
- Each cell has the same width and is fully clickable

## Accessibility

- Interactive elements with proper hover and focus states
- Visual feedback when interacting with cells
- Tooltips provide additional context
- Color is not the only indicator of status