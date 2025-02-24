import {LitElement, html, css} from 'lit';
import buttonStyles from "../../../css/buttons";
import {cachedFetch} from "../../../helpers/caching.js";
import '../../../svg/plus.js';
import '../../../svg/minus.js';
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
            const qty = matchingContributor ? matchingContributor.numberGetting : 0;
            return {
                id: user.id,
                name: user.name,
                imageId: user.image,
                qty: qty,
            };
        });
        this.initialized = true;
        this._updateData(compiledData);
    }

    /**
     * Updates the internal data and emits a "data-changed" event with the updated data.
     * @param {Array} newData - The updated data array.
     */
    _updateData(newData) {
        this.data = newData;
        let total = 0;

        // Sum quantities from the compiled newData.
        for (const item of newData) {
            total += parseInt(item.qty) || 0;
        }

        for (const contributor of this.contributors) {
            const existsInData = newData.some(userData => userData.id === contributor.userId);
            if (!existsInData) {
                total += parseInt(contributor.qty || contributor.numberGetting || 0);
            }
        }

        this.dispatchEvent(
            new CustomEvent('data-changed', {
                detail: {data: this.data, total},
                bubbles: true,
                composed: true,
            })
        );
    }


    /**
     * Increase the quantity for the given index.
     * @param {number} index
     */
    _incrementQty(index) {
        const newData = [...this.data];
        const currentQty = parseInt(newData[index].qty) || 0;
        newData[index] = {...newData[index], qty: currentQty + 1};
        this._updateData(newData);
    }

    /**
     * Decrease the quantity for the given index.
     * @param {number} index
     */
    _decrementQty(index) {
        const newData = [...this.data];
        const currentQty = parseInt(newData[index].qty) || 0;
        newData[index] = {...newData[index], qty: Math.max(0, currentQty - 1)};
        this._updateData(newData);
    }

    /**
     * Update the quantity based on direct input.
     * @param {number} index
     * @param {Event} e
     */
    _onQtyInputChange(index, e) {
        const newData = [...this.data];
        let value = parseInt(e.target.value);
        if (isNaN(value)) {
            value = 0;
        }
        newData[index] = {...newData[index], qty: value};
        this._updateData(newData);
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    display: block;
                    padding: 0 var(--spacing-normal);
                }

                .user-container {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-small, 8px);
                    margin-bottom: 1rem;
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
                    border: none; /* No border */
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
                
                .get-this-button {
                    min-width: 88px;
                    margin-left: auto;
                }

                /* Hide spinner for WebKit browsers */

                .qty-input input::-webkit-outer-spin-button,
                .qty-input input::-webkit-inner-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
            `
        ];
    }

    render() {
        return html`
            ${this.data?.map(
                    (userData, index) => html`
                        <div class="user-container">
                            <custom-avatar
                                    size="32"
                                    username="${userData.name}"
                                    imageId="${userData.imageId}"
                            ></custom-avatar>
                            <div class="user-info">
                                <div class="user-name">${userData.name}</div>
                            </div>
                            ${userData.qty > 0 ? html`
                                <div class="qty-input">
                                    <button
                                            class="button blue small adjust-button"
                                            @click="${() => this._decrementQty(index)}"
                                            aria-label="Decrease quantity for ${userData.name}"
                                    >
                                        <minus-icon></minus-icon>
                                    </button>
                                    <input
                                            class="qty-input-input"
                                            type="number"
                                            .value="${userData.qty}"
                                            @input="${(e) => this._onQtyInputChange(index, e)}"
                                            aria-label="Quantity for ${userData.name}"
                                    />
                                    <button
                                            class="button blue small adjust-button"
                                            @click="${() => this._incrementQty(index)}"
                                            aria-label="Increase quantity for ${userData.name}"
                                    >
                                        <plus-icon></plus-icon>
                                    </button>
                                </div>
                            ` : html`
                                <button @click="${() => this._incrementQty(index)}"
                                        class="primary button shadow get-this-button"
                                >
                                    Get
                                </button>
                            `}

                        </div>
                    `
            )}
        `;
    }
}

customElements.define('number-getting-list', CustomElement);
