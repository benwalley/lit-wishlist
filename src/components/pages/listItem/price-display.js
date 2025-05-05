import { LitElement, html, css } from 'lit';
import buttonStyles from "../../../css/buttons";
import { currencyHelper } from "../../../helpers.js";

export class CustomElement extends LitElement {
    static properties = {
        itemData: { type: Object },
        showLabel: { type: Boolean },
        size: {type: String},
    };

    constructor() {
        super();
        this.itemData = {};
        this.showLabel = false;
        this.size = 'normal';
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-small);
                }

                .min-max-price-container {
                    display: flex;
                    flex-direction: row;
                    gap: var(--spacing-x-small);
                    align-items: flex-end;
                }

                .min-max-price-container p {
                    font-size: var(--font-size-large);
                    color: var(--primary-color);
                    font-weight: bold;
                    line-height: 1;
                    margin: 0;
                }

                .min-max-price-container span {
                    line-height: 1;
                }
                
                .small.normal-price {
                    font-size: var(--font-size-medium);
                }
                
                .min-max-price-container.small {
                    font-size: var(--font-size-small);
                    
                    p {
                        font-size: inherit;
                    }
                }

                .normal-price {
                    font-size: var(--font-size-large);
                    color: var(--primary-color);
                    font-weight: bold;
                    line-height: 1;
                    margin: 0;
                }

                h3 {
                    font-size: var(--font-size-small);
                    color: var(--text-color-medium-dark);
                    font-weight: bold;
                    margin: 0;
                }
            `
        ];
    }

    render() {
        // Check if there's a valid price range value (even if it's 0, we'll handle display later)
        const hasPriceRange = parseFloat(this.itemData?.minPrice) || parseFloat(this.itemData?.maxPrice);

        // Format the prices: if the value is zero, display '--'
        const formattedPrice =
            parseFloat(this.itemData?.price) === 0
                ? '--'
                : currencyHelper(this.itemData?.price);

        const formattedMinPrice =
            parseFloat(this.itemData?.minPrice) === 0
                ? '--'
                : currencyHelper(this.itemData?.minPrice);

        const formattedMaxPrice =
            parseFloat(this.itemData?.maxPrice) === 0
                ? '--'
                : currencyHelper(this.itemData?.maxPrice);

        return html`
            ${hasPriceRange
                    ? html`
                        ${this.showLabel ? html`<h3>Price Range:</h3>` : ''}
                        <div class="min-max-price-container ${this.size}">
                            <p>${formattedMinPrice}</p>
                            <span>to</span>
                            <p>${formattedMaxPrice}</p>
                        </div>
                    `
                    : html`
                        ${this.showLabel ? html`<h3>Price:</h3>` : ''}
                        <p class="price normal-price ${this.size}">${formattedPrice}</p>
                    `}
        `;
    }
}

customElements.define('price-display', CustomElement);
