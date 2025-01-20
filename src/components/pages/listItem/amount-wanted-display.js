import { LitElement, html, css } from 'lit';
import buttonStyles from "../../../css/buttons";

export class CustomElement extends LitElement {
    static properties = {
        itemData: { type: Object },
    };

    constructor() {
        super();
        this.itemData = {};
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    display: flex;
                    flex-direction: column;
                    background: light-dark(var(--lavender-400), var(--lavender-800));
                    padding: var(--spacing-small);
                    border-radius: var(--border-radius-normal);
                }
                
                .regular-qty {
                    padding-bottom: var(--spacing-small);
                }
            `
        ];
    }

    render() {
        return html`
            ${this.itemData.amountWanted
                    ? html`<div class="regular-qty">${this.itemData.amountWanted}</div>`
                    : ''}

            ${this.itemData.minAmountWanted
                    ? html`<div>Min: ${this.itemData.minAmountWanted}</div>`
                    : ''}
            ${this.itemData.maxAmountWanted
                    ? html`<div>Max: ${this.itemData.maxAmountWanted}</div>`
                    : ''}
        `;
    }
}

customElements.define('amount-wanted-display', CustomElement);
