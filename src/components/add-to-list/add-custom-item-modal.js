import {LitElement, html, css} from 'lit';
import '../global/custom-modal.js'
import '../forms/custom-item-form.js'
import modalSections from "../../css/modal-sections.js";
import buttonStyles from "../../css/buttons.js";
import {getUsernameById} from "../../helpers/generalHelpers.js";

const EDIT_CUSTOM_ITEM_EVENT = 'open-edit-custom-item-modal';

export class AddCustomItemModal extends LitElement {
    static properties = {
        mode: { type: String }, // 'add' or 'edit'
        itemData: { type: Object },
        listId: { type: String }
    };

    constructor() {
        super();
        this.mode = 'add';
        this.itemData = null;
        this.listId = '';
        this._handleEditEvent = this._handleEditEvent.bind(this);
    }

    connectedCallback() {
        super.connectedCallback();
        window.addEventListener(EDIT_CUSTOM_ITEM_EVENT, this._handleEditEvent);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener(EDIT_CUSTOM_ITEM_EVENT, this._handleEditEvent);
    }

    _handleEditEvent(event) {
        if (event.detail && event.detail.itemData) {
            this.openModal(event.detail.itemData);
        }
    }

    static get styles() {
        return [
            modalSections,
            buttonStyles,
            css`
                .modal-header {
                    position: sticky;
                    top: 0;
                    z-index: 10;
                }

                .modal-footer {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    z-index: 1000;
                    background-color: var(--modal-background-color);
                    padding: var(--spacing-normal);
                    border-top: 1px solid var(--border-color);
                    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
                }

                button.save-button {
                    width: 100%;
                }

                .modal-contents {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    max-height: 90vh;
                    border-radius: var(--border-radius-large);
                }

                .scrolling-contents {
                    padding: var(--spacing-normal);
                    padding-bottom: calc(var(--spacing-normal) * 2 + 60px);
                    overflow-y: auto;
                    overflow-x: hidden;
                    flex: 1;
                    width: 100%;
                    box-sizing: border-box;
                }
            `
        ];
    }

    openModal(itemData = null) {
        if (itemData) {
            this.mode = 'edit';
            this.itemData = itemData;
            // Populate form after modal opens
            setTimeout(() => {
                const form = this.shadowRoot.querySelector('custom-item-form');
                if (form && typeof form.populateForm === 'function') {
                    form.populateForm(itemData);
                }
            }, 100);
        } else {
            this.mode = 'add';
            this.itemData = null;
        }

        const modal = this.shadowRoot.querySelector('custom-modal');
        if (modal && typeof modal.openModal === 'function') {
            modal.openModal();
        }
    }

    closeModal() {
        const modal = this.shadowRoot.querySelector('custom-modal');
        if (modal && typeof modal.closeModal === 'function') {
            modal.closeModal();
        }
    }

    async _handleSubmit() {
        const form = this.shadowRoot.querySelector('custom-item-form');
        if (form && typeof form.submitForm === 'function') {
            const success = await form.submitForm();
            if (success) {
                this.closeModal();
            }
        }
    }

    _handleItemSaved(e) {
        this.closeModal();
    }

    render() {
        return html`
            <custom-modal noPadding="true">
                <div class="modal-contents">
                    <div class="modal-header">
                        <h2>${this.mode === 'edit' ? 'Edit Custom Item' : 'Add Custom Item'}</h2>
                        <p style="margin: 0;">This item will not be visible to non-logged in users or the list owner.</p>
                    </div>
                    <div class="scrolling-contents">
                        <custom-item-form
                            .mode="${this.mode}"
                            .itemData="${this.itemData}"
                            .listId="${this.listId}"
                            @item-saved="${this._handleItemSaved}"
                        ></custom-item-form>
                    </div>
                    <div class="modal-footer">
                        <button
                            class="button primary save-button"
                            @click="${this._handleSubmit}"
                        >
                            ${this.mode === 'edit' ? 'Update Item' : 'Save Item'}
                        </button>
                    </div>
                </div>
            </custom-modal>
        `;
    }
}

customElements.define('add-custom-item-modal', AddCustomItemModal);

// Helper function to open the modal in edit mode
export function openEditCustomItemModal(itemData) {
    if (!itemData) {
        console.error('Item data is required to open the edit custom item modal');
        return;
    }

    const event = new CustomEvent(EDIT_CUSTOM_ITEM_EVENT, {
        detail: { itemData },
        bubbles: true,
        composed: true
    });

    window.dispatchEvent(event);
}
