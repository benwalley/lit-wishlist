import {LitElement, html, css} from 'lit';
import buttonStyles from '../../css/buttons.js'
import '../global/custom-input.js'

class AmountSelector extends LitElement {
    static get styles() {
        return [
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
    }

    static properties = {
        amount: {type: String},
        showAdvanced: {type: Boolean},
        min: {type: Number},
        max: {type: Number}
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

    handleInputChange(event) {
        const {name, value} = event.target;
        if (name === 'min' || name === 'max') {
            this[name] = Number(value);
        }
    }

    render() {
        return html`
            <h3>Amount You Want</h3>

            <div class="amount-input">
                <custom-input
                        type="text"
                        placeholder="Amount you want"
                        .value="${this.amount}"
                        @input="${(e) => this.amount = e.target.value}"
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
                                    placeholder="Min"
                                    @input="${this.handleInputChange}"
                            ></custom-input>
                            <custom-input
                                    type="number"
                                    name="max"
                                    placeholder="Max"
                                    @input="${this.handleInputChange}"
                            ></custom-input>
                        </div>`
                    : ''}
        `;
    }
}

customElements.define('amount-you-want', AmountSelector);
