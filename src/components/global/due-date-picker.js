import { LitElement, html, css } from 'lit';
import buttonStyles from "../../css/buttons";
import '../../svg/calendar.js'

export class CustomElement extends LitElement {
    static properties = {
        value: { type: String },
    };

    constructor() {
        super();
        this.value = '';
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    display: flex;
                    flex-direction: column;
                    position: relative;
                    margin-right: auto;
                }
                label {
                    display: block;
                    font-size: var(--font-size-small);
                    color: var(--text-color-dark);
                }
                input[type='date'] {
                    padding: var(--spacing-small);
                    font-size: var(--font-size-normal);
                    border: 1px solid var(--border-color);
                    border-radius: var(--border-radius-normal);
                    box-shadow: var(--shadow-1-soft);
                    transition: border-color 0.3s ease;
                    background: transparent; /* Transparent background */
                    color: var(--text-color-dark); /* Text color using var(--text-color-dark) */
                }
                input[type='date']:focus {
                    border-color: var(--primary-color);
                }
                
                .icon {
                    position: absolute;
                    right: 10px;
                    bottom: 10px;
                    font-size: var(--font-size-large);
                    pointer-events: none;
                }
            `
        ];
    }

    render() {
        return html`
            <input
                    id="datePicker"
                    type="date"
                    .value="${this.value}"
                    @change="${this._onDateChange}"
            />
            <calendar-icon class="icon"></calendar-icon>
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
}

customElements.define('due-date-picker', CustomElement);
