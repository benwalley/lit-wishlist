import {LitElement, html, css} from 'lit';
import {observeState} from 'lit-element-state';
import {userState} from '../../../state/userStore.js';
import '../../pages/account/avatar.js';
import '../../../svg/cart.js';
import '../../../svg/admin.js';
import '../../../svg/check.js';
import '../../../svg/x.js';
import '../../global/custom-tooltip.js';
import buttonStyles from '../../../css/buttons.js';
import {currencyHelper} from "../../../helpers.js";
import {acceptProposal, declineProposal} from '../../../helpers/api/proposals.js';
import {messagesState} from '../../../state/messagesStore.js';
import {triggerUpdateItem, triggerUpdateNotifications} from '../../../events/eventListeners.js';
import {getUserImageIdByUserId, getUsernameById} from "../../../helpers/generalHelpers.js";

export class ProposalParticipants extends observeState(LitElement) {
    static properties = {
        participants: {type: Array},
        creatorId: {type: String},
        proposalId: {type: String},
        showTotal: {type: Boolean}
    };

    constructor() {
        super();
        this.participants = [];
        this.creatorId = '';
        this.proposalId = '';
        this.showTotal = true;
    }

    static get styles() {
        return [
            buttonStyles,
            css`
            :host {
                display: block;
                width: 100%;
            }

            .participants-section {
                display: flex;
                flex-direction: column;
                gap: var(--spacing-small);
            }

            .participants-title {
                font-weight: 600;
                font-size: var(--font-size-medium);
                color: var(--text-color-dark);
            }

            .participant {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                align-items: center;
                padding: var(--spacing-small);
                background: var(--modal-background-color);
                border-radius: var(--border-radius-small);
                border: 1px solid var(--border-color-extra-light);
                transition: var(--transition-150);
            }
            
            .participant-info {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                gap: var(--spacing-x-small);
            }

            .participant-name {
                color: var(--text-color-dark);
                font-weight: 500;
                font-size: var(--font-size-small);
            }

            .participant-status-badge {
                font-size: var(--font-size-x-x-small);
                font-weight: 600;
                padding: 2px 8px;
                border-radius: 12px;
                text-transform: uppercase;
                letter-spacing: 0.3px;
            }

            .status-pending {
                background: var(--info-yellow-light);
                color: var(--info-yellow);
            }

            .status-accepted {
                background: var(--green-light);
                color: var(--green-darker);
            }

            .status-declined,
            .status-rejected {
                background: var(--delete-red-light);
                color: var(--delete-red);
            }

            .participant-amount {
                font-weight: 600;
                color: var(--primary-color);
            }

            .participant-right-side {
                display: flex;
                align-items: center;
                gap: var(--spacing-small);
                margin-left: auto;
            }

            .total-amount {
                color: var(--text-color-dark);
                display: flex;
                flex-direction: row;
                justify-content: flex-end;
                font-weight: bold;
                gap: var(--spacing-x-small);
            }

            admin-icon {
                color: var(--primary-color);
                cursor: pointer;
                font-size: var(--font-size-medium);
            }

            .proposal-actions {
                display: flex;
                gap: var(--spacing-x-small);
                margin-left: var(--spacing-small);
            }

            .action-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 32px;
                height: 32px;
                border: none;
                border-radius: var(--border-radius-small);
                cursor: pointer;
                transition: var(--transition-150);
                font-size: var(--font-size-small);
            }
                
                .icon-button:hover {
                    box-shadow: var(--shadow-1-soft);
                    transform: translateY(-1px);
                    scale: 1;
                }

            .icon-button.accept-btn {
                font-size: var(--font-size-large);
            }

            .icon-button.reject-btn {
                font-size: var(--font-size-normal);
            }
                
                .buyer-chip {
                    border: 1px solid var(--green-normal);
                    color: var(--light-text-color);
                    display: flex;
                    gap: var(--spacing-x-small);
                    align-items: center;
                    justify-content: center;
                    padding: 3px 7px;
                    border-radius: 50px;
                    line-height: 1;
                    font-size: var(--font-size-x-small);
                    font-weight: 600;
                    cursor: pointer;
                    background-color: var(--green-normal);
                }
            `
        ];
    }

    _calculateTotal() {
        if (!this.participants || !Array.isArray(this.participants)) {
            return 0;
        }
        const total = this.participants.reduce((sum, participant) => {
            return sum + (participant.amountRequested || 0);
        }, 0);

        return currencyHelper(total);
    }

    async _handleAcceptProposal() {
        try {
            const response = await acceptProposal(this.proposalId);
            if (response.success) {
                messagesState.addMessage('Proposal accepted successfully');
                triggerUpdateItem();
                triggerUpdateNotifications();
            } else {
                messagesState.addMessage(response.error || 'Failed to accept proposal', 'error');
            }
        } catch (error) {
            console.error('Error accepting proposal:', error);
            messagesState.addMessage('Error accepting proposal. Please try again.', 'error');
        }
    }

    async _handleDeclineProposal() {
        try {
            const response = await declineProposal(this.proposalId);
            if (response.success) {
                messagesState.addMessage('Proposal declined successfully');
                triggerUpdateItem();
            } else {
                messagesState.addMessage(response.error || 'Failed to decline proposal', 'error');
            }
        } catch (error) {
            console.error('Error declining proposal:', error);
            messagesState.addMessage('Error declining proposal. Please try again.', 'error');
        }
    }

    _getParticipantStatus(participant) {
        if (participant.accepted === true) {
            return 'accepted';
        }
        if (participant.rejected === true) {
            return 'rejected';
        }
        return 'pending';
    }

    _canTakeAction(participant) {
        return participant.userId === userState?.userData?.id;
    }

    _canAccept(participant) {
        const status = this._getParticipantStatus(participant);
        return this._canTakeAction(participant) && (status === 'pending' || status === 'rejected');
    }

    _canReject(participant) {
        const status = this._getParticipantStatus(participant);
        return this._canTakeAction(participant) && (status === 'pending' || status === 'accepted');
    }

    render() {
        if (!this.participants || this.participants.length === 0) {
            return html`
                <div class="participants-section">
                    <div class="participants-title">Participants</div>
                    <p>No participants found.</p>
                </div>
            `;
        }

        return html`
            <div class="participants-section">
                <div class="participants-title">Participants</div>
                ${this.participants.map(participant => html`
                    <div class="participant">
                        <div class="participant-info">
                            <custom-avatar 
                                    username="${getUsernameById(participant.userId)}"
                                    imageId="${getUserImageIdByUserId(participant.userId)}"
                                    size="28"
                                    round="true"
                            ></custom-avatar>
                            <span class="participant-name">
                                ${getUsernameById(participant.userId)}
                            </span>
                            <span class="participant-status-badge status-${this._getParticipantStatus(participant)}">
                                ${this._getParticipantStatus(participant)}
                            </span>
                            ${participant?.isBuying ? html`
                                    <span class="buyer-chip">
                                        <cart-icon></cart-icon>
                                        <span>buyer</span>
                                    </span>
                            ` : ''}
                            ${participant.userId === this.creatorId ? html`
                                <span>
                                    <admin-icon></admin-icon>
                                    <custom-tooltip>This user created this proposal</custom-tooltip>
                                </span>
                            ` : ''}
                        </div>
                        <div class="participant-right-side">
                            ${(this._canAccept(participant) || this._canReject(participant)) ? html`
                                <div class="proposal-actions">
                                    ${this._canAccept(participant) ? html`
                                        <button 
                                            class="icon-button accept-btn green-text"
                                            @click=${this._handleAcceptProposal}
                                            title="Accept proposal"
                                        >
                                            <check-icon></check-icon>
                                        </button>
                                    ` : ''}
                                    ${this._canReject(participant) ? html`
                                        <button 
                                            class="icon-button reject-btn danger-text"
                                            @click=${this._handleDeclineProposal}
                                            title="Decline proposal"
                                        >
                                            <x-icon></x-icon>
                                        </button>
                                    ` : ''}
                                </div>
                            ` : ''}
                            <span class="participant-amount">${currencyHelper(participant.amountRequested || '0.00')}</span>
                        </div>
                    </div>
                `)}
                ${this.showTotal ? html`
                    <div class="total-amount">
                        <span class="total-label">Total:</span>
                        <span class="total-value">${this._calculateTotal()}</span>
                    </div>
                ` : ''}
            </div>
        `;
    }
}

customElements.define('proposal-participants', ProposalParticipants);
