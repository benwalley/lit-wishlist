# Select My Questions Component

The `select-my-questions` component allows users to select one or more questions from their asked questions list. It's useful for operations that need to work with multiple questions at once.

## Features
- Displays a list of questions asked by the user
- Allows selection of one or multiple questions
- Shows answered/unanswered status of each question
- Displays due date when available
- Filtering options to show/hide answered and unanswered questions
- "Select All" and "Clear" actions

## Usage Example

```html
<!-- Uses current logged-in user from userState -->
<select-my-questions
  @change="${this._handleQuestionsChange}"
></select-my-questions>

<!-- Or with explicit user ID -->
<select-my-questions
  userId="123"
  @change="${this._handleQuestionsChange}"
></select-my-questions>
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `userId` | String | Optional. ID of the user whose questions to fetch. If not provided, uses current user ID from userState |
| `includeAnswered` | Boolean | Whether to include answered questions (default: true) |
| `includeUnanswered` | Boolean | Whether to include unanswered questions (default: true) |

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `change` | `{ selectedQuestionIds, selectedQuestions, count }` | Fired when selected questions change |

## Child Components

Uses `select-question-item` to display individual question items.