# Action Dropdown Component

The `action-dropdown` component provides a customizable dropdown menu for various actions, often used with a kebab/dots menu for contextual actions.

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

## Kebab Menu Example (from list-view-container)

The action-dropdown is commonly used with a dots/kebab menu for page-level actions. Note the use of color classes to visually distinguish different types of actions:

```javascript
// Define action items as a method
_getActionDropdownItems() {
  return [
    {
      id: 'edit',
      label: 'Edit List',
      icon: html`<edit-icon class="action-icon"></edit-icon>`,
      classes: 'blue-text',    // Standard action - blue
      action: () => this._handleEditList()
    },
    {
      id: 'share',
      label: 'Copy public link',
      icon: html`<share-icon class="action-icon"></share-icon>`,
      classes: 'purple-text',  // Special feature - purple
      action: () => this._handleShareList()
    },
    {
      id: 'delete',
      label: 'Delete List',
      icon: html`<delete-icon class="action-icon"></delete-icon>`,
      classes: 'danger-text',  // Destructive action - red
      action: () => this._handleDeleteList()
    }
  ];
}

// In render method
html`
  <div class="header-top">
    <h1>${this.listData?.listName}</h1>
    
    <action-dropdown
      .items="${this._getActionDropdownItems()}"
      placement="bottom-end"
    >
      <button
        slot="toggle"
        class="kebab-menu icon-button"
        aria-label="List actions"
      >
        <dots-icon></dots-icon>
      </button>
    </action-dropdown>
  </div>
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

## Available Button Classes and Color Semantics

The action-dropdown component supports all the button styles defined in `src/css/buttons.js`. Use color classes to visually distinguish between different types of actions:

| Class        | Description                                     | Usage                                    |
|-------------|--------------------------------------------------|------------------------------------------|
| primary      | Primary button style with filled background     | Main action                              |
| secondary    | Secondary button style with border              | Alternative action                       |
| ghost        | Ghost button style with light border            | Subtle action                            |
| danger       | Danger button style with red background         | Destructive actions with high visibility |
| danger-text  | Text-only danger style (red text)               | Destructive actions (delete, remove)     |
| blue-text    | Text-only blue style                            | Standard actions (edit, view)            |
| green-text   | Text-only green style                           | Positive actions (approve, confirm)      |
| purple-text  | Text-only purple style                          | Special features (share, export)         |
| small        | Small button size                               | Use for compact UIs                      |
| link-button  | Link-like button                                | Navigation-like actions                  |

### Color Meaning Conventions

Following consistent color conventions helps users understand actions at a glance:

- **Blue**: Standard, non-destructive actions (edit, view details)
- **Purple**: Special features or sharing functionality 
- **Green**: Positive or confirmation actions (approve, complete)
- **Red**: Destructive or warning actions (delete, remove)
- **Gray**: Neutral or disabled actions

## Events

| Event Name      | Detail                                | Description                          |
|-----------------|---------------------------------------|--------------------------------------|
| action-selected | `{ id: string, label: string }`       | Fired when an action is selected     |
