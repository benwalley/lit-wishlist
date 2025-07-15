# Item Selector Component

A custom input component that allows users to type text and select from a dropdown of matching items with debounced search functionality.

## Basic Usage

```javascript
import './src/components/global/item-selector.js';
```

```html
<item-selector
    label="Select Item"
    placeholder="Enter item name or select from your items"
    @value-changed="${this.handleItemChange}"
    required
></item-selector>
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `label` | String | `''` | Input label text |
| `value` | String | `''` | Current text value |
| `selectedItem` | Object | `null` | Currently selected item object |
| `placeholder` | String | `''` | Input placeholder text |
| `required` | Boolean | `false` | Whether field is required |

## Events

### `value-changed`
Fired when the input value changes (typing or item selection).

**Detail:**
- `value` - Current text value
- `selectedItem` - Selected item object (null if typing)

### `item-selected`
Fired when an item is selected from the dropdown.

**Detail:**
- `item` - Selected item object

## Features

- **Debounced Search**: 300ms debounce on typing to prevent excessive API calls
- **Server-side Search**: Uses `GET /listItems/search/:query` API endpoint
- **Flexible Input**: Accepts both typed text and item selections
- **Visual Feedback**: Shows selected item indicator with price information
- **Clear Function**: X button to clear selection
- **Loading Indicator**: Shows loading state while searching
- **API Integration**: Uses `searchItems()` to search for items via API
- **Rich Display**: Shows item name and owner information

## Item Data Structure

Items returned from the API should have the following structure:

```javascript
{
    id: number,
    name: string,
    ownerId: number,           // ID of the item owner
    singlePrice: number,       // Optional single price
    minPrice: number,          // Optional minimum price for range
    maxPrice: number,          // Optional maximum price for range
    listNames: string[]        // Optional array of list names
}
```

## Example Usage

```javascript
handleItemChange(e) {
    const { value, selectedItem } = e.detail;
    
    if (selectedItem) {
        console.log('Item selected:', selectedItem.name);
        console.log('Price:', selectedItem.singlePrice || `${selectedItem.minPrice} - ${selectedItem.maxPrice}`);
    } else {
        console.log('Text entered:', value);
    }
}
```

## Styling

The component uses CSS custom properties for theming and follows existing design patterns in the codebase. Selected items are highlighted with purple colors, and the dropdown shows rich item information including prices and associated lists.