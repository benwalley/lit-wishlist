import {LitElement, html, css} from 'lit';
import {ADD_MODAL_EVENT} from "../../events/custom-events.js";
import '../global/custom-modal.js'
import '../global/custom-input.js'
import '../global/custom-toggle.js'
import './price-input.js'
import buttonStyles from "../../css/buttons.js";
import './links-input.js'
import './wysiwyg-editor.js'
import './amount-you-want.js'
import './priority-selector.js'
import './images-selector.js'
import './visibility-selector/visibility-selector-container.js'
import "../lists/user-lists.js";
import '../../svg/ai.js'
import '../global/custom-tooltip.js'
import '../../svg/gear.js'
import '../global/process-loading-ring.js'
import {customFetch} from "../../helpers/fetchHelpers.js";
import {asyncItemFetch} from "../../helpers/api/asyncItemFetch.js";
import {triggerUpdateItem, triggerUpdateList} from "../../events/eventListeners.js";
import {messagesState} from "../../state/messagesStore.js";

export class AddToListModal extends LitElement {
    static properties = {
        advancedOpen: {type: Boolean},
        selectedListIds: {type: Array},
        itemName: {type: String},
        isPriceRange: {type: Boolean},
        singlePrice: {type: Number},
        minPrice: {type: Number},
        maxPrice: {type: Number},
        links: {type: Array},
        notes: {type: String},
        imageIds: {type: Array},
        amount: {type: String},
        minAmount: {type: Number},
        maxAmount: {type: Number},
        priority: {type: Number},
        isPublic: {type: Boolean},
        visibleToUsers: {type: Array},
        visibleToGroups: {type: Array},
        visibility: {type: String},
        matchListVisibility: {type: Boolean},
        fetchUrl: {type: String},
        isFetching: {type: Boolean},
        showFetchSection: {type: Boolean},
    };


    constructor() {
        super();
        this.advancedOpen = false;

        // Initialize form state variables
        this.itemName = '';
        this.isPriceRange = false;
        this.singlePrice = 0;
        this.minPrice = 0;
        this.maxPrice = 0;
        this.links = [{url: '', label: ''}];
        this.notes = '';
        this.images = [];
        this.imageIds = []; // Add this to ensure property is initialized
        this.amount = '';
        this.minAmount = 0;
        this.maxAmount = 0;
        this.priority = 1;
        this.isPublic = false;
        this.matchListVisibility = true;
        this.visibleToUsers = [];
        this.visibleToGroups = [];
        this.selectedListIds = [];
        this.fetchUrl = '';
        this.isFetching = false;
        this.showFetchSection = true;

        // Define loading phases for item fetching
        this.fetchingPhases = [
            {
                icon: html`<ai-icon></ai-icon>`,
                message: 'Analyzing URL...',
                detail: 'Fetching the product page',
                duration: 2000
            },
            {
                icon: html`<ai-icon></ai-icon>`,
                message: 'Extracting details...',
                detail: 'Getting product information',
                duration: 4000
            },
            {
                icon: html`<ai-icon></ai-icon>`,
                message: 'Processing images...',
                detail: 'Optimizing product photos',
                duration: 4000
            },
            {
                icon: html`<ai-icon></ai-icon>`,
                message: 'Extracting specifications...',
                detail: 'Getting technical details',
                duration: 4000
            },
            {
                icon: html`<ai-icon></ai-icon>`,
                message: 'Formatting results...',
                detail: 'Preparing for display',
                duration: 4000
            },
            {
                icon: html`<ai-icon></ai-icon>`,
                message: 'Getting distracted...',
                detail: 'Watching cat videos',
                duration: 4000
            },
            {
                icon: html`<ai-icon></ai-icon>`,
                message: 'Making coffee...',
                detail: 'Need caffeine to continue',
                duration: 4000
            },
            {
                icon: html`<ai-icon></ai-icon>`,
                message: 'Contemplating existence...',
                detail: 'Deep thoughts about URLs',
                duration: 4000
            },
            {
                icon: html`<ai-icon></ai-icon>`,
                message: 'Untangling headphones...',
                detail: 'They were fine 5 minutes ago',
                duration: 4000
            },
            {
                icon: html`<ai-icon></ai-icon>`,
                message: 'Arguing with pixels...',
                detail: 'They refuse to cooperate',
                duration: 4000
            },
            {
                icon: html`<ai-icon></ai-icon>`,
                message: 'Finalizing...',
                detail: 'Almost ready',
                duration: 6000
            },

        ];
    }


    static get styles() {
        return [
            buttonStyles,
            css`
                .modal-header {
                    position: sticky;
                    top: 0;
                    z-index: 10;
                    background-color: var(--background-dark);
                    border-bottom: 1px solid var(--border-color);
                }

                .modal-footer {
                    position: sticky;
                    bottom: 0;
                    z-index: 10;
                    background-color: var(--modal-background-color);
                    padding: var(--spacing-normal);
                    border-top: 1px solid var(--border-color);
                }
                
                .modal-contents {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    max-height: 90vh;
                    border-radius: var(--border-radius-large);
                }

                .modal-title {
                    padding: var(--spacing-normal);
                    background-color: light-dark(var(--mint-300), var(--mint-800));
                    margin: 0;
                    text-align: center;
                }

                .left-column {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-normal);
                }

                .right-column {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-normal);
                }

                .scrolling-contents {
                    display: grid;
                    gap: var(--spacing-normal);
                    grid-template-columns: 1fr;
                    padding: var(--spacing-normal-variable);
                    overflow-y: auto;
                    overflow-x: hidden; /* Prevent horizontal scrolling */
                    flex: 1;
                    width: 100%;
                    box-sizing: border-box; /* Ensure padding is included in width */
                }

                @media (min-width: 768px) {
                    .scrolling-contents {
                        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
                    }
                }

                .save-button {
                    width: 100%;
                }
                
                .advanced-options-container {
                    grid-column: 1 / -1;
                    margin-top: var(--spacing-normal);
                    text-align: right;
                }
                
                .advanced-options-content {
                    margin-top: var(--spacing-normal);
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-normal);
                    border-top: 1px solid var(--border-color);
                    padding-top: var(--spacing-normal);
                }
                
                .show-advanced-button {
                    background-color: transparent;
                    border: none;
                    color: var(--primary-color);
                    font-size: var(--font-size-small);
                    cursor: pointer;
                    transition: var(--transition-200);
                    
                    gear-icon {
                        transition: var(--transition-normal);
                    }
                    
                    &:hover {
                        color: var(--purple-darker);
                        transform: none;
                        
                        gear-icon {
                            transform: rotate(90deg);
                        }
                    }
                }
                
                .public-toggle-section {
                    margin-top: var(--spacing-normal);
                    padding: var(--spacing-small);
                    background-color: var(--background-dark);
                    border-radius: var(--border-radius-normal);
                    border: 1px solid var(--border-color);
                }
                
                .public-toggle-section h3 {
                    margin: 0 0 var(--spacing-small) 0;
                    font-size: var(--font-size-small);
                    font-weight: 600;
                    color: var(--text-color-dark);
                }
                
                .toggle-wrapper {
                    display: flex;
                    align-items: flex-start;
                    gap: var(--spacing-small);
                }
                
                .public-toggle-description {
                    font-size: var(--font-size-x-small);
                    color: var(--text-color-medium-dark);
                    line-height: 1.4;
                }

                .fetch-url-row {
                    display: flex;
                    gap: var(--spacing-small);
                    align-items: end;
                }

                .fetch-url-row custom-input {
                    flex: 1;
                }

                .fetch-button {
                    min-width: 44px;
                    height: 44px;
                    padding: var(--spacing-x-small);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                }

                .fetch-button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .fetch-button ai-icon {
                    width: 20px;
                    height: 20px;
                }

                .form-loading {
                    opacity: 0.6;
                    pointer-events: none;
                }

                .form-loading .fetch-url-row {
                    pointer-events: auto;
                }

                .show-fetch-section-container {
                    text-align: right;
                    width: 100%;
                }
                
                .public-disclaimer {
                    padding: var(--spacing-small);
                    background-color: var(--background-dark);
                    border-radius: var(--border-radius-normal);
                    border: 1px solid var(--border-color);
                    text-align: left;
                }
                
                .public-disclaimer p {
                    margin: 0 0 var(--spacing-x-small) 0;
                    font-size: var(--font-size-small);
                    color: var(--text-color-dark);
                }
                
                .public-disclaimer p:last-child {
                    margin-bottom: 0;
                    color: var(--text-color-medium-dark);
                    font-size: var(--font-size-x-small);
                }
            `
        ];
    }

    renderAdvancedOptions() {
        return html`
            <div class="advanced-options-content">
                ${this.isPublic ? html`
                    <div class="public-disclaimer">
                        <p><strong>Publicly Visible</strong></p>
                        <p>This item is set to be publicly visible. The "who is this item visible to" section is not applicable for public items.</p>
                    </div>
                ` : html`
                    <visibility-selector-container
                        @visibility-changed="${this._handleVisibilityChanged}"
                    ></visibility-selector-container>
                `}
            </div>
        `
    }

    _handleToggleAdvancedOptions() {
        this.advancedOpen = !this.advancedOpen
    }

    _handleToggleFetchSection() {
        this.showFetchSection = !this.showFetchSection;
    }


    async _submitHandler(e) {
        e.preventDefault();
        if(!this.itemName.trim()) {
            messagesState.addMessage('Please enter an item name', 'error');
            return;
        }
        const formData = {
            name: this.itemName,
            price: this.singlePrice,
            minPrice: this.minPrice,
            maxPrice: this.maxPrice,
            itemLinks: this.links.filter(link => link.url && link.url.trim() !== ''),
            notes: this.notes,
            note: this.notes, // Include both for backward compatibility
            imageIds: this.imageIds.filter(id => id !== 0),
            amountWanted: this.amount,
            minAmountWanted: this.minAmount,
            maxAmountWanted: this.maxAmount,
            priority: this.priority,
            isPublic: this.isPublic,
            visibleToUsers: this.visibleToUsers,
            visibleToGroups: this.visibleToGroups,
            matchListVisibility: this.matchListVisibility,
            lists: this.selectedListIds,
        };

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData), // Send necessary data if any
        }

        console.log('Submitting Form Data:', formData);

        const response = await customFetch('/listItems/create', options, true)

        if(response.success) {
            messagesState.addMessage('Item added to list successfully!', 'success');
            triggerUpdateList()
            triggerUpdateItem()
            this.closeModal();
            return;
        }

        messagesState.addMessage(response.publicMessage || 'Failed to add item to list. Please try again.', 'error');
    }

    async _handleFetchItem() {
        if (!this.fetchUrl) {
            messagesState.addMessage('Please enter a URL', 'error');
            return;
        }

        this.isFetching = true;

        try {
            // Use async pattern to avoid timeouts on slow URLs
            const data = await asyncItemFetch.fetchItem(this.fetchUrl);

            // Populate the form with fetched data
            if (data.name) this.itemName = data.name;
            if (data.price) {
                const priceString = data.price.replace(/[^0-9.-]+/g, '')
                this.singlePrice = parseFloat(priceString) || 0;
            }
            if (data.imageId) {
                this.imageIds = [data.imageId];
            }
            if (this.fetchUrl) {
                this.links = [{ url: this.fetchUrl, label: data.linkLabel || 'Product Link' }];
            }
            // Clear the fetch URL after successful fetch
            this.fetchUrl = '';
            this.showFetchSection = false;
            messagesState.addMessage('Item details fetched successfully!', 'success');

        } catch (error) {
            console.error('Error fetching item:', error);
            messagesState.addMessage(error.message || 'Error fetching item details', 'error');
        } finally {
            this.isFetching = false;
        }
    }

    _handleFetchUrlChange(e) {
        this.fetchUrl = e.detail.value;
    }

    clearData() {
        this.itemName = '';
        this.isPriceRange = false;
        this.singlePrice = 0;
        this.minPrice = 0;
        this.maxPrice = 0;
        this.links = [{url: '', label: ''}];
        this.notes = '';
        this.imageIds = [];
        this.amount = '';
        this.minAmount = 0;
        this.maxAmount = 0;
        this.priority = 1;
        this.isPublic = false;
        this.matchListVisibility = true;
        this.visibleToUsers = [];
        this.visibleToGroups = [];
        this.selectedListIds = [];
        this.fetchUrl = '';
        this.isFetching = false;
        this.showFetchSection = true;
    }

    closeModal() {
        this.clearData()
        const modal = this.shadowRoot.querySelector('custom-modal');
        if (modal && typeof modal.closeModal === 'function') {
            modal.closeModal();
        }
    }

    render() {
        return html`
            <custom-modal triggerEvent="${ADD_MODAL_EVENT}" noPadding="true">

                <form @submit=${this._submitHandler} class="modal-contents">
                    <div class="modal-header">
                        <h2 class="modal-title">Add To List</h2>
                    </div>
                    <div class="scrolling-contents ${this.isFetching ? 'form-loading' : ''}">
                        <div class="left-column">
                            ${this.showFetchSection ? html`
                                <div class="fetch-url-row">
                                    <custom-input 
                                        .value="${this.fetchUrl}"
                                        label="Fetch product details from URL"
                                        placeholder="https://example.com/product-page"
                                        type="url"
                                        @value-changed="${this._handleFetchUrlChange}">
                                    </custom-input>
                                    <button 
                                        class="button primary fetch-button"
                                        @click="${this._handleFetchItem}"
                                        ?disabled="${this.isFetching || !this.fetchUrl}"
                                    >
                                        <ai-icon></ai-icon>
                                        <custom-tooltip>
                                            ${this.isFetching ? 'Fetching item details...' : 'Fetch item details'}
                                        </custom-tooltip>
                                    </button>
                                </div>
                            ` : html`
                                <div class="show-fetch-section-container">
                                    <button 
                                        class="button small-link-button"
                                        @click="${this._handleToggleFetchSection}"
                                        type="button"
                                    >
                                        Show product fetch section
                                    </button>
                                </div>
                            `}
                            <div>
                                <custom-input .value="${this.itemName}"
                                              label="Item Name"
                                              id="item-name-input"
                                              fullWidth="true"
                                              placeholder="Item Name"
                                              ?disabled="${this.isFetching}"
                                              @value-changed="${(e) => this.itemName = e.detail.value}"></custom-input>
                            </div>
                            <div>
                                <price-input
                                        .isRange="${this.isPriceRange}"
                                        .singlePrice="${this.singlePrice}"
                                        .minPrice="${this.minPrice}"
                                        .maxPrice="${this.maxPrice}"
                                        @price-change="${this._handlePriceChange}"
                                ></price-input>
                            </div>
                            <div>
                                <links-input .values="${this.links}"
                                             @values-change="${(e) => this.links = e.detail.values}">
                                </links-input>
                            </div>
                            <priority-selector
                                    .value="${this.priority}"
                                    @priority-changed="${(e) => this.priority = e.detail.value}"
                            ></priority-selector>
                            <images-selector .images="${this.imageIds}"
                                             @images-changed="${(e) => this.imageIds = e.detail.images}"></images-selector>
                         
                        </div>

                        <div class="right-column">
                            <div>
                                <strong>Add to list(s)</strong>
                                <select-my-lists
                                        @change="${this._handleSelectedListsChange}"
                                        .selectedListIds="${this.selectedListIds}"
                                ></select-my-lists>
                            </div>
                            
                            <div>
                                <strong>Notes</strong>
                                <wysiwyg-editor
                                        @content-changed=${(e) => this.notes = e.detail.content}
                                        content="${this.notes}"
                                ></wysiwyg-editor>
                            </div>
                            
                            <amount-you-want
                                    .amount="${this.amount}"
                                    .min="${this.minAmount}"
                                    .max="${this.maxAmount}"
                                    @amount-changed="${this._handleAmountChange}"
                            ></amount-you-want>
                            
                            <div class="public-toggle-section">
                                <h3>Public Visibility</h3>
                                <div class="toggle-wrapper">
                                    <custom-toggle
                                        id="is-public-toggle"
                                        @change="${(e) => this.isPublic = e.detail.checked}"
                                        .checked="${this.isPublic}"
                                    ></custom-toggle>
                                    <label for="is-public-toggle" class="public-toggle-description">
                                        Set whether a non logged in user can see this item. If this is selected, all users who can view this list will also be able to view the item.
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div class="advanced-options-container">
                            <button type="button" class="show-advanced-button" @click=${this._handleToggleAdvancedOptions}>
                                ${this.advancedOpen ? "Hide Advanced Options" : "Show Advanced Options"}
                                <gear-icon></gear-icon>
                            </button>
                            ${this.advancedOpen ? this.renderAdvancedOptions() : ''}
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button type="submit" class="button primary save-button" ?disabled="${this.isFetching}">
                            ${this.isFetching ? 'Fetching...' : 'Save Item'}
                        </button>
                    </div>
                </form>
                <process-loading-ring
                        ?show="${this.isFetching}"
                        .phases="${this.fetchingPhases}"
                        duration="20000"
                ></process-loading-ring>

            </custom-modal>
            
            
        `;
    }

    _handlePriceChange(e) {
        const {isRange, singlePrice, minPrice, maxPrice} = e.detail;
        this.isPriceRange = isRange;
        this.singlePrice = singlePrice;
        this.minPrice = minPrice;
        this.maxPrice = maxPrice;
    }

    _handleAmountChange(e) {
        const {amount, min, max} = e.detail;
        this.amount = amount;
        this.minAmount = min;
        this.maxAmount = max;
    }

    _handleSelectedListsChange(e) {
        const {selectedListIds} = e.detail;
        this.selectedListIds = selectedListIds;
    }

    _handleVisibilityChanged(e) {
        const { isPublic, selectedGroups, selectedUsers, matchListVisibility } = e.detail;
        this.matchListVisibility = matchListVisibility;
        this.visibleToGroups = selectedGroups || [];
        this.visibleToUsers = selectedUsers || [];
    }
}

customElements.define('add-to-list-modal', AddToListModal);
