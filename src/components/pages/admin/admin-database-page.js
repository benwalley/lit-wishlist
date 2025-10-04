import { LitElement, html, css } from 'lit';
import { observeState } from 'lit-element-state';
import { userState } from '../../../state/userStore.js';
import { customFetch } from '../../../helpers/fetchHelpers.js';
import buttonStyles from '../../../css/buttons.js';
import './database-table-viewer.js';

class AdminDatabasePage extends observeState(LitElement) {
    static get properties() {
        return {
            tables: { type: Array },
            selectedTable: { type: String },
            isLoadingTables: { type: Boolean },
            error: { type: String }
        };
    }

    constructor() {
        super();
        this.tables = [];
        this.selectedTable = '';
        this.isLoadingTables = false;
        this.error = null;
    }

    connectedCallback() {
        super.connectedCallback();
        this.fetchTables();
    }

    async fetchTables() {
        try {
            this.isLoadingTables = true;
            this.error = null;

            const response = await customFetch('/superadmin/database/tables', {}, true);

            if (response.success) {
                this.tables = response.data || [];
                // Auto-select first table if available
                if (this.tables.length > 0 && !this.selectedTable) {
                    this.selectedTable = this.tables[0];
                }
            } else {
                this.error = response.error || 'Failed to fetch tables';
            }
        } catch (err) {
            this.error = 'An error occurred while fetching tables';
            console.error('Error fetching tables:', err);
        } finally {
            this.isLoadingTables = false;
        }
    }

    handleTableSelect(e) {
        this.selectedTable = e.target.value;
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    display: block;
                    padding: var(--spacing-normal-variable);
                    padding-bottom: 100px;
                    max-width: 100%;
                    width: 100%;
                    box-sizing: border-box;
                    overflow: auto;
                }

                h1 {
                    margin: 0 0 var(--spacing-normal) 0;
                    color: var(--text-color-dark);
                }

                .header-section {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: var(--spacing-normal);
                    gap: var(--spacing-normal);
                    flex-wrap: wrap;
                }

                .table-selector {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-small);
                }

                .table-selector label {
                    font-size: var(--font-size-normal);
                    font-weight: 500;
                    color: var(--text-color-dark);
                }

                .table-selector select {
                    padding: var(--spacing-small) var(--spacing-normal);
                    border: 1px solid var(--border-color);
                    border-radius: var(--border-radius-small);
                    background: var(--background-light);
                    color: var(--text-color-dark);
                    cursor: pointer;
                    font-size: var(--font-size-normal);
                    min-width: 200px;
                }

                .table-selector select:hover {
                    border-color: var(--purple-normal);
                }

                .error-container {
                    padding: var(--spacing-normal);
                    background: var(--error-light);
                    border: 1px solid var(--error-color);
                    border-radius: var(--border-radius-normal);
                    color: var(--error-color);
                    margin-bottom: var(--spacing-normal);
                }
            `
        ];
    }

    render() {
        if (!userState.userData?.isSuperAdmin) {
            return html`
                <div>
                    <h1>Access Denied</h1>
                    <p>You do not have permission to access this page.</p>
                </div>
            `;
        }

        return html`
            <div>
                <div class="header-section">
                    <h1>Database Administration</h1>
                    <div class="table-selector">
                        <label>Select Table:</label>
                        <select
                            @change=${this.handleTableSelect}
                            .value=${this.selectedTable}
                            ?disabled=${this.isLoadingTables || this.tables.length === 0}
                        >
                            ${this.isLoadingTables ? html`
                                <option>Loading tables...</option>
                            ` : this.tables.length === 0 ? html`
                                <option>No tables available</option>
                            ` : this.tables.map(table => html`
                                <option value=${table} ?selected=${table === this.selectedTable}>
                                    ${table}
                                </option>
                            `)}
                        </select>
                    </div>
                </div>

                ${this.error ? html`
                    <div class="error-container">
                        ${this.error}
                        <button class="button-primary" @click=${this.fetchTables} style="margin-left: var(--spacing-normal);">
                            Retry
                        </button>
                    </div>
                ` : ''}

                <database-table-viewer .tableName=${this.selectedTable}></database-table-viewer>
            </div>
        `;
    }
}

customElements.define('admin-database-page', AdminDatabasePage);
