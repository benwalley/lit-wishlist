import {LitElement, html, css} from 'lit';
import '../global/date-selector.js';
import '../global/custom-tooltip.js';
import '../global/custom-toggle.js';
import buttonStyles from '../../css/buttons.js';

class DeleteAutomaticallySelector extends LitElement {
    static properties = {
        deleteEnabled: { type: Boolean },
        deleteDate: { type: String },
    };

    static styles = [
        buttonStyles,
        css`
            :host {
                display: block;
                font-family: var(--font-family);
            }
            
            .container {
                background-color: var(--background-dark);
                border-radius: var(--border-radius-normal);
                padding: var(--spacing-normal);
                box-shadow: var(--shadow-1-soft);
            }
            
            .header {
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            
            h3 {
                margin: 0;
                font-size: var(--font-size-normal);
                font-weight: 600;
                color: var(--text-color-dark);
            }
            
            .description {
                font-size: var(--font-size-x-small);
                text-align: left;
                color: var(--text-color-medium-dark);
            }
            
            .date-selection {
                margin-top: var(--spacing-medium, 16px);
                display: flex;
                flex-direction: column;
                gap: var(--spacing-small, 8px);
            }
            
            custom-tooltip {
                margin-left: var(--spacing-small, 8px);
            }
            
            .tooltip-content {
                max-width: 250px;
                line-height: 1.4;
                text-align: left;
            }
        `
    ];

    constructor() {
        super();
        this.deleteEnabled = false;
        this.deleteDate = this.calculateDefaultDate();
    }

    reset() {
        this.deleteEnabled = false;
        this.deleteDate = this.calculateDefaultDate();
    }

    calculateDefaultDate() {
        const today = new Date();
        // Default to one year from today
        const nextYear = new Date(today.setFullYear(today.getFullYear() + 1));
        return nextYear.toISOString().split('T')[0];
    }

    render() {
        return html`
            <div class="container">
                <div class="header">
                    <div style="display: flex; align-items: center;">
                        <h3>Delete automatically</h3>
                        <custom-tooltip>
                            <div class="tooltip-content">
                                You will always be able to see your deleted items on your account page, under "Deleted Items".
                            </div>
                        </custom-tooltip>
                    </div>
                    <custom-toggle 
                        ?checked=${this.deleteEnabled} 
                        @change=${this._toggleDeleteEnabled}
                    ></custom-toggle>
                </div>
                
                <div class="description">
                    Optionally, set a date when this item should be automatically removed from your list.
                </div>
                
                ${this.deleteEnabled ? html`
                    <div class="date-selection">
                        <date-selector
                            .value=${this.deleteDate}
                            .minDate=${this._getMinDate()}
                            @date-changed=${this._onDateChanged}
                        ></date-selector>
                    </div>
                ` : ''}
            </div>
        `;
    }

    _getMinDate() {
        // Set minimum date to tomorrow
        const today = new Date();
        today.setDate(today.getDate() + 1);
        return today.toISOString().split('T')[0];
    }

    _toggleDeleteEnabled(e) {
        this.deleteEnabled = e.target.checked;
        this._dispatchChangeEvent();
    }

    _onDateChanged(e) {
        this.deleteDate = e.detail.value;
        this._dispatchChangeEvent();
    }

    _dispatchChangeEvent() {
        this.dispatchEvent(new CustomEvent('delete-settings-changed', {
            detail: {
                enabled: this.deleteEnabled,
                date: this.deleteDate
            },
            bubbles: true,
            composed: true
        }));
    }
}

customElements.define('delete-automatically-selector', DeleteAutomaticallySelector);
