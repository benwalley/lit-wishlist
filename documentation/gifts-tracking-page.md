# Gifts Tracking Page

The Gifts Tracking page displays a grid-styled table view of all items the user is contributing to or getting. This component provides a centralized place for users to see all their gift commitments across different lists.

## Features

- Displays all items the user is contributing to or getting
- Shows contribution amounts and getting quantities
- Provides links to view the item details
- Organizes data in a responsive grid-styled table
- Includes empty state handling
- Handles loading states with skeleton loaders
- Responsive design that simplifies on mobile

## Component Usage

```javascript
// The component is rendered at the route /gifts-tracking
// No need to import or instantiate directly.
// It's imported in the router: 
import '../components/pages/gift-tracking/gifts-tracking-page.js';

// Route definition:
{
    path: '/gifts-tracking',
    component: 'gifts-tracking-page',
}
```

## API

The component fetches data from:

- `/giftTracking` - Gets all items the user is contributing to or getting

## Implementation Details

The component is divided into three parts:

1. **GiftsTrackingPage** - The main container that:
   - Fetches data from the API
   - Groups items by user (who the item is for)
   - Handles loading, error, and empty states
   - Renders user groups

2. **GiftTrackingUserGroup** - A collapsible container for items grouped by user:
   - Displays a header with the user's name and item count
   - Can be expanded/collapsed to show/hide items
   - Contains multiple GiftTrackingRow components

3. **GiftTrackingRow** - A compact row component that renders a single item with:
   - Item image
   - Item name (with list info shown below)
   - Status (Getting/Contributing/Tracking)
   - Amount (Contributing amount or getting quantity)
   - Link to view the item

The compact grid layout uses CSS Grid with the following structure:
```css
grid-template-columns: 40px 2fr 80px 80px 40px;
```

On mobile, it simplifies to:
```css
grid-template-columns: 40px 3fr 70px 30px;
```

This modular approach combines grouping by user with compact rows, making the interface more organized and scalable for large numbers of items.

The component handles:
- Loading states with skeleton loaders that match the grid layout
- Error states with friendly error messages
- Empty states with a call to action
- Responsive design that hides less important columns on mobile
- Visual indicators for contribution status with colored badges

## Events

The component listens for the `updateItem` event to refresh the data when items are updated elsewhere in the application.

## Example Data Structure

```javascript
[
  {
    id: 36,
    createdById: 28,
    name: "Coffee Maker",
    lists: [16, 22, 27],
    price: "0",
    minPrice: "12.00",
    maxPrice: "214.00",
    links: ["..."],
    notes: "...",
    isCustom: false,
    deleteOnDate: null,
    visibleToGroups: [],
    matchListVisibility: true,
    amountWanted: "range",
    minAmountWanted: "1",
    maxAmountWanted: "20",
    priority: "1",
    visibleToUsers: [],
    isPublic: true,
    imageIds: [41],
    deleted: false,
    createdAt: "2025-05-02T02:35:01.866Z",
    updatedAt: "2025-05-04T23:25:59.051Z",
    contributors: [
      {
        id: 3,
        userId: 28,
        itemId: 36,
        getting: true,
        contributing: false,
        contributeAmount: null,
        isAmountPrivate: false,
        numberGetting: 1
      }
    ],
    trackingType: "contributing"
  }
]
```