import {LitElement, html, css} from 'lit';
import buttonStyles from "../../../css/buttons";
import {currencyHelper} from "../../../helpers.js";

export class CustomElement extends LitElement {
    static properties = {
        itemData: {type: Object},
        showLabel: {type: Boolean}
    };

    constructor() {
        super();
        this.itemData = {};
        this.showLabel = false;
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {

                }

                .min-max-price-container {
                    display: flex;
                    flex-direction: row;
                    gap: 3px;
                    font-size: 0.8em;
                    color: color-mix(in hsl, var(--text-color-dark), #999 50%);
                }
                
                p {
                    margin: 0;
                }
                
                .normal-price {
                    font-size: var(--font-size-normal);
                    font-weight: bold;
                    color: var(--primary-color);
                }

            `
        ];
    }

    render() {
        return html`
            ${this.showLabel ? html`<strong>Price:</strong>` : ''}
            ${this.itemData?.price
                    ? html`<p class="price normal-price"> ${currencyHelper(this.itemData?.price)}</p>`
                    : ''}
            ${(this.itemData?.minPrice && this.itemData?.maxPrice)
                    ? html`
                        <div class="min-max-price-container">
                            <p>${currencyHelper(this.itemData?.minPrice)}</p>
                            -
                            <p>${currencyHelper(this.itemData?.maxPrice)}</p>
                        </div>
                    `
                    : ''}
        `;
    }
}

customElements.define('price-display', CustomElement);
