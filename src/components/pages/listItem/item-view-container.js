import {LitElement, html, css} from 'lit';
import buttonStyles from "../../../css/buttons";
import {customFetch} from "../../../helpers/fetchHelpers.js";
import '../../global/custom-image.js';
import './price-display.js';
import './links-display.js';
import './notes-display.js';
import '../list/priority-display.js';
import './amount-wanted-display.js';
import './all-images-display.js';
import '../../../svg/arrow-long-left.js';
import '../../../svg/calendar.js';
import './list-sidebar.js';
import {cachedFetch} from "../../../helpers/caching.js";
import {formatDate} from "../../../helpers/generalHelpers.js";

export class CustomElement extends LitElement {
    static properties = {
        itemId: {type: String},
        listId: {type: String},
        itemData: {type: Object},
        loading: {type: Boolean},
        sidebarExpanded: {type: Boolean},
    };

    constructor() {
        super();
        this.itemId = '';
        this.listId = '';
        this.itemData = {};
        this.loading = true;
        this.sidebarExpanded = true;
    }

    onBeforeEnter(location, commands, router) {
        this.itemId = location.params.itemId;
        this.listId = location.params.listId;
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    display: block;
                }

                /* Use a grid layout for the overall container */

                .containing-element {
                    display: grid;
                    gap: var(--spacing-normal);
                    height: 100%;
                    position: relative;
                    grid-template-columns: 1fr 350px;
                    transition: var(--transition-normal);
                }

                /* When sidebar is collapsed, hide its column */

                .containing-element.collapsed {
                    grid-template-columns: 1fr 0;
                }

                /* Main content styled as a landmark region */

                main.main-content {
                    display: grid;
                    padding-left: 0;
                    grid-template-columns: 1fr 1fr;
                    grid-template-rows: auto 1fr;
                    gap: var(--spacing-normal) var(--spacing-large);
                    color: var(--text-color-dark);
                    padding-bottom: var(--spacing-large);
                    transition: var(--transition-normal);
                }

                .top-row {
                    grid-column: 1 / span 2;

                }

                a.back-arrow {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-x-small);
                    color: var(--link-color);
                    text-decoration: none;
                    padding: 0;
                    padding-top: var(--spacing-normal);
                }

                a.back-arrow:focus {
                    outline: 2px solid var(--focus-color, blue);
                    outline-offset: 2px;
                }

                h1,
                h3 {
                    margin: 0;
                }

                all-images-display {
                    width: 100%;
                }

                price-display {
                    font-size: 1.2em;
                }

                .details-section {
                    display: grid;
                    gap: var(--spacing-normal);
                    margin-bottom: auto;
                }

                /* Sidebar styles; using <aside> below improves accessibility */

                aside.right-column {
                    width: 300px;
                    position: relative;
                    overflow: visible;
                    display: none;
                    transition: var(--transition-normal);
                    border-left: 1px solid var(--border-color);
                    background: var(--background-light);
                    padding: var(--spacing-normal);
                }

                @media (min-width: 800px) {
                    aside.right-column {
                        display: block;
                    }
                }
            `,
        ];
    }

    connectedCallback() {
        super.connectedCallback();
        if (!this.itemId?.length) {
            this.loading = false;
            return;
        }
        this.fetchListData();
    }

    async fetchListData() {
        try {
            const response = await cachedFetch(`/listItems/${this.itemId}`, {}, true);
            if (response?.responseData?.error) {
                console.log('error');
                return;
            }
            this.itemData = response;
            this.loading = false;
            this.requestUpdate();
        } catch (error) {
            console.error('Error fetching groups:', error);
            this.loading = false;
        }
    }

    // Listen for the sidebar-toggle event from the child component.
    handleSidebarToggle(e) {
        this.sidebarExpanded = e.detail.expanded;
    }

    render() {
        return html`
            <div class="containing-element ${this.sidebarExpanded ? 'expanded' : 'collapsed'}">
                <main class="main-content" aria-busy="${this.loading ? 'true' : 'false'}">
                    <div class="top-row">
                        <a
                                href="/list/${this.listId}"
                                class="back-arrow"
                                aria-label="Back to List"
                        >
                            <arrow-long-left-icon aria-hidden="true"></arrow-long-left-icon>
                            Back To List
                        </a>
                    </div>
                    ${this.loading
                            ? html`<p>Loading item data…</p>`
                            : html`
                                <all-images-display .itemData="${this.itemData}"></all-images-display>
                                <div class="details-section">
                                    <h1>${this.itemData.name}</h1>
                                    <p>
                                        <calendar-icon></calendar-icon>
                                        <span>Added ${formatDate(this.itemData.createdAt)}</span>
                                    </p>
                                    <price-display .itemData="${this.itemData}"></price-display>
                                    <links-display .itemData="${this.itemData}"></links-display>
                                    <h3>Notes</h3>
                                    <notes-display .itemData="${this.itemData}"></notes-display>
                                    <h3>Priority</h3>
                                    <priority-display
                                            value="${this.itemData?.priority}"
                                    ></priority-display>
                                    <h3>Number Wanted</h3>
                                    <amount-wanted-display
                                            .itemData="${this.itemData}"
                                    ></amount-wanted-display>
                                </div>
                            `}
                </main>

                <!-- Sidebar wrapped in an <aside> with an accessible name -->
                <aside
                        class="right-column ${this.sidebarExpanded ? 'expanded' : 'collapsed'}"
                        id="sidebar"
                        aria-label="Other Items in This List"
                >
                    <h2>Other Items in This List</h2>
                    <list-sidebar
                            .listId="${this.listId}"
                            .expanded="${this.sidebarExpanded}"
                            @sidebar-toggle="${this.handleSidebarToggle}"
                    ></list-sidebar>
                </aside>
            </div>
        `;
    }
}

customElements.define('item-view-container', CustomElement);
