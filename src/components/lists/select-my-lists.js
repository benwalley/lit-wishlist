import {LitElement, html, css} from 'lit';
import './select-list-item.js'
import '../../svg/check.js'
import {listenUpdateList} from "../../events/eventListeners.js";
import {fetchMyLists} from "../../helpers/api/lists.js";
import '../../components/global/selectable-list/selectable-list.js';
import {messagesState} from "../../state/messagesStore.js";

export class CustomElement extends LitElement {
    static properties = {
        lists: {type: Array},
        selectedListIds: {type: Array},
        loading: {type: Boolean}
    };

    constructor() {
        super();
        this.lists = []; // Initialize lists
        this.selectedListIds = [];
        this.loading = true;
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
        this.fetchLists();
        listenUpdateList(this.fetchLists.bind(this));
    }

    async fetchLists() {
        try {
            this.loading = true;
            const response = await fetchMyLists();

            if (response.success) {
                this.lists = response.data;
                if(this.lists.length === 1) {
                    this.selectedListIds = [this.lists[0].id];
                    this.dispatchEvent(new CustomEvent('change', {
                        detail: {
                            selectedListIds: this.selectedListIds,
                        },
                    }));
                }
            } else {
                throw new Error(response.error);
            }
        } catch (error) {
            console.error('Error fetching lists:', error);
            messagesState.addMessage('Error fetching lists', 'error');
            this.lists = []; // Reset to empty array on error
        } finally {
            this.loading = false;
        }
    }

    _handleSelectionChange(event) {
        this.selectedListIds = event.detail.selectedItemIds;

        // Forward the event with our component's naming convention
        this.dispatchEvent(new CustomEvent('change', {
            detail: {
                selectedListIds: this.selectedListIds,
                selectedLists: event.detail.selectedItems,
                count: event.detail.count
            },
            bubbles: true,
            composed: true
        }));
    }

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

customElements.define('select-my-lists', CustomElement);
