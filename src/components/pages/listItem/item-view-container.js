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
import '../../../svg/edit.js';
import './list-sidebar.js';
import {cachedFetch, invalidateCache} from "../../../helpers/caching.js";
import {formatDate} from "../../../helpers/generalHelpers.js";
import {listenUpdateItem, triggerUpdateItem} from "../../../events/eventListeners.js";
import './get-this-button.js';
import './contribute-button.js';
import '../../global/action-dropdown.js';
import {openEditItemModal} from '../../add-to-list/edit-item-modal.js';
import {messagesState} from "../../../state/messagesStore.js";
import {canUserContribute} from "../../../helpers/userHelpers.js";
import {userState} from "../../../state/userStore.js";
import {observeState} from "lit-element-state";


export class CustomElement extends observeState(LitElement) {
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
        this.sidebarExpanded = false;
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
                    height: 100%;
                    overflow: hidden;
                }

                .item-title {
                    line-height: 1;
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
                    overflow: hidden;
                    padding: 0 var(--spacing-normal);
                    box-sizing: border-box;
                    width: 100%;
                    max-width: 1600px;
                    grid-template-columns: 1fr;
                    grid-template-rows: 1fr;
                    gap: var(--spacing-normal) calc(var(--spacing-normal) * 2);
                    color: var(--text-color-dark);
                    /* Transition the grid-template-columns property without delay */
                    transition: grid-template-columns 0.3s ease;
                }

                @media only screen and (min-width: 1000px) {
                    main.main-content {
                        grid-template-columns: 1fr 1fr;

                    }
                }

                @media only screen and (min-width: 1400px) {
                    main.main-content {
                        padding-right: 0;
                        grid-template-columns: 1fr 1fr 320px;
                    }
                }
                
                .main-content-wrapper {
                    grid-column: 1 / span 2;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: var(--spacing-normal);
                    overflow: scroll;
                    padding-bottom: var(--spacing-large);
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
                    gap: var(--spacing-normal);
                    margin-bottom: auto;
                }

                @media only screen and (min-width: 1000px) {
                    .details-section {
                        padding-top: calc(var(--spacing-normal));
                    }
                }

                /* Sidebar styles */

                aside.right-column {
                    width: 300px;
                    display: none;
                    border-left: 1px solid var(--border-color);
                    background: var(--background-light);
                    padding: var(--spacing-small);
                    display: none;
                    overflow: scroll;

                    h2 {
                        margin-top: 0;
                    }
                }

                @media (min-width: 1400px) {
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
        listenUpdateItem(() => this.fetchListData())
    }

    async fetchListData() {
        try {
            const response = await cachedFetch(`/listItems/${this.itemId}`, {}, true);
            if (response.success) {
                this.itemData = response.data;
            } else {
                messagesState.addMessage(response.message || 'there was an error fetching the item', 'error');
            }

        } catch (error) {
            console.error('Error fetching groups:', error);
            this.loading = false;
        } finally {
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
                <main class="main-content ${this.sidebarExpanded ? 'expanded' : 'collapsed'}"
                      aria-busy="${this.loading ? 'true' : 'false'}">
                    ${this.loading
                            ? html`<p>Loading item data…</p>`
                            : html`
                                <div class="main-content-wrapper">
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
                                        ${this.itemData?.itemLinks?.length ? html`
                                        <div class="tile">
                                            <h3 class="section-title">Where to buy</h3>
                                            <links-display .itemData="${this.itemData}"></links-display>
                                        </div>` : ''}
                                        <div class="tile">
                                            <h3 class="section-title">Notes</h3>
                                            <notes-display .itemData="${this.itemData}"></notes-display>
                                        </div>

                                        ${canUserContribute(userState.userData, this.itemData) ? html`
                                        <div class="action-buttons">
                                            <get-this-button .itemId="${this.itemId}"
                                                             .itemData="${this.itemData}"></get-this-button>
                                            <contribute-button .itemId="${this.itemId}"
                                                               .itemData="${this.itemData}"></contribute-button>
                                        </div>
                                    ` : ''}

                                    </div>
                                </div>
                            `}

                    <aside
                            class="right-column ${this.sidebarExpanded ? 'expanded' : 'collapsed'}"
                            id="sidebar"
                            aria-label="Other Items in This List"
                    >
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
