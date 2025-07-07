import { LitElement, html, css } from 'lit';
import { observeState } from 'lit-element-state';
import { fetchMyLists } from '../../../helpers/api/lists.js';
import { messagesState } from '../../../state/messagesStore.js';
import { userState } from '../../../state/userStore.js';

class WishlistSelector extends observeState(LitElement) {
    static get properties() {
        return {
            selectedListId: { type: String },
            lists: { type: Array },
            loading: { type: Boolean }
        };
    }

    static get styles() {
        return css`
            :host {
                display: block;
                width: 100%;
            }

            .selector-container {
                display: flex;
                flex-direction: column;
                gap: var(--spacing-small);
            }

            .selector-label {
                font-weight: 600;
                color: var(--text-color-dark);
                font-size: var(--font-size-small);
            }

            .selector-dropdown {
                width: 100%;
                padding: var(--spacing-small);
                border: 1px solid var(--border-color);
                border-radius: var(--border-radius-small);
                background: var(--card-background);
                color: var(--text-color-dark);
                font-size: var(--font-size-normal);
                font-family: var(--font-family);
                cursor: pointer;
                transition: var(--transition-normal);
            }

            .selector-dropdown:hover {
                border-color: var(--primary-color);
            }

            .selector-dropdown:focus {
                outline: none;
                border-color: var(--primary-color);
                box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb), 0.2);
            }

            .selector-dropdown:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }

            .loading-text {
                color: var(--text-color-medium);
                font-size: var(--font-size-small);
                font-style: italic;
            }

            .no-lists-message {
                color: var(--text-color-medium);
                font-size: var(--font-size-small);
                padding: var(--spacing-small);
                background: var(--info-background);
                border: 1px solid var(--info-border);
                border-radius: var(--border-radius-small);
            }

            .create-new-option {
                color: var(--primary-color);
                font-weight: 600;
            }
        `;
    }

    constructor() {
        super();
        this.selectedListId = '';
        this.lists = [];
        this.loading = false;
    }

    connectedCallback() {
        super.connectedCallback();
        if (userState.userData?.id) {
            this.fetchLists();
        }
    }

    async fetchLists() {
        if (!userState.userData?.id) return;

        this.loading = true;
        try {
            const response = await fetchMyLists();
            
            if (response.success) {
                this.lists = response.data;
                
                // Auto-select the first list if only one exists
                if (this.lists.length === 1) {
                    this.selectedListId = this.lists[0].id.toString();
                    this._handleSelectionChange();
                }
            } else {
                messagesState.addMessage('Error loading wishlists', 'error');
            }
        } catch (error) {
            console.error('Error fetching lists:', error);
            messagesState.addMessage('Error loading wishlists', 'error');
        } finally {
            this.loading = false;
        }
    }

    _handleSelectionChange() {
        const selectedList = this.lists.find(list => list.id.toString() === this.selectedListId);
        
        this.dispatchEvent(new CustomEvent('wishlist-selected', {
            detail: {
                listId: this.selectedListId,
                listData: selectedList
            },
            bubbles: true,
            composed: true
        }));
    }

    _handleDropdownChange(e) {
        this.selectedListId = e.target.value;
        this._handleSelectionChange();
    }

    render() {
        return html`
            <div class="selector-container">
                <label class="selector-label">Import to Wishlist</label>
                
                ${this.loading ? html`
                    <div class="loading-text">Loading your wishlists...</div>
                ` : ''}
                
                ${!this.loading && this.lists.length === 0 ? html`
                    <div class="no-lists-message">
                        You don't have any wishlists yet. Create one first to import items.
                    </div>
                ` : ''}
                
                ${!this.loading && this.lists.length > 0 ? html`
                    <select 
                        class="selector-dropdown"
                        .value="${this.selectedListId}"
                        @change="${this._handleDropdownChange}"
                        ?disabled="${this.loading}"
                    >
                        <option value="">Select a wishlist...</option>
                        ${this.lists.map(list => html`
                            <option value="${list.id}">${list.name}</option>
                        `)}
                        <option value="new" class="create-new-option">+ Create New Wishlist</option>
                    </select>
                ` : ''}
            </div>
        `;
    }
}

customElements.define('wishlist-selector', WishlistSelector);