# Contributor Stack Component

The `contributor-stack` component displays a stack of user avatars with contributor information. It's designed to show a visual representation of users who are contributing to or getting an item.

## Features

- Displays user avatars in an overlapping stack
- Shows a "+X more" indicator when there are more contributors than the display limit
- Provides detailed contributor information in tooltips
- Includes an info icon that opens a modal with a full list of contributors
- Handles both "contributing" and "getting" status types
- Supports a "simple" mode that shows a clickable chip with text (e.g., "3 contributors")

## Usage

```javascript
import '../../global/contributor-stack.js';

// Standard display with avatars
html`
  <contributor-stack 
    .contributors=${contributorsArray} 
    maxDisplayed="3">
  </contributor-stack>
`

// Simple display with just text and info icon
html`
  <contributor-stack 
    .contributors=${contributorsArray} 
    simple>
  </contributor-stack>
`
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| contributors | Array | Array of contributor objects |
| maxDisplayed | Number | Maximum number of avatars to display before showing "+X more" (default: 5) |
| simple | Boolean | When true, only displays text and info icon instead of avatars (default: false) |

## Contributor Object Structure

The component expects each contributor object to have this structure:

```javascript
{
  user: {
    name: "Username",
    image: "imageId"  // Optional image ID
  },
  getting: true/false,
  numberGetting: 1,    // Number of items they're getting (if getting=true)
  contributing: true/false,
  contributeAmount: 50  // Amount they're contributing (if contributing=true)
}
```

## Tooltips

- Hovering over an avatar shows details about that contributor
- Hovering over the "+X more" indicator shows a list of all contributors

## Examples

### Standard Display
```javascript
const contributors = [
  {
    user: { name: "Alice", image: "123" },
    getting: true,
    numberGetting: 2
  },
  {
    user: { name: "Bob" },
    contributing: true,
    contributeAmount: 25
  },
  {
    user: { name: "Charlie", image: "456" },
    contributing: true,
    contributeAmount: 50
  }
];

html`<contributor-stack .contributors=${contributors}></contributor-stack>`
```

### Simple Display
```javascript
// Use in compact UI elements like table rows
html`<contributor-stack .contributors=${contributors} simple></contributor-stack>`

// Renders as a clickable "3 contributors" chip that opens the contributors modal when clicked
```