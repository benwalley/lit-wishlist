import {LitElement, html, css} from 'lit';
import buttonStyles from "../../../css/buttons";
import {customFetch} from "../../../helpers/fetchHelpers.js";
import {cachedFetch, invalidateCache} from "../../../helpers/caching.js";
import {listenUpdateItem, triggerUpdateItem} from "../../../events/eventListeners.js";
import '../../../svg/cart.js';
import '../../global/custom-modal.js';

export class CustomElement extends LitElement {
    static properties = {
        itemId: { type: String },
        quantity: { type: Number },
        loading: { type: Boolean },
        error: { type: String },
        contributors: {type: Array, state: true},
        yourUsers: {type: Array, state: true},
    };

    constructor() {
        super();
        this.itemId = '';
        this.quantity = 1;
        this.loading = false;
        this.error = '';
        this.yourU
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
                .modal-contents {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-normal);
                }
                .modal-footer {
                    display: flex;
                    justify-content: flex-end;
                    gap: var(--spacing-normal);
                    
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
        const modal = this.shadowRoot.querySelector('custom-modal')
        modal.openModal()
    }

    _closeModal(e) {
        const modal = this.shadowRoot.querySelector('custom-modal')
        modal.closeModal()
        this.error = '';
    }

    _handleQuantityChange(e) {
        const value = parseInt(e.target.value, 10);
        this.quantity = isNaN(value) ? 1 : value;
    }

    async _handleConfirm() {
        if (this.quantity <= 0) {
            this.error = 'Quantity must be at least 1.';
            return;
        }
        this.loading = true;
        try {
            const data = {
                itemId: this.itemId,
                getting: true,
                contributing: false,
                numberGetting: this.quantity,
            };
            const options = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            };
            const contribution = await customFetch('/contributors/create', options, true);
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

    connectedCallback() {
        super.connectedCallback();
        if (!this.itemId) {
            return;
        }
        this._fetchContributorData();
        this._fetchYourUsers();
        listenUpdateItem(() => {
            this._fetchContributorData.bind(this)
            this._fetchYourUsers.bind(this)
        });
    }

    async _fetchContributorData() {
        this.loading = true;
        this.requestUpdate();

        try {
            const response = await cachedFetch(`/contributors/item/${this.itemId}`, {}, true);
            if (response?.responseData?.error) {
                console.error('Error fetching contributors:', response.responseData.error);
                this.loading = false;
                return;
            }
            const contributors = response;
            this.contributors = contributors;
            this.amountGotten = 0;
            for (const user of contributors) {
                this.amountGotten += parseInt(user.numberGetting || 1);
            }
        } catch (error) {
            console.error('Error fetching contributors:', error);
        } finally {
            this.loading = false;
            this.requestUpdate();
        }
    }

    async _fetchYourUsers() {
        this.loading = true;
        this.requestUpdate();

        try {
            const response = await cachedFetch(`/users/yours`, {}, true);
            if (response?.responseData?.error) {
                console.error('Error fetching users:', response.responseData.error);
                this.loading = false;
                return;
            }
            const users = response;
            this.yourUsers = users
        } catch (error) {
            console.error('Error fetching contributors:', error);
        } finally {
            this.loading = false;
            this.requestUpdate();
        }
    }

    render() {
        return html`
            <button class="button shadow primary large fancy get-this-button" @click="${this._openModal}">
                <cart-icon></cart-icon>
                <span>I'll get This</span>
            </button>
            <custom-modal maxWidth="400px">
                <div class="modal-contents">
                    <h3>Who is getting this</h3>
                    <h3>How many are you getting</h3>
                    <input
                            id="quantity"
                            type="number"
                            min="1"
                            .value="${this.quantity}"
                            @input="${this._handleQuantityChange}"
                    />
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
