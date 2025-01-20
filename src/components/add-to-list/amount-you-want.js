import {LitElement, html, css} from 'lit';
import buttonStyles from '../../css/buttons.js';
import '../global/custom-input.js';

class AmountSelector extends LitElement {
    static styles = [
        buttonStyles,
        css`
      .amount-input {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 1em;
      }
      .advanced-options {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-top: 10px;
      }
    `
    ];

    static properties = {
        amount: {type: String, reflect: true},
        showAdvanced: {type: Boolean},
        min: {type: Number, reflect: true},
        max: {type: Number, reflect: true}
    };

    constructor() {
        super();
        this.amount = "";
        this.showAdvanced = false;
        this.min = null;
        this.max = null;
    }

    toggleAdvancedOptions() {
        this.showAdvanced = !this.showAdvanced;
    }

    _handleInputChange(e) {
        const field = e.target.getAttribute('name') || 'amount';
        const value = e.target.value;
        this[field] = value;
        this._emitChange();
    }

    _emitChange() {
        this.dispatchEvent(new CustomEvent('amount-changed', {
            detail: {
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
      <h3>Amount You Want</h3>

      <div class="amount-input">
        <custom-input
          type="text"
          name="amount"
          placeholder="Amount you want (number or text)"
          .value="${this.amount}"
          @input="${this._handleInputChange}"
        ></custom-input>
        <button class="button primary" @click="${this.toggleAdvancedOptions}">
          Set Min/Max
        </button>
      </div>

      ${this.showAdvanced
            ? html`
            <div class="advanced-options">
              <custom-input
                type="number"
                name="min"
                .value="${this.min}"
                @input="${this._handleInputChange}"
                placeholder="Min"
              ></custom-input>
              <custom-input
                type="number"
                name="max"
                .value="${this.max}"
                @input="${this._handleInputChange}"
                placeholder="Max"
              ></custom-input>
            </div>`
            : ''
        }
    `;
    }
}

customElements.define('amount-you-want', AmountSelector);
