import {LitElement, html, css} from 'lit';

/**
 * Generic selectable list component
 * 
 * Usage:
 * <selectable-list 
 *   .items=${items}
 *   .selectedItemIds=${selectedIds}
 *   .itemRenderer=${(item, isSelected, handleClick) => html`<custom-item-component ...></custom-item-component>`}
 *   @selection-changed=${handleSelectionChange}
 * ></selectable-list>
 */
export class SelectableList extends LitElement {
    static properties = {
        items: {type: Array}, // Array of items to display
        selectedItemIds: {type: Array}, // Array of selected item IDs
        loading: {type: Boolean},
        title: {type: String}, // Optional title for the list
        itemRenderer: {type: Function}, // Function to render each item
        idField: {type: String}, // Field name to use as item ID (default: 'id')
        customEmptyMessage: {type: String} // Custom message when no items available
    };

    constructor() {
        super();
        this.items = [];
        this.selectedItemIds = [];
        this.loading = false;
        this.title = 'Items';
        this.idField = 'id';
        this.customEmptyMessage = 'No items available.';
        // Default renderer if none provided
        this.itemRenderer = (item, isSelected, handleClick) => html`
            <div 
                style="padding: 8px; border: 1px solid #ccc; cursor: pointer; 
                       background: ${isSelected ? 'var(--background-light)' : 'transparent'}"
                @click=${() => handleClick(item)}
            >
                ${isSelected ? '✓ ' : ''}${item.name || item.title || JSON.stringify(item)}
            </div>
        `;
    }

    static get styles() {
        return css`
            :host {
                display: block;
                border: 1px solid var(--border-color);
                border-radius: var(--border-radius-normal);
                background-color: var(--background-color);
            }

            .header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: var(--spacing-x-small);
                border-bottom: 1px solid var(--border-color);
            }

            .title {
                font-weight: bold;
                font-size: var(--font-size-small);
                color: var(--text-color-dark);
            }

            .selection-info {
                display: flex;
                align-items: center;
                gap: var(--spacing-x-small);
            }

            .selected-count {
                font-size: var(--font-size-x-small);
                color: var(--primary-color);
                font-weight: bold;
            }

            .action-buttons {
                display: flex;
                gap: var(--spacing-x-small);
            }

            button {
                border: none;
                background: none;
                padding: var(--spacing-x-small) var(--spacing-small);
                border-radius: var(--border-radius-small);
                font-size: var(--font-size-x-small);
                cursor: pointer;
                transition: var(--transition-normal);
            }

            .select-all {
                color: var(--primary-color);
            }

            .select-all:hover {
                background-color: var(--purple-light);
            }

            .clear {
                color: var(--text-color-medium-dark);
            }

            .clear:hover {
                background-color: var(--grayscale-150);
            }

            .items-container {
                display: flex;
                flex-direction: column;
                gap: var(--spacing-x-small);
                max-height: 300px;
                overflow-y: auto;
                padding: var(--spacing-x-small);
            }

            .items-container::-webkit-scrollbar {
                width: 8px;
            }

            .items-container::-webkit-scrollbar-track {
                background: var(--background-color);
                border-radius: 4px;
            }

            .items-container::-webkit-scrollbar-thumb {
                background: var(--grayscale-300);
                border-radius: 4px;
            }

            .items-container::-webkit-scrollbar-thumb:hover {
                background: var(--grayscale-400);
            }

            .empty-message {
                color: var(--text-color-medium-dark);
                font-size: var(--font-size-small);
                padding: var(--spacing-small);
                text-align: center;
            }

            .loading {
                padding: var(--spacing-small);
                text-align: center;
                color: var(--text-color-medium-dark);
                font-size: var(--font-size-small);
            }
        `;
    }

    _handleItemClick(item) {
        const itemId = item[this.idField];
        const index = this.selectedItemIds.indexOf(itemId);
        
        // Create a new array to trigger reactivity
        const newSelectedIds = [...this.selectedItemIds];
        
        if (index > -1) {
            newSelectedIds.splice(index, 1);
        } else {
            newSelectedIds.push(itemId);
        }
        
        this.selectedItemIds = newSelectedIds;
        this._emitChangeEvent();
    }

    selectAll() {
        const itemsArray = Array.isArray(this.items) ? this.items : [];
        this.selectedItemIds = itemsArray
            .filter(item => item && item[this.idField])
            .map(item => item[this.idField]);
        this._emitChangeEvent();
    }

    clearSelection() {
        this.selectedItemIds = [];
        this._emitChangeEvent();
    }

    _emitChangeEvent() {
        const itemsArray = Array.isArray(this.items) ? this.items : [];
        const selectedItems = this.selectedItemIds
            .map(id => itemsArray.find(item => item && item[this.idField] === id))
            .filter(Boolean);

        this.dispatchEvent(new CustomEvent('selection-changed', {
            detail: {
                selectedItemIds: this.selectedItemIds,
                selectedItems,
                count: this.selectedItemIds.length
            },
            bubbles: true,
            composed: true
        }));
    }

    render() {
        if (this.loading) {
            return html`
                <div class="loading">Loading items...</div>
            `;
        }

        if (!this.items || !Array.isArray(this.items) || this.items.length === 0) {
            return html`
                <div class="empty-message">${this.customEmptyMessage}</div>
            `;
        }

        return html`
            <div class="header">
                <div class="selection-info">
                    <div class="title">${this.title}</div>
                    ${this.selectedItemIds.length > 0 ? html`
                        <div class="selected-count">(${this.selectedItemIds.length} selected)</div>
                    ` : ''}
                </div>

                <div class="action-buttons">
                    ${this.items.length > 0 ? html`
                        <button class="select-all" @click=${this.selectAll}>Select All</button>
                    ` : ''}

                    ${this.selectedItemIds.length > 0 ? html`
                        <button class="clear" @click=${this.clearSelection}>Clear</button>
                    ` : ''}
                </div>
            </div>

            <div class="items-container">
                ${Array.isArray(this.items) 
                    ? this.items.map(item => item ? this.itemRenderer(
                        item, 
                        this.selectedItemIds.includes(item[this.idField]), 
                        this._handleItemClick.bind(this)
                    ) : '')
                    : html`<div class="empty-message">${this.customEmptyMessage}</div>`
                }
            </div>
        `;
    }
}

customElements.define('selectable-list', SelectableList);