# Public QA Component

The `public-qa` component displays answered QA items for a specific user. It shows all non-deleted QA items that have answers, making it suitable for displaying on public-facing user profiles.

## Usage

```html
<public-qa userId="123"></public-qa>
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| userId | String | The ID of the user whose QA items should be displayed |

## Features

- Automatically fetches QA items for the specified user
- Filters out deleted items and items without answers
- Updates when the QA data changes (via event listeners)
- Shows a loading state and empty state as appropriate
- Disables interaction with the QA items (read-only display)

## Example

```javascript
// Adding the component to a user profile page
import './qa/public-qa.js';

// In your render method:
render() {
  return html`
    <div class="profile-section">
      <h2>User Profile</h2>
      <!-- Other profile content -->
      
      <public-qa userId="${this.profileUserId}"></public-qa>
    </div>
  `;
}
```

## Implementation Notes

- QA items shown in this component are read-only (pointer-events are disabled)
- Only shows items that have been answered (items with empty answers are filtered out)
- Uses the same styling as the main QA component for consistency