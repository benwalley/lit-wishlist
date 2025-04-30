# Bulk Share to Group Modal

The Bulk Share to Group Modal allows users to share multiple lists and questions with a group at once.

## Usage

To open the modal, use the `triggerBulkAddToGroupModal` event trigger and pass the group data:

```js
import { triggerBulkAddToGroupModal } from '../../events/eventListeners';

// Example: Open the modal with group data
const group = { id: '123', groupName: 'Family Group' };
triggerBulkAddToGroupModal(group);
```

## Component Features

- Displays the group name in the header
- Allows selection of multiple lists using `select-my-lists` component
- Allows selection of multiple questions using `select-my-questions` component
- Sends the selected lists and questions to the API with the group ID
- Shows loading state during API request
- Displays success/failure messages using messagesState
- Triggers group update event on successful sharing

## API Endpoint

The component makes a POST request to `/groups/:groupId/bulk-share` with the following payload:

```js
{
  listIds: [list-id-1, list-id-2, ...],
  questionIds: [question-id-1, question-id-2, ...]
}
```

## Dependencies

- custom-modal
- select-my-lists
- select-my-questions
- messagesState
- triggerGroupUpdated event