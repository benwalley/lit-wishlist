import {LitElement, html, css} from 'lit';
import '../global/custom-modal.js';
import './edit-list-form.js';
import {EDIT_LIST_EVENT, listenEditListEvent, triggerEditListEvent} from "../../events/custom-events.js";

export class EditListModal extends LitElement {
    static properties = {
        listData: {type: Object},
    };

    constructor() {
        super();
        this.listData = null;
    }

    connectedCallback() {
        super.connectedCallback();
        this.eventRemover = listenEditListEvent(this._handleOpenEvent.bind(this));
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.eventRemover) {
            this.eventRemover();
        }
    }

    _handleOpenEvent(event) {
        if (event.detail && event.detail.listData) {
            this.listData = event.detail.listData;

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
            this.listData = null;
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
                triggerEvent="none"
                @modal-changed="${this._handleModalChanged}"
                maxWidth="1000px"
                noPadding>
                ${this.listData ? html`
                    <edit-list-form .listData="${this.listData}"></edit-list-form>
                ` : html``}
            </custom-modal>
        `;
    }
}

customElements.define('edit-list-modal', EditListModal);

// Helper function to trigger the edit list modal
export function openEditListModal(listData) {
    triggerEditListEvent(listData);
}
