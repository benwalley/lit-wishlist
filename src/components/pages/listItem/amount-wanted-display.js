import { LitElement, html, css } from 'lit';
import buttonStyles from "../../../css/buttons";
import '../../../svg/hash.js'
import '../../../svg/success.js'
import {listenUpdateItem} from "../../../events/eventListeners.js";
import {cachedFetch} from "../../../helpers/caching.js";
import '../../loading/skeleton-loader.js'

export class CustomElement extends LitElement {
    static properties = {
        itemData: { type: Object },
        amountGotten: {type: Number}
    };

    constructor() {
        super();
        this.itemData = {};
        this.amountGotten = 0;
    }

    connectedCallback() {
        super.connectedCallback();
        if (!this.itemData?.id) {
            return;
        }
        this.fetchContributorData();
        listenUpdateItem(this.fetchContributorData.bind(this));
    }

    async fetchContributorData() {
        this.loading = true;
        this.requestUpdate();

        try {
            const response = await cachedFetch(`/contributors/item/${this.itemData.id}`, {}, true);
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

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    gap: var(--spacing-small);
                }
                
                
                .regular-qty {
                    font-size: var(--font-size-medium);
                    font-weight: bold;
                    color: var(--text-color-dark);
                }
                
                .number-icon {
                    font-size: 20px;
                    color: var(--primary-color);
                    background: var(--purple-light);
                    height: 40px;
                    width: 40px;
                    border-radius: var(--border-radius-normal);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .min-max-section {
                    font-size: var(--font-size-small);
                    color: var(--text-color-medium-dark);
                }
                
                .amount-gotten-section {
                    background: var(--green-light);
                    color: var(--green-normal);
                    border-radius: 50px;
                    padding: var(--spacing-x-small) var(--spacing-small);
                    align-items: center;
                    display: flex;
                    gap: var(--spacing-x-small);
                    margin-left: auto;
                    min-width: 100px;
                }
            `
        ];
    }

    render() {
        return html`
            <div class="number-icon">
                <hash-icon></hash-icon>
            </div>
            <div>
                <div class="regular-qty">${this.itemData.amountWanted || 1}</div>

                ${(parseFloat(this.itemData.minAmountWanted) || parseFloat(this.itemData.maxAmountWanted)) ? html`<div class="min-max-section">
                    <span>Range:</span>
                    <span>${this.itemData?.minAmountWanted || '1'}</span>
                    <span>-</span>
                    <span>${this.itemData?.maxAmountWanted || '--'}</span>
                </div>` : ''}
            </div>
            <div class="amount-gotten-section">
                ${this.loading ? html`
                            <skeleton-loader width="100%" height="20px"></skeleton-loader>
                        ` : html`
                            <success-icon></success-icon>
                            <span>${this.amountGotten}</span>
                            <span>gotten</span>
                        `}
            </div>
            
        `;
    }
}

customElements.define('amount-wanted-display', CustomElement);
