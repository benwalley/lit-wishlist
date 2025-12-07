import {LitElement, html, css} from 'lit';

class MyTextarea extends LitElement {
    static get properties() {
        return {
            label: {type: String},
            placeholder: {type: String},
            value: {type: String, reflect: true},
            rows: {type: Number},
            required: {type: Boolean},
        };
    }

    constructor() {
        super();
        this.label = '';
        this.value = '';
        this.placeholder = '';
        this.rows = 4;
        this.required = false;
    }

    static get styles() {
        return css`
            :host {
                display: inline-block;
                font-family: var(--font-family);
                width: 100%;
            }

            .textarea-container {
                position: relative;
                font-size: 1rem;
                width: 100%;
                display: flex;
                flex-direction: column;
            }

            .textarea-wrapper {
                display: flex;
                align-items: stretch;
                position: relative;
                width: 100%;
                border: 2px solid var(--border-color);
                border-radius: var(--border-radius-normal);
                transition: border-color 0.2s ease;
            }

            .textarea-wrapper:focus-within {
                border-color: var(--focus-color);
                box-shadow: 0 0 2px 1px var(--focus-color);
            }

            .label {
                font-size: var(--font-size-x-small);
                margin-bottom: 8px;
            }

            textarea {
                flex: 1;
                border: none;
                background: transparent;
                color: var(--text-color-dark);
                padding: 10px;
                font-size: 1rem;
                outline: none;
                box-sizing: border-box;
                width: 100%;
                resize: vertical;
                font-family: var(--font-family);
                line-height: 1.5;
            }

            textarea::placeholder {
                color: var(--placeholder-color, gray);
            }

            label {
                font-size: 1rem;
            }
        `;
    }

    _renderLabel() {
        if (!this.label) return '';
        return html`
            <strong class="label">${this.label}</strong>
        `;
    }

    render() {
        return html`
            <div class="textarea-container">
                ${this._renderLabel()}
                <div class="textarea-wrapper">
                    <textarea
                        .value="${this.value}"
                        placeholder="${this.placeholder}"
                        rows="${this.rows}"
                        @input="${this._handleInput}"
                        @keydown="${this._handleKeydown}"
                        ?required="${this.required}"
                    ></textarea>
                </div>
            </div>
        `;
    }

    focus() {
        const textarea = this.shadowRoot.querySelector('textarea');
        textarea.focus();
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
        // Pass keydown events up to parent (for form handling)
        // Note: We don't prevent Enter key here as it's useful in textarea
    }

    /**
     * Custom validation method for the component.
     * Returns true if valid, false otherwise.
     */
    validate() {
        const textarea = this.renderRoot.querySelector('textarea');
        if (!textarea) return true;

        if (textarea.checkValidity) {
            const valid = textarea.checkValidity();
            if (!valid) {
                textarea.reportValidity();
            }
            return valid;
        }

        if (this.required && !this.value.trim()) {
            textarea.setCustomValidity('This field is required.');
            textarea.reportValidity();
            return false;
        } else {
            textarea.setCustomValidity('');
            return true;
        }
    }
}

customElements.define('custom-textarea', MyTextarea);
