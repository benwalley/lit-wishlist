import {LitElement, html, css} from 'lit';
import {currencyHelper} from "../../../helpers.js";
import '../../../svg/arrow-long.js';
import '../../../svg/check.js';
import '../../global/custom-image.js';
import '../../global/custom-tooltip.js';
import '../../global/contributor-stack.js';
import './tracking-status.js';
import './tracking-qty-input.js';
import './tracking-amount-input.js';
import {observeState} from "lit-element-state";
import {userState} from "../../../state/userStore.js";
import  "./giving-tracking.js";

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

    constructor() {
        super();
        this.itemIndex = 0;
        this.lastItem = false;
    }

    render() {
        if (!this.item) return html``;

        return html`
            <div class="table-row">
                
                <div class="item-name cell padded">${this.item.item?.name || '--'}</div>
                <div class="contributors cell">
                    <giving-tracking .givingData=${this.item}
                    ></giving-tracking>
                </div>
                <tracking-status 
                    class="cell" 
                    itemId="${this.item.id}" 
                    status="${this.item.status || 'none'}"
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
                    <a href="/item/${this.item.id}" aria-label="View item details" class="button icon-button text-blue view-details-button">
                        <arrow-long-icon></arrow-long-icon>
                    </a>
                </div>
            </div>
        `;
    }
}

customElements.define('gift-tracking-row', GiftTrackingRow);
