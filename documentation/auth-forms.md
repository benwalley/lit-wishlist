# Authentication Forms

## Overview
The authentication system uses a parent-child architecture where `auth-form-container` manages state and UI switching, while individual form components handle their specific authentication logic.

## Components

### AuthFormContainer
**File:** `src/components/pages/guest-home/auth-form-container.js`
**Element:** `<auth-form-container>`

The parent controller component that manages form switching and provides a consistent UI wrapper.

**Features:**
- Visual progress indicators with dots
- Smooth transitions between forms
- Centralized event handling
- Responsive design with loading states

**States:**
- `login` - Login form
- `create` - Create account form  
- `forgot-password` - Password reset form

### Child Form Components

#### LoginForm
**File:** `src/components/pages/guest-home/login-form.js`
**Element:** `<login-form>`

Handles user authentication with support for subuser login.

#### CreateAccountForm
**File:** `src/components/pages/guest-home/create-account-form.js`
**Element:** `<create-account-form>`

Handles new user registration.

#### ForgotPasswordForm
**File:** `src/components/pages/guest-home/forgot-password-form.js`
**Element:** `<forgot-password-form>`

Handles password reset email requests.

## Event System

All child forms dispatch standardized events that the parent can listen for:

### Success Events
```javascript
// Dispatched when authentication succeeds
this.dispatchEvent(new CustomEvent('auth-success', {
    bubbles: true,
    composed: true,
    detail: {
        type: 'login' | 'create-account' | 'password-reset',
        userData?: object,
        redirectTo?: string,
        message?: string
    }
}));
```

### Error Events
```javascript
// Dispatched when authentication fails
this.dispatchEvent(new CustomEvent('auth-error', {
    bubbles: true,
    composed: true,
    detail: {
        type: 'login' | 'create-account' | 'password-reset',
        message: string,
        data?: object
    }
}));
```

### Form Navigation Events
```javascript
// Switch between forms
this.dispatchEvent(new CustomEvent('show-forgot-password', { bubbles: true, composed: true }));
this.dispatchEvent(new CustomEvent('back-to-login', { bubbles: true, composed: true }));
this.dispatchEvent(new CustomEvent('password-reset-sent', { bubbles: true, composed: true }));
```

## Usage Example

```html
<!-- In guest-home-container.js -->
<auth-form-container></auth-form-container>
```

The parent container automatically handles:
- Form switching based on user actions
- Visual feedback and loading states
- Event delegation from child forms
- Consistent styling and layout

## Styling

The component uses CSS custom properties for theming:
- `--purple-normal` - Primary action color
- `--purple-light` - Background highlights
- `--grayscale-*` - Border and text colors
- Responsive design with mobile-first approach

## Best Practices

1. **Event-Driven**: Child forms communicate through events, not direct method calls
2. **Centralized State**: All form switching logic lives in the parent
3. **Consistent API**: All forms follow the same success/error event patterns
4. **User Feedback**: Visual indicators show current state and transitions
5. **Accessibility**: Proper ARIA labels and semantic HTML structure