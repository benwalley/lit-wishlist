import {css, html, LitElement} from 'lit';
import buttonStyles from "../../../css/buttons";
import {triggerUpdateItem} from "../../../events/eventListeners.js";
import {bulkUpdateGetting} from "../../../helpers/api/gifts.js";
import '../../../svg/cart.js';
import '../../global/custom-modal.js';
import '../../users/your-users-list.js'
import '../../global/multi-select-dropdown.js'
import '../../global/qty-input.js'
import './number-getting-list.js'
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
                .get-this-button {
                    width: 100%;
                    font-size: var(--font-size-large);
                }

                .modal-header {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-small);
                    padding: var(--spacing-small) var(--spacing-normal) 0 var(--spacing-normal);
                }

                .progress-bar-container {
                    width: 100%;
                    height: 2px;
                    background-color: var(--border-color);
                    border-radius: 2px;
                    overflow: hidden;
                }

                .progress-bar {
                    height: 100%;
                    background-color: var(--blue-normal);
                    transition: var(--transition-normal);
                    
                    &.full {
                        background-color: var(--green-normal);
                    }
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
    }

    handleError(message) {
        this.error = message;
    }

    async _handleConfirm() {
        this.loading = true;
        try {
            const data = this.newData.map(user => ({
                giverId: user.id,
                getterId: this.itemData?.createdById,
                numberGetting: user.qty,
                itemId: this.itemId,
            }));

            const response = await bulkUpdateGetting(data);
            if(response.success) {
                triggerUpdateItem();
                this._closeModal();
                messagesState.addMessage('Successfully updated getting data.', 'success');
            } else {
                messagesState.addMessage(response.publicMessage || 'Failed to update getting data.', 'error');
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
        this.total = e.detail.total;
    }

    render() {
        const maxAmount = Math.max(parseInt(this.itemData?.amountWanted) || 1, this.itemData?.maxAmountWanted);
        const progressPercent = Math.min((this.total / maxAmount) * 100, 100);
        return html`
            ${this.compact ? html`
            <button class="icon-button get-this-button green-text" @click="${this._openModal}">
                <cart-icon></cart-icon>
            </button>` : html`
                <button class="button shadow primary large fancy get-this-button" @click="${this._openModal}">
                    <cart-icon></cart-icon>
                    <span>I'll get This</span>
                </button>
            `}
            <custom-tooltip>Say that you'll get this</custom-tooltip>
            <custom-modal 
                maxWidth="400px" 
                noPadding="true"
                lazyLoad
                .isOpen="${this.modalOpen}"
                @modal-closed="${this._handleModalClosed}"
            >
                <div class="modal-contents">
                    <div class="modal-header">
                        <h3>Who is getting this?</h3>
                        <p class="header-subtitle">${this.total} of ${maxAmount} gotten</p>
                    </div>
                    <div class="progress-bar-container">
                        <div class="progress-bar ${progressPercent === 100 ? 'full' : ''}" style="width: ${progressPercent}%;"></div>
                    </div>
                    <number-getting-list
                            .itemData="${this.itemData}"
                            @data-changed="${this._handleDataChange}"
                    ></number-getting-list>
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

customElements.define('get-this-button', CustomElement);
