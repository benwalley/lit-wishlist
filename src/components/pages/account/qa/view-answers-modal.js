import {LitElement, html} from 'lit';
import '../../../global/custom-modal.js';
import './view-answers-popup.js';
import {listenViewAnswersEvent} from '../../../../events/custom-events.js';

export class ViewAnswersModal extends LitElement {
    static properties = {
        isOpen: {type: Boolean},
        questionData: {type: Object},
    };

    constructor() {
        super();
        this.isOpen = false;
        this.questionData = null;
    }

    connectedCallback() {
        super.connectedCallback();
        this._removeEventListener = listenViewAnswersEvent(this._handleOpenModal.bind(this));
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this._removeEventListener) {
            this._removeEventListener();
        }
    }

    _handleOpenModal(event) {
        this.questionData = event.detail.questionData;
        this.isOpen = true;
    }

    _handleModalChanged(event) {
        this.isOpen = event.detail.isOpen;
        if (!this.isOpen) {
            this.questionData = null;
        }
    }

    render() {
        return html`
            <custom-modal
                triggerEvent="open-view-answers-modal"
                .isOpen=${this.isOpen}
                @modal-changed=${this._handleModalChanged}
                maxWidth="800px"
                noPadding
            >
                <view-answers-popup
                    .questionData=${this.questionData}
                    @close-popup=${() => this.isOpen = false}
                ></view-answers-popup>
            </custom-modal>
        `;
    }
}

customElements.define('view-answers-modal', ViewAnswersModal);
