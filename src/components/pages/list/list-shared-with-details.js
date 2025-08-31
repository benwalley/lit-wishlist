import {LitElement, html, css} from 'lit';
import {observeState} from 'lit-element-state';
import {userState} from '../../../state/userStore.js';
import {getUsernameById, getUserImageIdByUserId} from '../../../helpers/generalHelpers.js';
import {getGroupNameById, getGroupImageIdByGroupId} from '../../../helpers/userHelpers.js';
import '../../pages/account/avatar.js';

export class ListSharedWithDetails extends observeState(LitElement) {
    static properties = {
        listData: {type: Object},
    };

    constructor() {
        super();
        this.listData = {};
    }

    static get styles() {
        return css`
            :host {
                display: block;
                margin: 0;
            }

            .shared-container {
                display: flex;
                flex-wrap: wrap;
                gap: var(--spacing-x-small);
                align-items: center;
                margin-top: var(--spacing-x-small);
            }

            .chip {
                display: flex;
                align-items: center;
                gap: var(--spacing-x-small);
                padding: 2px 10px 2px 2px;
                border-radius: 20px;
                font-size: var(--font-size-small);
                border: 1px solid var(--border-color);
                background: var(--background-light);
                color: var(--text-color-dark);
            }

            .group-chip {
                border-color: var(--purple-normal);
                background: var(--purple-light);
                color: var(--purple-darker);
            }

            .user-chip {
                border-color: var(--blue-normal);
                background: var(--blue-light);
                color: var(--blue-darker);
            }

            .warning-message {
                display: flex;
                align-items: center;
                gap: var(--spacing-small);
                padding: var(--spacing-x-small) var(--spacing-small);
                border-radius: var(--border-radius-normal);
                background: var(--delete-red-light);
                border: 1px solid var(--delete-red);
                color: var(--delete-red-darker);
                font-size: var(--font-size-small);
            }

            .warning-icon {
                font-size: var(--font-size-medium);
                font-weight: bold;
            }

            .shared-label {
                font-size: var(--font-size-small);
                color: var(--text-color-medium-dark);
                margin-right: var(--spacing-x-small);
            }
            
            .name-link {
                color: inherit;
                text-decoration: none;
                font-weight: 500;
                
                &:hover {
                    text-decoration: underline;
                }
            }
        `;
    }

    _isCurrentUserOwner() {
        return userState.userData && this.listData.ownerId === userState.userData.id;
    }

    _renderGroupChips() {
        if (!this.listData.visibleToGroups || this.listData.visibleToGroups.length === 0) {
            return '';
        }

        return this.listData.visibleToGroups.map(groupId => html`
            <div class="chip group-chip">
                <custom-avatar
                    username="${getGroupNameById(groupId)}"
                    imageId="${getGroupImageIdByGroupId(groupId)}"
                    size="20"
                    round
                ></custom-avatar>
                <a class="name-link" href="/group/${groupId}">${getGroupNameById(groupId)}</a>
            </div>
        `);
    }

    _renderUserChips() {
        // Only show user chips if current user is the owner
        if (!this._isCurrentUserOwner() || !this.listData.visibleToUsers || this.listData.visibleToUsers.length === 0) {
            return '';
        }

        return this.listData.visibleToUsers.map(userId => html`
            <div class="chip user-chip">
                <custom-avatar
                    username="${getUsernameById(userId)}"
                    imageId="${getUserImageIdByUserId(userId)}"
                    size="20"
                    round
                ></custom-avatar>
                <a class="name-link" href="/user/${userId}">${getUsernameById(userId)}</a>
            </div>
        `);
    }

    _shouldShowWarning() {
        if (!this._isCurrentUserOwner()) {
            return false;
        }

        // Show warning if list is not public and has no shared users or groups
        const hasGroups = this.listData.visibleToGroups && this.listData.visibleToGroups.length > 0;
        const numberUsers = this.listData.visibleToUsers?.length || 0;

        // Check if there are users other than the owner
        let hasOtherUsers = false;
        if (numberUsers > 0) {
            const otherUsers = this.listData.visibleToUsers.filter(userId => userId !== this.listData.ownerId);
            hasOtherUsers = otherUsers.length > 0;
        }

        return !this.listData.public && !hasGroups && !hasOtherUsers;
    }

    render() {
        const hasGroups = this.listData.visibleToGroups && this.listData.visibleToGroups.length > 0;
        const hasUsers = this._isCurrentUserOwner() && this.listData.visibleToUsers && this.listData.visibleToUsers.length > 0;
        const hasSharedContent = hasGroups || hasUsers;
        const shouldShowWarning = this._shouldShowWarning();

        // Don't render anything if there's no sharing information and no warning to show
        if (!hasSharedContent && !shouldShowWarning) {
            return html``;
        }

        return html`
            ${hasSharedContent && !shouldShowWarning ? html`
                <div class="shared-container">
                    <span class="shared-label">Shared with:</span>
                    ${this._renderGroupChips()}
                    ${this._renderUserChips()}
                </div>
            ` : ''}
            
            ${shouldShowWarning ? html`
                <div class="warning-message">
                    <span>This list is not shared with any users or groups besides the owner.</span>
                </div>
            ` : ''}
        `;
    }
}

customElements.define('list-shared-with-details', ListSharedWithDetails);
