# Gift Tracking Components

This document describes the gift tracking components and their usage.

## Components

### GiftsTrackingPage

The main component for displaying a user's gift tracking information organized by user groups. It handles the overall container, data fetching, grouping, and state management.

```javascript
// Example usage
<gifts-tracking-page></gifts-tracking-page>
```

#### Data Processing

The component groups items by user (the person receiving the gift):
- "For Me" group contains items the current user is getting
- Other groups are organized by the creator's user ID (who the item is for)

### GiftTrackingUserGroup

A collapsible container component that displays a group of items for a specific user.

```javascript
// Example usage
<gift-tracking-user-group .group=${userGroupData}></gift-tracking-user-group>
```

Features:
- Collapsible header with user name and item count
- Toggle to expand/collapse the group
- Container for multiple GiftTrackingRow components
- Compact, space-efficient design for large numbers of items

### GiftTrackingRow

A component that renders a single row in a compact layout. It handles the display of an individual gift item's data.

```javascript
// Example usage
<gift-tracking-row .item=${itemData} compact></gift-tracking-row>
```

The compact layout uses CSS Grid:
```css
grid-template-columns: 40px 2fr 80px 80px 40px;
```

On mobile, it simplifies to:
```css
grid-template-columns: 40px 3fr 70px 30px;
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

## API Helper

The `gifts.js` helper provides functions for fetching gift tracking data:

```javascript
import {fetchUserGiftTrackingData} from "../helpers/api/gifts.js";

// Example usage
async function loadData() {
  const response = await fetchUserGiftTrackingData();
  
  if (response.success) {
    const contributionsData = response.data;
    // Use contributionsData
  } else {
    // Handle error
  }
}
```

## Design Patterns

1. **Grid-Based Table Layout**
   - Uses CSS Grid for a responsive table-like layout
   - Maintains column alignment across rows
   - Adapts to different screen sizes by hiding less important data

2. **Separation of Concerns**
   - Fetch logic is moved to a dedicated API helper
   - UI components focus on rendering and user interaction
   - Loader component provides visual feedback during data fetching

3. **Responsive Design**
   - Both the page and loader components adapt to different screen sizes
   - Mobile-friendly layout with appropriate column hiding
   - Alternative display of necessary information on mobile

4. **Error Handling**
   - Clear error states and messaging
   - Consistent error handling pattern across components
   - Empty state handling with appropriate calls to action

5. **Visual Status Indicators**
   - Colored badges to indicate contribution status
   - Clear visual hierarchy of information