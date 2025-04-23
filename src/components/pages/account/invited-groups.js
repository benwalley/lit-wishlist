import {LitElement, html, css} from 'lit';
import buttonStyles from "../../../css/buttons.js";
import '../account/avatar.js';
import '../../../svg/check.js';
import '../../../svg/delete.js';
import '../../../svg/arrow-long.js';
import '../../global/custom-tooltip.js'
import {getInvitedGroups, acceptGroupInvitation, declineGroupInvitation} from '../../../helpers/api/groups.js';
import {messagesState} from "../../../state/messagesStore.js";
import {listenGroupUpdated, triggerGroupUpdated} from "../../../events/eventListeners.js";

export class InvitedGroups extends LitElement {
    static properties = {
        groups: { type: Array },
        loading: { type: Boolean },
        error: { type: String },
    };

    constructor() {
        super();
        this.groups = [];
        this.loading = true;
        this.error = '';
    }

    connectedCallback() {
        super.connectedCallback();
        this.fetchInvitedGroups();
        listenGroupUpdated(this.fetchInvitedGroups.bind(this));
    }

    async fetchInvitedGroups() {
        try {
            this.loading = true;
            const result = await getInvitedGroups();

            if (!result.success) {
                this.error = 'Failed to load invited groups';
                messagesState.addMessage('Failed to load invited groups', 'error');
            } else {
                this.groups = result.data || [];
            }
        } catch (err) {
            this.error = 'An error occurred loading invited groups';
            messagesState.addMessage('An error occurred loading invited groups', 'error');
        } finally {
            this.loading = false;
        }
    }

    async handleAcceptInvite(groupId, event) {
        event.preventDefault();
        event.stopPropagation();
        try {
            const result = await acceptGroupInvitation(groupId);
            if (result.success) {
                messagesState.addMessage('Group invitation accepted');
                triggerGroupUpdated();
                await this.fetchInvitedGroups();
            } else {
                throw new Error('Failed to accept invitation');
            }
        } catch (error) {
            messagesState.addMessage('Failed to accept invitation', 'error');
        }
    }

    async handleDeclineInvite(groupId, event) {
        event.preventDefault();
        event.stopPropagation();
        try {
            const result = await declineGroupInvitation(groupId);
            if (result.success) {
                messagesState.addMessage('Group invitation declined');
                triggerGroupUpdated();
                await this.fetchInvitedGroups();
            } else {
                throw new Error('Failed to decline invitation');
            }
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
                    padding: var(--spacing-small);
                    background-color: var(--background-light);
                    border-radius: var(--border-radius-small);
                    font-size: var(--font-size-small);
                    color: var(--text-color-medium-dark);
                    text-align: center;
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
                    border-radius: var(--border-radius-normal);
                    background-color: var(--background-light);
                    transition: var(--transition-200);
                    
                    &:hover {
                        box-shadow: var(--shadow-1-soft);
                        transform: translateY(-1px);
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
            
            ${this.loading ? 
                html`<div class="loading">Loading invitations...</div>` :
                this.renderGroups()
            }
        `;
    }

    renderGroups() {
        if (this.error) {
            return html`<div class="empty-state">${this.error}</div>`;
        }

        if (!this.groups || this.groups.length === 0) {
            return html`<div class="empty-state">You don't have any group invitations.</div>`;
        }

        return html`
            <div class="groups-container">
                ${this.groups.map(group => html`
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
                            @click="${(e) => this.handleAcceptInvite(group.id, e)}"
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
