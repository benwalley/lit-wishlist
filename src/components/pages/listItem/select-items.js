import {LitElement, html, css} from 'lit';
import './select-item.js'
import '../../../svg/check.js'
import {fetchMyItems} from "../../../helpers/api/listItems.js";
import {listenUpdateItem} from "../../../events/eventListeners.js";
import {messagesState} from "../../../state/messagesStore.js";

export class SelectItems extends LitElement {
    static properties = {
        items: {type: Array}, // Track items fetched from the server
        selectedItemIds: {type: Array},
        loading: {type: Boolean},
        excludedItemIds: {type: Array} // Optional IDs to exclude from selection
    };

    constructor() {
        super();
        this.items = []; // Initialize items
        this.selectedItemIds = [];
        this.loading = true;
        this.excludedItemIds = [];
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

    connectedCallback() {
        super.connectedCallback();
        this.fetchItems();
        listenUpdateItem(this.fetchItems.bind(this));
    }

    async fetchItems() {
        try {
            this.loading = true;
            const response = await fetchMyItems(this.excludedItemIds);
            
            if (response.success) {
                this.items = response.data;
            } else {
                throw new Error(response.error);
            }
        } catch (error) {
            console.error('Error fetching items:', error);
            messagesState.addMessage('Error fetching items', 'error');
            this.items = []; // Reset to empty array on error
        } finally {
            this.loading = false;
        }
    }

    _handleItemClick(event) {
        const itemData = event.detail.itemData;
        const index = this.selectedItemIds.indexOf(itemData.id);
        if (index > -1) {
            this.selectedItemIds.splice(index, 1);
        } else {
            this.selectedItemIds.push(itemData.id);
        }
        this.requestUpdate();
        this._emitChangeEvent();
    }

    selectAll() {
        // Set selectedItemIds to include all item IDs, ensuring items is an array
        const itemsArray = Array.isArray(this.items) ? this.items : [];
        this.selectedItemIds = itemsArray
            .filter(item => item && item.id)
            .map(item => item.id);
        this._emitChangeEvent();
        this.requestUpdate();
    }

    clearSelection() {
        this.selectedItemIds = [];
        this._emitChangeEvent();
        this.requestUpdate();
    }

    _emitChangeEvent() {
        // Ensure items is an array before using find method
        const itemsArray = Array.isArray(this.items) ? this.items : [];

        const selectedItems = this.selectedItemIds
            .map(id => itemsArray.find(item => item && item.id === id))
            .filter(Boolean);

        this.dispatchEvent(new CustomEvent('change', {
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
                <div class="empty-message">No items available to add.</div>
            `;
        }

        return html`
            <div class="header">
                <div class="selection-info">
                    <div class="title">Items</div>
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
                    ? this.items.map(
                        item => item ? html`
                            <select-item
                                .itemData=${item}
                                .isSelected="${this.selectedItemIds.includes(item?.id)}"
                                @item-clicked="${this._handleItemClick}"
                            ></select-item>
                        ` : ''
                    )
                    : html`<div class="empty-message">No items available.</div>`
                }
            </div>
        `;
    }
}

customElements.define('select-items', SelectItems);
