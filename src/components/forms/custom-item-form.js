import {LitElement, html, css} from 'lit';
import '../global/custom-input.js';
import '../add-to-list/price-input.js';
import buttonStyles from "../../css/buttons.js";
import '../add-to-list/links-input.js';
import '../add-to-list/wysiwyg-editor.js';
import '../add-to-list/images-selector.js';
import {customFetch} from "../../helpers/fetchHelpers.js";
import {triggerUpdateList} from "../../events/eventListeners.js";
import {messagesState} from "../../state/messagesStore.js";

export class CustomItemForm extends LitElement {
    static properties = {
        mode: {type: String}, // 'add' or 'edit'
        itemData: {type: Object},
        listId: {type: String},
        itemName: {type: String},
        isPriceRange: {type: Boolean},
        singlePrice: {type: Number},
        minPrice: {type: Number},
        maxPrice: {type: Number},
        links: {type: Array},
        notes: {type: String},
        imageIds: {type: Array},
    };

    constructor() {
        super();
        this.mode = 'add';
        this.itemData = null;
        this.listId = '';
        this.clearForm();
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
            `
        ];
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
    }

    async submitForm() {
        if(!this.itemName.trim()) {
            messagesState.addMessage('Please enter an item name', 'error');
            return false;
        }

        if(this.mode === 'add' && !this.listId) {
            messagesState.addMessage('List ID is required', 'error');
            return false;
        }

        const formData = {
            name: this.itemName,
            price: this.singlePrice,
            minPrice: this.minPrice,
            maxPrice: this.maxPrice,
            itemLinks: this.links.filter(link => link.url && link.url.trim() !== ''),
            notes: this.notes,
            imageIds: this.imageIds.filter(id => id !== 0),
        };

        // Add listId only for create mode
        if (this.mode === 'add') {
            formData.listId = this.listId;
        }

        const endpoint = this.mode === 'edit' && this.itemData?.id
            ? `/listitems/custom/${this.itemData.id}`
            : '/listitems/custom';

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
            const action = this.mode === 'edit' ? 'updated' : 'added';
            messagesState.addMessage(`Custom item ${action} successfully!`, 'success');
            triggerUpdateList();
            this.clearForm();

            // Dispatch success event
            this.dispatchEvent(new CustomEvent('item-saved', {
                detail: { item: response.data, mode: this.mode },
                bubbles: true,
                composed: true
            }));

            return true;
        }

        messagesState.addMessage(response.publicMessage || `Failed to ${this.mode === 'edit' ? 'update' : 'add'} custom item. Please try again.`, 'error');
        return false;
    }

    _handlePriceChange(e) {
        const {isRange, singlePrice, minPrice, maxPrice} = e.detail;
        this.isPriceRange = isRange;
        this.singlePrice = singlePrice;
        this.minPrice = minPrice;
        this.maxPrice = maxPrice;
    }

    async _handleSubmit(e) {
        e.preventDefault();
        // Don't auto-submit, let parent handle submission
    }

    render() {
        return html`
            <form @submit=${this._handleSubmit} class="form-container">
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
                        <links-input .values="${this.links}"
                                     @values-change="${(e) => this.links = e.detail.values}">
                        </links-input>
                    </div>
                    <images-selector .images="${this.imageIds}"
                                     @images-changed="${(e) => this.imageIds = e.detail.images}"></images-selector>
                </div>

                <div class="right-column">
                    <div>
                        <strong>Notes</strong>
                        <wysiwyg-editor
                                @content-changed=${(e) => this.notes = e.detail.content}
                                content="${this.notes}"
                        ></wysiwyg-editor>
                    </div>
                </div>
            </form>
        `;
    }
}

customElements.define('custom-item-form', CustomItemForm);
