import {LitElement, html, css} from 'lit';
import buttonStyles from "../../../css/buttons.js";
import '../../global/custom-tooltip.js';
import '../../global/custom-modal.js';
import '../account/avatar.js';
import {getUserImageIdByUserId, getUsernameById} from "../../../helpers/generalHelpers.js";
import {currencyHelper} from "../../../helpers.js";
import {observeState} from "lit-element-state";

export class GivingTracking extends observeState(LitElement) {
    static properties = {
        givingData: {type: Object},
        showModal: {type: Boolean, state: true}
    };

    constructor() {
        super();
        this.givingData = {};
        this.showModal = false;
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    display: block;
                    position: relative;
                }
                
                .giving-display {
                    cursor: pointer;
                    padding: 0 var(--spacing-x-small);
                    border-radius: var(--border-radius-small);
                    transition: background-color 0.2s ease;
                    display: inline-flex;
                    align-items: center;
                    gap: var(--spacing-x-small);
                }
                
                .giving-display:hover {
                    background-color: var(--background-light);
                }
                
                .participant-count {
                    color: var(--text-color-dark);
                    font-weight: bold;
                    font-size: var(--font-size-small);
                }
                
                .number-bubble {
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background-color: var(--blue-normal);
                    color: white;
                    text-align: center;
                    line-height: 1;
                    padding: 2px;
                    font-size: var(--font-size-small);
                    margin-right: var(--spacing-x-small);
                }
                
                .you-getting {
                    color: var(--dark-text-color);
                    font-style: italic;
                    font-size: var(--font-size-small);
                }
                
                .modal-content {
                    padding: var(--spacing-small);
                }
                
                .modal-header {
                    font-weight: bold;
                    margin-bottom: var(--spacing-normal);
                    color: var(--text-color-dark);
                    font-size: 1.1rem;
                }
                
                .participant-list {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-x-small);
                }
                
                .participant-item {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: var(--spacing-x-small) var(--spacing-small);
                    border-radius: var(--border-radius-normal);
                    background-color: var(--background-color);
                }
                
                .participant-info {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-small);
                }
                
                .participant-name {
                    font-size: var(--font-size-normal);
                    color: var(--text-color-dark);
                    font-weight: bold;
                }
                
                .participant-amount {
                    font-size: var(--font-size-normal);
                    color: var(--green-normal);
                    font-weight: 500;
                }
            `
        ];
    }

    _openModal() {
        if (this._hasProposal()) {
            this.showModal = true;
        }
    }

    _closeModal() {
        this.showModal = false;
    }

    _hasProposal() {
        return this.givingData?.proposal && this.givingData.proposal.proposalParticipants?.length > 0;
    }

    _getParticipantCount() {
        return this.givingData?.proposal?.proposalParticipants?.length || 0;
    }

    _getParticipants() {
        return this.givingData?.proposal?.proposalParticipants || [];
    }

    render() {
        if (!this.givingData) return html``;

        const hasProposal = this._hasProposal();
        const participantCount = this._getParticipantCount();

        return html`
            <div class="giving-display" @click="${this._openModal}">
                ${hasProposal ? html`
                    <span class="participant-count">
                        <span class="number-bubble">${participantCount}</span>
                        <span>going in on this</span>
                          
                    </span>
                ` : html`
                    <span class="you-getting">You are getting this</span>
                `}
            </div>
            
            <custom-modal 
                ?isOpen=${this.showModal}
                maxWidth="400px"
                @modal-closed=${this._closeModal}
            >
                <div class="modal-content">
                    <div class="modal-header">Proposal Participants</div>
                    <div class="participant-list">
                        ${this._getParticipants().map(participant => html`
                            <div class="participant-item">
                                <div class="participant-info">
                                    <custom-avatar
                                        size="24"
                                        username="${getUsernameById(participant.userId)}"
                                        imageId="${getUserImageIdByUserId(participant.userId)}"
                                        round="true"
                                    ></custom-avatar>
                                    <span class="participant-name">
                                        ${getUsernameById(participant.userId)}
                                    </span>
                                </div>
                                <span class="participant-amount">
                                    ${currencyHelper(participant.amountRequested || 0)}
                                </span>
                            </div>
                        `)}
                    </div>
                </div>
            </custom-modal>
        `;
    }
}
customElements.define('giving-tracking', GivingTracking);
