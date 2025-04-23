import {LitElement, html, css} from 'lit';
import buttonStyles from '../../css/buttons.js';
import '../global/custom-input.js';
import '../../svg/chevron-left.js';

class AmountSelector extends LitElement {
    static properties = {
        isRange: {type: Boolean, reflect: true},
        amount: {type: String, reflect: true},
        min: {type: Number, reflect: true},
        max: {type: Number, reflect: true}
    };

    constructor() {
        super();
        this.amount = "";
        this.isRange = false;
        this.min = null;
        this.max = null;
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                .header {
                    display: flex;
                    justify-content: space-between;
                }
                
                .amount-input-container {
                    display: flex;
                    flex-direction: column;
                    
                    .button {
                        margin-left: auto;
                    }

                    chevron-left-icon {
                        transform: rotate(-90deg);
                    }
                }
                
                .two-input-container {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: var(--spacing-small);
                }
                
                .button-text {
                    display: none;
                }
                
                @media (min-width: 768px) {
                    .button-text {
                        display: block;
                    }
                }
            `
        ];
    }

    _toggleMode() {
        this.isRange = !this.isRange;
        this.amount = "";
        this.min = null;
        this.max = null;
        this._emitChange();
    }

    _handleInputChange(e) {
        const field = e.target.getAttribute('name') || 'amount';
        const value = e.target.value;
        this[field] = value;
        this._emitChange();
    }

    _onMinChange(e) {
        this.min = parseFloat(e.target.value) || null;
        this._emitChange();
    }

    _onMaxChange(e) {
        this.max = parseFloat(e.target.value) || null;
        this._emitChange();
    }

    _emitChange() {
        this.dispatchEvent(new CustomEvent('amount-changed', {
            detail: {
                isRange: this.isRange,
                amount: this.amount,
                min: this.min,
                max: this.max
            },
            bubbles: true,
            composed: true
        }));
    }

    render() {
        return html`
            <div class="amount-input-container">
                <div class="header">
                    <strong>Amount You Want</strong>
                    <button @click=${this._toggleMode} class="button small-link-button">
                        <span class="button-text">
                            ${this.isRange ? 'Switch to Single Amount' : 'Switch to Range'}
                        </span>
                        <chevron-left-icon></chevron-left-icon>
                    </button>
                </div>
                
                ${this.isRange
                    ? html`
                        <div class="two-input-container">
                            <custom-input
                                class="small-input"
                                type="number"
                                name="min"
                                placeholder="Min Amount"
                                .value=${this.min ?? ''}
                                @input=${this._onMinChange}
                            ></custom-input>
                            <custom-input
                                class="small-input"
                                type="number"
                                name="max"
                                placeholder="Max Amount"
                                .value=${this.max ?? ''}
                                @input=${this._onMaxChange}
                            ></custom-input>
                        </div>
                    `
                    : html`
                        <custom-input
                            class="single-input"
                            type="text"
                            name="amount"
                            placeholder="Amount"
                            .value=${this.amount}
                            @input=${this._handleInputChange}
                        ></custom-input>
                    `}
            </div>
        `;
    }
}

customElements.define('amount-you-want', AmountSelector);
