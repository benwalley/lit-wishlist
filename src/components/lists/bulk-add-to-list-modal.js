import {LitElement, html, css} from 'lit';
import buttonStyles from "../../css/buttons";
import '../global/custom-modal';
import { listenBulkAddToListModal, triggerUpdateList } from '../../events/eventListeners';
import '../../svg/check.js';
import '../pages/account/avatar.js';
import '../pages/listItem/select-items.js';
import { bulkAddToList } from '../../helpers/api/listItems.js';
import { messagesState } from '../../state/messagesStore.js';

export class BulkAddToListModal extends LitElement {
    static properties = {
        isOpen: {type: Boolean},
        selectedItemIds: {type: Array},
        list: {type: Object},
        isLoading: {type: Boolean}
    };

    constructor() {
        super();
        this.isOpen = false;
        this.selectedItemIds = [];
        this.list = null;
        this.isLoading = false;
    }

    connectedCallback() {
        super.connectedCallback();
        this.unsubscribe = listenBulkAddToListModal((event) => {
            if (event && event.detail && event.detail.list) {
                this.list = event.detail.list;
                this.isOpen = true;
            } else {
                console.error('No list data provided to bulk-add-to-list-modal');
                messagesState.addMessage('Error: No list data provided', 'error');
            }
        });
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }

    handleModalChange(e) {
        this.isOpen = e.detail.isOpen;
        if (!e.detail.isOpen) {
            // Clear selections when modal is closed
            this.selectedItemIds = [];
        }
    }

    async handleAddToList() {
        if (!this.list || !this.list.id) {
            messagesState.addMessage('Error: Unable to add items to list. Missing list information.', 'error');
            return;
        }

        this.isLoading = true;

        try {
            const itemIds = this.selectedItemIds || [];

            // Skip the API call if there's nothing to add
            if (itemIds.length === 0) {
                messagesState.addMessage('Please select at least one item to add', 'warning');
                this.isLoading = false;
                return;
            }

            const result = await bulkAddToList(this.list.id, itemIds);

            if (result.success) {
                messagesState.addMessage('Items successfully added to list');
                triggerUpdateList();
                this.isOpen = false;
            } else {
                messagesState.addMessage(`Error adding items to list: ${result.error || 'Unknown error'}`, 'error');
            }
        } catch (error) {
            console.error('Error adding items to list:', error);
            messagesState.addMessage('Error adding items to list', 'error');
        } finally {
            this.isLoading = false;
        }
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    display: block;
                }
                
                .modal-header {
                    position: sticky;
                    top: 0;
                    z-index: 10;
                    background-color: var(--background-dark);
                    border-bottom: 1px solid var(--border-color);
                }
                
                .modal-title {
                    padding: var(--spacing-normal);
                    margin: 0;
                    text-align: center;
                    font-size: var(--font-size-large);
                }
                
                .list-name {
                    color: var(--primary-color);
                    font-weight: bold;
                }
                
                .modal-footer {
                    position: sticky;
                    bottom: 0;
                    z-index: 10;
                    background-color: var(--modal-background-color);
                    padding: var(--spacing-normal);
                    border-top: 1px solid var(--border-color);
                    display: flex;
                    justify-content: flex-end;
                    gap: var(--spacing-small);
                }
                
                .modal-content {
                    padding: var(--spacing-normal);
                    max-height: 70vh;
                    overflow-y: auto;
                }
                
                .scrolling-contents {
                    flex: 1;
                    width: 100%;
                    box-sizing: border-box;
                    padding: var(--spacing-normal);
                    overflow-y: auto;
                    overflow-x: hidden;
                }
            `
        ];
    }

    _handleSelectedItemsChange(e) {
        const {selectedItemIds} = e.detail;
        this.selectedItemIds = selectedItemIds;
    }

    render() {
        return html`
            <custom-modal 
                triggerEvent="open-bulk-add-to-list-modal"
                ?isOpen=${this.isOpen}
                @modal-changed=${this.handleModalChange}
                noPadding="true"
            >
                <div class="modal-container">
                    <div class="modal-header">
                        <h2 class="modal-title">
                            ${this.list ? 
                                html`Add Items to <span class="list-name">${this.list.listName}</span>` : 
                                'Add Items to List'
                            }
                        </h2>
                    </div>
                    
                    <div class="scrolling-contents">
                        <select-items 
                            @change="${this._handleSelectedItemsChange}"
                        ></select-items>
                    </div>
                    
                    <div class="modal-footer">
                        <button class="secondary" @click=${() => this.isOpen = false}>Cancel</button>
                        <button class="primary" 
                                ?disabled=${this.isLoading || this.selectedItemIds.length === 0}
                                @click=${this.handleAddToList}>
                            ${this.isLoading ? 'Adding...' : 'Add to List'}
                        </button>
                    </div>
                </div>
            </custom-modal>
        `;
    }
}
customElements.define('bulk-add-to-list-modal', BulkAddToListModal);
