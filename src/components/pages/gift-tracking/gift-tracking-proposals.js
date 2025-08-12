import {LitElement, html, css} from 'lit';
import {observeState} from 'lit-element-state';
import {userState} from '../../../state/userStore.js';
import {customFetch} from '../../../helpers/fetchHelpers.js';
import buttonStyles from '../../../css/buttons.js';
import formStyles from '../../../css/forms.js';
import '../../global/custom-image.js';
import '../../global/loading-screen.js';
import '../../global/action-dropdown.js';
import '../../pages/account/avatar.js';
import './proposal-participants.js';
import '../../../svg/dots.js';
import '../../../svg/edit.js';
import '../../../svg/delete.js';
import {formatDate} from "../../../helpers.js";
import {getUserImageIdByUserId, getUsernameById, maxLength} from "../../../helpers/generalHelpers.js";
import {envVars} from "../../../config.js";
import {triggerEditProposalModal, triggerDeleteProposal, listenProposalDeleted, listenUpdateItem} from "../../../events/eventListeners.js";

export class GiftTrackingProposals extends observeState(LitElement) {
    static properties = {
        proposals: {type: Array, state: true},
        loading: {type: Boolean, state: true}
    };

    constructor() {
        super();
        this.proposals = [];
        this.loading = true;
    }

    connectedCallback() {
        super.connectedCallback();
        this._loadProposals();
        this._unsubscribeProposalDeleted = listenProposalDeleted(this._handleProposalDeleted.bind(this));
        this._unsubscribeUpdateItem = listenUpdateItem(this._loadProposals.bind(this));
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this._unsubscribeProposalDeleted) {
            this._unsubscribeProposalDeleted();
        }
        if (this._unsubscribeUpdateItem) {
            this._unsubscribeUpdateItem();
        }
    }

    async _loadProposals() {
        this.loading = true;
        try {
            const response = await customFetch('/proposals/for-me', {}, true);
            if (response.success) {
                // Filter out proposals that have "accepted" status
                this.proposals = (response.data || []).filter(proposal => proposal.proposalStatus !== 'accepted');
            }
        } catch (error) {
            console.error('Failed to load proposals:', error);
        } finally {
            this.loading = false;
        }
    }

    static get styles() {
        return [
            buttonStyles,
            formStyles,
            css`
                :host {
                    display: block;
                    width: 100%;
                    box-sizing: border-box;
                    margin: 0 auto;
                    padding: 0 var(--spacing-normal);
                    max-width: 1200px;
                }

                .proposals-container {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-normal);
                    padding-top: var(--spacing-normal);
                }

                .proposal-item {
                    border: 1px solid var(--border-color-light);
                    border-radius: var(--border-radius-large);
                    padding: var(--spacing-normal);
                    background: var(--modal-background-color);
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
                    transition: var(--transition-200);
                    overflow: hidden;
                    position: relative;
                }

                .proposal-header {
                    display: flex;
                    align-items: flex-start;
                    gap: var(--spacing-normal);
                    margin-bottom: var(--spacing-normal);
                    position: relative;
                }

                .proposal-image {
                    width: 100px;
                    height: 100px;
                    border-radius: var(--border-radius-normal);
                    overflow: hidden;
                    flex-shrink: 0;
                    border: 2px solid var(--border-color-extra-light);
                    background: var(--background-color);
                }

                .proposal-info {
                    flex: 1;
                    min-width: 0;
                }

                .proposal-title {
                    font-size: var(--font-size-medium);
                    font-weight: 600;
                    max-width: calc(100% - 140px);
                    color: var(--text-color-dark);
                    margin-bottom: var(--spacing-x-small);
                    line-height: 1.3;
                    word-wrap: break-word;
                }

                .proposal-status {
                    font-size: var(--font-size-x-small);
                    font-weight: 600;
                    padding: 4px 12px;
                    border-radius: var(--border-radius-normal);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    position: absolute;
                    top: 0;
                    right: 40px;
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
                
                .proposal-meta {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-x-small)
                }
                
                .meta-row {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-small);
                    font-size: var(--font-size-x-small);
                }


                .meta-label {
                    font-weight: 600;
                    color: var(--medium-text-color);
                    flex-shrink: 0;
                }

                .meta-value {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-x-small);
                    color: var(--medium-dark-text-color);
                }

                .meta-user {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-x-small);
                    color: inherit;
                    text-decoration: none;
                    
                    &:hover {
                        text-decoration: none;
                    }
                }


                .proposal-actions {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    z-index: 10;
                }

                .actions-container {
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-end;
                }

                .action-button {
                    font-size: 1.3em;
                    transition: transform 0.3s ease;
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: var(--spacing-x-small);
                    border-radius: var(--border-radius-small);
                    color: var(--medium-text-color);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .action-button:hover {
                    background-color: var(--purple-light, rgba(0, 0, 0, 0.05));
                    color: var(--text-color-dark);
                }

                .empty-state {
                    text-align: center;
                    padding: var(--spacing-large);
                    color: var(--medium-text-color);
                    background: var(--modal-background-color);
                    border-radius: var(--border-radius-large);
                    border: 2px dashed var(--border-color-light);
                }

                .empty-state::before {
                    content: "📝";
                    font-size: 3rem;
                    display: block;
                    margin-bottom: var(--spacing-small);
                }

                @media (max-width: 600px) {
                    .proposal-header {
                        flex-direction: column;
                        align-items: stretch;
                    }

                    .proposal-status {
                        position: absolute;
                        top: var(--spacing-small);
                        right: 40px;
                    }

                    .proposal-image {
                        align-self: center;
                        width: 120px;
                        height: 120px;
                        margin-bottom: var(--spacing-small);
                    }

                    .proposal-info {
                        text-align: center;
                    }

                    .proposal-meta {
                        margin-top: var(--spacing-normal);
                    }

                    .meta-row {
                        justify-content: center;
                        margin-bottom: var(--spacing-small);
                    }
                }
            `
        ];
    }


    _getProposalActions(proposal) {
        return [
            {
                id: 'edit',
                label: 'Edit Proposal',
                icon: html`<edit-icon></edit-icon>`,
                classes: 'blue-text',
                action: () => this._handleEditProposal(proposal)
            },
            {
                id: 'delete',
                label: 'Delete Proposal',
                icon: html`<delete-icon></delete-icon>`,
                classes: 'danger-text',
                action: () => this._handleDeleteProposal(proposal)
            }
        ];
    }

    _handleEditProposal(proposal) {
        triggerEditProposalModal(proposal);
    }

    _handleDeleteProposal(proposal) {
        triggerDeleteProposal(proposal);
    }

    _handleProposalDeleted(event) {
        const { proposalId } = event.detail;
        // Remove the proposal from the local state
        this.proposals = this.proposals.filter(p => p.id !== proposalId);
    }


    render() {
        if (this.loading) {
            return html`<loading-screen></loading-screen>`;
        }

        if (!this.proposals || this.proposals.length === 0) {
            return html`
                <div class="empty-state">
                    <p>No proposals found.</p>
                </div>
            `;
        }

        return html`
            <div class="proposals-container">
                ${this.proposals.map(proposal => html`
                    <div class="proposal-item">
                        <div class="proposal-header">
                            ${proposal.itemData?.imageIds?.length > 0 ? html`
                                <custom-image
                                    class="proposal-image"
                                    imageId="${proposal.itemData.imageIds[0]}"
                                    alt="${proposal.itemData.name}"
                                ></custom-image>
                            ` : ''}
                            <div class="proposal-info">
                                <div class="proposal-title">${maxLength(proposal.itemData?.name || 'Unknown Item', envVars.LIST_ITEM_MAX_LENGTH)}</div>
                                <span class="proposal-status status-${proposal.proposalStatus}">
                                    ${proposal.proposalStatus}
                                </span>
                                <div class="proposal-meta">
                                    <div class="meta-row">
                                        <span class="meta-label">Created:</span>
                                        <span class="meta-value">${formatDate(proposal.createdAt)}</span>
                                    </div>
                                    <div class="meta-row">
                                        <span class="meta-label">Gift for:</span>
                                        <div class="meta-value">
                                            <a class="meta-user" href="/user/${proposal.itemData?.createdById}">
                                                <custom-avatar
                                                        username="${getUsernameById(proposal.itemData?.createdById)}"
                                                        imageId="${getUserImageIdByUserId(proposal.itemData?.createdById)}"
                                                        size="20"
                                                ></custom-avatar>
                                                <span>${getUsernameById(proposal.itemData?.createdById)}</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        ${this._getProposalActions(proposal).length > 0 ? html`
                        <div class="proposal-actions">
                            <div class="actions-container">
                                <action-dropdown .items=${this._getProposalActions(proposal)}>
                                    <button
                                            class="button icon-button action-button"
                                            aria-label="Proposal actions"
                                            slot="toggle"
                                    >
                                        <dots-icon></dots-icon>
                                    </button>
                                </action-dropdown>
                            </div>
                        </div>
                        ` : ''}

                        <proposal-participants
                            .participants=${proposal.proposalParticipants}
                            .creatorId=${proposal.creator?.id}
                            .proposalId=${proposal.id}
                            .showTotal=${true}
                        ></proposal-participants>
                    </div>
                `)}
            </div>
        `;
    }
}

customElements.define('gift-tracking-proposals', GiftTrackingProposals);
