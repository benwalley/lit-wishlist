import {LitElement, html, css} from 'lit';
import '../account/avatar.js';
import '../../global/custom-image.js';
import {getUserImageIdByUserId, getUsernameById} from "../../../helpers/generalHelpers.js";
import '../../../svg/edit.js';
import '../../../svg/delete.js';
import buttonStyles from '../../../css/buttons.js';
import {observeState} from "lit-element-state";

export class MoneyCard extends observeState(LitElement) {
    static properties = {
        record: {type: Object},
        checked: {type: Boolean}
    };

    constructor() {
        super();
        this.record = {};
        this.checked = false;
    }

    static styles = [
        buttonStyles,
        css`
            :host {
                display: block;
                position: relative;
            }

            .money-item {
                display: grid;
                gap: 0.5rem;
                grid-template-columns: 40px 1fr auto;
                background: var(--background-light);
                border-radius: var(--border-radius-normal);
                padding: 0.75rem;
                border: 1px solid var(--border-color);
                margin-top: -1px;
                transition: background-color 0.2s ease;
                position: relative;
                align-items: flex-end;
                box-shadow: var(--shadow-1-soft);
            }

            @media only screen and (min-width: 768px) {
                .money-item {
                    grid-template-columns: 40px 1fr auto 1fr auto 52px;
                }

            }
            
            .money-item:hover {
                background: var(--green-light);
            }

            .person-info {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            .person-name {
                font-weight: 500;
            }

            .money-amount {
                font-weight: 600;
                color: var(--primary-color);
                text-align: right;
            }

            .item-content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            .item-info {
                display: flex;
                flex-direction: column;
                width: 100%;
            }

            .item-name {
                font-weight: 500;
            }

            .money-note {
                grid-column: 1 / -1;
                font-style: italic;
                color: var(--text-color-medium-dark);
                padding: var(--spacing-x-small);
                border-radius: 4px;
                border-top: 1px solid var(--border-color);
            }

            .checkbox {
                display: flex;
                align-items: center;
                justify-content: center;
                align-self: flex-start;
                cursor: pointer;
            }

            .checkbox-icon {
                width: 20px;
                height: 20px;
                border: 2px solid var(--border-color);
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
            }

            .checkbox-icon:hover {
                border-color: var(--primary-color);
            }

            .checkbox-icon.checked {
                background: var(--primary-color);
                border-color: var(--primary-color);
                color: white;
            }

            .checkbox-icon.checked::before {
                content: "✓";
                font-size: 12px;
                font-weight: bold;
            }

            .money-actions {
                display: flex;
                gap: 0.25rem;
                grid-column-start: 3;
                grid-row: 1;
                justify-content: flex-end;
            }
            
            @media only screen and (min-width: 768px) {
                .money-actions {
                    grid-column-start: 6;
                }
            }

            .action-button {
                padding: 0.25rem;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                transition: background-color 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .edit-button {
                background: rgba(59, 130, 246, 0.1);
                color: rgb(59, 130, 246);
            }

            .edit-button:hover {
                background: rgba(59, 130, 246, 0.2);
            }

            .delete-button {
                background: rgba(239, 68, 68, 0.1);
                color: rgb(239, 68, 68);
            }

            .delete-button:hover {
                background: rgba(239, 68, 68, 0.2);
            }
            
            .for-row {
                grid-column: 1 / -1;
                display: flex;
                gap: var(--spacing-small);
            }
            
            .item {
                overflow: hidden;
                
                .item-name {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }
        `
    ];

    formatAmount(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    owedFromName() {
        if(this.record.owedFromId) {
            return getUsernameById(this.record.owedFromId)
        }
        return this.record.owedFromName;
    }

    owedFromImageId() {
        if(this.record.owedFromId) {
            return getUserImageIdByUserId(this.record.owedFromId)
        }
        return 0;
    }

    owedToName() {
        if(this.record.owedToId) {
            return getUsernameById(this.record.owedToId)
        }
        return this.record.owedToName;
    }

    owedToImageId() {
        if(this.record.owedToId) {
            return getUserImageIdByUserId(this.record.owedToId)
        }
        return 0;
    }

    toggleCheckbox() {
        this.checked = !this.checked;
        this.dispatchEvent(new CustomEvent('checkbox-changed', {
            detail: { checked: this.checked, record: this.record },
            bubbles: true,
            composed: true
        }));
    }

    handleEditClick(e) {
        e.stopPropagation();
        this.dispatchEvent(new CustomEvent('edit-money', {
            detail: { record: this.record },
            bubbles: true,
            composed: true
        }));
    }

    handleDeleteClick(e) {
        e.stopPropagation();
        this.dispatchEvent(new CustomEvent('delete-money', {
            detail: { record: this.record },
            bubbles: true,
            composed: true
        }));
    }

    render() {
        if (!this.record) {
            return html``;
        }

        return html`
            <div class="money-item" @click="${this.toggleCheckbox}">
                <div class="checkbox">
                    <div class="checkbox-icon ${this.checked ? 'checked' : ''}"></div>
                </div>
                <div class="from">
                    <div class="person-info">
                        <custom-avatar size="24"
                                       username="${this.owedFromName()}"
                                       imageId="${this.owedFromImageId()}"
                        ></custom-avatar>
                        <span class="person-name">${this.owedFromName()}</span>
                    </div>
                </div>
                <div class="owes-label">Owes</div>
                <div class="to">
                    <div class="person-info">
                        <custom-avatar size="24"
                                       username="${this.owedToName()}"
                                       imageId="${this.owedToImageId()}"
                        ></custom-avatar>
                        <span class="person-name">${this.owedToName()}</span>
                    </div>
                </div>
                <div class="amount">
                    <div class="money-amount">${this.formatAmount(this.record.amount)}</div>
                </div>
                ${this.record.itemData ? html`
                    <div class="for-row">
                        <div>For:</div>
                        <div class="item">
                            <div class="item-content">
                                <custom-image width="40" height="40" imageId="${this.record.itemData?.imageIds?.[0]}"></custom-image>
                                <div class="item-info">
                                    <div class="item-name">${this.record.itemData?.name}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                ` : ''}

                <div class="money-actions">
                    <button
                            class="action-button edit-button"
                            @click="${this.handleEditClick}"
                            title="Edit money record"
                    >
                        <edit-icon></edit-icon>
                    </button>
                    <button
                            class="action-button delete-button"
                            @click="${this.handleDeleteClick}"
                            title="Delete money record"
                    >
                        <delete-icon></delete-icon>
                    </button>
                </div>
                ${this.record.note ? html`
                    <div class="money-note">${this.record.note}</div>
                ` : ''}
            </div>
        `;
    }
}

customElements.define('money-card', MoneyCard);
