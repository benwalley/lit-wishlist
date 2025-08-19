import {LitElement, html, css} from 'lit';
import '../global/custom-tooltip.js';
import '../global/custom-modal.js';
import buttonStyles from "../../css/buttons.js";

export class InfoTooltip extends LitElement {
    static properties = {
        tooltipText: {type: String},
        isModalOpen: {type: Boolean, state: true},
        buttonClasses: {type: String},
        removeDefaultClasses: {type: Boolean},
    };

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    display: inline-block;
                    position: relative;
                }
                
                button.icon-button.trigger-button {
                    padding: var(--spacing-x-small);
                }
            `
        ];
    }


    constructor() {
        super();
        this.tooltipText = '';
        this.isModalOpen = false;
        this.buttonClasses = '';
        this.removeDefaultClasses = false;
    }

    _handleTriggerClick() {
        this.isModalOpen = true;
    }

    _handleModalClose() {
        this.isModalOpen = false;
    }

    render() {
        const classes = `${!this.removeDefaultClasses ? 'icon-button' : ''} trigger-button ${this.buttonClasses}`;

        return html`
            <button 
                class="${classes}"
                @click=${this._handleTriggerClick}
                aria-label="${this.tooltipText || 'More information'}"
            >
                <slot name="icon"></slot>
            </button>
            
            ${this.tooltipText ? html`
                <custom-tooltip placement="top">
                    ${this.tooltipText}
                </custom-tooltip>
            ` : ''}
            
            <custom-modal 
                ?isOpen=${this.isModalOpen}
                @modal-closed=${this._handleModalClose}
                maxWidth="600px"
                noPadding
            >
                <slot name="modal-content"></slot>
            </custom-modal>
        `;
    }
}

customElements.define('info-tooltip', InfoTooltip);
