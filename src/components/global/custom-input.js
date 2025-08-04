import {LitElement, html, css} from 'lit';
import '../../svg/eye.js';
import '../../svg/dollar.js';
import '../../svg/search.js';
import '../global/custom-tooltip.js';

class MyTextInput extends LitElement {
    static get properties() {
        return {
            label: {type: String},
            size: {type: String},
            placeholder: {type: String},
            value: {type: String, reflect: true},
            type: {type: String},
            passwordVisible: {type: Boolean},
            floatingLabel: {type: Boolean},
            fullWidth: {type: Boolean},
            required: {type: Boolean},  // New required property
            dollarIcon: {type: Boolean},
            min: {type: String},
            max: {type: String},
        };
    }

    constructor() {
        super();
        this.label = '';
        this.size = 'normal';
        this.value = '';
        this.placeholder = '';
        this.type = 'text';
        this.passwordVisible = false;
        this.floatingLabel = false;
        this.fullWidth = true;
        this.required = false;  // Default false
        this.dollarIcon = false;
        this.min = '';
        this.max = '';
    }

    static get styles() {
        return css`
            :host {
                display: inline-block;
                font-family: var(--font-family);
                width: 100%;
            }

            .input-container {
                position: relative;
                font-size: 1rem;
                width: 100%;
                display: flex;
                flex-direction: column;
            }

            .input-wrapper {
                display: flex;
                align-items: center;
                position: relative;
                width: 100%;
                border: 2px solid var(--border-color);
                border-radius: var(--border-radius-normal);
                //background: var(--input-background-color);
                transition: border-color 0.2s ease;
            }

            .input-wrapper:focus-within {
                border-color: var(--focus-color);
                box-shadow: 0 0 2px 1px var(--focus-color);
            }

            .start-icon {
                margin: 0 8px;
                display: flex;
                align-items: center;
            }
            
            .label {
                font-size: var(--font-size-x-small);
            }

            input {
                flex: 1;
                border: none;
                background: transparent;
                color: var(--text-color-dark);
                padding: 10px;
                font-size: 1rem;
                outline: none;
                box-sizing: border-box;
                width: 100%;
            }

            input.small {
                padding: 6px;
            }

            input.large {
                padding: 16px 10px;
            }

            input::placeholder {
                color: var(--placeholder-color, gray);
            }

            label {
                margin-bottom: 8px;
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
                position: relative;
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
            <strong class="label">${this.label}</strong>
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
        <div class="input-wrapper">
            ${this.dollarIcon ? html`
                <div class="start-icon">
                    <dollar-icon></dollar-icon>
                </div>
            ` : ''}
          <input
            class="${this.size}"
            type="${this.type}"
            .value="${this.value}"
            placeholder="${this.placeholder}"
            @input="${this._handleInput}"
            @keydown="${this._handleKeydown}"
            ?required="${this.required}"
            min="${this.min || ''}"
            max="${this.max || ''}"
          />
          ${this._renderEyeIcon()}
        </div>
      </div>
    `;
    }

    focus() {
        const input = this.shadowRoot.querySelector('input');
        input.focus();
    }

    _handleInput(e) {
        this.value = e.target.value;
        this.dispatchEvent(
            new CustomEvent('value-changed', {
                detail: {value: this.value},
            })
        );
    }

    _handleKeydown(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            
            // Find the closest form element
            const form = this.closest('form');
            if (form) {
                // Use requestSubmit() for modern browsers with proper validation
                if (form.requestSubmit) {
                    form.requestSubmit();
                } else {
                    // Fallback for older browsers
                    form.submit();
                }
            }
        }
    }

    /**
     * Custom validation method for the component.
     * Returns true if valid, false otherwise.
     */
    validate() {
        const input = this.renderRoot.querySelector('input');
        if (!input) return true; // No input found, consider valid.

        // Use native validity check if available.
        if (input.checkValidity) {
            const valid = input.checkValidity();
            if (!valid) {
                input.reportValidity(); // Triggers browser UI for invalid state if available.
            }
            return valid;
        }

        // Fallback custom validation
        if (this.required && !this.value.trim()) {
            input.setCustomValidity('This field is required.');
            input.reportValidity();
            return false;
        } else {
            input.setCustomValidity('');
            return true;
        }
    }
}

customElements.define('custom-input', MyTextInput);
