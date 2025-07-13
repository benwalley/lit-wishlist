import {LitElement, html, css} from 'lit';
import './user-list-item.js'
import '../global/multi-select-dropdown.js'
import '../global/single-select-dropdown.js'
import '../../svg/check.js'
import {observeState} from "lit-element-state";
import {userListState} from "../../state/userListStore.js";

class UserListComponent extends observeState(LitElement) {
    static properties = {
        selectedUserIds: {type: Array},
    };

    constructor() {
        super();
        this.selectedUserIds = [];
    }

    static styles = css`
        :host {
            display: block;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: var(--spacing-x-small);
            border-bottom: 1px solid var(--border-color);
        }

        .title {
            font-weight: bold;
            font-size: var(--font-size-small);
            color: var(--text-color-dark);
        }

        .selection-info {
            display: flex;
            align-items: center;
            gap: var(--spacing-x-small);
        }

        .selected-count {
            font-size: var(--font-size-x-small);
            color: var(--primary-color);
            font-weight: bold;
        }

        .action-buttons {
            display: flex;
            gap: var(--spacing-x-small);
        }

        button {
            border: none;
            background: none;
            padding: var(--spacing-x-small) var(--spacing-small);
            border-radius: var(--border-radius-small);
            font-size: var(--font-size-x-small);
            cursor: pointer;
            transition: var(--transition-normal);
        }

        .select-all {
            color: var(--primary-color);
        }

        .select-all:hover {
            background-color: var(--purple-light);
        }

        .clear {
            color: var(--text-color-medium-dark);
        }

        .clear:hover {
            background-color: var(--grayscale-150);
        }

        .users-container {
            display: flex;
            flex-direction: column;
            gap: var(--spacing-x-small);
            max-height: 200px;
            overflow-y: auto;
            padding: var(--spacing-x-small);
        }

        .users-container::-webkit-scrollbar {
            width: 8px;
        }

        .users-container::-webkit-scrollbar-track {
            background: var(--background-color);
            border-radius: 4px;
        }

        .users-container::-webkit-scrollbar-thumb {
            background: var(--grayscale-300);
            border-radius: 4px;
        }

        .users-container::-webkit-scrollbar-thumb:hover {
            background: var(--grayscale-400);
        }

        .empty-state {
            padding: var(--spacing-normal);
            text-align: center;
            color: var(--text-color-medium-dark);
            font-size: var(--font-size-small);
        }

        .loading {
            padding: var(--spacing-small);
            text-align: center;
            color: var(--text-color-medium-dark);
            font-size: var(--font-size-small);
        }
    `;

    connectedCallback() {
        super.connectedCallback();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
    }

    toggleUserSelection(e) {
        if (!e || !e.detail || !e.detail.user || !e.detail.user.id) {
            console.error('Invalid user selection event', e);
            return;
        }

        const userId = e.detail.user.id;
        console.log('happening')
        if (this.selectedUserIds.includes(userId)) {
            this.selectedUserIds = this.selectedUserIds.filter(id => id !== userId);
        } else {
            this.selectedUserIds = [...this.selectedUserIds, userId];
        }

        this._dispatchSelectionChangedEvent();
    }

    selectAll() {
        // Set selectedUserIds to include all user IDs
        this.selectedUserIds = userListState.users
            .filter(user => user && user.id)
            .map(user => user.id);
        this._dispatchSelectionChangedEvent();
    }

    clearSelection() {
        this.selectedUserIds = [];
        this._dispatchSelectionChangedEvent();
    }

    setUserIds(userIds) {
        this.selectedUserIds = userIds;
    }

    _dispatchSelectionChangedEvent() {
        const selectedUsers = this.selectedUserIds
            .map(id => userListState.users.find(user => user && user.id === id))
            .filter(Boolean);

        this.dispatchEvent(new CustomEvent('selection-changed', {
            detail: {
                selectedUsers,
                count: this.selectedUserIds.length
            },
            bubbles: true,
            composed: true
        }));
    }

    render() {
        if (!userListState.usersLoaded) {
            return html`
                <div class="loading">Loading users...</div>
            `;
        }

        if (!userListState.users || userListState.users.length === 0) {
            return html`
                <div class="empty-state">No users found</div>
            `;
        }

        return html`
            <div class="header">
                <div class="selection-info">
                    <div class="title">Users</div>
                    ${this.selectedUserIds.length > 0 ? html`
                        <div class="selected-count">(${this.selectedUserIds.length} selected)</div>
                    ` : ''}
                </div>

                <div class="action-buttons">
                    ${userListState.users.length > 0 ? html`
                        <button class="select-all" @click=${this.selectAll}>Select All</button>
                    ` : ''}

                    ${this.selectedUserIds.length > 0 ? html`
                        <button class="clear" @click=${this.clearSelection}>Clear</button>
                    ` : ''}
                </div>
            </div>

            <div class="users-container">
                ${userListState.users?.map(item => html`
                    <user-list-item
                            .userData="${item}"
                            ?isSelected=${item && item.id && this.selectedUserIds.includes(item.id)}
                            @user-selected=${this.toggleUserSelection}
                    ></user-list-item>
                `)}
            </div>
        `;
    }
}

customElements.define('your-users-list', UserListComponent);
