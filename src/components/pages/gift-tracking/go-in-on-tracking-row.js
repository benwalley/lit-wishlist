import {LitElement, html, css} from 'lit';
import '../../../svg/arrow-long.js';
import '../../../svg/delete.js';
import '../../../svg/group.js';
import '../../../svg/cart.js';
import '../../global/custom-tooltip.js';
import '../../global/custom-modal.js';
import '../account/avatar.js';
import {observeState} from "lit-element-state";
import {showConfirmation} from "../../global/custom-confirm/confirm-helper.js";
import {deleteGoInOn} from "../../../helpers/api/gifts.js";
import {messagesState} from "../../../state/messagesStore.js";
import {triggerUpdateItem} from "../../../events/eventListeners.js";
import {triggerProposalModal} from "../../../events/eventListeners.js";
import modalSections from '../../../css/modal-sections.js';

export class GoInOnTrackingRow extends observeState(LitElement) {
    static properties = {
        item: {type: Object},
        itemIndex: {type: Number},
        lastItem: {type: Boolean},
        showPeopleModal: {type: Boolean, state: true},
        alreadyGotten: {type: Boolean},
    };

    static get styles() {
        return [
            modalSections,
            css`
                :host {
                    display: contents;
                }
                
                .table-row {
                    display: grid;
                    grid-template-columns: var(--go-in-on-tracking-columns, 1fr 300px 40px 40px 40px);
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
                
                .item-name {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    font-size: var(--font-size-small);
                    font-weight: 500;
                    border-left: 2px solid var(--info-yellow);
                }
                
                .people-count {
                    color: var(--medium-text-color);
                    font-size: var(--font-size-small);
                    text-align: center;
                    cursor: pointer;
                    transition: var(--transition-200);
                    
                    &:hover:not(.zero) {
                        color: var(--blue-normal);
                        background: var(--blue-light);
                    }
                    
                }
                
                .people-list {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-small);
                }
                
                .person-item {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-small);
                    padding: var(--spacing-x-small);
                    border-radius: var(--border-radius-small);
                    
                    &:hover {
                        background: var(--background-light);
                    }
                }
                
                .go-in-on-indicator {
                    color: var(--info-yellow);
                    padding-right: var(--spacing-x-small);
                }
                
                .already-gotten-indicator {
                    font-size: var(--font-size-x-small);
                    color: var(--medium-text-color);
                    background: var(--background-light);
                    padding: var(--spacing-x-small) var(--spacing-small);
                    border-radius: var(--border-radius-small);
                    margin-left: var(--spacing-small);
                    font-weight: 500;
                }
                
                .person-name {
                    font-weight: 500;
                }
                
                .action-buttons {
                    display: flex;
                    gap: var(--spacing-x-small);
                    justify-content: center;
                    align-items: center;
                }
                
                .action-button {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: var(--transition-200);
                    border: none;
                    background: transparent;
                    cursor: pointer;
                    color: var(--medium-text-color);
                    
                    &:hover {
                        background: var(--background-light);
                    }
                }

                .delete-button {
                    color: var(--delete-red);
                }
                
                .delete-button:hover {
                    color: var(--delete-red);
                    background: var(--delete-red-light);
                }
                
                .proposal-button.has-proposal {
                    color: var(--blue-normal);
                }
                
                .proposal-button:hover {
                    color: var(--blue-normal);
                    background: var(--blue-light);
                }
                
                .view-link {
                    display: flex;
                    justify-content: center;
                    align-items: center;
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
                
                cart-icon {
                    color: var(--green-normal);
                    padding: 0 var(--spacing-x-small);
                    border-left: 1px solid var(--border-color);
                }
                
                @media (max-width: 768px) {
                    .table-row {
                        grid-template-columns: 1fr 200px 32px 32px 32px;
                    }
                    
                    .people-count {
                        font-size: var(--font-size-x-small);
                    }
                    
                    .action-button {
                        width: 28px;
                        height: 28px;
                    }
                }
            `
        ];
    }

    constructor() {
        super();
        this.itemIndex = 0;
        this.lastItem = false;
        this.showPeopleModal = false;
    }

    render() {
        if (!this.item) return html``;

        return html`
            <div class="table-row">
                <div class="item-name cell padded">
                    <group-icon class="go-in-on-indicator"></group-icon>
                    <custom-tooltip>You want to go in on this</custom-tooltip>
                    ${this.alreadyGotten ? html`
                        <cart-icon></cart-icon>
                        <custom-tooltip>You're getting this</custom-tooltip>
                    ` : ''}
                    ${this.item.item?.name || '--'}
                </div>
                
                <div class="people-count cell padded ${this._getPeopleCount() === 0 ? 'zero' : ''}" @click=${this._handleShowPeople}>
                    ${this._renderPeopleCount()}
                </div>
                
                <div class="cell">
                    <button 
                        class="action-button proposal-button ${this.item.proposals?.length ? 'has-proposal' : ''}" 
                        @click=${this._handleCreateProposal}
                        aria-label="Create proposal"
                    >
                        <group-icon></group-icon>
                    </button>
                    ${this.item.proposals?.length ? html`
                        <custom-tooltip>You already have ${this.item.proposals?.length} proposal${this.item.proposals?.length > 1 ? 's' : ''} for this item. Create another?</custom-tooltip>
                    ` : html`
                        <custom-tooltip>Create proposal</custom-tooltip>
                    `}
                </div>

                <div class="cell">
                    <button
                            class="action-button delete-button"
                            @click=${this._handleDelete}
                            aria-label="Remove from go-in-on tracking"
                    >
                        <delete-icon></delete-icon>
                    </button>
                    <custom-tooltip>Mark as don't want to go in on.</custom-tooltip>
                </div>
                
                <div class="view-link cell">
                    <a href="/item/${this.item.itemId}" aria-label="View item details" class="button icon-button text-blue view-details-button">
                        <arrow-long-icon></arrow-long-icon>
                    </a>
                </div>
            </div>
            
            <custom-modal 
                ?isOpen=${this.showPeopleModal}
                @modal-closed=${this._closePeopleModal}
                maxWidth="400px"
                noPadding
            >
                <div class="modal-container">
                    <div class="modal-header">
                        <h2>${this._getPeopleCount()} ${this._getPeopleCount() < 2 ? 'person wants' : 'people want'} to go in on this</h2>
                    </div>
                    <div class="modal-content">
                        <div class="people-list">
                            ${this.item.otherPeople?.map(person => html`
                                <div class="person-item">
                                    <custom-avatar 
                                        username="${person.username || person.name || ''}"
                                        imageId="${person.imageId || 0}"
                                        size="40"
                                        round="true"
                                        shadow
                                    ></custom-avatar>
                                    <span class="person-name">${person.username || person.name || 'Unknown'}</span>
                                </div>
                            `) || ''}
                        </div>
                    </div>
                </div>
            </custom-modal>
        `;
    }

    _getPeopleCount() {
        return this.item.otherPeople?.length || 0;

    }

    _renderPeopleCount() {
        const count = this._getPeopleCount();
        if (count === 0) {
            return 'No other people interested';
        } else if (count === 1) {
            return '1 other person wants to go in on this';
        } else {
            return `${count} other people want to go in on this`;
        }
    }

    _renderUrlButton() {

        return html`
            <a 
                href="/item/${this.item.itemId}"
                class="action-button url-button" 
                aria-label="Go to item URL"
            >
                <arrow-long-icon></arrow-long-icon>
            </a>
        `;
    }

    async _handleDelete() {
        try {
            const confirmed = await showConfirmation({
                heading: 'Remove from Go-In-On Tracking',
                message: `Are you sure you want to mark that you don't want to go in on this item?`,
                submessage: 'This will remove it from your list of items you want to contribute to.',
                confirmLabel: 'Remove',
                cancelLabel: 'Cancel'
            });

            if (confirmed) {
                const response = await deleteGoInOn(this.item.itemId);

                if (response.success) {
                    messagesState.addMessage('Item removed from go-in-on tracking');
                    triggerUpdateItem();
                } else {
                    messagesState.addMessage(response.error || 'Failed to remove item from go-in-on tracking', 'error');
                }
            }
        } catch (error) {
            console.error('Error deleting go-in-on item:', error);
            messagesState.addMessage('An error occurred while removing the item from go-in-on tracking', 'error');
        }
    }

    _handleCreateProposal() {
        triggerProposalModal(this.item?.item);
    }

    _handleShowPeople() {
        if (this.item.otherPeople?.length > 0) {
            this.showPeopleModal = true;
        }
    }

    _closePeopleModal() {
        this.showPeopleModal = false;
    }
}

customElements.define('go-in-on-tracking-row', GoInOnTrackingRow);
