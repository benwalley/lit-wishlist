# All Lists Page

The All Lists page displays all lists that the current user has access to, including their own lists and lists shared with them through groups or direct sharing.

## Route

The page is accessible at `/lists`.

## Features

- Displays all accessible lists in a responsive grid layout
- Shows list owner for each list
- Allows filtering/searching lists by name
- Provides loading skeleton UI while data is being fetched
- Responsive design for different screen sizes

## Component Structure

- `all-lists-container.js` - Main container component
  - Uses `list-item` components to display each list
  - Shows owner information with the `showOwner` property
  - Provides search/filter functionality

## API Integration

Uses the `getAllAccessibleLists()` function from the lists API to fetch all lists the user has access to.

## Example Usage

```javascript
// In router configuration
{
  path: '/lists',
  component: 'all-lists-container',
}

// In navigation links
<a href="/lists">All Lists</a>
```