# Group Lists List Component

The `group-lists-list` component displays all lists associated with a specific group.

## Usage

```html
<group-lists-list .groupData="${groupData}"></group-lists-list>
```

## Properties

- `groupData` (Object): Group data object containing group information including the group ID

## Behavior

- Displays a list of all lists associated with the specified group
- Shows a loading skeleton while fetching data
- Displays a message when no lists are found
- Automatically refreshes when lists are updated using the event system
- Uses the `list-item` component to render individual list items

## Example

```javascript
// In a parent component
import '../groups/group-lists-list.js';

render() {
  return html`
    <section>
      <group-lists-list .groupData="${this.groupData}"></group-lists-list>
    </section>
  `;
}
```

## API Integration

Uses the `getGroupLists(groupId)` function from the lists API to fetch all lists for a specific group.