import {LitElement, html, css} from 'lit';
import {currencyHelper} from "../../../helpers.js";
import '../../../svg/arrow-long.js';
import '../../../svg/check.js';
import '../../../svg/delete.js';
import '../../global/custom-image.js';
import '../../global/custom-tooltip.js';
import '../../global/contributor-stack.js';
import './tracking-status.js';
import './tracking-qty-input.js';
import './tracking-amount-input.js';
import {observeState} from "lit-element-state";
import {userState} from "../../../state/userStore.js";
import  "./giving-tracking.js";
import {showConfirmation} from "../../global/custom-confirm/confirm-helper.js";
import {deleteGetting} from "../../../helpers/api/gifts.js";
import {messagesState} from "../../../state/messagesStore.js";
import {triggerUpdateItem} from "../../../events/eventListeners.js";

export class GiftTrackingRow extends observeState(LitElement) {
    static properties = {
        item: {type: Object},
        itemIndex: {type: Number},
        lastItem: {type: Boolean},
    };

    static get styles() {
        return [
            css`
                :host {
                    display: contents;
                }
                
                .table-row {
                    display: grid;
                    grid-template-columns: var(--gift-tracking-columns);
                    align-items: center;
                    transition: var(--transition-normal);
                    position: relative;
                }
                
                .cell {
                    border: 0.5px solid var(--grayscale-300);
                    box-sizing: border-box;
                    height: 100%;
                    line-height: 1;
                    
                    &.padded {
                        padding: var(--spacing-x-small);
                    }
                }
                
                
                .item-image {
                    width: 60px;
                    height: 60px;
                    border-radius: var(--border-radius-normal);
                    object-fit: cover;
                }
                
                .item-details {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-small);
                }
                
                .item-name {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                
                :host([compact]) .item-name {
                    font-size: 0.9em;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                
                .list-name {
                    font-size: 0.9em;
                }
                
                
                .status-badge {
                    display: inline-block;
                    padding: 4px 8px;
                    border-radius: 50px;
                    font-size: var(--font-size-x-small);
                    font-weight: bold;
                    text-align: center;
                    line-height: 1;
                }
                
                .getting {
                    background-color: var(--purple-normal);
                    color: var(--light-text-color);
                }
                
                .contributing {
                    background-color: var(--green-normal);
                    color: var(--light-text-color);
                    
                }
                
                .view-link {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                
                .price-display {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    text-align: right;
                }
                
                .contributors {
                    display: flex;
                    align-items: center;
                }
                
                .save-button {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    background-color: var(--green-normal);
                    color: white;
                    border: none;
                    border-radius: var(--border-radius-normal);
                    padding: 4px 8px;
                    font-size: 0.8rem;
                    cursor: pointer;
                    transition: var(--transition-normal);
                    margin-left: 10px;
                }
                
                .save-button:hover:not(:disabled) {
                    background-color: var(--green-darker);
                }
                
                .save-button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    
                    
                }
                
                .view-details-button {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: var(--transition-200);
                    
                    &:hover {
                        color: var(--purple-darker);
                        background: var(--purple-light);
                    }
                }
                
                .delete-button {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: var(--transition-200);
                    border: none;
                    background: transparent;
                    cursor: pointer;
                    color: var(--delete-red);
                    
                    &:hover {
                        color: var(--delete-red);
                        background: var(--delete-red-light);
                    }
                }
                
                /* Input styles moved to respective components */
                
                @media (max-width: 768px) {
                    .table-row {
                        grid-template-columns: 40px auto 3fr 1fr 1fr 40px;
                    }
                    
                    .list-cell, 
                    .amount-cell {
                        display: none;
                    }
                }
            `
        ];
    }

    _getParticipants() {
        if(this.item?.proposalId) {
            return [];
        }
        return [userState.userData?.id]
    }

    _getBuyerData() {
        const buyerData = this.item?.proposal?.proposalParticipants?.find(participant => participant.isBuying) || false;
        return buyerData;
    }

    async _handleDelete() {
        try {
            const confirmed = await showConfirmation({
                heading: 'Mark as Not Gotten',
                message: `Are you sure you want to mark this item as not gotten?`,
                submessage: 'This will remove it from your gift tracking.',
                confirmLabel: 'Mark as Not Gotten',
                cancelLabel: 'Cancel'
            });

            if (confirmed) {
                const response = await deleteGetting(this.item.id);

                if (response.success) {
                    messagesState.addMessage('Item marked as not gotten and removed from gift tracking');
                    triggerUpdateItem();
                } else {
                    messagesState.addMessage(response.error || 'Failed to remove item from gift tracking', 'error');
                }
            }
        } catch (error) {
            console.error('Error deleting getting item:', error);
            messagesState.addMessage('An error occurred while removing the item from gift tracking', 'error');
        }
    }

    constructor() {
        super();
        this.itemIndex = 0;
        this.lastItem = false;
    }

    render() {
        if (!this.item) return html``;

        return html`
            <div class="table-row">
                <div class="item-name cell padded">
                    <span>${this.item.item?.name || '--'}</span>
                </div>
                <div class="contributors cell">
                    <giving-tracking .givingData=${this.item}
                    ></giving-tracking>
                </div>
                <tracking-status 
                    class="cell" 
                    itemId="${this.item.id}" 
                    status="${this.item.status || 'none'}"
                    .buyerData="${this._getBuyerData()}"
                    .buyerStatus="${this.item.buyerStatus || 'none'}"
                ></tracking-status>
                <div class="amount-cell price-display cell">
                    <tracking-qty-input
                        .data=${this.item}
                    ></tracking-qty-input>
                </div>
                <div class="amount-cell price-display cell">
                    <tracking-amount-input
                        .data=${this.item}
                    ></tracking-amount-input>
                </div>
        
                <div class="view-link cell">
                    <button 
                        class="delete-button" 
                        @click=${this._handleDelete}
                        aria-label="Delete item from tracking"
                    >
                        <delete-icon></delete-icon>
                    </button>
                    <custom-tooltip>Mark as not gotten</custom-tooltip>
                </div>
                
                <div class="view-link cell">
                    <a href="/item/${this.item.itemId}" aria-label="View item details" class="button icon-button text-blue view-details-button">
                        <arrow-long-icon></arrow-long-icon>
                    </a>
                </div>
            </div>
        `;
    }
}

customElements.define('gift-tracking-row', GiftTrackingRow);
