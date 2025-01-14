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
import {customFetch} from "../../helpers/fetchHelpers.js";

export class AddToListModal extends LitElement {
    static properties = {
        advancedOpen: { type: Boolean },

        // Form state variables
        itemName: { type: String },
        isPriceRange: {type: Boolean},
        singlePrice: {type: Number},
        minPrice: {type: Number},
        maxPrice: {type: Number},
        links: { type: Array },
        notes: { type: String },
        images: { type: Array },
        amount: { type: String },
        minAmount: { type: Number },
        maxAmount: { type: Number },
        priority: { type: Number },
        isPublic: { type: Boolean },
        autoDelete: { type: Boolean },
        visibility: { type: String },
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
        this.links = [{ url: '', displayName: '' }];
        this.notes = '<p>Add notes here...</p>';
        this.images = [];
        this.amount = 1;
        this.minAmount = 0;
        this.maxAmount = 0;
        this.priority = 1;
        this.isPublic = false;
        this.autoDelete = false;
        this.visibility = '';
    }


    static get styles() {
        return [
            buttonStyles,
            css`
                .modal-contents {
                    display: grid;
                    gap: var(--spacing-normal);
                }
                
                .save-button {
                    position: sticky;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    
                    box-shadow: 0 83px 20px 100px var(--modal-background-color);
                }
            `
        ];
    }

    renderAdvancedOptions() {
        return html`
            is public
            advanced visibility
            <delete-automatically-selector></delete-automatically-selector>
            <visibility-selector-container></visibility-selector-container>
            linked items
        `
    }

    _handleToggleAdvancedOptions() {
        this.advancedOpen = !this.advancedOpen
    }


    async _submitHandler(e) {
        e.preventDefault();
        const formData = {
            name: this.itemName,
            price: this.price,
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
        console.log(response)

        this.closeModal();
    }

    closeModal() {
        const modal = this.shadowRoot.querySelector('custom-modal');
        if (modal && typeof modal.closeModal === 'function') {
            modal.closeModal();
        }
    }

    render() {
        return html`
            <custom-modal triggerEvent="${ADD_MODAL_EVENT}">
                <h2>Add To List</h2>
                <form @submit=${this._submitHandler} class="modal-contents">
                    select list
                    <div>
                        <custom-input .value="${this.itemName}" id="item-name-input" label="Item Name" fullWidth="true" placeholder="Item Name"
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
                                     placeholder=${'url, displayName'}
                                     @values-change="${(e) => this.links = e.detail.values}">
                        </multi-input>
                    </div>
                    <wysiwyg-editor
                            @content-changed=${(e) => this.notes = e.detail.content}
                            content="${this.notes}"
                    ></wysiwyg-editor>
                    <images-selector .images="${this.images}"
                        @images-changed="${(e) => this.images = e.detail.images}"></images-selector>
                    <amount-you-want
                            .amount="${this.amount}"
                            .min="${this.minAmount}"
                            .max="${this.maxAmount}"
                            @amount-changed="${this._handleAmountChange}"
                    ></amount-you-want>
                    <priority-selector
                            .value="${this.priority}"
                            @priority-changed="${(e) => this.priority = e.detail.value}"
                    ></priority-selector>
                    <button type="button" class="button primary" @click=${this._handleToggleAdvancedOptions}>${this.advancedOpen ? "Hide Advanced Options" : "Show Advanced Options"}</button>
                    ${this.advancedOpen ? this.renderAdvancedOptions() : ''}
                    
                    <button type="submit" class="button primary save-button">Save Item</button>
                </form>
                
            </custom-modal>
    `;
    }

    _handlePriceChange(e) {
        const { isRange, singlePrice, minPrice, maxPrice } = e.detail;
        this.isPriceRange = isRange;
        this.singlePrice = singlePrice;
        this.minPrice = minPrice;
        this.maxPrice = maxPrice;
    }

    _handleAmountChange(e) {
        const { amount, min, max } = e.detail;
        this.amount = amount;
        this.minAmount = min;
        this.maxAmount = max;
    }
}
customElements.define('add-to-list-modal', AddToListModal);
