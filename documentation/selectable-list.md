# Selectable List Component

The `selectable-list` component provides a reusable UI pattern for displaying a list of selectable items with "Select All" and "Clear" functionality.

## Features

- Generic list container with selection capabilities
- Select All / Clear selection buttons
- Customizable item rendering
- Loading and empty states
- Automatic tracking of selected items

## Usage

```javascript
import '../components/global/selectable-list/selectable-list.js';

// Inside your component's render method:
render() {
  return html`
    <selectable-list
      .items=${this.items}
      .selectedItemIds=${this.selectedItemIds}
      .loading=${this.loading}
      .itemRenderer=${this.renderCustomItem}
      .title=${"My Items"}
      .idField=${"id"} 
      .customEmptyMessage=${"No items available."}
      @selection-changed=${this.handleSelectionChange}
    ></selectable-list>
  `;
}

// Custom renderer function
renderCustomItem(item, isSelected, handleClick) {
  return html`
    <div class="custom-item ${isSelected ? 'selected' : ''}" 
         @click=${() => handleClick(item)}>
      ${isSelected ? '✓ ' : ''}${item.name}
    </div>
  `;
}

// Handle selection changes
handleSelectionChange(event) {
  // event.detail contains:
  // - selectedItemIds: Array of IDs
  // - selectedItems: Array of complete item objects
  // - count: Number of selected items
  console.log('Selected items:', event.detail.selectedItems);
}
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `items` | Array | Array of items to display in the list |
| `selectedItemIds` | Array | Array of selected item IDs |
| `loading` | Boolean | Whether the list is in loading state |
| `title` | String | Title displayed in the header (default: "Items") |
| `itemRenderer` | Function | Function to render each item with signature: (item, isSelected, handleClick) => html`` |
| `idField` | String | Property name to use as the unique identifier in items (default: "id") |
| `customEmptyMessage` | String | Message to display when no items are available |

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `selection-changed` | `{ selectedItemIds, selectedItems, count }` | Fired when selection changes |

## Example Implementations

The selectable list is used throughout the application for different types of selectable content.

### 1. Select List Items

```javascript
// From select-items.js
import '../../../components/global/selectable-list/selectable-list.js';

export class SelectItems extends LitElement {
  // ...

  // Custom renderer for the select-item component
  _renderItem(item, isSelected, handleClick) {
    return html`
      <select-item
        .itemData=${item}
        .isSelected=${isSelected}
        @item-clicked=${() => handleClick(item)}
      ></select-item>
    `;
  }

  render() {
    return html`
      <selectable-list
        .items=${this.items}
        .selectedItemIds=${this.selectedItemIds}
        .loading=${this.loading}
        .itemRenderer=${this._renderItem}
        .title=${"Items"}
        .customEmptyMessage=${"No items available to add."}
        @selection-changed=${this._handleSelectionChange}
      ></selectable-list>
    `;
  }
}
```

### 2. Select Lists

```javascript
// From select-my-lists.js
export class CustomElement extends LitElement {
  // ...

  // Custom renderer for the select-list-item component
  _renderItem(item, isSelected, handleClick) {
    return html`
      <select-list-item
        .itemData=${item}
        .isSelected=${isSelected}
        @item-clicked=${() => handleClick(item)}
      ></select-list-item>
    `;
  }

  render() {
    return html`
      <selectable-list
        .items=${this.lists}
        .selectedItemIds=${this.selectedListIds}
        .loading=${this.loading}
        .itemRenderer=${this._renderItem}
        .title=${"Lists"}
        .customEmptyMessage=${"No lists available."}
        @selection-changed=${this._handleSelectionChange}
      ></selectable-list>
    `;
  }
}
```

### 3. Select Questions with Additional Filters

```javascript
// From select-my-questions.js
export class CustomElement extends observeState(LitElement) {
  // ...

  // Custom renderer for the select-question-item component
  _renderItem(item, isSelected, handleClick) {
    return html`
      <select-question-item
        .itemData=${item}
        .isSelected=${isSelected}
        @item-clicked=${() => handleClick(item)}
      ></select-question-item>
    `;
  }

  render() {
    return html`
      <!-- Optional filters section above the list -->
      <div class="filters">
        <div class="filter-option">
          <input 
            type="checkbox" 
            id="include-answered" 
            ?checked=${this.includeAnswered}
            @change=${this._handleFilterChange}
          >
          <label for="include-answered">Answered</label>
        </div>
        <div class="filter-option">
          <input 
            type="checkbox" 
            id="include-unanswered" 
            ?checked=${this.includeUnanswered}
            @change=${this._handleFilterChange}
          >
          <label for="include-unanswered">Unanswered</label>
        </div>
      </div>
      
      <selectable-list
        .items=${this.questions}
        .selectedItemIds=${this.selectedQuestionIds}
        .loading=${this.loading}
        .itemRenderer=${this._renderItem}
        .title=${"Questions"}
        .customEmptyMessage=${"No questions available."}
        @selection-changed=${this._handleSelectionChange}
      ></selectable-list>
    `;
  }
}
```