import {LitElement, html, css} from 'lit';
import buttonStyles from "../../../css/buttons";
import scrollbarStyles from "../../../css/scrollbars.js";
import {customFetch} from "../../../helpers/fetchHelpers.js";
import '../../global/custom-image.js';
import '../listItem/price-display.js';
import '../listItem/links-display.js';
import '../listItem/notes-display.js';
import '../list/priority-display.js';
import '../listItem/amount-wanted-display.js';
import '../listItem/all-images-display.js';
import '../../../svg/arrow-long-left.js';
import '../../../svg/calendar.js';
import '../../global/loading-screen.js'
import {getPublicListItemById} from "../../../helpers/api/listItems.js";
import {formatDate, getUserImageIdByUserId, getUsernameById} from "../../../helpers/generalHelpers.js";
import '../listItem/shared-with.js';

export class PublicItemView extends LitElement {
    static properties = {
        itemId: {type: String},
        itemData: {type: Object},
        loading: {type: Boolean},
        itemNotFound: {type: Boolean},
    };

    constructor() {
        super();
        this.itemId = '';
        this.itemData = {};
        this.loading = true;
        this.itemNotFound = false;
    }

    onBeforeEnter(location) {
        this.itemId = location.params.itemId;
    }

    static get styles() {
        return [
            buttonStyles,
            scrollbarStyles,
            css`
                :host {
                    display: block;
                    height: 100%;
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

                .containing-element {
                    display: grid;
                    height: 100%;
                    width: 100%;
                    position: relative;
                    grid-template-rows: auto 1fr;
                    grid-template-columns: 1fr;
                    transition: var(--transition-normal);
                }

                .main-content-wrapper {
                    margin: 0 auto;
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: var(--spacing-normal);
                    overflow: auto;
                    padding: var(--spacing-medium-variable) var(--spacing-normal-variable) var(--spacing-large) var(--spacing-normal-variable);
                    max-width: 1000px;
                }
                
                @media only screen and (min-width: 700px) {
                    .main-content-wrapper {
                        grid-template-columns: 1fr 1fr;
                        grid-column: 1 / span 2;
                    }
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

                .not-found-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: var(--spacing-large);
                    text-align: center;
                    min-height: 400px;
                }

                .not-found-message {
                    font-size: var(--font-size-large);
                    color: var(--text-color-medium-dark);
                    margin-bottom: var(--spacing-normal);
                }

                .not-found-subtitle {
                    font-size: var(--font-size-medium);
                    color: var(--text-color-light);
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
            const response = await getPublicListItemById(this.itemId);
            if (response.success) {
                this.itemData = response.data;
                this.itemNotFound = false;
            } else {
                this.itemNotFound = true;
            }
        } catch (error) {
            console.error('Error fetching item:', error);
            this.itemNotFound = true;
        } finally {
            this.loading = false;
        }
    }


    render() {
        if (this.loading) {
            return html`
                <loading-screen></loading-screen>`;
        }

        if (this.itemNotFound) {
            return html`
                <div class="not-found-container">
                    <h2 class="not-found-message">Public Item Not Found</h2>
                    <p class="not-found-subtitle">This item does not exist or is not publicly accessible.</p>
                </div>
            `;
        }

        return html`
            <main class="main-content-wrapper custom-scrollbar">
                <div class="left-column">
                    <all-images-display .itemData="${this.itemData}"></all-images-display>
                </div>
                <div class="details-section">
                    ${this.itemData?.creator?.id ? html`
                        <div class="gift-for">
                            <custom-avatar
                                    size="50"
                                    shadow
                                    round
                                    username="${this.itemData?.creator?.name || "Anonymous"}"
                                    imageId="${this.itemData?.creator?.image || 0}"
                            ></custom-avatar>
                            <div class="right-side">
                                <div class="gift-for-label">Gift for</div>
                                <a href="/public/user/${this.itemData?.creator?.id}">
                                    ${this.itemData?.creator?.name || "Anonymous"}
                                </a>
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
                                .publicView="${true}"
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
                </div>
            </main>
        `;
    }
}

customElements.define('public-item-view', PublicItemView);
