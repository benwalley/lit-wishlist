import {LitElement, html, css} from 'lit';
import '../../svg/calendar.js';

export class DueDatePicker extends LitElement {
    static properties = {
        dueDate: { type: Object, reflect: true },
        label: { type: String },
        required: { type: Boolean },
        fullWidth: { type: Boolean },
    };

    constructor() {
        super();
        this.dueDate = null;
        this.label = 'Due Date';
        this.required = false;
        this.fullWidth = true;
    }

    static get styles() {
        return css`
            :host {
                display: inline-block;
                font-family: var(--font-family);
                width: 100%;
            }

            .date-picker-container {
                position: relative;
                font-size: 1rem;
                width: 100%;
                display: flex;
                flex-direction: column;
            }

            .date-picker-wrapper {
                display: flex;
                align-items: center;
                position: relative;
                width: 100%;
                border: 1px solid var(--border-color);
                border-radius: var(--border-radius-small);
                background: var(--input-background-color);
                transition: border-color 0.2s ease;
            }

            .date-picker-wrapper:focus-within {
                border-color: var(--focus-color);
                box-shadow: 0 0 2px 1px var(--focus-color);
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
                cursor: pointer;
            }

            label {
                margin-bottom: 8px;
                font-size: var(--font-size-normal);
                font-weight: bold;
                display: block;
                color: var(--text-color-dark);
            }

            .calendar-icon {
                margin-right: 10px;
                color: var(--text-color-dark);
                display: flex;
                align-items: center;
            }

            .date-display {
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 100%;
            }

            .clear-button {
                background: none;
                border: none;
                color: var(--secondary-color);
                cursor: pointer;
                font-size: var(--font-size-small);
                padding: 0 10px;
                visibility: hidden;
                opacity: 0;
                transition: visibility 0.2s, opacity 0.2s;
            }

            .date-picker-wrapper:hover .clear-button {
                visibility: visible;
                opacity: 1;
            }

            .required-mark {
                color: var(--delete-red);
                margin-left: 4px;
            }
        `;
    }

    _handleDateChange(e) {
        const selectedDate = e.target.valueAsDate;
        this.dueDate = selectedDate;
        
        this.dispatchEvent(
            new CustomEvent('date-changed', {
                detail: { dueDate: this.dueDate },
                bubbles: true,
                composed: true
            })
        );
    }

    _clearDate(e) {
        e.stopPropagation();
        this.dueDate = null;
        
        this.dispatchEvent(
            new CustomEvent('date-changed', {
                detail: { dueDate: null },
                bubbles: true,
                composed: true
            })
        );

        // Reset the input value
        const input = this.shadowRoot.querySelector('input');
        if (input) {
            input.value = '';
        }
    }

    _formatDisplayDate(date) {
        if (!date) return '';
        
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        
        return new Date(date).toLocaleDateString(undefined, options);
    }

    render() {
        return html`
            <div class="date-picker-container">
                ${this.label ? html`
                    <label>
                        ${this.label}
                        ${this.required ? html`<span class="required-mark">*</span>` : ''}
                    </label>
                ` : ''}
                
                <div class="date-picker-wrapper">
                    <div class="calendar-icon">
                        <calendar-icon></calendar-icon>
                    </div>
                    
                    <div class="date-display">
                        <input 
                            type="date"
                            .value=${this.dueDate ? this._formatDateForInput(this.dueDate) : ''}
                            @change=${this._handleDateChange}
                            ?required=${this.required}
                            placeholder="Select a due date"
                        />
                        
                        ${this.dueDate ? html`
                            <button 
                                class="clear-button" 
                                @click=${this._clearDate}
                                title="Clear date"
                            >
                                ✕
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    _formatDateForInput(date) {
        if (!date) return '';
        
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
    }

    validate() {
        const input = this.renderRoot.querySelector('input');
        if (!input) return true;

        const valid = input.checkValidity();
        if (!valid) {
            input.reportValidity();
        }
        return valid;
    }
}

customElements.define('due-date-picker', DueDatePicker);