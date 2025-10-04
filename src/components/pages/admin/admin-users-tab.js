import { LitElement, html, css } from 'lit';
import { observeState } from 'lit-element-state';
import { customFetch } from '../../../helpers/fetchHelpers.js';
import '../../loading/skeleton-loader.js';
import '../../global/custom-input.js';
import buttonStyles from '../../../css/buttons.js';

class AdminUsersTab extends observeState(LitElement) {
    static get properties() {
        return {
            users: { type: Array },
            isLoading: { type: Boolean },
            error: { type: String },
            expandedUserId: { type: Number },
            searchQuery: { type: String },
            currentPage: { type: Number },
            pageSize: { type: Number },
            pagination: { type: Object },
            debounceTimeout: { type: Number }
        };
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    display: block;
                }

                .loading-container,
                .error-container {
                    padding: var(--spacing-large);
                    text-align: center;
                }

                .error-container {
                    color: var(--error-color);
                }

                .users-table {
                    width: 100%;
                    border-collapse: collapse;
                    background: var(--background-light);
                    border-radius: var(--border-radius-normal);
                    overflow: hidden;
                    box-shadow: var(--shadow-2-soft);
                }

                .users-table thead {
                    background: var(--purple-lighter);
                }

                .users-table th {
                    padding: var(--spacing-small);
                    text-align: left;
                    font-weight: 600;
                    color: var(--text-dark);
                    border-bottom: 2px solid var(--border-color);
                }

                .users-table td {
                    padding: var(--spacing-small);
                    border-bottom: 1px solid var(--border-color-light);
                    color: var(--text-normal);
                }

                .users-table tbody tr {
                    transition: background-color 0.2s;
                }

                .users-table tbody tr:hover {
                    background: var(--background-hover);
                }

                .expand-button {
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 0;
                    color: var(--purple-normal);
                    font-size: var(--font-size-small);
                }

                .expand-button:hover {
                    color: var(--purple-darker);
                }

                .status-badge {
                    display: inline-block;
                    padding: 2px 8px;
                    border-radius: var(--border-radius-small);
                    font-size: var(--font-size-x-small);
                    font-weight: 600;
                }

                .status-active {
                    background: var(--green-light);
                    color: var(--green-darker);
                }

                .status-inactive {
                    background: var(--delete-red-light);
                    color: var(--delete-red-darker);
                }

                .expanded-content {
                    padding: var(--spacing-small);
                    background: var(--background-darker);
                }

                .expanded-section {
                    margin-bottom: var(--spacing-small);
                }

                .expanded-section h4 {
                    margin: 0 0 var(--spacing-small) 0;
                    color: var(--text-dark);
                    font-size: var(--font-size-normal);
                }

                .lists-grid,
                .groups-grid {
                    display: grid;
                    gap: var(--spacing-small);
                    padding-left: var(--spacing-small);
                }

                .list-item,
                .group-item {
                    padding: var(--spacing-x-small);
                    font-size: var(--font-size-small);
                }

                .no-data {
                    font-style: italic;
                    color: var(--text-color-medium-dark);
                    padding-left: var(--spacing-small);
                }

                .search-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: var(--spacing-normal);
                    gap: var(--spacing-normal);
                    flex-wrap: wrap;
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

                .pagination-container {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: var(--spacing-normal);
                    gap: var(--spacing-normal);
                    flex-wrap: wrap;
                }

                .pagination-info {
                    color: var(--text-color-medium-dark);
                    font-size: var(--font-size-small);
                }

                .pagination-controls {
                    display: flex;
                    gap: var(--spacing-small);
                    align-items: center;
                }

                .page-button {
                    padding: var(--spacing-small) var(--spacing-normal);
                    background: var(--background-light);
                    border: 1px solid var(--border-color);
                    border-radius: var(--border-radius-small);
                    cursor: pointer;
                    font-size: var(--font-size-small);
                    color: var(--text-color-dark);
                    transition: all 0.2s;
                }

                .page-button:hover:not(:disabled) {
                    background: var(--purple-lighter);
                    border-color: var(--purple-normal);
                    color: var(--purple-normal);
                }

                .page-button.active {
                    background: var(--purple-normal);
                    border-color: var(--purple-normal);
                    color: white;
                    font-weight: 600;
                }

                .page-button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .page-ellipsis {
                    padding: var(--spacing-small);
                    color: var(--text-color-medium-dark);
                }

                .page-size-selector {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-small);
                    font-size: var(--font-size-small);
                    color: var(--text-color-medium-dark);
                }

                .page-size-selector select {
                    padding: var(--spacing-small);
                    border: 1px solid var(--border-color);
                    border-radius: var(--border-radius-small);
                    background: var(--background-light);
                    color: var(--text-color-dark);
                    cursor: pointer;
                    font-size: var(--font-size-small);
                }

                .page-size-selector select:hover {
                    border-color: var(--purple-normal);
                }
            `
        ];
    }

    constructor() {
        super();
        this.users = [];
        this.isLoading = true;
        this.error = null;
        this.expandedUserId = null;
        this.searchQuery = '';
        this.currentPage = 1;
        this.pageSize = 20;
        this.pagination = null;
        this.debounceTimeout = null;
    }

    connectedCallback() {
        super.connectedCallback();
        this.fetchUsers();
    }

    async fetchUsers(page = this.currentPage, query = this.searchQuery) {
        try {
            this.isLoading = true;
            this.error = null;

            // Build query string
            const params = new URLSearchParams();
            params.append('page', page.toString());
            params.append('limit', this.pageSize.toString());
            if (query) {
                params.append('query', query);
            }

            const response = await customFetch(`/superadmin/users?${params.toString()}`, {}, true);

            if (response.success) {
                this.users = response.data || [];
                this.pagination = response.pagination || null;
                this.currentPage = page;
                this.searchQuery = query;
            } else {
                this.error = response.error || 'Failed to fetch users';
            }
        } catch (err) {
            this.error = 'An error occurred while fetching users';
            console.error('Error fetching users:', err);
        } finally {
            this.isLoading = false;
        }
    }

    toggleExpand(userId) {
        this.expandedUserId = this.expandedUserId === userId ? null : userId;
    }

    handleSearchChange(e) {
        const value = e.detail.value;

        // Clear existing timeout
        if (this.debounceTimeout) {
            clearTimeout(this.debounceTimeout);
        }

        // Set new timeout for debounced search
        this.debounceTimeout = setTimeout(() => {
            this.fetchUsers(1, value); // Reset to page 1 when searching
        }, 300);
    }

    goToPage(page) {
        if (page < 1 || (this.pagination && page > this.pagination.totalPages)) {
            return;
        }
        this.fetchUsers(page, this.searchQuery);
    }

    handlePageSizeChange(e) {
        this.pageSize = parseInt(e.target.value, 10);
        this.fetchUsers(1, this.searchQuery); // Reset to page 1 when changing page size
    }

    renderPagination() {
        if (!this.pagination || this.pagination.totalPages <= 1) {
            return '';
        }

        const { currentPage, totalPages, total, pageSize } = this.pagination;
        const startItem = (currentPage - 1) * pageSize + 1;
        const endItem = Math.min(currentPage * pageSize, total);

        // Generate page numbers to show
        const pageNumbers = [];
        const maxPagesToShow = 7;

        if (totalPages <= maxPagesToShow) {
            // Show all pages
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            // Show first page, last page, current page and nearby pages
            pageNumbers.push(1);

            if (currentPage > 3) {
                pageNumbers.push('...');
            }

            for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
                if (!pageNumbers.includes(i)) {
                    pageNumbers.push(i);
                }
            }

            if (currentPage < totalPages - 2) {
                pageNumbers.push('...');
            }

            if (!pageNumbers.includes(totalPages)) {
                pageNumbers.push(totalPages);
            }
        }

        return html`
            <div class="pagination-container">
                <div class="pagination-info">
                    Showing ${startItem}-${endItem} of ${total} users
                </div>
                <div class="pagination-controls">
                    <button
                        class="page-button"
                        ?disabled=${currentPage === 1}
                        @click=${() => this.goToPage(currentPage - 1)}
                    >
                        Previous
                    </button>

                    ${pageNumbers.map(page => {
                        if (page === '...') {
                            return html`<span class="page-ellipsis">...</span>`;
                        }
                        return html`
                            <button
                                class="page-button ${page === currentPage ? 'active' : ''}"
                                @click=${() => this.goToPage(page)}
                            >
                                ${page}
                            </button>
                        `;
                    })}

                    <button
                        class="page-button"
                        ?disabled=${currentPage === totalPages}
                        @click=${() => this.goToPage(currentPage + 1)}
                    >
                        Next
                    </button>
                </div>
            </div>
        `;
    }

    renderExpandedContent(user) {
        if (this.expandedUserId !== user.id) return '';

        return html`
            <tr>
                <td colspan="5">
                    <div class="expanded-content">
                        <div class="expanded-section">
                            <h4>Lists (${user.lists?.length || 0})</h4>
                            ${user.lists && user.lists.length > 0 ? html`
                                <div class="lists-grid">
                                    ${user.lists.map(list => html`
                                        <div class="list-item">
                                            <strong>${list.listName}</strong>
                                        </div>
                                    `)}
                                </div>
                            ` : html`<div class="no-data">No lists</div>`}
                        </div>

                        <div class="expanded-section">
                            <h4>Groups (${user.groups?.length || 0})</h4>
                            ${user.groups && user.groups.length > 0 ? html`
                                <div class="groups-grid">
                                    ${user.groups.map(group => html`
                                        <div class="group-item">
                                            ${group.groupName}
                                        </div>
                                    `)}
                                </div>
                            ` : html`<div class="no-data">No groups</div>`}
                        </div>

                        <div class="expanded-section">
                            <h4>Group Invitations (${user.groupInvitations?.length || 0})</h4>
                            ${user.groupInvitations && user.groupInvitations.length > 0 ? html`
                                <div class="groups-grid">
                                    ${user.groupInvitations.map(group => html`
                                        <div class="group-item">
                                            ${group.groupName} (Pending)
                                        </div>
                                    `)}
                                </div>
                            ` : html`<div class="no-data">No pending invitations</div>`}
                        </div>
                    </div>
                </td>
            </tr>
        `;
    }

    renderTable() {
        if (this.users.length === 0) {
            return html`<div class="loading-container">No users found</div>`;
        }

        return html`
            <table class="users-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.users.map(user => html`
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.name || 'N/A'}</td>
                            <td>${user.email || 'N/A'}</td>
                            <td>
                                <span class="status-badge ${user.isActive ? 'status-active' : 'status-inactive'}">
                                    ${user.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </td>
                            <td>
                                <button
                                    class="expand-button"
                                    @click=${() => this.toggleExpand(user.id)}
                                >
                                    ${this.expandedUserId === user.id ? 'Hide Details' : 'Show Details'}
                                </button>
                            </td>
                        </tr>
                        ${this.renderExpandedContent(user)}
                    `)}
                </tbody>
            </table>
        `;
    }

    render() {
        if (this.error) {
            return html`
                <div class="error-container">
                    <p>${this.error}</p>
                    <button class="button-primary" @click=${() => this.fetchUsers()}>Retry</button>
                </div>
            `;
        }

        return html`
            <div class="search-header">
                <div class="pagination-info">
                    ${this.pagination ? html`${this.pagination.total} total users` : ''}
                </div>
                <div style="display: flex; gap: var(--spacing-normal); align-items: center;">
                    <div class="page-size-selector">
                        <label>Show:</label>
                        <select @change=${this.handlePageSizeChange} .value=${this.pageSize.toString()}>
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                    </div>
                    <div class="search-input">
                        <custom-input
                            placeholder="Search by name or email..."
                            .value=${this.searchQuery}
                            @value-changed=${this.handleSearchChange}
                        ></custom-input>
                    </div>
                </div>
            </div>

            ${this.isLoading ? html`
                <div class="loading-container">
                    <skeleton-loader type="table" height="400px"></skeleton-loader>
                </div>
            ` : html`
                ${this.renderTable()}
                ${this.renderPagination()}
            `}
        `;
    }
}

customElements.define('admin-users-tab', AdminUsersTab);
