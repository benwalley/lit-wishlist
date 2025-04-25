import {css, html, LitElement} from 'lit';
import buttonStyles from "../../../css/buttons";
import {customFetch} from "../../../helpers/fetchHelpers.js";
import {invalidateCache} from "../../../helpers/caching.js";
import {triggerUpdateItem} from "../../../events/eventListeners.js";
import '../../../svg/contribute.js';
import '../../global/custom-modal.js';
import '../../users/your-users-list.js'
import '../../global/multi-select-dropdown.js'
import '../../global/qty-input.js'
import './amount-contributing-list.js'

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
        console.log(this.newData)
        this.loading = true;
        try {
            const data = this.newData.map(item => ({
                userId: item.id,
                contributeAmount: item.amount,
                itemId: this.itemId,
                contributing: true,
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
    }

    render() {
        const maxAmount = Math.max(parseInt(this.itemData?.amountWanted) || 1, this.itemData?.maxAmountWanted);
        const progressPercent = Math.min((this.total / maxAmount) * 100, 100);
        return html`
            <button class="button shadow contribute-button ghost large fancy" @click="${this._openModal}">
                <contribute-icon></contribute-icon>
                <span>Contribute</span>
            </button>
            <custom-modal maxWidth="400px" noPadding="true">
                <div class="modal-contents">
                    <div class="modal-header">
                        <h3>Who is contributing?</h3>
                        <small>Let others know that  you want to go in on this, and optionally enter an amount you're willing to contribute</small>
                    </div>
                    <amount-contributing-list
                            .users="${this.yourUsers}"
                            .contributors="${this.contributors}"
                            .data="${this.newData}"
                            .itemId="${this.itemId}"
                            @data-changed="${this._handleDataChange}"
                    ></amount-contributing-list>
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
