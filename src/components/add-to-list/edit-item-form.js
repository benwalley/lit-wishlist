import {LitElement, html, css} from 'lit';
import '../global/custom-input.js';
import '../global/custom-toggle.js';
import './price-input.js';
import buttonStyles from "../../css/buttons.js";
import './links-input.js';
import './wysiwyg-editor.js';
import './amount-you-want.js';
import './priority-selector.js';
import './images-selector.js';
import './visibility-selector/visibility-selector-container.js';
import {customFetch} from "../../helpers/fetchHelpers.js";
import {triggerUpdateItem, triggerUpdateList} from "../../events/eventListeners.js";
import {invalidateCache} from "../../helpers/caching.js";
import {messagesState} from "../../state/messagesStore.js";
import '../../svg/gear.js';
import "../lists/user-lists.js";

export class EditItemForm extends LitElement {
    static properties = {
        itemData: {type: Object},
        advancedOpen: {type: Boolean},
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
        saving: {type: Boolean},
        selectedListIds: {type: Array},
    };

    constructor() {
        super();
        this.itemData = null;
        this.advancedOpen = false;
        this.saving = false;

        // Initialize form state variables
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
    }

    updated(changedProperties) {
        if (changedProperties.has('itemData') && this.itemData) {
            this.populateFormData();
        }
    }

    populateFormData() {
        if (!this.itemData) return;

        this.itemName = this.itemData.name || '';

        // Set price data
        if (this.itemData.minPrice && this.itemData.maxPrice) {
            this.isPriceRange = true;
            this.minPrice = this.itemData.minPrice;
            this.maxPrice = this.itemData.maxPrice;
            this.singlePrice = 0;
        } else {
            this.isPriceRange = false;
            this.singlePrice = this.itemData.price || 0;
            this.minPrice = 0;
            this.maxPrice = 0;
        }

        // Set links data
        if (this.itemData.links && Array.isArray(this.itemData.links)) {
            try {
                this.links = this.itemData.links.map(link => {
                    if (typeof link === 'string') {
                        try {
                            return JSON.parse(link);
                        } catch (e) {
                            return { url: '', label: '' };
                        }
                    }
                    return link;
                });
                if (this.links.length === 0) {
                    this.links = [{url: '', label: ''}];
                }
            } catch (e) {
                console.error('Error parsing links:', e);
                this.links = [{url: '', label: ''}];
            }
        } else {
            this.links = [{url: '', label: ''}];
        }

        // Set notes
        this.notes = this.itemData.notes || this.itemData.note || '';

        // Set images
        this.imageIds = this.itemData.imageIds || [];

        // Set amount data
        if (this.itemData.minAmountWanted && this.itemData.maxAmountWanted) {
            this.amount = 'range';
            this.minAmount = this.itemData.minAmountWanted;
            this.maxAmount = this.itemData.maxAmountWanted;
        } else if (this.itemData.amountWanted) {
            this.amount = this.itemData.amountWanted.toString();
            this.minAmount = 0;
            this.maxAmount = 0;
        } else {
            this.amount = '1';
            this.minAmount = 0;
            this.maxAmount = 0;
        }

        // Set other properties
        this.priority = this.itemData.priority || 1;
        this.isPublic = this.itemData.isPublic || false;
        this.matchListVisibility = this.itemData.matchListVisibility !== false;
        this.visibleToUsers = this.itemData.visibleToUsers || [];
        this.visibleToGroups = this.itemData.visibleToGroups || [];

        // Set initial list IDs if available
        if (this.itemData.lists && Array.isArray(this.itemData.lists)) {
            this.selectedListIds = [...this.itemData.lists];
        } else {
            this.selectedListIds = [];
        }
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    display: block;
                }
                
                form {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    border-radius: var(--border-radius-large);
                    overflow: hidden;
                }
                
                .modal-header {
                    position: sticky;
                    top: 0;
                    z-index: 10;
                    background-color: var(--background-dark);
                    border-bottom: 1px solid var(--border-color);
                }
                
                h2 {
                    padding: var(--spacing-normal);
                    background-color: light-dark(var(--mint-300), var(--mint-800));
                    margin: 0;
                    text-align: center;
                }
                
                .form-contents {
                    display: grid;
                    gap: var(--spacing-normal);
                    grid-template-columns: 1fr;
                    padding: var(--spacing-normal);
                    overflow-y: auto;
                    overflow-x: hidden;
                    width: 100%;
                    box-sizing: border-box;
                    flex: 1;
                    max-height: calc(80vh - 120px); /* Subtract header and footer heights */
                }
                
                .modal-footer {
                    position: sticky;
                    bottom: 0;
                    z-index: 10;
                    background-color: var(--modal-background-color);
                    padding: var(--spacing-normal);
                    border-top: 1px solid var(--border-color);
                }
                
                @media (min-width: 768px) {
                    .form-contents {
                        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
                    }
                }
                
                .column {
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
                }
                
                gear-icon {
                    transition: var(--transition-normal);
                }
                
                .show-advanced-button:hover {
                    color: var(--purple-darker);
                    transform: none;
                }
                
                .show-advanced-button:hover gear-icon {
                    transform: rotate(90deg);
                }
                
                .public-toggle-section {
                    margin-top: var(--spacing-normal);
                    padding: var(--spacing-small);
                    background-color: var(--background-dark);
                    border-radius: var(--border-radius-normal);
                    border: 1px solid var(--border-color);
                }
                
                .public-toggle-section h3,
                .list-selector-container h3 {
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
                
                .public-toggle-description,
                .list-selector-description {
                    font-size: var(--font-size-x-small);
                    color: var(--text-color-medium-dark);
                    line-height: 1.4;
                    margin-bottom: var(--spacing-small);
                }
                
                .list-selector-container {
                    margin-bottom: var(--spacing-normal);
                    padding: var(--spacing-small);
                    background-color: var(--background-dark);
                    border-radius: var(--border-radius-normal);
                    border: 1px solid var(--border-color);
                }
                
                .button-container {
                    display: flex;
                    justify-content: flex-end;
                    gap: var(--spacing-normal);
                    width: 100%;
                }
                
                .save-button {
                    min-width: 120px;
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
                        .matchListVisibility="${this.matchListVisibility}"
                        .selectedGroups="${this.visibleToGroups}"
                        .selectedUsers="${this.visibleToUsers}"
                        @visibility-changed="${this._handleVisibilityChanged}"
                    ></visibility-selector-container>
                `}
            </div>
        `;
    }

    _handleToggleAdvancedOptions() {
        this.advancedOpen = !this.advancedOpen;
    }

    async _submitHandler(e) {
        e.preventDefault();
        if (!this.itemData?.id) return;
        this.saving = true;

        const formData = {
            id: this.itemData.id,
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
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        };

        const response = await customFetch(`/listItems/${this.itemData.id}`, options, true);

        if (response.success) {
            messagesState.addMessage('Item successfully updated');
            triggerUpdateItem(this.itemData.id);
            triggerUpdateList();
            invalidateCache(`/listItems/${this.itemData.id}`);

            // Close the modal by dispatching an event
            this.dispatchEvent(new CustomEvent('item-updated', {
                bubbles: true,
                composed: true,
                detail: { data: response.data }
            }));
        } else {
            messagesState.addMessage('Failed to update item', 'error');
            console.error('API Error:', response.error);
        }

        this.saving = false;
    }

    render() {
        return html`
            <form @submit=${this._submitHandler}>
                <div class="modal-header">
                    <h2>Edit Item</h2>
                </div>
                
                <div class="form-contents">
                    <div class="column">
                        <div>
                            <custom-input .value="${this.itemName}"
                                        label="Item Name"
                                        id="item-name-input"
                                        fullWidth="true"
                                        placeholder="Item Name"
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

                    <div class="column">
                        <select-my-lists 
                            .selectedListIds="${this.selectedListIds}" 
                            @change="${this._handleListSelectionChange}"
                        ></select-my-lists>
                        <wysiwyg-editor
                                @content-changed=${(e) => this.notes = e.detail.content}
                                .content="${this.notes}"
                        ></wysiwyg-editor>
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
                    <div class="button-container">
                        <button type="button" class="button" @click=${this._handleCancel}>Cancel</button>
                        <button type="submit" class="button primary save-button" ?disabled=${this.saving}>
                            ${this.saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </form>
        `;
    }

    _handleCancel() {
        this.dispatchEvent(new CustomEvent('cancel', {
            bubbles: true,
            composed: true
        }));
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

    _handleVisibilityChanged(e) {
        const { isPublic, selectedGroups, selectedUsers, matchListVisibility } = e.detail;
        this.matchListVisibility = matchListVisibility;
        this.visibleToGroups = selectedGroups || [];
        this.visibleToUsers = selectedUsers || [];
    }

    _handleListSelectionChange(e) {
        this.selectedListIds = e.detail.selectedListIds || [];
    }
}

customElements.define('edit-item-form', EditItemForm);
