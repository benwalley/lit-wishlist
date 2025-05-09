import {css, html, LitElement} from 'lit';
import buttonStyles from "../../../css/buttons";
import {customFetch} from "../../../helpers/fetchHelpers.js";
import {invalidateCache} from "../../../helpers/caching.js";
import {triggerUpdateItem} from "../../../events/eventListeners.js";
import '../../../svg/cart.js';
import '../../global/custom-modal.js';
import '../../users/your-users-list.js'
import '../../global/multi-select-dropdown.js'
import '../../global/qty-input.js'
import './number-getting-list.js'

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
        newData: { type: Array, state: true }
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

    _openModal() {
        const modal = this.shadowRoot.querySelector('custom-modal');
        modal.openModal();
    }

    _closeModal(e) {
        const modal = this.shadowRoot.querySelector('custom-modal');
        modal.closeModal();
        this.error = '';
    }

    handleError(message) {
        this.error = message;
    }

    async _handleConfirm() {
        this.loading = true;
        try {
            const data = this.newData.map(item => ({
                userId: item.id,
                qty: item.qty,
                itemId: this.itemId,
                getting: true,
            }));
            const options = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            };
            await customFetch('/contributors/update/batch', options, true);
            invalidateCache(`/contributors/item/${this.itemId}`);
            triggerUpdateItem();
            this._closeModal();
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
            <button class="button shadow primary large fancy get-this-button" @click="${this._openModal}">
                <cart-icon></cart-icon>
                <span>I'll get This</span>
            </button>
            <custom-modal maxWidth="400px" noPadding="true">
                <div class="modal-contents">
                    <div class="modal-header">
                        <h3>Who is getting this?</h3>
                        <p class="header-subtitle">${this.total} of ${maxAmount} gotten</p>
                    </div>
                    <div class="progress-bar-container">
                        <div class="progress-bar ${progressPercent === 100 ? 'full' : ''}" style="width: ${progressPercent}%;"></div>
                    </div>
                    <number-getting-list
                            .users="${this.yourUsers}"
                            .contributors="${this.contributors}"
                            .data="${this.newData}"
                            .itemId="${this.itemId}"
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
