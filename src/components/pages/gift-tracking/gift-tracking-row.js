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
import '../account/avatar.js';
import {customFetch} from '../../../helpers/fetchHelpers.js';
import {messagesState} from '../../../state/messagesStore.js';
import {getUserImageIdByUserId, getUsernameById} from "../../../helpers/generalHelpers.js";
import {observeState} from "lit-element-state";

export class GiftTrackingRow extends observeState(LitElement) {
    static properties = {
        item: {type: Object},
        compact: {type: Boolean, reflect: true},
        savingChanges: {type: Boolean},
        contributeAmount: {type: Number},
        numberGetting: {type: Number},
        showSaveButton: {type: Boolean},
        originalContributeAmount: {type: Number},
        originalNumberGetting: {type: Number},
        showUsername: {type: Boolean},
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
                
                .username.cell {
                    border-bottom: none;
                    border-top: none;
                   
                    
                    a {
                        display: flex;
                        flex-direction: row;
                        gap: 5px;
                        align-items: center;
                        color: var(--text-color-dark);
                        text-decoration: none;
                    }
                    
                    &.top-border {
                        border-top: 0.5px solid var(--grayscale-300);
                    }
                    
                    &.bottom-border {
                        border-bottom: 0.5px solid var(--grayscale-300);
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
                    font-weight: bold;
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
                
                .status-badge:not(.contributing):not(.getting) {
                    background-color: var(--color-background-tertiary);
                    color: var(--color-text-secondary);
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
                        grid-template-columns: 40px auto 3fr 1fr 40px;
                    }
                    
                    .list-cell, 
                    .amount-cell {
                        display: none;
                    }
                }
            `
        ];
    }

    constructor() {
        super();
        this.savingChanges = false;
        this.contributeAmount = 0;
        this.numberGetting = 0;
        this.showSaveButton = false;
        this.originalContributeAmount = 0;
        this.originalNumberGetting = 0;
        this.showUsername = true;
        this.itemIndex = 0;
        this.lastItem = false;
    }

    // We no longer need the global event listeners since we're updating in-place
    connectedCallback() {
        super.connectedCallback();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
    }

    updateIfDifferent() {
        const hasContributeAmountChanged = parseFloat(this.contributeAmount) !== parseFloat(this.originalContributeAmount);
        const hasNumberGettingChanged = parseFloat(this.numberGetting) !== parseFloat(this.originalNumberGetting || 0);

        this.showSaveButton = hasContributeAmountChanged || hasNumberGettingChanged;
    }

    handleContributeAmountChange(e) {
        this.contributeAmount = Number(e.detail.value);
        this.updateIfDifferent();
    }

    handleNumberGettingChange(e) {
        this.numberGetting = Number(e.detail.value);
        this.updateIfDifferent();
    }

    updated(changedProperties) {
        if (changedProperties.has('item') && this.item) {
            const contributors = this.item.contributors || [];
            const contributor = contributors.length > 0 ? contributors[0] : {};

            // Set contribution amount
            if (contributor.contributeAmount !== undefined) {
                this.contributeAmount = contributor.contributeAmount;
                this.originalContributeAmount = contributor.contributeAmount;
            } else {
                this.contributeAmount = 0;
                this.originalContributeAmount = 0;
            }

            // Set quantity getting
            if (contributor.numberGetting !== undefined) {
                this.numberGetting = contributor.numberGetting;
                this.originalNumberGetting = contributor.numberGetting;
            } else {
                this.numberGetting = 0;
                this.originalNumberGetting = 0;
            }
        }
    }

    render() {
        if (!this.item) return html``;

        const contributors = this.item.contributors || [];
        const listId = this.item.lists && this.item.lists.length > 0 ? this.item.lists[0] : '';

        const contributor = contributors.length > 0 ? contributors[0] : {};

        return html`
            <div class="table-row">
                
                <div class="username cell padded ${this.showUsername ? 'top-border' : ''} ${this.lastItem ? 'bottom-border' : ''}">
                    ${this.showUsername ? html`
                        <a href="/user/${this.item?.itemData?.createdById}">
                            <custom-avatar
                                    size="16"
                                    username="${getUsernameById(this.item?.itemData?.createdById)}"
                                    imageId="${getUserImageIdByUserId(this.item?.itemData?.createdById)}"
                            ></custom-avatar>
                            <div>${getUsernameById(this.item?.itemData?.createdById)}</div>
                        </a>
                    ` : ''}
                </div>
                <div class="item-name cell padded">${this.item.itemData?.name || '--'}</div>
                <tracking-status class=" cell" itemId="${this.item.id}"></tracking-status>
                <div class="amount-cell price-display cell">
                    <tracking-qty-input
                        .value=${this.numberGetting || 0}
                        @qty-changed=${this.handleNumberGettingChange}
                    ></tracking-qty-input>
                </div>
                <div class="amount-cell price-display cell">
                    <tracking-amount-input
                        .value=${this.contributeAmount || 0}
                        @amount-changed=${this.handleContributeAmountChange}
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
