import {css, html, LitElement} from 'lit';
import buttonStyles from "../../../css/buttons";
import {triggerUpdateItem} from "../../../events/eventListeners.js";
import {bulkUpdateGoInOn} from "../../../helpers/api/gifts.js";
import '../../../svg/contribute.js';
import '../../global/custom-modal.js';
import '../../users/your-users-list.js'
import '../../global/multi-select-dropdown.js'
import '../../global/qty-input.js'
import './contributing-list.js'
import {messagesState} from "../../../state/messagesStore.js";

export class CustomElement extends LitElement {
    static properties = {
        itemId: { type: String },
        itemData: { type: Object },
        quantity: { type: Number },
        loading: { type: Boolean },
        error: { type: String },
        total: { type: Number, state: true },
        contributors: { type: Array, state: true },
        yourUsers: { type: Array, state: true },
        newData: { type: Array, state: true },
        compact: { type: Boolean},
        modalOpen: { type: Boolean, state: true },
    };

    constructor() {
        super();
        this.itemId = '';
        this.itemData = {};
        this.quantity = 1;
        this.loading = false;
        this.error = '';
        this.total = 0;
        this.contributors = [];
        this.newData = [];
        this.compact = false;
        this.modalOpen = false;
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    display: inline-block;
                    flex-grow: 1;
                }
                .get-this-button,
                .contribute-button {
                    width: 100%;
                }

                .modal-header {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-small);
                    border-bottom: 1px solid var(--border-color);
                    padding: var(--spacing-small) var(--spacing-normal);
                }

                .header-subtitle {
                    margin: 0;
                    font-size: var(--font-size-small);
                    color: var(--medium-text-color);
                }

                .modal-contents {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-normal);
                    overflow: hidden;
                    border-radius: var(--border-radius-large);
                }
                .modal-footer {
                    display: flex;
                    justify-content: flex-end;
                    gap: var(--spacing-normal);
                    padding: var(--spacing-normal);
                    border-top: 1px solid var(--border-color);

                    .button {
                        flex-grow: 1;
                    }
                }
                .error {
                    color: red;
                    margin-top: var(--spacing-small);
                }
                h3 {
                    margin: 0;
                }
            `,
        ];
    }

    _openModal(e) {
        e.preventDefault();
        e.stopPropagation();
        this.modalOpen = true;
    }

    _closeModal(e) {
        this.modalOpen = false;
    }

    _handleModalClosed(event) {
        this.modalOpen = false;
        this.error = '';
        this.loading = false;
        this.newData = [];
        this.total = 0;
    }

    async _handleConfirm() {
        this.loading = true;
        try {
            const data = this.newData.map(user => ({
                giverId: user.id,
                getterId: this.itemData?.createdById,
                itemId: this.itemId,
                participating: true
            }));

            const response = await bulkUpdateGoInOn(data);
            if(response.success) {
                triggerUpdateItem();
                this._closeModal();
                messagesState.addMessage('Successfully updated contributing data.', 'success');
            } else {
                messagesState.addMessage(response.publicMessage || 'Failed to update contributing data.', 'error');
            }

        } catch (e) {
            console.error(e);
            this.error = 'Failed to process request.';
        } finally {
            this.loading = false;
        }
    }

    _handleDataChange(e) {
        this.newData = e.detail.data;
    }

    render() {
        return html`
            ${this.compact ? html`
            <button class="icon-button contribute-button purple-text" @click="${this._openModal}">
                <group-icon></group-icon>
            </button>` : html`
                <button class="button shadow contribute-button ghost large fancy" @click="${this._openModal}">
                    <contribute-icon></contribute-icon>
                    <span>Contribute</span>
                </button>
            `}
            <custom-modal 
                maxWidth="400px" 
                noPadding="true"
                lazyLoad
                .isOpen="${this.modalOpen}"
                @modal-closed="${this._handleModalClosed}"
            >
                <div class="modal-contents">
                    <div class="modal-header">
                        <h3>Who is contributing?</h3>
                        <small>Let others know that you want to go in on this.</small>
                    </div>
                    <contributing-list
                            .itemData="${this.itemData}"
                            @data-changed="${this._handleDataChange}"
                    ></contributing-list>
                    ${this.error ? html`<div class="error">${this.error}</div>` : ''}
                    <div class="modal-footer">
                        <button class="button ghost shadow" @click="${this._closeModal}" ?disabled="${this.loading}">
                            Cancel
                        </button>
                        <button class="button primary shadow" @click="${this._handleConfirm}" ?disabled="${this.loading}">
                            ${this.loading ? 'Processing...' : 'Confirm'}
                        </button>
                    </div>
                </div>
            </custom-modal>
        `;
    }
}

customElements.define('contribute-button', CustomElement);
