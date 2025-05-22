# Gift Tracking Components

This document describes the gift tracking components and their usage.

## Components

### GiftsTrackingPage

The main container component with tabs for different gift tracking views. It handles tab switching between "Getting" and "Contributing" views.

```javascript
// Example usage
<gifts-tracking-page></gifts-tracking-page>
```

#### Features

- Tab-based interface for switching between different views
- "Getting" tab shows items the user is receiving from others
- "Contributing" tab shows items the user is contributing to

### GiftTrackingGetting

The component responsible for displaying items the user is getting, organized by the person providing the gift.

```javascript
// Example usage
<gift-tracking-getting></gift-tracking-getting>
```

#### Data Processing

The component groups items by user (the person providing the gift):
- "For Me" group contains items the current user is getting
- Other groups are organized by the creator's user ID (who the item is for)

### GiftTrackingContributing

The component responsible for displaying items the user is contributing to, organized by recipient.

```javascript
// Example usage
<gift-tracking-contributing></gift-tracking-contributing>
```

### GiftTrackingUserGroup

A collapsible container component that displays a group of items for a specific user.

```javascript
// Example usage
```

Features:
- Collapsible header with user name and item count
- Toggle to expand/collapse the group
- Container for multiple GiftTrackingRow components
- Compact, space-efficient design for large numbers of items

### GiftTrackingRow

A component that renders a single row in a compact layout. It handles the display of an individual gift item's data, allowing users to see and edit the quantity they're getting and the amount they're contributing.

```javascript
// Example usage
<gift-tracking-row .item=${itemData} compact></gift-tracking-row>
```

Features:
- Item name display
- Contributor count with simplified contributor stack
- Tracking status display
- Quantity input component (TrackingQtyInput)
- Amount input component (TrackingAmountInput)
- Save button that appears when changes are made
- Arrow link to the item detail page

The compact layout uses CSS Grid:
```css
grid-template-columns: 1fr auto auto auto auto;
```

On mobile, it simplifies to:
```css
grid-template-columns: 40px 3fr 1fr 40px;
```

This three-tiered modular approach separates concerns:
1. Page container and data organization (GiftsTrackingPage)
2. User grouping and collapsible sections (GiftTrackingUserGroup)
3. Individual item rendering (GiftTrackingRow)

### GiftTrackingLoader

A skeleton loader component that displays a visual representation of the loading state for the gift tracking page, matching the user group structure.

```javascript
// Example usage
<gift-tracking-loader></gift-tracking-loader>
```

Features:
- Mimics the appearance of collapsed user groups
- Shows skeleton loaders for group headers
- Displays skeleton rows for items within each group
- Matches the compact, grouped layout of the actual component

### TrackingQtyInput

A reusable input component for quantity selection.

```javascript
// Example usage
<tracking-qty-input 
  .value=${qtyValue}
  @qty-changed=${handleQtyChanged}
></tracking-qty-input>
```

Features:
- Focused on a single responsibility: quantity input
- Fires custom `qty-changed` event with the new value
- Maintains consistent styling with other input components
- Includes proper labeling with "Qty:" prefix

### TrackingAmountInput

A reusable input component for monetary amount entry.

```javascript
// Example usage
<tracking-amount-input 
  .value=${amountValue}
  @amount-changed=${handleAmountChanged}
></tracking-amount-input>
```

Features:
- Focused on a single responsibility: amount input
- Fires custom `amount-changed` event with the new value
- Includes currency symbol ($) prefix
- Configures proper step value (0.01) for currency

## API Helper

The `gifts.js` helper provides functions for fetching gift tracking data:

```javascript

// Example usage
async function loadData() {
  
  
  if (response.success) {
    const contributionsData = response.data;
    // Use contributionsData
  } else {
    // Handle error
  }
}
```

## Design Patterns

1. **Tabbed Interface**
   - Uses a tab-based navigation pattern for organizing different views
   - Persistent tabs with visual indicators for the active tab
   - Each tab has a dedicated component with its own UI and data loading logic
   - Icons and labels in tabs for improved usability

2. **Grid-Based Table Layout**
   - Uses CSS Grid for a responsive table-like layout
   - Maintains column alignment across rows
   - Adapts to different screen sizes by hiding less important data

3. **Separation of Concerns**
   - Container/Content pattern separates layout from functionality
   - Each tab is its own component with specific responsibilities
   - Fetch logic is moved to a dedicated API helper
   - UI components focus on rendering and user interaction
   - Loader component provides visual feedback during data fetching

4. **Responsive Design**
   - Both the page and loader components adapt to different screen sizes
   - Mobile-friendly layout with appropriate column hiding
   - Alternative display of necessary information on mobile
   - Tab interface scales well across device sizes

5. **Error Handling**
   - Clear error states and messaging
   - Consistent error handling pattern across components
   - Empty state handling with appropriate calls to action
   - Each tab manages its own error states independently

6. **Interactive Input Controls**
   - Dedicated input components for quantity and contribution amount
   - Custom events for change notifications
   - Save button that appears only when changes are made
   - Instant visual feedback on updates
   
7. **Simplified Contributor Display**
   - Uses simple mode of contributor-stack component
   - Shows clickable chip with number of contributors
   - Chip opens modal with detailed contributor information
