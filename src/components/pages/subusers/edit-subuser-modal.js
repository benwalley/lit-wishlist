import { LitElement, html, css } from 'lit';
import '../../global/custom-modal.js';
import './edit-subuser-form.js';

class EditSubuserModal extends LitElement {
    static get properties() {
        return {
            subuserData: { type: Object }
        };
    }

    static get styles() {
        return css`
            :host {
                display: block;
            }
        `;
    }

    constructor() {
        super();
        this.subuserData = null;
    }

    open(subuserData) {
        if (!subuserData) {
            console.error('Subuser data is required to open the edit modal');
            return;
        }

        this.subuserData = subuserData;

        // Open the modal
        const modal = this.shadowRoot.querySelector('custom-modal');
        if (modal) {
            modal.openModal();
        }
    }

    close() {
        const modal = this.shadowRoot.querySelector('custom-modal');
        if (modal) {
            modal.closeModal();
        }
    }

    _handleModalChanged(e) {
        // Reset data when modal is closed
        if (!e.detail.isOpen) {
            this.subuserData = null;
        }
    }

    _handleSubuserUpdated() {
        this.close();
    }

    _handleCancel() {
        this.close();
    }

    render() {
        return html`
            <custom-modal 
                @modal-changed="${this._handleModalChanged}"
                maxWidth="600px"
                noPadding
            >
                ${this.subuserData ? html`
                    <edit-subuser-form 
                        .subuserData="${this.subuserData}"
                        @subuser-updated="${this._handleSubuserUpdated}"
                        @cancel="${this._handleCancel}">
                    </edit-subuser-form>
                ` : html``}
            </custom-modal>
        `;
    }
}

customElements.define('edit-subuser-modal', EditSubuserModal);
