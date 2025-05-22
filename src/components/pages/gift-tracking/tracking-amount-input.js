import {LitElement, html, css} from 'lit';

export class TrackingAmountInput extends LitElement {
    static properties = {
        value: {type: Number},
    };

    static get styles() {
        return css`
            :host {
                display: block;
            }
       
            .amount-input {
                background: transparent;
                line-height: 1;
                border: none;
                color: var(--text-color-dark);
                width: 100%;
                padding: var(--spacing-x-small);
                box-sizing: border-box;
            }
            
            .amount-input:focus {
                outline: none;
                border-color: var(--focus-color);
                box-shadow: 0 0 0 2px var(--blue-light);
            }
        `;
    }

    constructor() {
        super();
        this.value = 0;
    }

    handleChange(e) {
        this.value = Number(e.target.value);
        this.dispatchEvent(new CustomEvent('amount-changed', {
            detail: { value: this.value },
            bubbles: true,
            composed: true
        }));
    }

    render() {
        return html`
            <div class="amount-input-container">
                <input 
                    type="number" 
                    class="amount-input" 
                    .value=${this.value || 0}
                    @input=${this.handleChange}
                    min="0"
                    step="0.01"
                >
            </div>
        `;
    }
}

customElements.define('tracking-amount-input', TrackingAmountInput);
