# Claude Guidelines for lit-wishlist

## Build Commands
- `npm run dev` - Start development server
- `npm run build` - Build production version
- `npm run preview` - Preview production build

## Code Style Guidelines

### Framework & Structure
- Built with Lit (Web Components)
- Uses lit-element-state for state management
- Vite as build tool with PWA support
- ES Modules format

### Naming Conventions
- Component classes: PascalCase (e.g., `MyTextInput`)
- Custom elements: kebab-case (e.g., `custom-input`)
- Files: kebab-case.js
- Properties/variables: camelCase

### Component Structure
- Use LitElement for all components
- Define properties with static get properties()
- Implement render() method for component templates
- Place styles in static get styles() using css template literal

### Error Handling
- Validate inputs with custom validate() methods
- Use native validation when available
- Dispatch custom events for errors

### Event Handling
- Use custom events with meaningful names (e.g., 'value-changed')
- Include relevant data in event.detail

### Styling
- Use CSS variables for theming
- Look in src/index.css for variables.
- Follow existing design patterns in components

### API fetching
 - When fetching data from an API, assume that the API response will include
   - success: (true or false)
   - data (response data if successful)
   - error (error data if an error)

### re-fetching data
 - There is a list of event listeners in src/events/eventListeners.js such as:
   - triggerUpdateUser
 - When the user is updated, call triggerUseUpdated to update any usages of the user data.
 - The same approach should be done for other types of data

### Current User data
 - When the user is loaded, the user data is stored in the user store.
 - when element use user data, they should subscribe to the user store for the user data. 
 - See example in src/components/pages/account/account-username.js

### messages
 - Messages can be added using the messageState add method like
   - `messagesState.addMessage('User info successfully updated');`

### Documentation
 - Any components or functionality we use needs to get documented in /documentation. 
 - There shold be a file for each type of component or practice we're using.
 - The documentation should be very simple and straight forward such as an example of usage and a few sentences of description
 - 
- always find variable names from index.css instead of making them up