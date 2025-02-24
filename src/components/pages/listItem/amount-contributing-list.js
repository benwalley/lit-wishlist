import {LitElement, html, css} from 'lit';
import buttonStyles from "../../../css/buttons";
import {cachedFetch} from "../../../helpers/caching.js";
import '../../../svg/plus.js';
import '../../../svg/minus.js';
import '../../../svg/contribute.js';
import '../../../svg/x.js';
import '../../../svg/question-mark.js';
import '../../global/custom-tooltip.js';
import {listenUpdateItem} from "../../../events/eventListeners.js";

export class CustomElement extends LitElement {
    static properties = {
        itemId: {type: String},
        users: {type: Array},
        contributors: {type: Array},
        data: {type: Array, reflect: true},
        contributorsLoaded: {type: Boolean},
        initialized: {type: Boolean}
    };

    constructor() {
        super();
        this.itemId = '';
        this.users = [];
        this.contributors = [];
        this.data = [];
        this.contributorsLoaded = false;
        this.initialized = false;
    }

    connectedCallback() {
        super.connectedCallback();
        if (!this.itemId) {
            return;
        }
        // Kick off both fetches concurrently
        this._fetchData();

        // Assume listenUpdateItem is a helper that listens for external updates.
        listenUpdateItem(() => {
            this._fetchData();
        });
    }

    /**
     * Fetch both contributors and users concurrently.
     * When both are fetched, compile the data.
     */
    async _fetchData() {
        this.contributorsLoaded = false;
        this.initialized = false;
        try {
            await Promise.all([this._fetchContributorData(), this._fetchYourUsers()]);
            this._setInitialData();
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    async _fetchYourUsers() {
        try {
            const response = await cachedFetch(`/users/yours`, {}, true);
            if (response?.responseData?.error) {
                console.error('Error fetching users:', response.responseData.error);
                return;
            }
            this.users = response;
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            this.requestUpdate();
        }
    }

    async _fetchContributorData() {
        this.requestUpdate();
        try {
            const response = await cachedFetch(`/contributors/item/${this.itemId}`, {}, true);
            if (response?.responseData?.error) {
                console.error('Error fetching contributors:', response.responseData.error);
                this.contributorsLoaded = true;
                return;
            }
            this.contributors = response;
            // Optionally, compute an aggregate if needed.
            this.amountGotten = 0;
            for (const user of this.contributors) {
                this.amountGotten += parseInt(user.numberGetting || 1);
            }
        } catch (error) {
            console.error('Error fetching contributors:', error);
        } finally {
            this.contributorsLoaded = true;
            this.requestUpdate();
        }
    }

    /**
     * Compiles the data once both users and contributors have been fetched.
     */
    _setInitialData() {
        if (!this.users?.length || !this.contributorsLoaded) return;
        if (!this.itemId) return;
        const compiledData = this.users.map(user => {
            const matchingContributor = this.contributors.find(contributor => contributor.userId === user.id);
            const amount = matchingContributor ? matchingContributor.contributeAmount : 0;
            return {
                id: user.id,
                name: user.name,
                imageId: user.image,
                contributing: matchingContributor?.contributing,
                amount: amount
            };
        });
        console.log(compiledData)
        this.initialized = true;
        this._updateData(compiledData);
    }

    /**
     * // TODO: Make sure only numbers are sent.
     * Updates the internal data and emits a "data-changed" event with the updated data.
     * @param {Array} newData - The updated data array.
     */
    _updateData(newData) {
        this.data = newData;

        this.dispatchEvent(
            new CustomEvent('data-changed', {
                detail: {data: this.data},
                bubbles: true,
                composed: true,
            })
        )
    }

    _toggleContribute(index) {
        const newData = [...this.data];
        const value = newData[index]?.contributing;
        newData[index] = {...newData[index], contributing: !value};
        this._updateData(newData);
    }

    _handleAmountChange(index, event) {
        const newData = [...this.data];
        newData[index] = {...newData[index], amount: event.detail.value};
        this._updateData(newData)
    }

    static get styles() {
        return [buttonStyles, css`
            :host {
                display: flex;
                flex-direction: column;
                gap: var(--spacing-normal);
                padding: 0 var(--spacing-normal);

            }

            question-mark-icon {
                font-size: var(--font-size-normal);
                flex-shrink: 0;
            }

            .user-container {
                display: flex;
                flex-direction: column;
                gap: var(--spacing-small);
            }

            .user-top-row {
                display: flex;
                align-items: center;
                gap: var(--spacing-small);
            }

            .user-info {
                display: flex;
                flex-direction: column;
            }

            .qty-input {
                display: inline-flex;
                gap: 6px;
                margin-top: 4px;
                margin-left: auto;
                align-items: center;
            }

            .qty-input button.adjust-button {
                width: 1.5rem;
                height: 1.5rem;
                border-radius: 50px;
            }

            .qty-input button:focus {
                outline: 2px solid blue;
            }

            .qty-input input {
                text-align: center;
                width: 2rem;
                height: 2rem;
                box-sizing: border-box;
                display: flex;
                align-items: center;
                justify-content: center;
                border: none;
                background: transparent;
                color: var(--purple-normal);
                background: var(--purple-light);
                border-radius: var(--border-radius-normal);
                -webkit-appearance: none;
                -moz-appearance: textfield;
                appearance: none;
                font-size: var(--font-size-normal);
                font-weight: bold;
            }

            .contribute-button {
                margin-left: auto;
                transition: var(--transition-normal);
            }

            /* Hide spinner for WebKit browsers */

            .qty-input input::-webkit-outer-spin-button,
            .qty-input input::-webkit-inner-spin-button {
                -webkit-appearance: none;
                margin: 0;
            }

            /* New styles for contribution details */

            .contribution-amount-container {
                display: flex;
                flex-direction: column;
                gap: 4px;
                width: 100%;
            }

            .contribution-container custom-input {
            }

            .contribution-text {
                font-size: 0.8em;
                color: #666;
            }
        `];
    }

    render() {
        return html`
            ${this.data?.map((userData, index) => html`
                <div class="user-container">
                    <div class="user-top-row">
                        <custom-avatar
                                size="32"
                                username="${userData.name}"
                                imageId="${userData.imageId}"
                        ></custom-avatar>
                        <div class="user-info">
                            <div class="user-name">${userData.name}</div>
                        </div>
                        <button
                                @click="${() => this._toggleContribute(index)}"
                                class="button contribute-button ${userData.contributing ? 'danger' : 'green'}">
                            ${userData.contributing ? html`
                                <span key="dont-contribute" class="fade">
          <x-icon></x-icon> Don't Contribute
        </span>
                            ` : html`
                                <span key="contribute" class="fade">
          <contribute-icon></contribute-icon> Contribute
        </span>
                            `}
                        </button>

                    </div>
                    ${userData.contributing ? html`
                        <div class="contribution-amount-container">
                            <custom-input size="small"
                                          placeholder="Amount (optional)"
                                          .value="${userData.amount}"
                                          @value-changed="${(event) => this._handleAmountChange(index, event)}"
                                          fullWidth="true"
                                          dollarIcon="true   "
                            ></custom-input>
                            <small>Optionally add amount</small>
                        </div>
                    ` : ''}
                </div>

            `)}
        `;
    }
}

customElements.define('amount-contributing-list', CustomElement);
