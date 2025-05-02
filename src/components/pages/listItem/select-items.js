import {LitElement, html, css} from 'lit';
import './select-item.js'
import '../../../svg/check.js'
import {fetchMyItems} from "../../../helpers/api/listItems.js";
import {listenUpdateItem} from "../../../events/eventListeners.js";
import {messagesState} from "../../../state/messagesStore.js";
import '../../../components/global/selectable-list/selectable-list.js';

export class SelectItems extends LitElement {
    static properties = {
        selectedItemIds: {type: Array},
        loading: {type: Boolean},
        excludedItemIds: {type: Array}, // Optional IDs to exclude from selection
        items: {type: Array} // Track items fetched from the server
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

    _handleSelectionChange(event) {
        this.selectedItemIds = event.detail.selectedItemIds;
        
        // Forward the event with our component's naming convention
        this.dispatchEvent(new CustomEvent('change', {
            detail: event.detail,
            bubbles: true,
            composed: true
        }));
    }

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

customElements.define('select-items', SelectItems);
