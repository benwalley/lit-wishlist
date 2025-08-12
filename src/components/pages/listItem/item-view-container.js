import {LitElement, html, css} from 'lit';
import buttonStyles from "../../../css/buttons";
import scrollbarStyles from "../../../css/scrollbars.js";
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
import '../../../svg/world.js';
import '../../../svg/lock.js';
import '../../global/custom-tooltip.js';
import './list-sidebar.js';
import '../../global/loading-screen.js'
import {cachedFetch, invalidateCache} from "../../../helpers/caching.js";
import {formatDate, getUserImageIdByUserId, getUsernameById} from "../../../helpers/generalHelpers.js";
import {listenUpdateItem, triggerUpdateItem} from "../../../events/eventListeners.js";
import './get-this-button.js';
import './contribute-button.js';
import '../../global/action-dropdown.js';
import './shared-with.js';
import {openEditItemModal} from '../../add-to-list/edit-item-modal.js';
import {messagesState} from "../../../state/messagesStore.js";
import {canUserContribute} from "../../../helpers/userHelpers.js";
import {userState} from "../../../state/userStore.js";
import {observeState} from "lit-element-state";
import {addItemToQueue} from "../../../helpers/viewedItems/index.js";
import {isItemViewed} from "../../../helpers/generalHelpers.js";


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
        this.listId = location.params.listId || '';
    }

    static get styles() {
        return [
            buttonStyles,
            scrollbarStyles,
            css`
                :host {
                    display: block;
                    height: 100%;
                    overflow: hidden;
                }

                .item-title {
                    line-height: 1;
                }

                .gift-for {
                    display: flex;
                    flex-direction: row;
                    gap: var(--spacing-small);
                    
                    a {
                        font-size: var(--font-size-medium);
                        color: var(--text-color-dark);
                        text-decoration: none;
                        font-weight: bold;
                    }
                }

                .gift-for .right-side {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-x-small);
                }

                .gift-for-header {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-x-small);
                }

                .privacy-icon {
                    font-size: var(--font-size-medium);
                    position: relative;
                    cursor: help;
                }

                .privacy-icon world-icon {
                    color: var(--purple-normal);
                }

                .privacy-icon lock-icon {
                    color: var(--text-color-medium-dark);
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
                    
                    /* When no listId (standalone mode), use 2-column layout */
                    main.main-content.no-sidebar {
                        grid-template-columns: 1fr 1fr;
                    }
                }
                
                .main-content-wrapper {
                    grid-column: 1 / span 2;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: var(--spacing-normal);
                    overflow: auto;
                    padding: var(--spacing-normal) var(--spacing-normal-variable) var(--spacing-large) var(--spacing-normal-variable);
                    max-width: 1000px;
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
                
                aside.right-column {
                    width: 300px;
                    display: none;
                    border-left: 1px solid var(--border-color);
                    background: var(--background-light);
                    padding: var(--spacing-small);
                    display: none;
                    overflow: auto;

                    h2 {
                        margin-top: 0;
                    }
                }

                @media (min-width: 1400px) {
                    aside.right-column {
                        display: block;
                    }
                    
                    /* Hide sidebar when no listId (standalone mode) */
                    aside.right-column.hidden {
                        display: none;
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
                
                .gift-for-label {
                    color: var(--medium-text-color);
                }

                .left-column {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-normal);
                }
                
                loading-screen {
                    grid-column: 1 / -1;
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

                // Mark item as viewed if user is authenticated and item hasn't been viewed yet
                if (userState.userData?.id && this.itemId && !isItemViewed(this.itemId)) {
                    addItemToQueue(parseInt(this.itemId));
                }
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
                <main class="main-content ${this.sidebarExpanded ? 'expanded' : 'collapsed'} ${!this.listId ? 'no-sidebar' : ''}"
                      aria-busy="${this.loading ? 'true' : 'false'}">
                    ${this.loading
                            ? html`<loading-screen></loading-screen>`
                            : html`
                                <div class="main-content-wrapper custom-scrollbar">
                                    <div class="left-column">
                                        <all-images-display .itemData="${this.itemData}"></all-images-display>
                                        <shared-with .itemData="${this.itemData}"></shared-with>
                                    </div>
                                    <div class="details-section">
                                        ${this.itemData?.createdById ? html`
                                            <div class="gift-for">
                                                <custom-avatar
                                                    size="50"
                                                    shadow
                                                    round
                                                    username="${getUsernameById(this.itemData.createdById)}"
                                                    imageId="${getUserImageIdByUserId(this.itemData.createdById)}"
                                                ></custom-avatar>
                                                <div class="right-side">
                                                    <div class="gift-for-header">
                                                        <div class="gift-for-label">Gift for</div>
                                                    </div>
                                                    <a href="/user/${this.itemData.createdById}">
                                                        ${getUsernameById(this.itemData.createdById)}
                                                    </a>
                                                </div>
                                                <div class="privacy-icon">
                                                    ${this.itemData.isPublic ? html`
                                                                <world-icon></world-icon>
                                                                <custom-tooltip>This item is public and can be seen by anyone</custom-tooltip>
                                                            ` : html`
                                                                <lock-icon></lock-icon>
                                                                <custom-tooltip>This item is private and can only be seen by users and groups it's been shared with</custom-tooltip>
                                                            `}
                                                </div>
                                            </div>
                                        ` : ''}
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

                    ${this.listId ? html`
                    <aside
                            class="right-column custom-scrollbar ${this.sidebarExpanded ? 'expanded' : 'collapsed'}"
                            id="sidebar"
                            aria-label="Other Items in This List"
                    >
                        <list-sidebar
                                .listId="${this.listId}"
                                .expanded="${this.sidebarExpanded}"
                                @sidebar-toggle="${this.handleSidebarToggle}"
                        ></list-sidebar>
                    </aside>
                    ` : ''}
                </main>

                <!-- Sidebar wrapped in an <aside> with an accessible name -->

            </div>
        `;
    }
}

customElements.define('item-view-container', CustomElement);
