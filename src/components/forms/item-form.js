import {LitElement, html, css} from 'lit';
import {observeState} from "lit-element-state";
import {userState} from "../../state/userStore.js";
import '../global/custom-input.js';
import '../global/custom-toggle.js';
import '../add-to-list/price-input.js';
import buttonStyles from "../../css/buttons.js";
import '../add-to-list/links-input.js';
import '../add-to-list/wysiwyg-editor.js';
import '../add-to-list/amount-you-want.js';
import '../add-to-list/priority-selector.js';
import '../add-to-list/images-selector.js';
import '../add-to-list/visibility-selector/visibility-selector-container.js';
import "../lists/user-lists.js";
import '../../svg/ai.js';
import '../global/custom-tooltip.js';
import '../../svg/gear.js';
import '../global/process-loading-ring.js';
import {customFetch} from "../../helpers/fetchHelpers.js";
import {asyncItemFetch} from "../../helpers/api/asyncItemFetch.js";
import {triggerUpdateItem, triggerUpdateList} from "../../events/eventListeners.js";
import {messagesState} from "../../state/messagesStore.js";

export class ItemForm extends observeState(LitElement) {
    static properties = {
        mode: {type: String}, // 'add' or 'edit'
        itemData: {type: Object},
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
        initialListsSelected: {type: Boolean},
    };

    constructor() {
        super();
        this.mode = 'add';
        this.itemData = null;
        this.advancedOpen = false;

        // Initialize form state variables
        this.clearForm();

        this.initialListsSelected = false;

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
                :host {
                    display: block;
                    width: 100%;
                }

                .form-container {
                    display: grid;
                    gap: var(--spacing-normal);
                    grid-template-columns: 1fr;
                    width: 100%;
                    box-sizing: border-box;
                }

                @media (min-width: 768px) {
                    .form-container {
                        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
                    }
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

    connectedCallback() {
        super.connectedCallback();
        this._setDefaultListSelection();
    }

    // Public Methods
    async fetchItemFromUrl(url) {
        if (!url) return;

        this.fetchUrl = url;
        this.showFetchSection = true;
        await this.updateComplete;

        // Automatically trigger the fetch
        await this._handleFetchItem();
    }

    populateForm(itemData) {
        if (!itemData) return;

        this.itemName = itemData.name || '';
        this.singlePrice = itemData.price || 0;
        this.minPrice = itemData.minPrice || 0;
        this.maxPrice = itemData.maxPrice || 0;
        this.links = itemData.itemLinks || [{ url: '', label: '' }];
        this.notes = itemData.notes || itemData.note || '';
        this.imageIds = itemData.imageIds || [];
        this.amount = itemData.amountWanted || '';
        this.minAmount = itemData.minAmountWanted || 0;
        this.maxAmount = itemData.maxAmountWanted || 0;
        this.priority = itemData.priority || 1;
        this.isPublic = itemData.isPublic || false;
        this.visibleToUsers = itemData.visibleToUsers || [];
        this.visibleToGroups = itemData.visibleToGroups || [];
        this.matchListVisibility = itemData.matchListVisibility || true;
        this.selectedListIds = itemData.lists || [];
    }

    clearForm() {
        this.itemName = '';
        this.isPriceRange = false;
        this.singlePrice = 0;
        this.minPrice = 0;
        this.maxPrice = 0;
        this.links = [{ url: '', label: '' }];
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
        this.fetchUrl = '';
        this.isFetching = false;
        this.showFetchSection = true;
    }

    async submitForm() {
        if(!this.itemName.trim()) {
            messagesState.addMessage('Please enter an item name', 'error');
            return false;
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

        const endpoint = this.mode === 'edit' && this.itemData?.id
            ? `/listItems/${this.itemData.id}`
            : '/listItems/create';

        const method = this.mode === 'edit' ? 'PUT' : 'POST';

        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        }

        const response = await customFetch(endpoint, options, true);

        if(response.success) {
            const action = this.mode === 'edit' ? 'updated' : 'added to list';
            messagesState.addMessage(`Item ${action} successfully!`, 'success');
            triggerUpdateList();
            triggerUpdateItem();
            this.clearForm();

            // Dispatch success event
            this.dispatchEvent(new CustomEvent('item-saved', {
                detail: { item: response.data, mode: this.mode },
                bubbles: true,
                composed: true
            }));

            return true;
        }

        messagesState.addMessage(response.publicMessage || `Failed to ${this.mode === 'edit' ? 'update' : 'add'} item. Please try again.`, 'error');
        return false;
    }

    // Private Methods
    _setDefaultListSelection() {
        if(this.initialListsSelected) return;
        this.initialListsSelected = true;
        const allLists = userState.myLists || [];
        const listIds = allLists.map(list => list.id);
        this.selectedListIds = listIds;
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

    async _handleSubmit(e) {
        e.preventDefault();
        // Don't auto-submit, let parent handle submission
    }

    async _handleFetchItem() {
        if (!this.fetchUrl) {
            messagesState.addMessage('Please enter a URL', 'error');
            return;
        }

        this.isFetching = true;

        try {
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
                this.links = [{ url: this.fetchUrl, label: (data.linkLabel || 'Product Link') }];
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
        const { selectedGroups, selectedUsers, matchListVisibility } = e.detail;
        this.matchListVisibility = matchListVisibility;
        this.visibleToGroups = selectedGroups || [];
        this.visibleToUsers = selectedUsers || [];
    }

    render() {
        return html`
            <form @submit=${this._handleSubmit} class="form-container ${this.isFetching ? 'form-loading' : ''}">
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
                                type="button"
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

            </form>
            <process-loading-ring
                    ?show="${this.isFetching}"
                    .phases="${this.fetchingPhases}"
                    duration="20000"
            ></process-loading-ring>
        `;
    }
}

customElements.define('item-form', ItemForm);
