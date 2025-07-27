import {LitElement, html, css} from 'lit';
import '../../svg/message.js';
import './custom-modal.js';
import '../pages/account/qa/add-qa-popup.js';
import {listenAddQuestionEvent} from '../../events/custom-events.js';
import {createQA} from '../pages/account/qa/qa-helpers.js';
import {messagesState} from '../../state/messagesStore.js';
import {triggerUpdateQa} from '../../events/eventListeners.js';

export class AddQuestionModal extends LitElement {
    static properties = {
        isOpen: {type: Boolean},
        preSelectedUserId: {type: String},
        editData: {type: Object},
    };

    constructor() {
        super();
        this.isOpen = false;
        this.preSelectedUserId = null;
        this.editData = null;
    }

    connectedCallback() {
        super.connectedCallback();
        this._removeEventListener = listenAddQuestionEvent(this._handleOpenModal.bind(this));
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this._removeEventListener) {
            this._removeEventListener();
        }
    }

    _handleOpenModal(event) {
        const editData = event.detail.editData || {};
        const qaForm = this.shadowRoot.getElementById('qa-form');

        if (editData && Object.keys(editData).length > 0) {
            qaForm.editQuestion(editData);
        } else {
            qaForm.clearForm();
        }

        this.isOpen = true;
    }

    _handleModalChanged(event) {
        this.isOpen = event.detail.isOpen;
    }


    render() {
        return html`
            <custom-modal 
                triggerEvent="open-add-question-modal"
                .isOpen=${this.isOpen}
                @modal-changed=${this._handleModalChanged}
                maxWidth="800px"
                noPadding
            >
                <add-qa-popup
                    id="qa-form"
=                    @cancel-popup=${() => this.isOpen = false}
                ></add-qa-popup>
            </custom-modal>
        `;
    }
}

customElements.define('add-question-modal', AddQuestionModal);
