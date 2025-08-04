import { LitElement, html, css } from 'lit';
import { observeState } from 'lit-element-state';
import buttonStyles from '../../../css/buttons.js';
import { bulkCreateItems } from '../../../helpers/api/listItems.js';
import { customFetch } from '../../../helpers/fetchHelpers.js';
import { messagesState } from '../../../state/messagesStore.js';
import { navigate } from '../../../router/main-router.js';
import { triggerUpdateList } from '../../../events/eventListeners.js';
import './import-items-display.js';
import '../../lists/select-my-lists.js';

class ImportContainer extends observeState(LitElement) {
    static get properties() {
        return {
            importData: { type: Object },
            selectedItems: { type: Array },
            selectedListId: { type: String },
            isImporting: { type: Boolean },
            onBackToForm: { type: Function },
        };
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    display: block;
                    width: 100%;
                }

                select-my-lists {
                    width: 100%;
                }

                .import-container {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-normal);
                    width: 100%;
                }

                .import-header {
                    text-align: center;
                    margin-bottom: var(--spacing-normal);
                    padding: var(--spacing-normal);
                }

                .import-header h1 {
                    margin: 0 0 var(--spacing-small) 0;
                    font-size: var(--font-size-x-large);
                    color: var(--text-color-dark);
                }

                .import-header p {
                    color: var(--text-color-medium-dark);
                    margin: 0;
                }

                .import-actions {
                    background: var(--card-background);
                    border: 1px solid var(--border-color);
                    border-radius: var(--border-radius-normal);
                    padding: var(--spacing-normal);
                    padding-bottom: 100px;
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-normal);
                }

                .actions-row {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    align-items: center;
                    gap: var(--spacing-normal);
                    flex-wrap: wrap;
                }

                .import-summary {
                    color: var(--text-color-medium-dark);
                    font-size: var(--font-size-small);
                    margin-right: auto;
                }

                .import-button {
                    min-width: 150px;
                    margin-left: auto;
                }


                .no-import-data {
                    text-align: center;
                    padding: var(--spacing-large);
                    color: var(--text-color-medium);
                    background: var(--card-background);
                    border: 1px solid var(--border-color);
                    border-radius: var(--border-radius-normal);
                }

                @media (max-width: 768px) {
                    .actions-row {
                        flex-direction: column;
                        align-items: stretch;
                    }
                    
                    .import-button {
                        width: 100%;
                    }
                }
            `
        ];
    }

    constructor() {
        super();
        this.importData = null;
        this.selectedItems = [];
        this.selectedListId = '';
        this.isImporting = false;
        this.onBackToForm = null;
    }

    _handleItemsSelectionChanged(e) {
        this.selectedItems = e.detail.selectedItems;
    }

    _handleWishlistSelected(e) {
        // select-my-lists returns an array of selected list IDs
        // For import, we'll use the first selected list
        this.selectedListId = e.detail.selectedListIds?.[0] || '';
    }

    async _handleImport() {
        if (!this.selectedListId) {
            messagesState.addMessage('Please select a wishlist to import to', 'error');
            return;
        }

        if (this.selectedItems.length === 0) {
            messagesState.addMessage('Please select at least one item to import', 'error');
            return;
        }

        this.isImporting = true;

        try {
            // Transform items to the format expected by bulkCreateItems
            const transformedItems = this.selectedItems.map(item => ({
                name: item.name,
                price: item.price || '',
                imageIds: [item.imageId || 0],
                itemLinks: item.linkUrl ? [{ url: item.linkUrl, label: 'Amazon Link' }] : [],
                description: '',
                notes: '',
                priority: 3,
                category: ''
            }));

            const response = await bulkCreateItems(transformedItems, [this.selectedListId]);

            if (response.success) {
                messagesState.addMessage(
                    `Successfully imported ${this.selectedItems.length} items to your wishlist`,
                    'success'
                );

                // Trigger updates
                triggerUpdateList();

                navigate(`/list/${this.selectedListId}`);
            } else {
                messagesState.addMessage(
                    response.publicMessage || 'Failed to import items. Please try again.',
                    'error'
                );
            }
        } catch (error) {
            console.error('Error importing items:', error);
            messagesState.addMessage('An unexpected error occurred. Please try again.', 'error');
        } finally {
            this.isImporting = false;
        }
    }

    _canImport() {
        return this.selectedItems.length > 0 &&
               this.selectedListId &&
               this.selectedListId !== 'new' &&
               !this.isImporting;
    }

    render() {
        if (!this.importData) {
            return html`
                <div class="no-import-data">
                    <h2>No Import Data Available</h2>
                    <p>Please go back and import a wishlist first.</p>
                    <button class="button primary" @click="${() => navigate('/import')}">
                        Back to Import
                    </button>
                </div>
            `;
        }

        return html`
            <div class="import-container">
                <div class="import-header">
                    <h1>Review & Import Items</h1>
                    <p>Select the items you want to import and choose a destination wishlist.</p>
                </div>

                <div style="text-align: center; padding: var(--spacing-normal) 0;">
                    <button 
                        class="button secondary"
                        @click="${this.onBackToForm}"
                    >
                        Back to Import Form
                    </button>
                </div>

                <import-items-display
                    .importData="${this.importData}"
                    .selectedItems="${this.selectedItems}"
                    @items-selection-changed="${this._handleItemsSelectionChanged}"
                ></import-items-display>

                <div class="import-actions">
                    <div class="actions-row">
                        <div class="import-summary">
                            ${this.selectedItems.length} items selected
                        </div>
                        <select-my-lists
                            @change="${this._handleWishlistSelected}"
                            includeSubuserLists
                        ></select-my-lists>
                        <button
                            class="button primary import-button"
                            @click="${this._handleImport}"
                            ?disabled="${!this._canImport()}"
                        >
                            ${this.isImporting ? 'Importing...' : 'Import Items'}
                        </button>
                    </div>
                </div>

            </div>
        `;
    }
}

customElements.define('import-container', ImportContainer);
