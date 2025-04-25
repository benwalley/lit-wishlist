import { LitElement, html, css } from 'lit';
import buttonStyles from "../../css/buttons.js";
import '../../svg/calendar.js';
import './custom-input.js';

export class DateSelector extends LitElement {
    static properties = {
        value: { type: String },
        label: { type: String },
        placeholder: { type: String },
        minDate: { type: String },
        maxDate: { type: String },
        required: { type: Boolean },
    };

    constructor() {
        super();
        this.value = '';
        this.label = '';
        this.placeholder = 'Select a date';
        this.minDate = '';
        this.maxDate = '';
        this.required = false;
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    display: block;
                    position: relative;
                }
                
                .date-wrapper {
                    position: relative;
                }
                
                input[type='date'] {
                    display: block;
                    width: 100%;
                    padding: var(--spacing-small);
                    font-size: var(--font-size-normal);
                    border: 1px solid var(--border-color);
                    border-radius: var(--border-radius-normal);
                    box-shadow: var(--shadow-1-soft);
                    transition: border-color 0.3s ease, box-shadow 0.3s ease;
                    background: var(--input-background-color, white);
                    color: var(--text-color-dark);
                    box-sizing: border-box;
                    appearance: none;
                    -webkit-appearance: none;
                }
                
                input[type='date']::-webkit-calendar-picker-indicator {
                    opacity: 0;
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    top: 0;
                    left: 0;
                    cursor: pointer;
                }
                
                input[type='date']:focus {
                    border-color: var(--primary-color);
                    box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb, 33, 150, 243), 0.2);
                    outline: none;
                }
                
                .icon {
                    position: absolute;
                    right: 10px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--text-color-medium);
                    pointer-events: none;
                    width: 18px;
                    height: 18px;
                }
                
                label {
                    display: block;
                    font-size: var(--font-size-small);
                    color: var(--text-color-dark);
                    margin-bottom: 4px;
                    font-weight: 500;
                }
                
                .date-display {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    padding: var(--spacing-small);
                    pointer-events: none;
                    display: flex;
                    align-items: center;
                }
                
                /* Improve mobile experience */
                @media (max-width: 768px) {
                    input[type='date'] {
                        padding: 10px var(--spacing-small);
                    }
                }
            `
        ];
    }

    render() {
        return html`
            <div>
                ${this.label ? html`<label for="date">${this.label}</label>` : ''}
                <div class="date-wrapper">
                    <input
                        id="date"
                        type="date"
                        .value="${this.value}"
                        .min="${this.minDate}"
                        .max="${this.maxDate}"
                        ?required="${this.required}"
                        @change="${this._onDateChange}"
                    />
                    <calendar-icon class="icon"></calendar-icon>
                </div>
            </div>
        `;
    }

    _onDateChange(event) {
        this.value = event.target.value;
        this.dispatchEvent(
            new CustomEvent('date-changed', {
                detail: { value: this.value },
                bubbles: true,
                composed: true,
            })
        );
    }
    
    /**
     * Returns the selected date as a Date object
     */
    getDateObject() {
        return this.value ? new Date(this.value) : null;
    }
    
    /**
     * Sets the date from a Date object
     */
    setDateFromObject(dateObj) {
        if (dateObj instanceof Date) {
            this.value = dateObj.toISOString().split('T')[0];
        }
    }
    
    /**
     * Programmatically focuses the date input
     */
    focus() {
        const input = this.shadowRoot.querySelector('#date');
        if (input) {
            input.focus();
        }
    }
    
    /**
     * Validates the date input
     */
    validate() {
        const input = this.shadowRoot.querySelector('#date');
        if (!input) return true;
        
        return input.checkValidity();
    }
}

customElements.define('date-selector', DateSelector);