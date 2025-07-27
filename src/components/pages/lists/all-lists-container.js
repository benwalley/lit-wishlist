import { LitElement, html, css } from 'lit';
import { userState } from '../../../state/userStore.js';
import { observeState } from 'lit-element-state';
import { getAllAccessibleLists } from '../../../helpers/api/lists.js';
import { listenUpdateList } from '../../../events/eventListeners.js';
import '../../../components/lists/list-item.js';
import '../../../components/loading/skeleton-loader.js';
import '../../global/custom-input.js';

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
            
            list-item {
                --item-background: var(--background-light);
            }

            .lists-container {
                display: grid;
                grid-template-columns: 1fr;
                gap: 16px;
                width: 100%;
            }

            @media (min-width: 930px) {
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

            .search-input custom-input {
                width: 100%;
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
        listenUpdateList(this.fetchLists.bind(this));
    }

    disconnectedCallback() {
        super.disconnectedCallback();
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
        this.filterTerm = e.detail.value.toLowerCase();
    }

    renderSkeletons() {
        return Array(6).fill(0).map(() => html`
            <skeleton-loader type="list-item" height="87px"</skeleton-loader>
        `);
    }

    renderLists() {
        const filteredLists = this.lists.filter(list => {
            if(list.id === 0) return false;
            if(this.filterTerm) {
                return list.listName.toLowerCase().includes(this.filterTerm)
            }
            return true;
        });
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
                        <custom-input 
                            placeholder="Search lists..." 
                            .value=${this.filterTerm}
                            @value-changed=${this._handleFilterChange}
                        ></custom-input>
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
