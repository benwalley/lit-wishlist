import { LitElement, html, css } from 'lit';
import buttonStyles from "../../css/buttons.js";

export class QtyInput extends LitElement {
    static properties = {
        value: { type: Number },
        min: { type: Number },
        max: { type: Number },
    };

    constructor() {
        super();
        this.value = 0;
        this.min = 0;
        this.max = Infinity;
    }

    static styles = [
        buttonStyles,
        css`
            :host {
                display: inline-flex;
                font-family: var(--font-family, "Nunito Sans", sans-serif);
                color: var(--dark-text-color);
            }
            .qty-container {
                display: inline-flex;
                align-items: center;
                border-radius: var(--border-radius-normal);
                gap: var(--spacing-small);
            }
            button {
                background: var(--primary-button-background);
                color: var(--primary-button-text);
                border: none;
                width: 40px;
                height: 40px;
                font-size: 1.25rem;
                cursor: pointer;
                transition: var(--transition-normal);
                display: flex;
                align-items: center;
                justify-content: center;
            }
            button:hover {
                background: var(--primary-button-hover-background);
            }
            button:focus {
                outline: 2px solid var(--focus-color);
                outline-offset: 2px;
            }
            button:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }
            input {
                width: 60px;
                text-align: center;
                border: none;
                outline: none;
                font-size: 1rem;
                background: transparent;
                height: 100%;
                border-radius: var(--border-radius-normal);
                border: 1px solid var(--border-color);
                color: var(--dark-text-color);
                box-shadow: var(--shadow-1-soft);

                padding: 0 8px;
                /* Remove native spin buttons */
                -moz-appearance: textfield;
            }
            input::-webkit-outer-spin-button,
            input::-webkit-inner-spin-button {
                -webkit-appearance: none;
                margin: 0;
            }
            input:focus {
                outline: 2px solid var(--focus-color);
                outline-offset: 2px;
            }
        `
    ];

    _increment() {
        const newValue = this.value + 1;
        if (newValue <= this.max) {
            this.value = newValue;
            this._dispatchChange();
        }
    }

    _decrement() {
        const newValue = this.value - 1;
        if (newValue >= this.min) {
            this.value = newValue;
            this._dispatchChange();
        }
    }

    _handleInput(e) {
        const newValue = parseInt(e.target.value, 10);
        if (!isNaN(newValue)) {
            if (newValue < this.min) {
                this.value = this.min;
            } else if (newValue > this.max) {
                this.value = this.max;
            } else {
                this.value = newValue;
            }
            this._dispatchChange();
        } else {
            e.target.value = this.value;
        }
    }

    _dispatchChange() {
        this.dispatchEvent(new CustomEvent('change', {
            detail: { value: this.value },
            bubbles: true,
            composed: true
        }));
    }

    render() {
        return html`
            <div class="qty-container">
                <button
                        @click=${this._decrement}
                        aria-label="Decrease quantity"
                        ?disabled=${this.value <= this.min}
                >
                    &minus;
                </button>
                <input
                        type="number"
                        .value=${this.value}
                        @input=${this._handleInput}
                        aria-label="Quantity"
                        min="${this.min}"
                        max="${this.max}"
                />
                <button
                        @click=${this._increment}
                        aria-label="Increase quantity"
                        ?disabled=${this.value >= this.max}
                >
                    +
                </button>
            </div>
        `;
    }
}

customElements.define('qty-input', QtyInput);
