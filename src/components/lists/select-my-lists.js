import {LitElement, html, css} from 'lit';
import {customFetch} from "../../helpers/fetchHelpers.js";
import './select-list-item.js'
import '../../svg/check.js'
import {cachedFetch} from "../../helpers/caching.js";

export class CustomElement extends LitElement {
    static properties = {
        lists: {type: Array}, // Track lists fetched from the server
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

            .lists-container {
                display: flex;
                flex-direction: column;
                gap: var(--spacing-x-small);
                max-height: 200px;
                overflow-y: auto;
                padding: var(--spacing-x-small);
            }

            .lists-container::-webkit-scrollbar {
                width: 8px;
            }

            .lists-container::-webkit-scrollbar-track {
                background: var(--background-color);
                border-radius: 4px;
            }

            .lists-container::-webkit-scrollbar-thumb {
                background: var(--grayscale-300);
                border-radius: 4px;
            }

            .lists-container::-webkit-scrollbar-thumb:hover {
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
        this.fetchLists(); // Fetch lists when the component is added to the DOM

        // Bind methods
        this.selectAll = this.selectAll.bind(this);
        this.clearSelection = this.clearSelection.bind(this);
    }

    // Actual disconnectedCallback implementation is in fetchLists
    // to ensure proper cleanup of async operations

    async fetchLists() {
        // Flag to track if component was unmounted during fetch
        let isMounted = true;

        // Store a reference to the component instance for cleanup
        const cleanup = () => {
            isMounted = false;
        };

        // Set up cleanup if component is unmounted
        this.disconnectedCallback = () => {
            super.disconnectedCallback();
            cleanup();
        };

        try {
            this.loading = true;
            const response = await cachedFetch('/lists/mine', {}, true);

            // Check if component was unmounted during the fetch
            if (!isMounted) return;

            if (response?.responseData?.error) {
                throw new Error(response?.responseData?.error);
            }

            // Ensure response is properly formatted and contains data
            if (response?.success) {
                const lists = Array.isArray(response.data) ? response.data : [];
                this.lists = lists.filter(list => list?.id > 0);
                if(this.lists.length === 1) {
                    this.selectedListIds = [this.lists[0].id];
                }
            }
        } catch (error) {
            // Only log error if component is still mounted
            if (isMounted) {
                console.error('Error fetching lists:', error);
                this.lists = []; // Reset to empty array on error
            }
        } finally {
            // Only update loading state if component is still mounted
            if (isMounted) {
                this.loading = false;
            }
        }
    }

    _handleItemClick(event) {
        const itemData = event.detail.itemData;
        const index = this.selectedListIds.indexOf(itemData.id);
        if (index > -1) {
            this.selectedListIds.splice(index, 1);
        } else {
            this.selectedListIds.push(itemData.id);
        }
        this.requestUpdate();
        this._emitChangeEvent();
    }

    selectAll() {
        // Set selectedListIds to include all list IDs, ensuring lists is an array
        const listsArray = Array.isArray(this.lists) ? this.lists : [];
        this.selectedListIds = listsArray
            .filter(list => list && list.id)
            .map(list => list.id);
        this._emitChangeEvent();
        this.requestUpdate();
    }

    clearSelection() {
        this.selectedListIds = [];
        this._emitChangeEvent();
        this.requestUpdate();
    }

    _emitChangeEvent() {
        // Ensure lists is an array before using find method
        const listsArray = Array.isArray(this.lists) ? this.lists : [];

        const selectedLists = this.selectedListIds
            .map(id => listsArray.find(list => list && list.id === id))
            .filter(Boolean);

        this.dispatchEvent(new CustomEvent('change', {
            detail: {
                selectedListIds: this.selectedListIds,
                selectedLists,
                count: this.selectedListIds.length
            },
            bubbles: true,
            composed: true
        }));
    }

    render() {
        if (this.loading) {
            return html`
                <div class="loading">Loading lists...</div>
            `;
        }

        if (!this.lists || !Array.isArray(this.lists) || this.lists.length === 0) {
            return html`
                <div class="empty-message">No lists available.</div>
            `;
        }

        return html`
            <div class="header">
                <div class="selection-info">
                    <div class="title">Lists</div>
                    ${this.selectedListIds.length > 0 ? html`
                        <div class="selected-count">(${this.selectedListIds.length} selected)</div>
                    ` : ''}
                </div>

                <div class="action-buttons">
                    ${this.lists.length > 0 ? html`
                        <button class="select-all" @click=${this.selectAll}>Select All</button>
                    ` : ''}

                    ${this.selectedListIds.length > 0 ? html`
                        <button class="clear" @click=${this.clearSelection}>Clear</button>
                    ` : ''}
                </div>
            </div>

            <div class="lists-container">
                ${Array.isArray(this.lists) 
                    ? this.lists.map(
                        list => list ? html`
                            <select-list-item
                                .itemData=${list}
                                .isSelected="${this.selectedListIds.includes(list?.id)}"
                                @item-clicked="${this._handleItemClick}"
                            ></select-list-item>
                        ` : ''
                    )
                    : html`<div class="empty-message">No lists available.</div>`
                }
            </div>
        `;
    }
}

customElements.define('select-my-lists', CustomElement);
