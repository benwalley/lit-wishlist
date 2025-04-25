# Action Dropdown Component

The `action-dropdown` component provides a customizable dropdown menu for various actions.

## Basic Usage

```javascript
import '../global/action-dropdown.js';

// In your component
this.actionItems = [
  {
    id: 'edit',
    label: 'Edit Item',
    icon: html`<edit-icon></edit-icon>`,
    classes: 'blue-text',
    action: () => this.handleEditItem()
  },
  {
    id: 'share',
    label: 'Copy Link',
    icon: html`<share-icon></share-icon>`,
    classes: 'purple-text',
    action: () => this.handleCopyLink()
  },
  {
    id: 'delete',
    label: 'Delete Item',
    icon: html`<delete-icon></delete-icon>`,
    classes: 'danger-text',
    action: () => this.handleDeleteItem()
  }
];

// In your render method
html`
  <action-dropdown .items=${this.actionItems} placement="bottom-start">
    <button
      class="button icon-button"
      aria-label="Actions"
      slot="toggle"
    >
      <dots-icon></dots-icon>
    </button>
  </action-dropdown>
`;
```

## Properties

| Property   | Type    | Description                                  |
|------------|---------|----------------------------------------------|
| items      | Array   | Array of action items to display             |
| placement  | String  | Dropdown placement (e.g., "bottom-start")    |
| open       | Boolean | Whether the dropdown is open                 |

## Item Configuration

Each item in the `items` array can have the following properties:

| Property    | Type     | Description                                          |
|-------------|----------|------------------------------------------------------|
| id          | String   | Unique identifier for the item                       |
| label       | String   | Display text for the item                            |
| icon        | HTML     | Optional icon to display (Lit html template)         |
| action      | Function | Function to execute when the item is clicked         |
| classes     | String   | CSS classes to apply to the item                     |

## Available Button Classes

The action-dropdown component supports all the button styles defined in `src/css/buttons.js`. Some useful classes for dropdown items include:

| Class        | Description                                     |
|-------------|-------------------------------------------------|
| primary      | Primary button style with filled background     |
| secondary    | Secondary button style with border              |
| ghost        | Ghost button style with light border            |
| danger       | Danger button style with red background         |
| danger-text  | Text-only danger style (red text)               |
| blue-text    | Text-only blue style                            |
| green-text   | Text-only green style                           |
| purple-text  | Text-only purple style                          |
| small        | Small button size                               |
| link-button  | Link-like button                                |

## Events

| Event Name      | Detail                                | Description                          |
|-----------------|---------------------------------------|--------------------------------------|
| action-selected | `{ id: string, label: string }`       | Fired when an action is selected     |