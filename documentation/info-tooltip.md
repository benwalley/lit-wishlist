# Info Tooltip Component

A reusable component that combines a tooltip on hover with a modal on click. Perfect for providing additional information without cluttering the UI.

## Usage

```html
<info-tooltip message="Click for more details" buttonClass="small-icon">
  <info-icon></info-icon>
  <div slot="modal-content">
    <h2>Details</h2>
    <p>Your detailed content goes here...</p>
  </div>
</info-tooltip>
```

## Properties

- `message` (String): Tooltip text shown on hover
- `buttonClass` (String): Additional CSS classes for the button element

## Slots

- Default slot: Icon or trigger element
- `modal-content`: Content to display in the modal

## Features

- Accessible button with proper ARIA labels
- Keyboard navigation support (Enter and Space to open)
- Uses existing custom-tooltip and custom-modal components
- Self-contained - no external trigger events needed