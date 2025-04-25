# API Response Handling

When fetching data from an API, all responses should follow a consistent format to simplify error handling and data management across the application.

## Response Format

API responses should include:

```javascript
{
  success: true | false,  // Boolean indicating if the request was successful
  data: {}, // Response data if successful
  error: {} // Error data if unsuccessful
}
```

## Example Usage

```javascript
const response = await customFetch(`/users/${userId}`, options, true);

if (response.success) {
  // Handle successful response
  const userData = response.data;
  // Process userData...
  messagesState.addMessage('User data successfully loaded');
} else {
  // Handle error response
  messagesState.addMessage('Failed to load user data', 'error');
  console.error('API Error:', response.error);
}
```

## Implementation Details

The `customFetch` function in `src/helpers/fetchHelpers.js` processes all API responses and converts them to this standardized format. It handles:

- Status code validation
- JSON parsing
- Authentication
- Token refresh
- Error handling

This consistent format makes it easier to handle responses throughout the application and provides a clear pattern for error management.