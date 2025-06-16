import {LitElement, html, css} from 'lit';
import '../../../svg/ordered.js';
import '../../../svg/arrived.js';
import '../../../svg/wrapped.js';
import '../../../svg/given.js';
import '../../../svg/order.js';
import formStyles from '../../../css/forms.js'
import {customFetch} from '../../../helpers/fetchHelpers.js';
import {messagesState} from '../../../state/messagesStore.js';
import {statuses} from "./gift-giving-helpers.js";

export class TrackingStatus extends LitElement {
    static properties = {
        itemId: {type: String},
        status: {type: String},
        loading: {type: Boolean},
        originalStatus: {type: String, state: true},
        hasChanged: {type: Boolean, state: true}
    };

    constructor() {
        super();
        this.itemId = '';
        this.status = 'none';
        this.loading = false;
        this.originalStatus = 'none';
        this.hasChanged = false;
    }

    connectedCallback() {
        super.connectedCallback();
    }

    updated(changedProperties) {
        if (changedProperties.has('status')) {
            if (changedProperties.get('status') === undefined) {
                this.originalStatus = this.status || 'none';
            }
            this.hasChanged = this.status !== this.originalStatus;
        }
    }

    updateStatus(newStatus) {
        if (this.loading || !this.itemId) return;

        this.status = newStatus;
    }

    getStatusLabel(statusId) {
        const status = statuses.find(s => s.id === statusId);
        return status ? status.label : 'Unknown';
    }

    static get styles() {
        return [
            formStyles,
            css`
                :host {
                    display: block;
                    height: 100%;
                }
                
                .container {
                    display: grid;
                    height: 100%;
                    grid-template-columns: repeat(5, 1fr);
                    box-sizing: border-box;
                }
                
                .container.changed {
                    position: relative;
                    &:before {
                        position: absolute;
                        pointer-events: none;
                        content: '';
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        border: 2px solid var(--changed-outline-color);
                        z-index: 1;
                    }
                }

                .status-cell {
                    border: 0.5px solid var(--border-color);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: background-color 0.2s, color 0.2s;
                    position: relative;
                    color: var(--medium-text-color);
                }
                
                .status-cell:hover {
                    background-color: var(--grayscale-200);
                }
                
                .status-cell.selected {
                    background-color: var(--green-normal);
                    color: white;
                }
                
                .status-cell.completed {
                    background-color: var(--grayscale-200);
                    color: var(--green-normal);
                }
                
                .status-cell.original {
                    background-color: var(--green-light);
                    color: var(--green-normal);
                }
                
                .status-cell svg {
                    width: 18px;
                    height: 18px;
                }
            `
        ];
    }

    isSelected(statusId) {
        const currentStatus = this.status || 'none';
        return currentStatus === statusId;
    }

    isCompleted(statusId) {
        const currentIndex = statuses.findIndex(s => s.id === this.status);
        const statusIndex = statuses.findIndex(s => s.id === statusId);
        return statusIndex < currentIndex;
    }

    isOriginal(statusId) {
        return this.originalStatus === statusId && this.hasChanged;
    }

    renderIcon(iconName) {
        switch(iconName) {
            case 'order-icon':
                return html`<order-icon></order-icon>`;
            case 'ordered-icon':
                return html`<ordered-icon></ordered-icon>`;
            case 'arrived-icon':
                return html`<arrived-icon></arrived-icon>`;
            case 'wrapped-icon':
                return html`<wrapped-icon></wrapped-icon>`;
            case 'given-icon':
                return html`<given-icon></given-icon>`;
            default:
                return html``;
        }
    }

    renderStatusCell(status) {
        const isSelected = this.isSelected(status.id);
        const isCompleted = this.isCompleted(status.id);
        const isOriginal = this.isOriginal(status.id);

        let cellClass = '';
        if (isSelected) {
            cellClass = 'selected';
        } else if (isOriginal) {
            cellClass = 'original';
        } else if (isCompleted) {
            cellClass = 'completed';
        }

        return html`
            <div 
                class="status-cell ${cellClass}" 
                @click=${() => this.updateStatus(status.id)}
            >
                ${status.icon ? html`
                    ${this.renderIcon(status.icon)}
                    <custom-tooltip>
                        ${status.label}
                    </custom-tooltip>
                ` : ''}
                ${this.loading && isSelected ? html`
                    <div class="loading-overlay">
                        <span>...</span>
                    </div>
                ` : ''}
            </div>
        `;
    }

    render() {
        const containerClass = `container ${this.hasChanged ? 'changed' : ''}`;

        return html`
            <div class="${containerClass}">
                ${statuses.map(status => this.renderStatusCell(status))}
            </div>
        `;
    }
}

customElements.define('tracking-status', TrackingStatus);
