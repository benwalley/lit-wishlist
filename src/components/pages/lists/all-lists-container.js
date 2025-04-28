import { LitElement, html, css } from 'lit';
import { userState } from '../../../state/userStore.js';
import { observeState } from 'lit-element-state';
import { getAllAccessibleLists } from '../../../helpers/api/lists.js';
import { listenUpdateList } from '../../../events/eventListeners.js';
import '../../../components/lists/list-item.js';
import '../../../components/loading/skeleton-loader.js';

class AllListsContainer extends observeState(LitElement) {
    static get properties() {
        return {
            lists: { type: Array },
            loading: { type: Boolean },
            filterTerm: { type: String }
        };
    }

    static get styles() {
        return css`
            :host {
                display: block;
                padding: var(--spacing-normal);
            }

            .lists-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 24px;
                gap: 16px;
                flex-wrap: wrap;
            }

            .lists-container {
                display: grid;
                grid-template-columns: 1fr;
                gap: 16px;
                width: 100%;
            }

            @media (min-width: 768px) {
                .lists-container {
                    grid-template-columns: repeat(2, 1fr);
                }
            }

            @media (min-width: 1200px) {
                .lists-container {
                    grid-template-columns: repeat(3, 1fr);
                }
            }

            .search-input {
                display: flex;
                position: relative;
                width: 100%;
                max-width: 300px;
            }

            .search-input input {
                border: 1px solid var(--border-color);
                border-radius: var(--border-radius-normal);
                padding: 8px 12px;
                padding-left: 36px;
                font-size: var(--font-size-normal);
                width: 100%;
                background-color: var(--background-dark);
                color: var(--text-color-dark);
            }

            .search-icon {
                position: absolute;
                left: 12px;
                top: 50%;
                transform: translateY(-50%);
                color: var(--text-color-medium-dark);
            }

            .no-lists {
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
        `;
    }

    constructor() {
        super();
        this.lists = [];
        this.loading = true;
        this.filterTerm = '';
    }

    connectedCallback() {
        super.connectedCallback();
        this.fetchLists();
        this._updateListListener = listenUpdateList(this.fetchLists.bind(this));
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this._updateListListener) {
            this._updateListListener.remove();
        }
    }

    async fetchLists() {
        this.loading = true;

        const response = await getAllAccessibleLists();

        if (response.success) {
            this.lists = response.data;
        } else {
            console.error('Failed to fetch accessible lists:', response.error);
            this.lists = [];
        }

        this.loading = false;
    }

    _handleFilterChange(e) {
        this.filterTerm = e.target.value.toLowerCase();
    }

    renderSkeletons() {
        return Array(6).fill(0).map(() => html`
            <skeleton-loader type="list-item"></skeleton-loader>
        `);
    }

    renderLists() {
        const filteredLists = this.filterTerm
            ? this.lists.filter(list => list.listName.toLowerCase().includes(this.filterTerm))
            : this.lists;

        if (filteredLists.length === 0) {
            return html`<div class="no-lists">
                ${this.filterTerm 
                    ? `No lists matching "${this.filterTerm}" found.` 
                    : "You don't have access to any lists yet."}
            </div>`;
        }

        return filteredLists.map(list => html`
            <list-item .itemData=${list} showOwner></list-item>
        `);
    }

    render() {
        return html`
            
                <div class="lists-header">
                    <h1>All Lists</h1>
                    <div class="search-input">
                        <span class="search-icon">🔍</span>
                        <input 
                            type="text" 
                            placeholder="Search lists..." 
                            @input=${this._handleFilterChange} 
                            .value=${this.filterTerm}
                        >
                    </div>
                </div>
                
                <p class="page-description">
                    All lists you can access, including those from your groups and those shared with you directly.
                </p>
                
                <div class="lists-container">
                    ${this.loading ? this.renderSkeletons() : this.renderLists()}
                </div>
        `;
    }
}

customElements.define('all-lists-container', AllListsContainer);
