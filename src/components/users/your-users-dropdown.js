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
        selectedUsers: {type: Object},
    };

    constructor() {
        super();
        this.users = [];
        this.apiEndpoint = '/users/yours';
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
            const users = await response;
            console.log(users)
            this.users = users;

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
        return html`
            <single-select-dropdown
            .items="${this.users}"
                itemKey="id"
                labelField="name"
                .renderer="${(item, isSelected) => html`
                    <user-list-item .userData="${item}" .isSelected="${isSelected}"></user-list-item>
                `}"
          ></single-select-dropdown>`;
    }
}

customElements.define('your-users-dropdown', UserListComponent);
