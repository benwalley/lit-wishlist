import {LitElement, html, css} from 'lit';
import {observeState} from 'lit-element-state';
import {userState} from '../../../state/userStore.js';
import {getUsernameById, getUserImageIdByUserId} from '../../../helpers/generalHelpers.js';
import {getGroupNameById, getGroupImageIdByGroupId} from '../../../helpers/userHelpers.js';
import '../../pages/account/avatar.js';

export class SharedWith extends observeState(LitElement) {
    static properties = {
        itemData: {type: Object},
    };

    constructor() {
        super();
        this.itemData = {};
    }

    static get styles() {
        return css`
            :host {
                display: block;
            }

            .shared-with-container {
                border-radius: var(--border-radius-normal);
                border: 1px solid var(--border-color);
                background: var(--background-light);
                padding: 16px;
                box-shadow: var(--shadow-0-soft);
            }

            .section-title {
                font-weight: bold;
                font-size: var(--font-size-small);
                color: var(--text-color-medium-dark);
                padding-bottom: var(--spacing-small);
                margin: 0;
            }

            .shared-list {
                display: flex;
                flex-direction: column;
                gap: var(--spacing-small);
            }

            .shared-group {
                margin-bottom: var(--spacing-small);
            }

            .group-title {
                font-size: var(--font-size-small);
                color: var(--medium-text-color);
                margin: 0;
                margin-bottom: var(--spacing-small);
                font-weight: 500;
            }

            .users-list {
                display: flex;
                flex-wrap: wrap;
                gap: var(--spacing-small);
            }

            .user-item {
                display: flex;
                align-items: center;
                gap: var(--spacing-x-small);
                font-size: var(--font-size-small);
                color: var(--light-text-color);
                border: 1px solid var(--border-color);
                padding: 2px 10px 2px 2px;
                border-radius: 50px;
            }

            .user-name {
                color: var(--text-color-dark);
            }

            .visibility-note {
                font-size: var(--font-size-x-small);
                color: var(--medium-text-color);
                font-style: italic;
            }

            .public-indicator {
                color: var(--green-normal);
                font-weight: 500;
            }
        `;
    }

    _isCurrentUserOwner() {
        return userState.userData && this.itemData.createdById === userState.userData.id;
    }

    _renderSharedUsers() {
        if (!this.itemData.visibleToUsers || this.itemData.visibleToUsers.length === 0) {
            return '';
        }

        return html`
            <div class="shared-group">
                <h3 class="group-title">Shared with users:</h3>
                <div class="users-list">
                    ${this.itemData.visibleToUsers.map(userId => html`
                        <div class="user-item">
                            <custom-avatar
                                username="${getUsernameById(userId)}"
                                imageId="${getUserImageIdByUserId(userId)}"
                                size="24"
                                round
                            ></custom-avatar>
                            <span class="user-name">${getUsernameById(userId)}</span>
                        </div>
                    `)}
                </div>
            </div>
        `;
    }

    _renderSharedGroups() {
        if (!this.itemData.visibleToGroups || this.itemData.visibleToGroups.length === 0) {
            return '';
        }

        return html`
            <div class="shared-group">
                <h3 class="group-title">Shared with groups:</h3>
                <div class="users-list">
                    ${this.itemData.visibleToGroups.map(groupId => html`
                        <div class="user-item">
                            <custom-avatar
                                username="${getGroupNameById(groupId)}"
                                imageId="${getGroupImageIdByGroupId(groupId)}"
                                size="24"
                                round
                            ></custom-avatar>
                            <span class="user-name">${getGroupNameById(groupId)}</span>
                        </div>
                    `)}
                </div>
            </div>
        `;
    }

    _getVisibilityDescription() {
        if (this.itemData.isPublic) {
            return html`<div class="visibility-note public-indicator">This item is public and visible to everyone</div>`;
        }

        if (this.itemData.matchListVisibility) {
            return html`<div class="visibility-note">This item shares the same visibility settings as its list</div>`;
        }

        const hasUsers = this.itemData.visibleToUsers && this.itemData.visibleToUsers.length > 0;
        const hasGroups = this.itemData.visibleToGroups && this.itemData.visibleToGroups.length > 0;

        if (!hasUsers && !hasGroups) {
            return html`<div class="visibility-note">This item is only visible to you</div>`;
        }

        return '';
    }

    render() {
        // Only show if the current user is the owner of the item
        if (!this._isCurrentUserOwner()) {
            return html``;
        }

        const hasUsers = this.itemData.visibleToUsers && this.itemData.visibleToUsers.length > 0;
        const hasGroups = this.itemData.visibleToGroups && this.itemData.visibleToGroups.length > 0;
        const hasSharedContent = hasUsers || hasGroups || this.itemData.isPublic || this.itemData.matchListVisibility;

        // Don't render if there's no sharing information to display
        if (!hasSharedContent) {
            return html``;
        }

        return html`
            <div class="shared-with-container">
                <div class="shared-list">
                    ${!this.itemData.matchListVisibility ? html`
                        ${this._renderSharedGroups()}
                        ${this._renderSharedUsers()}
                    ` : ''}
                    ${this._getVisibilityDescription()}
                </div>
            </div>
        `;
    }
}

customElements.define('shared-with', SharedWith);
