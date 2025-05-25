import {LitElement, html, css} from 'lit';
import {customFetch} from "../../helpers/fetchHelpers.js";
import './user-list-item.js'
import '../global/multi-select-dropdown.js'
import '../global/single-select-dropdown.js'
import '../../svg/check.js'

class UserListComponent extends LitElement {
    static properties = {
        users: {type: Array},
        apiEndpoint: {type: String},
        selectedUsers: {type: Array},
        loading: {type: Boolean},
    };

    constructor() {
        super();
        this.users = [];
        this.apiEndpoint = '/users/yours';
        this.selectedUsers = []; // Using an array now
        this.loading = true;
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
        this.fetchUsers();

        // Bind methods
        this.toggleUserSelection = this.toggleUserSelection.bind(this);
        this.selectAll = this.selectAll.bind(this);
        this.clearSelection = this.clearSelection.bind(this);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
    }

    async fetchUsers() {
        try {
            this.loading = true;
            const response = await customFetch(this.apiEndpoint, {}, true);
            const users = await response;
            this.users = users;
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            this.loading = false;
        }
    }

    toggleUserSelection(e) {
        if (!e || !e.detail || !e.detail.user || !e.detail.user.id) {
            console.error('Invalid user selection event', e);
            return;
        }

        const userId = e.detail.user.id;

        // Toggle selection status using array methods
        if (this.selectedUsers.includes(userId)) {
            this.selectedUsers = this.selectedUsers.filter(id => id !== userId);
        } else {
            this.selectedUsers = [...this.selectedUsers, userId];
        }

        this._dispatchSelectionChangedEvent();
        this.requestUpdate();
    }

    selectAll() {
        // Set selectedUsers to include all user IDs
        this.selectedUsers = this.users
            .filter(user => user && user.id)
            .map(user => user.id);
        this._dispatchSelectionChangedEvent();
        this.requestUpdate();
    }

    clearSelection() {
        this.selectedUsers = [];
        this._dispatchSelectionChangedEvent();
        this.requestUpdate();
    }

    _dispatchSelectionChangedEvent() {
        const selectedUsers = this.selectedUsers
            .map(id => this.users.find(user => user && user.id === id))
            .filter(Boolean);

        this.dispatchEvent(new CustomEvent('selection-changed', {
            detail: {
                selectedUsers,
                count: this.selectedUsers.length
            },
            bubbles: true,
            composed: true
        }));
    }

    render() {
        if (this.loading) {
            return html`
                <div class="loading">Loading users...</div>
            `;
        }

        if (!this.users || this.users.length === 0) {
            return html`
                <div class="empty-state">No users found</div>
            `;
        }

        return html`
            <div class="header">
                <div class="selection-info">
                    <div class="title">Users</div>
                    ${this.selectedUsers.length > 0 ? html`
                        <div class="selected-count">(${this.selectedUsers.length} selected)</div>
                    ` : ''}
                </div>

                <div class="action-buttons">
                    ${this.users.length > 0 ? html`
                        <button class="select-all" @click=${this.selectAll}>Select All</button>
                    ` : ''}

                    ${this.selectedUsers.length > 0 ? html`
                        <button class="clear" @click=${this.clearSelection}>Clear</button>
                    ` : ''}
                </div>
            </div>

            <div class="users-container">
                ${this.users.map(item => html`
                    <user-list-item
                            .userData="${item}"
                            ?isSelected=${item && item.id && this.selectedUsers.includes(item.id)}
                            @user-selected=${this.toggleUserSelection}
                    ></user-list-item>
                `)}
            </div>
        `;
    }
}

customElements.define('your-users-list', UserListComponent);
