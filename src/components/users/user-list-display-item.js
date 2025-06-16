import {LitElement, html, css} from 'lit';
import '../pages/account/avatar.js';
import '../../svg/user.js';
import '../../svg/leave.js';
import '../../svg/check.js';
import '../../svg/x.js';
import '../../svg/admin.js';
import '../../svg/add-admin.js';
import '../../svg/remove-admin.js';
import '../../svg/owner.js';

import '../global/custom-tooltip.js';
import {getUserDescriptionById, getUserImageIdByUserId, getUsernameById} from "../../helpers/generalHelpers.js";
import {observeState} from "lit-element-state";
import {userState} from "../../state/userStore.js";
import {isGroupAdmin, isGroupOwner} from "../../helpers/groupHelpers.js";
import {messagesState} from "../../state/messagesStore.js";
import {invalidateCache} from "../../helpers/caching.js";
import {triggerGroupUpdated} from "../../events/eventListeners.js";
import {makeUserGroupAdmin, removeUserGroupAdmin, removeUserFromGroup} from "../../helpers/api/groups.js";
import buttonStyles from "../../css/buttons";

export class UserListDisplayItem extends observeState(LitElement) {
    static properties = {
        userId: {type: Number},
        showDescription: {type: Boolean},
        compact: {type: Boolean},
        groupData: {type: Object}
    };

    constructor() {
        super();
        this.userId = null;
        this.showDescription = true;
        this.compact = false;
        this.groupData = null;
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    display: block;
                    color: var(--text-color-dark);
                    border-radius: var(--border-radius-normal);
                    transition: var(--transition-200);
                }

                .user-container {
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    padding: var(--spacing-small);
                    gap: var(--spacing-small);
                    border-radius: var(--border-radius-normal);
                    background-color: var(--background-dark);
                    transition: var(--transition-normal);
                    border: 1px solid var(--border-color);
                    text-decoration: none;
                    flex: 1;
                    position: relative;
                }
                
                .avatar-container {
                    position: relative;
                }

                .user-container:hover {
                    box-shadow: var(--shadow-1-soft);
                    //transform: translateY(-1px);
                    border-color: var(--primary-color);
                }

                .compact.user-container {
                    padding: var(--spacing-x-small);
                    gap: var(--spacing-x-small);
                }

                .user-info {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    min-width: 0;
                }

                .user-name {
                    font-size: var(--font-size-small);
                    font-weight: bold;
                    color: var(--text-color-dark);
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .compact .user-name {
                    font-size: var(--font-size-x-small);
                }
                
                .compact .icon-button {
                    padding: 4px;
                }

                .user-desc {
                    font-size: var(--font-size-x-small);
                    color: var(--text-color-medium-dark);
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    margin-top: 2px;
                    line-height: 1.2;
                }

                .admin-badge {
                    font-size: var(--font-size-x-x-x-small);
                    background-color: var(--primary-color);
                    color: white;
                    padding: 3px 6px;
                    line-height: 1;
                    border-radius: var(--border-radius-normal);
                    margin-left: var(--spacing-x-small);
                    text-transform: uppercase;
                    font-weight: 600;
                    
                    &.admin {
                        background-color: var(--green-normal);
                    }
                }

                .name-with-badge {
                    display: flex;
                    align-items: center;
                }
                
            `
        ];
    }

    /**
     * Check if current user can make another user an admin
     * @returns {boolean}
     */
    canMakeAdmin() {
        // Any admin can make another user an admin, if the user is not already an admin and not the owner
        return isGroupAdmin(this.groupData, userState?.userData?.id) &&
               !isGroupAdmin(this.groupData, this.userId);
    }

    /**
     * Check if current user can remove admin privileges from another user
     * @returns {boolean}
     */
    canRemoveAdmin() {
        // Only the owner can remove admin privileges, and can't remove owner's admin privileges
        return isGroupOwner(this.groupData, userState?.userData?.id) &&
               isGroupAdmin(this.groupData, this.userId) &&
               !isGroupOwner(this.groupData, this.userId);
    }

    /**
     * Check if current user can remove another user from the group
     * @returns {boolean}
     */
    canRemoveFromGroup() {
        // Can't remove the owner
        if (isGroupOwner(this.groupData, this.userId)) {
            return false;
        }

        // If the user is an admin, only the owner can remove them
        if (isGroupAdmin(this.groupData, this.userId)) {
            return isGroupOwner(this.groupData, userState?.userData?.id);
        }

        // Any admin can remove a regular user
        return isGroupAdmin(this.groupData, userState?.userData?.id);
    }

    async _handleMakeAdmin(e) {
        e.stopPropagation();
        e.preventDefault();
        if (!this.groupData || !this.userId || !this.canMakeAdmin()) return;

        try {
            const result = await makeUserGroupAdmin(
                this.groupData.id,
                this.userId,
                this.groupData.adminIds
            );

            if (result.success) {
                messagesState.addMessage('User has been made admin');
                invalidateCache(`/groups/${this.groupData.id}`);
                triggerGroupUpdated();
            } else {
                messagesState.addMessage('Failed to make user admin', 'error');
            }
        } catch (error) {
            console.error('Error making user admin:', error);
            messagesState.addMessage('An error occurred', 'error');
        }
    }

    async _handleRemoveAdmin(e) {
        e.stopPropagation();
        e.preventDefault();
        if (!this.groupData || !this.userId || !this.canRemoveAdmin()) return;

        try {
            const result = await removeUserGroupAdmin(
                this.groupData.id,
                this.userId,
                this.groupData.adminIds
            );

            if (result.success) {
                messagesState.addMessage('Admin privileges removed');
                invalidateCache(`/groups/${this.groupData.id}`);
                triggerGroupUpdated();
            } else {
                messagesState.addMessage('Failed to remove admin privileges', 'error');
            }
        } catch (error) {
            console.error('Error removing admin privileges:', error);
            messagesState.addMessage('An error occurred', 'error');
        }
    }

    async _handleRemoveFromGroup(e) {
        e.stopPropagation();
        e.preventDefault();
        if (!this.groupData || !this.userId || !this.canRemoveFromGroup()) return;

        try {
            const result = await removeUserFromGroup(
                this.groupData.id,
                this.userId,
                this.groupData.members,
                this.groupData.adminIds
            );

            if (result.success) {
                messagesState.addMessage('User removed from group');
                invalidateCache(`/groups/${this.groupData.id}`);
                triggerGroupUpdated();
            } else {
                messagesState.addMessage('Failed to remove user from group', 'error');
            }
        } catch (error) {
            console.error('Error removing user from group:', error);
            messagesState.addMessage('An error occurred', 'error');
        }
    }


    render() {
        if (!userState?.userData?.id) {
            return html`
                <div class="user-container">No user data</div>`;
        }

        return html`
                <a class="user-container ${this.compact ? 'compact' : ''}"  href="/user/${this.userId}">
                    <custom-avatar size="${this.compact ? '24' : '40'}"
                               username="${getUsernameById(this.userId) || '-'}"
                               imageId="${getUserImageIdByUserId(this.userId)}"
                    ></custom-avatar>

                    <div class="user-info">
                        <div class="name-with-badge">
                            <div class="user-name">${getUsernameById(this.userId) || 'Unknown User'}</div>
                            ${isGroupOwner(this.groupData, this.userId) ? html`
                                        <span class="admin-badge owner">
                                            owner
                                        </span>` :
                                    isGroupAdmin(this.groupData, this.userId) ? html`<span
                                            class="admin-badge admin">admin</span>` : ''}
                        </div>
                        ${this.showDescription && !this.compact
                                ? html`
                                    <div class="user-desc">${getUserDescriptionById(this.userId)}</div>`
                                : null
                        }
                    </div>

                    ${isGroupAdmin(this.groupData, userState?.userData?.id) ? html`
                        ${this.canRemoveAdmin() ? html`
                            <button class="icon-button danger-text large"
                                    aria-label="Remove admin privileges"
                                    @click=${this._handleRemoveAdmin}>
                                <remove-admin-icon></remove-admin-icon>
                            </button>
                            <custom-tooltip style="min-width: 200px;">Remove Admin Privileges</custom-tooltip>
                        ` : ''}

                        ${this.canMakeAdmin() ? html`
                            <button class="icon-button green-text large"
                                    aria-label="Make admin"
                                    @click=${this._handleMakeAdmin}>
                                <add-admin-icon></add-admin-icon>
                            </button>
                            <custom-tooltip>Make Admin</custom-tooltip>
                        ` : ''}

                        ${this.canRemoveFromGroup() ? html`
                            <button class="icon-button blue-text large"
                                   aria-label="Remove from group"
                                   @click=${this._handleRemoveFromGroup}>
                                <leave-icon></leave-icon>
                            </button>
                            <custom-tooltip style="min-width: 150px;">Remove from Group</custom-tooltip>
                        ` : ''}
                    ` : ''}
                </a>
        `;
    }
}

customElements.define('user-list-display-item', UserListDisplayItem);
