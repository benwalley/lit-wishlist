# User Chooser Component

A custom input component that allows users to type text and select from a dropdown of matching users with autocomplete functionality.

## Basic Usage

```javascript
import './src/components/global/user-chooser.js';
```

```html
<user-chooser
    label="Select User"
    placeholder="Enter name or select user"
    @value-changed="${this.handleUserChange}"
    required
></user-chooser>
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `label` | String | `''` | Input label text |
| `value` | String | `''` | Current text value |
| `selectedUser` | Object | `null` | Currently selected user object |
| `placeholder` | String | `''` | Input placeholder text |
| `required` | Boolean | `false` | Whether field is required |

## Events

### `value-changed`
Fired when the input value changes (typing or user selection).

**Detail:**
- `value` - Current text value
- `selectedUser` - Selected user object (null if typing)

### `user-selected`
Fired when a user is selected from the dropdown.

**Detail:**
- `user` - Selected user object

## Features

- **Autocomplete**: Filters users as you type
- **Flexible Input**: Accepts both typed text and user selections
- **Visual Feedback**: Shows selected user indicator
- **Clear Function**: X button to clear selection
- **Keyboard Navigation**: Focus/blur handling
- **API Integration**: Uses `getAccessibleUsers()` to fetch users

## Example Usage

```javascript
handleUserChange(e) {
    const { value, selectedUser } = e.detail;
    
    if (selectedUser) {
        console.log('User selected:', selectedUser.name);
    } else {
        console.log('Text entered:', value);
    }
}
```

## Styling

The component uses CSS custom properties for theming and follows existing design patterns in the codebase. Selected users are highlighted with purple colors.