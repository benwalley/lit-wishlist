import {LitElement, html, css} from 'lit';
import {ADD_MODAL_EVENT} from "../../events/custom-events.js";
import '../global/custom-modal.js'
import '../global/custom-input.js'
import './price-input.js'
import buttonStyles from "../../css/buttons.js";
import './multi-input.js'
import './wysiwyg-editor.js'
import './amount-you-want.js'
import './priority-selector.js'
import './images-selector.js'
import './delete-automatically-selector.js'
import './visibility-selector/visibility-selector-container.js'
import '../lists/select-my-lists.js'
import '../../svg/gear.js'
import {customFetch} from "../../helpers/fetchHelpers.js";
import {triggerUpdateList} from "../../events/eventListeners.js";
import {invalidateCache} from "../../helpers/caching.js";

export class AddToListModal extends LitElement {
    static properties = {
        advancedOpen: {type: Boolean},
        selectedListIds: {type: Array},
        // Form state variables
        itemName: {type: String},
        isPriceRange: {type: Boolean},
        singlePrice: {type: Number},
        minPrice: {type: Number},
        maxPrice: {type: Number},
        links: {type: Array},
        notes: {type: String},
        images: {type: Array},
        amount: {type: String},
        minAmount: {type: Number},
        maxAmount: {type: Number},
        priority: {type: Number},
        isPublic: {type: Boolean},
        autoDelete: {type: Boolean},
        visibility: {type: String},
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
        this.links = [{url: '', displayName: ''}];
        this.notes = '';
        this.images = [];
        this.amount = '';
        this.minAmount = 0;
        this.maxAmount = 0;
        this.priority = 1;
        this.isPublic = false;
        this.autoDelete = false;
        this.visibility = '';
        this.selectedListIds = [];
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
                    padding: var(--spacing-normal);
                    overflow-y: auto;
                    flex: 1;
                }

                @media (min-width: 768px) {
                    .scrolling-contents {
                        grid-template-columns: 1fr 1fr;
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
            `
        ];
    }

    renderAdvancedOptions() {
        return html`
            <div class="advanced-options-content">
                <delete-automatically-selector
                    @change="${(e) => this.autoDelete = e.detail.value}"
                ></delete-automatically-selector>
                <visibility-selector-container
                    @visibility-changed="${(e) => this.visibility = e.detail.value}"
                ></visibility-selector-container>
            </div>
        `
    }

    _handleToggleAdvancedOptions() {
        this.advancedOpen = !this.advancedOpen
    }


    async _submitHandler(e) {
        e.preventDefault();
        const formData = {
            name: this.itemName,
            price: this.singlePrice,
            minPrice: this.minPrice,
            maxPrice: this.maxPrice,
            links: this.links,
            note: this.notes,
            imageIds: this.images,
            amountWanted: this.amount,
            minAmountWanted: this.minAmount,
            maxAmountWanted: this.maxAmount,
            priority: this.priority,
            isPublic: this.isPublic,
            autoDelete: this.autoDelete,
            visibility: this.visibility,
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
        invalidateCache('/lists/*')
        triggerUpdateList()
        this.closeModal();
    }

    clearData() {
        this.itemName = '';
        this.isPriceRange = false;
        this.singlePrice = 0;
        this.minPrice = 0;
        this.maxPrice = 0;
        this.links = [{url: '', displayName: ''}];
        this.notes = '';
        this.images = [];
        this.amount = '';
        this.minAmount = 0;
        this.maxAmount = 0;
        this.priority = 1;
        this.isPublic = false;
        this.autoDelete = false;
        this.visibility = '';
        this.selectedListIds = [];
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
                    <div class="scrolling-contents">
                        <div class="left-column">
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
                                <multi-input .values="${this.links}"
                                             sectionName="Link(s)"
                                             placeholder= ${'https://..., Display Name'}
                                             @values-change="${(e) => this.links = e.detail.values}">
                                </multi-input>
                            </div>
                            <priority-selector
                                    .value="${this.priority}"
                                    @priority-changed="${(e) => this.priority = e.detail.value}"
                            ></priority-selector>
                            <images-selector .images="${this.images}"
                                             @images-changed="${(e) => this.images = e.detail.images}"></images-selector>
                         
                        </div>

                        <div class="right-column">
                            <select-my-lists @change="${this._handleSelectedListsChange}"></select-my-lists>
                            <wysiwyg-editor
                                    @content-changed=${(e) => this.notes = e.detail.content}
                                    content="${this.notes}"
                            ></wysiwyg-editor>
                            <amount-you-want
                                    .amount="${this.amount}"
                                    .min="${this.minAmount}"
                                    .max="${this.maxAmount}"
                                    @amount-changed="${this._handleAmountChange}"
                            ></amount-you-want>
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
                        <button type="submit" class="button primary save-button">Save Item</button>
                    </div>
                </form>

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
}

customElements.define('add-to-list-modal', AddToListModal);
