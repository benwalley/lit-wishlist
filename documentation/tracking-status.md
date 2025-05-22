# Tracking Status Component

The `tracking-status` component provides an enhanced customizable select dropdown for managing an item's status through its gifting lifecycle, featuring rich content in options with icons and color-coding.

## Usage

```javascript
import './tracking-status.js';

// In your template
html`<tracking-status itemId="123"></tracking-status>`
```

## Features

- Advanced customizable `<select>` element using modern HTML/CSS features
- Rich content in dropdown options with status icons and colored text
- Seamless status updates with visual feedback
- Graceful fallback for browsers without customizable select support
- Designed to work with or without backend API integration

## Status Options

The component offers five status options, each with its own icon and color:

1. **Not Started** - Default state (gray)
2. **Ordered** - The item has been ordered/purchased (green with cart icon)
3. **Arrived** - The item has been received (yellow with delivery icon)
4. **Wrapped** - The item has been gift-wrapped (blue with gift icon)
5. **Given** - The item has been given to the recipient (purple with heart icon)

## Advanced Select Implementation

The component uses the new customizable select features:

- `<button>` as the first child of `<select>` for custom button styling
- `<selectedcontent>` element to display the currently selected option with its icon
- Rich HTML content inside each `<option>` including icons and formatted text
- Custom styling via `appearance: base-select` and associated pseudo-elements

```html
<select appearance="base-select">
  <button>
    <selectedcontent>
      <!-- Custom selected content with icon -->
    </selectedcontent>
  </button>
  <option>
    <!-- Rich HTML option content with icon -->
  </option>
</select>
```

## Progressive Enhancement

The component is built with a progressive enhancement approach:

- In modern browsers: Full customized select with icons and rich content
- In older browsers: Falls back to a standard select with color-coded text
- Maintains core functionality in all browsers while enhancing where supported

## Implementation

The component is designed to work with a backend API for persisting tracking status. Currently, it maintains state locally but includes placeholder code for future API integration.

```javascript
// Example usage in gift-tracking-row
<div class="table-row">
    <div class="item-name">${this.item.name}</div>
    <tracking-status itemId="${this.item.id}"></tracking-status>
    <div class="contributors">...</div>
</div>
```

## Styling

The component uses CSS variables for colors and styling, maintaining consistency with the application's design system:

- Visual styling using the new `::picker-icon`, `::picker(select)`, and `::selectedcontent` pseudo-elements
- Color-coded status indicators in the dropdown and selected display
- Custom hover and focus states with animated transitions
- Responsive design that works across different screen sizes
- Graceful styling fallbacks for browsers without customizable select support

## Accessibility

- Maintains native select element accessibility features
- Proper labeling with ARIA attributes
- Keyboard navigation fully supported
- Screen reader friendly