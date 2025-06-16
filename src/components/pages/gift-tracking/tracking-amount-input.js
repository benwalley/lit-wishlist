import {LitElement, html, css} from 'lit';
import {observeState} from 'lit-element-state';
import {userState} from '../../../state/userStore.js';
import '../../../svg/dollar.js';

export class TrackingAmountInput extends observeState(LitElement) {
    static properties = {
        data: {type: Object},
        value: {type: Number},
        originalValue: {type: Number, state: true},
        hasChanged: {type: Boolean, state: true}
    };

    static get styles() {
        return css`
            :host {
                display: block;
                width: 100%;
                height: 100%;
                position: relative;
            }
       
            .amount-input {
                background: transparent;
                line-height: 1;
                border: none;
                color: var(--text-color-dark);
                width: 100%;
                padding: var(--spacing-x-small);
                box-sizing: border-box;
                text-align: right;
                /* Hide arrows for number inputs */
                -moz-appearance: textfield;
            }
            
            /* Chrome, Safari, Edge, Opera */
            .amount-input::-webkit-outer-spin-button,
            .amount-input::-webkit-inner-spin-button {
                -webkit-appearance: none;
                margin: 0;
            }
            
            .amount-input:focus {
                outline: none;
                border-color: var(--focus-color);
                box-shadow: 0 0 0 2px var(--blue-light);
            }
            
            .amount-input.changed {
                outline: 2px solid var(--changed-outline-color, #7bd0b6);
                outline-width: 6px;
                outline-offset: -2px;
            }
            
            .amount-input-container {
                width: 100%;
                height: 100%;
            }
            
            .input-decorator {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                left: 3px;
                font-size: var(--font-size-small);
                color: var(--green-normal);
            }
        `;
    }

    constructor() {
        super();
        this.data = {};
        this.value = 0;
        this.originalValue = 0;
        this.hasChanged = false;
    }

    connectedCallback() {
        super.connectedCallback();
    }

    updated(changedProperties) {
        if (changedProperties.has('data') && this.data) {
            let newValue = parseFloat(this.data.actualPrice);
            this.value = newValue
            this.hasChanged = false;
            this.originalValue = newValue;
        }

        if (changedProperties.has('value')) {
            this.hasChanged = this.value !== this.originalValue;
        }
    }

    handleChange(e) {
        const newValue = Number(e.target.value);
        this.value = newValue;
    }

    render() {

        return html`
            <div class="amount-input-container">
                <dollar-icon class="input-decorator"></dollar-icon>
                <input 
                    type="number" 
                    class="amount-input ${this.hasChanged ? 'changed' : ''}" 
                    .value=${this.value || 0}
                    @input=${this.handleChange}
                    min="0"
                    step="0.01"
                />
            </div>
        `;
    }
}

customElements.define('tracking-amount-input', TrackingAmountInput);
