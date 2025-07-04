import {LitElement, html, css} from 'lit';
import buttonStyles from "../../../css/buttons.js";
import '../account/avatar.js';
import '../../../svg/check.js';
import '../../../svg/delete.js';
import '../../../svg/arrow-long.js';
import '../../../svg/bell.js';
import '../../global/custom-tooltip.js'
import {messagesState} from "../../../state/messagesStore.js";
import {listenGroupUpdated, triggerGroupUpdated, triggerBulkAddToGroupModal, triggerUpdateList} from "../../../events/eventListeners.js";
import {observeState} from 'lit-element-state';
import {groupInvitationsState} from '../../../state/groupInvitationsStore.js';

export class InvitedGroups extends observeState(LitElement) {
    connectedCallback() {
        super.connectedCallback();
        listenGroupUpdated(() => {
            groupInvitationsState.fetchInvitations();
        });
    }

    async handleAcceptInvite(group, event) {
        event.preventDefault();
        event.stopPropagation();
        try {
            const result = await groupInvitationsState.acceptInvitation(group.id);
            messagesState.addMessage('Group invitation accepted');
            triggerGroupUpdated();
            triggerUpdateList();

            // Trigger the bulk add modal to allow adding items/lists to the newly joined group
            if (result.data) {
                triggerBulkAddToGroupModal(group);
            }
        } catch (error) {
            messagesState.addMessage('Failed to accept invitation', 'error');
        }
    }

    async handleDeclineInvite(groupId, event) {
        event.preventDefault();
        event.stopPropagation();
        try {
            await groupInvitationsState.declineInvitation(groupId);
            messagesState.addMessage('Group invitation declined');
            triggerGroupUpdated();
            triggerUpdateList();
        } catch (error) {
            messagesState.addMessage('Failed to decline invitation', 'error');
        }
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    display: block;
                    width: 100%;
                }
                
                .section-header {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: space-between;
                    margin-bottom: var(--spacing-small);
                }
                
                .title {
                    font-weight: bold;
                    margin: 0;
                }
                
                .groups-container {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-small);
                }
                
                .empty-state {
                    padding: 48px 24px;
                    text-align: center;
                    color: var(--text-color-medium-dark);
                    background-color: var(--background-light);
                    border-radius: var(--border-radius-normal);
                    border: 2px dashed var(--border-color);
                }

                .empty-state-icon {
                    width: 48px;
                    height: 48px;
                    margin: 0 auto 16px;
                    opacity: 0.5;
                    color: var(--text-color-medium-dark);
                }

                .empty-state-title {
                    font-size: var(--font-size-large);
                    font-weight: 600;
                    margin: 0 0 8px 0;
                    color: var(--text-color-dark);
                }

                .empty-state-description {
                    font-size: var(--font-size-normal);
                    margin: 0;
                    line-height: 1.5;
                }
                
                .loading {
                    height: 100px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--text-color-medium-dark);
                }
                
                .compact-group-item {
                    display: grid;
                    text-decoration: none;
                    grid-template-columns: auto 1fr auto auto;
                    align-items: center;
                    padding: var(--spacing-small);
                    border: 1px solid var(--border-color);
                    border-radius: var(--border-radius-normal);
                    background-color: var(--background-light);
                    transition: var(--transition-200);
                    
                    &:hover {
                        box-shadow: var(--shadow-1-soft);
                        border-color: var(--primary-color);
                    }
                }
                
                .group-info {
                    display: flex;
                    flex-direction: column;
                    padding: 0 var(--spacing-small);
                }
                
                .group-name {
                    font-weight: bold;
                    color: var(--text-color-dark);
                }
                
                .member-count {
                    font-size: var(--font-size-small);
                    color: var(--text-color-medium-dark);
                }
                
                .icon-button {
                    font-size: var(--font-size-large);
                }
            `
        ];
    }

    render() {
        return html`
            <div class="section-header">
                <h2 class="title">Group Invitations</h2>
            </div>
            
            ${groupInvitationsState.loading ? 
                html`<div class="loading">Loading invitations...</div>` :
                this.renderGroups()
            }
        `;
    }

    renderGroups() {
        if (groupInvitationsState.error) {
            return html`<div class="empty-state">${groupInvitationsState.error}</div>`;
        }

        if (!groupInvitationsState.invitations || groupInvitationsState.invitations.length === 0) {
            return html`
                <div class="empty-state">
                    <bell-icon class="empty-state-icon"></bell-icon>
                    <h3 class="empty-state-title">No Invitations</h3>
                    <p class="empty-state-description">
                        You don't have any pending group invitations at the moment. Check back later!
                    </p>
                </div>
            `;
        }

        return html`
            <div class="groups-container">
                ${groupInvitationsState.invitations.map(group => html`
                    <a class="compact-group-item" href="/group/${group.id}">
                        <custom-avatar 
                            size="40" 
                            username="${group?.groupName}"
                            borderradius="var(--border-radius-normal)"
                            imageId="${group?.groupImage}"
                        ></custom-avatar>
                        
                        <div class="group-info">
                            <span class="group-name">${group?.groupName}</span>
                            <span class="member-count">
                                ${group?.members?.length || 1} 
                                ${group?.members?.length === 1 ? 'member' : 'members'}
                            </span>
                        </div>

                        <button
                                class="icon-button decline-button"
                                @click="${(e) => this.handleDeclineInvite(group.id, e)}"
                                title="Decline invitation"
                                style="--icon-color: var(--delete-red);
                                 --icon-color-hover: var(--delete-red-darker);
                                 --icon-hover-background: var(--delete-red-light);"
                        >
                            <delete-icon></delete-icon>
                        </button>
                        <custom-tooltip>Decline Invitation</custom-tooltip>
                        
                        <button 
                            class="icon-button accept-button" 
                            @click="${(e) => this.handleAcceptInvite(group, e)}"
                            title="Accept invitation"
                            style="--icon-color: var(--green-normal);
                                 --icon-color-hover: var(--green-darker);
                                 --icon-hover-background: var(--green-light);"
                        >
                            <check-icon></check-icon>
                        </button>
                        <custom-tooltip style="min-width: 120px">Join Group</custom-tooltip>
                    </a>
                `)}
            </div>
        `;
    }
}

customElements.define('invited-groups', InvitedGroups);
