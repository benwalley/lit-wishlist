import { LitElement, html, css } from 'lit';
import '../../svg/eye.js';
import '../global/custom-tooltip.js'

class MyTextInput extends LitElement {
    static get properties() {
        return {
            label: { type: String },
            placeholder: {type: String},
            value: { type: String },
            type: { type: String },
            passwordVisible: { type: Boolean },
            floatingLabel: { type: Boolean },
        };
    }

    constructor() {
        super();
        this.label = '';
        this.value = '';
        this.placeholder = '';
        this.type = 'text';
        this.passwordVisible = false; // Boolean for visibility
        this.floatingLabel = false; // Default to non-floating labels
    }

    static get styles() {
        return css`
            :host {
                display: inline-block;
                font-family: sans-serif;
            }

            .input-container {
                position: relative;
                font-size: 1rem;
                width: 100%;
                display: flex;
                flex-direction: column;
            }

            input {
                width: 100%;
                border: 1px solid var(--border-color-light);
                border-radius: var(--border-radius-small);
                padding: 16px 10px;
                font-size: 1rem;
                outline: none;
                box-sizing: border-box;
                transition: border-color 0.2s ease;
            }

            input:focus {
                border-color: var(--focus-color);
                box-shadow: 0 0 2px 1px var(--focus-color);
            }

            label {
                margin-bottom: 8px;
                color: var(--text-color-dark);
                font-size: 1rem;
                transition: color 0.2s ease, transform 0.2s ease;
            }

            .floating-label {
                position: absolute;
                top: 50%;
                left: 10px;
                transform: translateY(-50%);
                background: none;
                padding: 0 0.25rem;
                pointer-events: none;
                color: var(--placeholder-color, gray);
                font-size: 1rem;
                transition: top 0.2s ease, transform 0.2s ease, font-size 0.2s ease;
            }

            input:focus ~ .floating-label,
            input:not(:placeholder-shown) ~ .floating-label {
                top: -0.6rem;
                font-size: var(--font-size-small);
                color: var(--focus-color);
            }

            .toggle-button {
                background: none;
                border: none;
                outline: none;
                cursor: pointer;
                padding: 0 8px;
                display: flex;
                align-items: center;
                position: absolute;
                right: 10px;
                bottom: 14px;
            }

            eye-icon {
                width: 24px;
                height: 24px;
                color: var(--placeholder-color, gray);
            }
        `;
    }

    _renderLabel() {
        if (!this.label) return '';
        if (this.floatingLabel) {
            return html`
            <label class="floating-label">${this.label}</label>
        `;
        }
        return html`
        <label>${this.label}</label>
    `;
    }

    _renderEyeIcon() {
        return this.type === 'password' || this.passwordVisible
            ? html`
            <button
                class="toggle-button"
                @click="${this._togglePasswordVisibility}"
                aria-label="Toggle password visibility"
            >
                <eye-icon .open="${this.passwordVisible}"></eye-icon>
            </button>
            <custom-tooltip>
                ${this.passwordVisible ? 'Hide Password' : 'Show Password'}
            </custom-tooltip>
        `
            : '';
    }


    _togglePasswordVisibility() {
        this.passwordVisible = !this.passwordVisible;
        this.type = this.passwordVisible ? 'text' : 'password';
    }

    render() {
        return html`
            <div class="input-container">
                ${this._renderLabel()}
                <input
                        type="${this.type}"
                        .value="${this.value}"
                        placeholder="${this.placeholder}"
                        @input="${this._handleInput}"
                />
                ${this._renderEyeIcon()}
            </div>

        `;
    }

    _handleInput(e) {
        this.value = e.target.value;
        // Optionally, dispatch an event so parent can track changes:
        // this.dispatchEvent(new CustomEvent('value-changed', {
        //   detail: { value: this.value }
        // }));
    }
}

customElements.define('custom-input', MyTextInput);
