# Add Question Modal

A globally available modal component for adding questions throughout the application.

## Usage

The modal is already included in the `auth-container` and is available on all authenticated pages of the application.

### Triggering the Modal

No need to import the component, just use the event system:

```js
import { triggerAddQuestionEvent } from '../../events/custom-events.js';

// Add this method to your component:
_handleAskQuestion() {
  triggerAddQuestionEvent(editData);
}

// In your render method:
render() {
  return html`
    <button @click=${this._handleAskQuestion}>Ask a Question</button>
  `;
}
```


## Features

- Opens a modal for asking questions to users
- Supports pre-selecting users when opened from user profiles
- Consistent interface with other modals in the application
- Handles submissions through a standardized API approach

## Component Structure

The modal system consists of:

1. `src/components/global/add-question-modal.js` - The globally available modal container component that listens for events
2. `src/components/pages/account/qa/add-qa-popup.js` - The form component that lives inside the modal
3. Custom events in `src/events/custom-events.js` for opening/closing the modal

## API

### Custom Events

- `ADD_QUESTION_EVENT` - Event to open the question modal
- `triggerAddQuestionEvent(editData)` - Helper to trigger the modal opening

### Component Properties

- `isOpen` - Controls modal visibility
- `preSelectedUserId` - User ID to pre-select when opening the modal

## Implementation Details

- Uses the application's standard event-based modal system
- Integrates with existing user selection components
- Follows the established pattern for modal/form separation
