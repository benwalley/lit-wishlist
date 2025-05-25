import {LitElement, html, css} from 'lit';
import '../../../svg/plus.js';
import '../../../svg/minus.js';
import '../../../svg/delete.js';

export class TrackingQtyInput extends LitElement {
      static get styles() {
        return css`
            :host {
                display: block;
                width: 100%;
                height: 100%;
            }
            
            .qty-container {
                display: flex;
                align-items: center;
                width: 100%;
                height: 100%;
                background: transparent;
                transition: background-color 0.2s;
            }
            
            .qty-container.zero {
                background-color: #ffebee;
            }
            
            .qty-container.changed {
                outline: 2px solid var(--changed-outline-color, #7bd0b6);
                outline-width: 6px;
                outline-offset: -2px;
            }
            
            .qty-button {
                background: transparent;
                border: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 2px;
                color: var(--text-color-dark);
                transition: color 0.2s;
                flex-shrink: 0;
            }
            
            .qty-button:hover {
                color: var(--purple-normal);
            }
            
            .qty-button.red {
                color: var(--delete-red);
            }
            
            .qty-button.red:hover {
                color: var(--delete-red-darker);
            }
            
            .qty-button:disabled {
                cursor: not-allowed;
                opacity: 0.3;
            }
            
            .qty-button svg {
                width: 14px;
                height: 14px;
            }
            
            .qty-display {
                flex: 1;
                text-align: center;
                font-size: 0.9em;
                color: var(--text-color-dark);
                min-width: 20px;
            }
        `;
    }

    static properties = {
        data: {type: Object},
        value: {type: Number},
        loading: {type: Boolean},
        originalValue: {type: Number, state: true},
        hasChanged: {type: Boolean, state: true}
    };

    constructor() {
        super();
        this.data = {};
        this.value = 0;
        this.loading = true;
        this.originalValue = 0;
        this.hasChanged = false;
    }

    connectedCallback() {
        super.connectedCallback();
    }

    updated(changedProperties) {
        if (changedProperties.has('data') && this.data) {
            if (this.data.type === 'proposal') {
                this.value = 1;
                this.originalValue = 1;
                this.loading = false;
                this.hasChanged = false;
            } else if (this.data.numberGetting !== undefined) {
                this.value = this.data.numberGetting;
                this.originalValue = this.data.numberGetting;
                this.loading = false;
                this.hasChanged = false;
            }
        }

        if (changedProperties.has('value')) {
            this.hasChanged = this.value !== this.originalValue;
        }
    }

    handlePlus() {
        this.value = Math.max(0, this.value + 1);
    }

    handleMinus() {
        this.value = Math.max(0, this.value - 1);
    }

    render() {
        const isZero = this.value === 0;
        const isOne = this.value === 1;
        const isProposal = this.data?.type === 'proposal';
        const containerClass = `qty-container ${isZero ? 'zero' : ''} ${this.hasChanged ? 'changed' : ''}`;
        const minusButtonClass = `qty-button ${isOne ? 'red' : ''}`;

        return html`
            <div class="${containerClass}">
                <button 
                    class="${minusButtonClass}"
                    @click=${this.handleMinus}
                    ?disabled=${this.loading || this.value <= 0 || isProposal}
                >
                    ${isOne ? html`<delete-icon></delete-icon>` : html`<minus-icon></minus-icon>`}
                </button>
                <div class="qty-display">${this.value}</div>
                <button 
                    class="qty-button"
                    @click=${this.handlePlus}
                    ?disabled=${this.loading || isProposal}
                >
                    <plus-icon></plus-icon>
                </button>
            </div>
        `;
    }
}

customElements.define('tracking-qty-input', TrackingQtyInput);
