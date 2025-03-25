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
