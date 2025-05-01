# Edit Item Form

The edit-item-form component allows users to modify existing list items, including their basic properties as well as which lists the item appears in.

## Features

- Edit item name, price, links, notes, images, amount wanted, and priority
- Select which lists the item should appear in
- Control visibility settings (public, user-specific, group-specific)
- Set automatic deletion preferences

## Usage

```html
<edit-item-form
  .itemData="${itemData}"
  @item-updated="${handleItemUpdated}"
  @cancel="${handleCancel}"
></edit-item-form>
```

## Properties

- `itemData`: Object containing the item data to edit
- `selectedListIds`: Array of list IDs that this item belongs to

## Events

- `item-updated`: Dispatched when the item is successfully updated, includes updated item data
- `cancel`: Dispatched when the user clicks the cancel button

## Implementation Details

The edit-item-form includes a list selector that allows users to select which lists the item should appear in. This is implemented using the `select-my-lists` component, which fetches the user's lists and provides a multi-select interface.

The form submits the selected list IDs along with other item properties when the user saves changes.