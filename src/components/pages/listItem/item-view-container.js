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
import './contributors-top-bar.js';
import '../../../svg/arrow-long-left.js';
import '../../../svg/calendar.js';
import '../../../svg/cart.js';
import './list-sidebar.js';
import {cachedFetch, invalidateCache} from "../../../helpers/caching.js";
import {formatDate} from "../../../helpers/generalHelpers.js";
import {triggerUpdateItem} from "../../../events/eventListeners.js";
import './get-this-button.js';
import './contribute-button.js';


export class CustomElement extends LitElement {
    static properties = {
        itemId: {type: String},
        listId: {type: String},
        itemData: {type: Object},
        loading: {type: Boolean},
        sidebarExpanded: {type: Boolean},
        hasLinks: {type: Boolean},
    };

    constructor() {
        super();
        this.itemId = '';
        this.listId = '';
        this.itemData = {};
        this.loading = true;
        this.sidebarExpanded = false;
        this.hasLinks = false;
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

                .item-title {
                    line-height: 1;
                    padding-top: 10px;
                }

                /* Use a grid layout for the overall container */
                .containing-element {
                    display: grid;
                    height: 100%;
                    width: 100%;
                    position: relative;
                    grid-template-rows: auto 1fr;
                    grid-template-columns: 1fr;
                    transition: var(--transition-normal);
                }
                
                main.main-content {
                    display: grid;
                    padding: var(--spacing-normal);
                    padding-top: 0;
                    box-sizing: border-box;
                    width: 100%;
                    grid-template-columns: 1fr 1fr 0;
                    grid-template-rows: auto 1fr;
                    gap: var(--spacing-normal) calc(var(--spacing-normal) * 2);
                    color: var(--text-color-dark);
                    /* Transition the grid-template-columns property without delay */
                    transition: grid-template-columns 0.3s ease;
                }

                /* When hovering over the sidebar, delay the grid expansion by 300ms */
                main.main-content:has(aside.right-column:hover) {
                    grid-template-columns: 1fr 1fr 320px;
                    transition-delay: 300ms;
                }

                contributors-top-bar {
                    grid-column: 1 / span 2;
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
                    gap: var(--spacing-small);
                    margin-bottom: auto;
                    padding-top: var(--spacing-normal);
                }
                
                all-images-display {
                    padding-top: var(--spacing-normal);
                }

                /* Sidebar styles */
                aside.right-column {
                    width: 300px;
                    position: relative;
                    display: none;
                    border-left: 1px solid var(--border-color);
                    background: var(--background-light);
                    padding: var(--spacing-normal);
                    /* Transition border-color immediately and let other properties use the standard transition */
                    transition: border-color 0.1s ease, var(--transition-normal);
                }

                /* When hovering over the sidebar, immediately darken the border */
                aside.right-column:hover {
                    //box-shadow: var(--shadow-2-soft);
                    border-color: var(--grayscale-300);
                    border-width: 3px;
                }

                @media (min-width: 800px) {
                    aside.right-column {
                        display: block;
                    }
                }

                .added-date {
                    margin: 0;
                }

                .tile {
                    border-radius: var(--border-radius-normal);
                    border: 1px solid var(--border-color);
                    background: var(--background-light);
                    padding: 16px;
                    box-shadow: var(--shadow-0-soft);
                    margin-top: var(--spacing-normal);
                }

                .tile h3 {
                    font-weight: bold;
                    font-size: var(--font-size-small);
                    color: var(--text-color-medium-dark);
                    padding-bottom: var(--spacing-small);
                }

                .action-buttons {
                    display: flex;
                    gap: var(--spacing-normal);
                    flex-wrap: wrap;
                    padding-top: var(--spacing-normal);
                }

                .action-buttons button {
                    flex-grow: 1;
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
            for(const item of this.itemData.links) {
                const parsed = JSON.parse(item);
                if (parsed.url) {
                    this.hasLinks = true;
                    break;
                }
            }
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
            <div class="containing-element">
                <contributors-top-bar 
                        .itemId="${this.itemId}" 
                        .listId="${this.listId}"
                        .itemData="${this.itemData}"></contributors-top-bar>
                <main class="main-content ${this.sidebarExpanded ? 'expanded' : 'collapsed'}" aria-busy="${this.loading ? 'true' : 'false'}">
                    ${this.loading
                            ? html`<p>Loading item data…</p>`
                            : html`
                                <all-images-display .itemData="${this.itemData}"></all-images-display>
                                <div class="details-section">
                                    <h1 class="item-title">${this.itemData.name}</h1>
                                    <p class="added-date">
                                        <calendar-icon></calendar-icon>
                                        <span>Added ${formatDate(this.itemData.createdAt)}</span>
                                    </p>
                                    <priority-display
                                            value="${this.itemData?.priority}"
                                            heartSize="20px"
                                    ></priority-display>
                                    <div class="tile">
                                        <price-display .itemData="${this.itemData}" showLabel></price-display>
                                    </div>
                                    <div class="tile">
                                        <h3 class="section-title">Quantity Wanted</h3>
                                        <amount-wanted-display
                                                .itemData="${this.itemData}"
                                        ></amount-wanted-display>
                                    </div>
                                    ${this.hasLinks ? html`<div class="tile">
                                        <h3 class="section-title">Where to buy</h3>
                                        <links-display .itemData="${this.itemData}"></links-display>
                                    </div>` : ''}
                                    <div class="tile">
                                        <h3 class="section-title">Notes</h3>
                                        <notes-display .itemData="${this.itemData}"></notes-display>
                                    </div>
                                    
                                    
                                    <div class="action-buttons">
                                        <get-this-button .itemId="${this.itemId}" .itemData="${this.itemData}"></get-this-button>
                                        <contribute-button .itemId="${this.itemId}" .itemData="${this.itemData}"></contribute-button>
                                    </div>
                                </div>
                            `}

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
                </main>

                <!-- Sidebar wrapped in an <aside> with an accessible name -->
                
            </div>
        `;
    }
}

customElements.define('item-view-container', CustomElement);
