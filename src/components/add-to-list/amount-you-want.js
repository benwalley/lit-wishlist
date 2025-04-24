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
        this.isRange = true; // Always true since we're showing both
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
                    margin-bottom: var(--spacing-small);
                }
                
                .amount-input-container {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-small);
                }
                
                .inputs-row {
                    display: grid;
                    grid-template-columns: 1fr 100px 100px;
                    gap: var(--spacing-small);
                }
            `
        ];
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
                isRange: true, // Always include both single and range values
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
                </div>
                
                <div class="inputs-row">
                    <custom-input
                    class="single-input"
                    type="text"
                    name="amount"
                    placeholder="Single Amount"
                    .value=${this.amount}
                    @input=${this._handleInputChange}
                ></custom-input>
                
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
                
            </div>
        `;
    }
}

customElements.define('amount-you-want', AmountSelector);
