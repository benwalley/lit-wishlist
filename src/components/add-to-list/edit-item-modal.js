import {LitElement, html, css} from 'lit';
import '../global/custom-modal.js';
import './edit-item-form.js';
import {EDIT_ITEM_EVENT, listenEditItemEvent} from "../../events/custom-events.js";

export class EditItemModal extends LitElement {
    static properties = {
        itemData: {type: Object},
    };

    constructor() {
        super();
        this.itemData = null;
    }

    connectedCallback() {
        super.connectedCallback();
        this.eventRemover = listenEditItemEvent(this._handleOpenEvent.bind(this));
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.eventRemover) {
            this.eventRemover();
        }
    }

    _handleOpenEvent(event) {
        if (event.detail && event.detail.itemData) {
            this.itemData = event.detail.itemData;

            // Open the modal
            const modal = this.shadowRoot.querySelector('custom-modal');
            if (modal) {
                modal.openModal();
            }
        }
    }

    _handleModalChanged(e) {
        // Reset data when modal is closed
        if (!e.detail.isOpen) {
            this.itemData = null;
        }
    }

    _handleItemUpdated() {
        const modal = this.shadowRoot.querySelector('custom-modal');
        if (modal) {
            modal.closeModal();
        }
    }

    _handleCancel() {
        const modal = this.shadowRoot.querySelector('custom-modal');
        if (modal) {
            modal.closeModal();
        }
    }

    static get styles() {
        return css`
            :host {
                display: block;
            }
        `;
    }

    render() {
        return html`
            <custom-modal 
                level="2"
                @modal-changed="${this._handleModalChanged}"
                maxWidth="1200px"
                noPadding
            >
                ${this.itemData ? html`
                    <edit-item-form 
                        .itemData="${this.itemData}"
                        @item-updated="${this._handleItemUpdated}"
                        @cancel="${this._handleCancel}">
                    </edit-item-form>
                ` : html``}
            </custom-modal>
        `;
    }
}

customElements.define('edit-item-modal', EditItemModal);

// Helper function to trigger the edit item modal
export function openEditItemModal(itemData) {
    if (!itemData) {
        console.error('Item data is required to open the edit modal');
        return;
    }

    const event = new CustomEvent(EDIT_ITEM_EVENT, {
        detail: { itemData },
        bubbles: true,
        composed: true
    });

    document.dispatchEvent(event);
}
