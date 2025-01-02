import { LitElement, html, css } from 'lit';
import './group-list-item.js';
import { customFetch } from "../../helpers/fetchHelpers.js";
import { createGroup } from "../../helpers/api/users.js";

class UserListComponent extends LitElement {
    static properties = {
        users: { type: Array },
        apiEndpoint: { type: String },
        selectedUsers: { type: Object },
    };

    constructor() {
        super();
        this.users = [];
        this.apiEndpoint = '/users/current';
        this.selectedUsers = new Set();
    }

    static styles = css`
        :host {
            display: block;
            font-family: Arial, sans-serif;
        }

        .group {
            border: 1px solid #ccc;
            padding: 10px;
            margin: 5px 0;
            border-radius: 5px;
        }
    `;

    connectedCallback() {
        super.connectedCallback();
        this.fetchUsers();
    }

    async fetchUsers() {
        try {
            const response = await customFetch(this.apiEndpoint, {}, true);
            if (false) {
                throw new Error(`Failed to fetch users: ${response.statusText}`);
            }
            this.users = await response;
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }

    toggleUserSelection(userId) {
        if (this.selectedUsers.has(userId)) {
            this.selectedUsers.delete(userId);
        } else {
            this.selectedUsers.add(userId);
        }
        this.requestUpdate();
    }

    render() {
        return this.users?.length ? html`
            <div>
                ${this.users && this.users.map(
                       user => html`
                            <user-list-item
                                    .user=${user}
                                    .isSelected=${this.selectedUsers.has(user.id)}
                                    @click=${() => this.toggleUsersSelection(user.id)}>
                            </user-list-item>
                        `
                )}
            </div>
        ` : html`<div>No users found.</div>`;
    }
}

customElements.define('your-users-list', UserListComponent);
