import { LitElement, html, css } from 'lit';
import { observeState } from 'lit-element-state';
import { customFetch } from '../../../helpers/fetchHelpers.js';
import '../../loading/skeleton-loader.js';
import '../../global/custom-input.js';
import buttonStyles from '../../../css/buttons.js';

class DatabaseTableViewer extends observeState(LitElement) {
    static get properties() {
        return {
            tableName: { type: String },
            tableData: { type: Array },
            columns: { type: Array },
            isLoading: { type: Boolean },
            error: { type: String },
            filters: { type: Object },
            idMin: { type: String },
            idMax: { type: String },
            sortBy: { type: String },
            sortOrder: { type: String },
            currentPage: { type: Number },
            pageSize: { type: Number },
            pagination: { type: Object },
            showFilters: { type: Boolean },
            debounceTimeout: { type: Number }
        };
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    display: block;
                    width: 100%;
                    max-width: 100%;
                }

                .loading-container,
                .error-container {
                    padding: var(--spacing-large);
                    text-align: center;
                }

                .error-container {
                    color: var(--error-color);
                }

                .controls-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: var(--spacing-normal);
                    gap: var(--spacing-normal);
                    flex-wrap: wrap;
                    max-width: 100%;
                }

                .controls-left {
                    display: flex;
                    gap: var(--spacing-normal);
                    align-items: center;
                }

                .table-name {
                    font-size: var(--font-size-large);
                    font-weight: 600;
                    color: var(--text-color-dark);
                }

                .filter-toggle {
                    padding: var(--spacing-small) var(--spacing-normal);
                }

                .filters-panel {
                    background: var(--background-light);
                    border: 1px solid var(--border-color);
                    border-radius: var(--border-radius-normal);
                    padding: var(--spacing-normal);
                    margin-bottom: var(--spacing-normal);
                    max-width: 100%;
                    overflow-x: auto;
                }

                .filter-row {
                    display: flex;
                    gap: var(--spacing-normal);
                    margin-bottom: var(--spacing-small);
                    flex-wrap: wrap;
                }

                .filter-group {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-x-small);
                }

                .filter-group label {
                    font-size: var(--font-size-small);
                    font-weight: 500;
                    color: var(--text-color-dark);
                }

                .filter-group input {
                    padding: var(--spacing-small);
                    border: 1px solid var(--border-color);
                    border-radius: var(--border-radius-small);
                    background: var(--background-light);
                    color: var(--text-color-dark);
                    font-size: var(--font-size-small);
                    min-width: 150px;
                }

                .filter-actions {
                    display: flex;
                    gap: var(--spacing-small);
                    margin-top: var(--spacing-small);
                }

                .table-container {
                    overflow-x: auto;
                    margin-bottom: var(--spacing-normal);
                    width: 100%;
                    max-width: 100%;
                }

                .data-table {
                    width: 100%;
                    border-collapse: collapse;
                    background: var(--background-light);
                    border-radius: var(--border-radius-normal);
                    overflow: hidden;
                    box-shadow: var(--shadow-2-soft);
                }

                .data-table thead {
                    background: var(--purple-lighter);
                }

                .data-table th {
                    padding: var(--spacing-small);
                    text-align: left;
                    font-weight: 600;
                    color: var(--text-dark);
                    border-bottom: 2px solid var(--border-color);
                    cursor: pointer;
                    user-select: none;
                    white-space: nowrap;
                }

                .data-table th:hover {
                    background: var(--purple-normal);
                    color: white;
                }

                .data-table th.sorted {
                    background: var(--purple-normal);
                    color: white;
                }

                .sort-indicator {
                    margin-left: var(--spacing-x-small);
                    font-size: var(--font-size-x-small);
                }

                .data-table td {
                    padding: var(--spacing-small);
                    border-bottom: 1px solid var(--border-color-light);
                    color: var(--text-normal);
                    max-width: 300px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .data-table tbody tr {
                    transition: background-color 0.2s;
                }

                .data-table tbody tr:hover {
                    background: var(--background-hover);
                }

                .cell-json {
                    font-family: monospace;
                    font-size: var(--font-size-x-small);
                    color: var(--purple-darker);
                }

                .cell-null {
                    color: var(--text-color-medium-dark);
                    font-style: italic;
                }

                .pagination-container {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: var(--spacing-normal);
                    gap: var(--spacing-normal);
                    flex-wrap: wrap;
                    max-width: 100%;
                    overflow-x: auto;
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

                .no-data {
                    text-align: center;
                    padding: var(--spacing-large);
                    color: var(--text-color-medium-dark);
                    font-style: italic;
                }
            `
        ];
    }

    constructor() {
        super();
        this.tableName = '';
        this.tableData = [];
        this.columns = [];
        this.isLoading = false;
        this.error = null;
        this.filters = {};
        this.idMin = '';
        this.idMax = '';
        this.sortBy = 'id';
        this.sortOrder = 'ASC';
        this.currentPage = 1;
        this.pageSize = 20;
        this.pagination = null;
        this.showFilters = false;
        this.debounceTimeout = null;
    }

    updated(changedProperties) {
        if (changedProperties.has('tableName') && this.tableName) {
            this.resetFilters();
            this.fetchTableData();
        }
    }

    resetFilters() {
        this.filters = {};
        this.idMin = '';
        this.idMax = '';
        this.sortBy = 'id';
        this.sortOrder = 'ASC';
        this.currentPage = 1;
    }

    async fetchTableData() {
        if (!this.tableName) return;

        try {
            this.isLoading = true;
            this.error = null;

            const params = new URLSearchParams();
            params.append('page', this.currentPage.toString());
            params.append('limit', this.pageSize.toString());

            if (this.sortBy) {
                params.append('sortBy', this.sortBy);
                params.append('sortOrder', this.sortOrder);
            }

            if (this.idMin) {
                params.append('idMin', this.idMin);
            }
            if (this.idMax) {
                params.append('idMax', this.idMax);
            }

            Object.keys(this.filters).forEach(key => {
                if (this.filters[key]) {
                    params.append(`filter[${key}]`, this.filters[key]);
                }
            });

            const response = await customFetch(
                `/superadmin/database/${this.tableName}?${params.toString()}`,
                {},
                true
            );

            if (response.success) {
                this.tableData = response.data || [];
                this.pagination = response.pagination || null;

                // Extract columns from first row if data exists
                if (this.tableData.length > 0) {
                    this.columns = Object.keys(this.tableData[0]);
                }
            } else {
                this.error = response.error || 'Failed to fetch table data';
            }
        } catch (err) {
            this.error = 'An error occurred while fetching table data';
            console.error('Error fetching table data:', err);
        } finally {
            this.isLoading = false;
        }
    }

    toggleFilters() {
        this.showFilters = !this.showFilters;
    }

    handleIdMinChange(e) {
        this.idMin = e.target.value;
        this.debouncedFetch();
    }

    handleIdMaxChange(e) {
        this.idMax = e.target.value;
        this.debouncedFetch();
    }

    handleFilterChange(column, value) {
        if (value) {
            this.filters = { ...this.filters, [column]: value };
        } else {
            const newFilters = { ...this.filters };
            delete newFilters[column];
            this.filters = newFilters;
        }
        this.debouncedFetch();
    }

    debouncedFetch() {
        if (this.debounceTimeout) {
            clearTimeout(this.debounceTimeout);
        }

        this.debounceTimeout = setTimeout(() => {
            this.currentPage = 1;
            this.fetchTableData();
        }, 300);
    }

    clearFilters() {
        this.resetFilters();
        this.fetchTableData();
    }

    handleSort(column) {
        if (this.sortBy === column) {
            this.sortOrder = this.sortOrder === 'ASC' ? 'DESC' : 'ASC';
        } else {
            this.sortBy = column;
            this.sortOrder = 'ASC';
        }
        this.fetchTableData();
    }

    goToPage(page) {
        if (page < 1 || (this.pagination && page > this.pagination.totalPages)) {
            return;
        }
        this.currentPage = page;
        this.fetchTableData();
    }

    handlePageSizeChange(e) {
        this.pageSize = parseInt(e.target.value, 10);
        this.currentPage = 1;
        this.fetchTableData();
    }

    formatCellValue(value) {
        if (value === null || value === undefined) {
            return html`<span class="cell-null">NULL</span>`;
        }
        if (typeof value === 'object') {
            return html`<span class="cell-json">${JSON.stringify(value)}</span>`;
        }
        if (typeof value === 'boolean') {
            return value ? 'true' : 'false';
        }
        return value;
    }

    renderFiltersPanel() {
        if (!this.showFilters) return '';

        return html`
            <div class="filters-panel">
                <div class="filter-row">
                    <div class="filter-group">
                        <label>ID Min</label>
                        <input
                            type="number"
                            .value=${this.idMin}
                            @input=${this.handleIdMinChange}
                            placeholder="Min ID"
                        />
                    </div>
                    <div class="filter-group">
                        <label>ID Max</label>
                        <input
                            type="number"
                            .value=${this.idMax}
                            @input=${this.handleIdMaxChange}
                            placeholder="Max ID"
                        />
                    </div>
                </div>

                <div class="filter-actions">
                    <button class="button-secondary" @click=${this.clearFilters}>
                        Clear All Filters
                    </button>
                </div>
            </div>
        `;
    }

    renderPagination() {
        if (!this.pagination || this.pagination.totalPages <= 1) {
            return '';
        }

        const { currentPage, totalPages, total, pageSize } = this.pagination;
        const startItem = (currentPage - 1) * pageSize + 1;
        const endItem = Math.min(currentPage * pageSize, total);

        const pageNumbers = [];
        const maxPagesToShow = 7;

        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
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
                    Showing ${startItem}-${endItem} of ${total} records
                </div>
                <div class="pagination-controls">
                    <div class="page-size-selector">
                        <label>Show:</label>
                        <select @change=${this.handlePageSizeChange} .value=${this.pageSize.toString()}>
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                    </div>

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

    renderTable() {
        if (this.tableData.length === 0) {
            return html`<div class="no-data">No data available</div>`;
        }

        return html`
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            ${this.columns.map(col => html`
                                <th
                                    @click=${() => this.handleSort(col)}
                                    class=${this.sortBy === col ? 'sorted' : ''}
                                >
                                    ${col}
                                    ${this.sortBy === col ? html`
                                        <span class="sort-indicator">
                                            ${this.sortOrder === 'ASC' ? '↑' : '↓'}
                                        </span>
                                    ` : ''}
                                </th>
                            `)}
                        </tr>
                    </thead>
                    <tbody>
                        ${this.tableData.map(row => html`
                            <tr>
                                ${this.columns.map(col => html`
                                    <td title=${JSON.stringify(row[col])}>${this.formatCellValue(row[col])}</td>
                                `)}
                            </tr>
                        `)}
                    </tbody>
                </table>
            </div>
        `;
    }

    render() {
        if (!this.tableName) {
            return html`<div class="no-data">Select a table to view its data</div>`;
        }

        if (this.error) {
            return html`
                <div class="error-container">
                    <p>${this.error}</p>
                    <button class="button-primary" @click=${() => this.fetchTableData()}>Retry</button>
                </div>
            `;
        }

        return html`
            <div class="controls-header">
                <div class="controls-left">
                    <div class="table-name">${this.tableName}</div>
                    <button class="button-secondary filter-toggle" @click=${this.toggleFilters}>
                        ${this.showFilters ? 'Hide Filters' : 'Show Filters'}
                    </button>
                </div>
            </div>

            ${this.renderFiltersPanel()}

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

customElements.define('database-table-viewer', DatabaseTableViewer);
