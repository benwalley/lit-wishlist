import { LitElement, html, css } from 'lit';
import { userListState } from '../../../state/userListStore.js';
import { observeState } from 'lit-element-state';
import '../../../components/loading/skeleton-loader.js';
import '../../global/custom-input.js';
import '../../users/user-list-display-item.js';

class AllUsersContainer extends observeState(LitElement) {
    static get properties() {
        return {
            filterTerm: { type: String }
        };
    }

    static get styles() {
        return css`
            :host {
                display: block;
                padding: var(--spacing-normal-variable);
                padding-bottom: 100px;
                max-width: 1400px;
            }

            .users-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 24px;
                gap: 16px;
                flex-wrap: wrap;
                
            }

            .users-container {
                display: grid;
                grid-template-columns: 1fr;
                gap: var(--spacing-normal-variable);
                width: 100%;
            }

            @media (min-width: 600px) {
                .users-container {
                    grid-template-columns: repeat(2, 1fr);
                }
            }

            @media (min-width: 930px) {
                .users-container {
                    grid-template-columns: repeat(3, 1fr);
                }
            }

            @media (min-width: 1400px) {
                .users-container {
                    grid-template-columns: repeat(4, 1fr);
                }
            }

            .search-input {
                display: flex;
                position: relative;
                width: 100%;
                max-width: 300px;
                --input-background-color: var(--background-light);
            }

            .search-input custom-input {
                width: 100%;
            }

            .no-users {
                text-align: center;
                padding: 48px 24px;
                font-style: italic;
                color: var(--text-color-medium-dark);
                width: 100%;
            }

            h1 {
                margin: 0;
                font-size: var(--font-size-x-large);
                color: var(--text-color-dark);
            }

            .page-description {
                color: var(--text-color-medium-dark);
                margin-bottom: 24px;
            }

            user-list-display-item {
                --item-background: var(--background-light);
            }
        `;
    }

    constructor() {
        super();
        this.filterTerm = '';
    }

    _handleFilterChange(e) {
        this.filterTerm = e.detail.value.toLowerCase();
    }

    renderSkeletons() {
        return Array(6).fill(0).map(() => html`
            <skeleton-loader type="user-item" height="87px"></skeleton-loader>
        `);
    }

    renderUsers() {
        const filteredUsers = userListState.users.filter(user => {
            if (!user?.id) return false;
            if (this.filterTerm) {
                return user.name?.toLowerCase().includes(this.filterTerm);
            }
            return true;
        });

        if (filteredUsers.length === 0) {
            return html`<div class="no-users">
                ${this.filterTerm 
                    ? `No users matching "${this.filterTerm}" found.` 
                    : "You don't have access to any users yet."}
            </div>`;
        }

        return filteredUsers.map(user => html`
            <user-list-display-item .userId=${user.id}></user-list-display-item>
        `);
    }

    render() {
        return html`
            <div class="users-header">
                <h1>All Users</h1>
                <div class="search-input">
                    <custom-input 
                        placeholder="Search users..." 
                        .value=${this.filterTerm}
                        @value-changed=${this._handleFilterChange}
                    ></custom-input>
                </div>
            </div>
            
            <p class="page-description">
                All users you have access to, including those from your groups and those you have directly connected with.
            </p>
            
            <div class="users-container">
                ${!userListState.usersLoaded ? this.renderSkeletons() : this.renderUsers()}
            </div>
        `;
    }
}

customElements.define('all-users-container', AllUsersContainer);
