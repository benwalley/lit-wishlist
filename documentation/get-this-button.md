# Get This Button

`get-this-button` renders the "I'll get This" button (or a compact cart icon) and the modal popup used to mark yourself (or a subuser) as getting an item.

```javascript
// Example usage
<get-this-button .itemId=${item.id} .itemData=${item}></get-this-button>
```

## Behavior

- Clicking the button opens a `custom-modal` containing a `number-getting-list`, which lists the current user and their subusers with a quantity control for each.
- When the modal opens, the current user's own row is pre-selected with a quantity of 1 (if they weren't already marked as getting it), so clicking **Confirm** immediately marks them as getting one, without requiring the quantity to be changed first.
- Clicking **Confirm** calls `bulkUpdateGetting` with the quantities from the list, then calls `triggerUpdateItem()` and shows a success message.
- Closing the modal any other way (Cancel, the X button, backdrop click, or Escape) without confirming shows an error message "You did not mark that as gotten", so the user knows their intent wasn't saved.
