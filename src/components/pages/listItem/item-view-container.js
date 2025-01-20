import {LitElement, html, css} from 'lit';
import buttonStyles from "../../../css/buttons";
import {customFetch} from "../../../helpers/fetchHelpers.js";
import '../../global/custom-image.js';
import './price-display.js'
import './links-display.js'
import './notes-display.js'
import '../list/priority-display.js'
import './amount-wanted-display.js'
import './all-images-display.js'
import '../../../svg/arrow-long-left.js'
import './list-sidebar.js'
import {cachedFetch} from "../../../helpers/caching.js";

export class CustomElement extends LitElement {
    static properties = {
        itemId: {type: String},
        listId: {type: String},
        itemData: {type: Object},
        loading: {type: Boolean}
    };

    constructor() {
        super();
        this.itemId = '';
        this.listId = '';
        this.itemData = {};
        this.loading = true;
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
                    display: grid;
                    position: relative;
                }

                .left-column {
                    width: 300px;
                    position: absolute;
                    left: 0;
                    top: 0;
                    bottom: 0;
                    border-right: 1px solid var(--border-color);
                    overflow: auto;
                    display: none;
                }
                
                @media (min-width: 800px) {
                    .left-column {
                        display: block;
                    }
                }

                .main-content {
                    display: grid;
                    padding-left: 0;
                    grid-template-columns: 400px 1fr;
                    gap: var(--spacing-normal) var(--spacing-large);
                    color: var(--text-color-dark);
                    padding-bottom: var(--spacing-large);
                }

                @media (min-width: 800px) {
                    .main-content {
                        padding-left: 320px;
                    }
                }

                .back-arrow {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-x-small);
                    color: var(--link-color);
                    text-decoration: none;
                }

                .back-arrow {
                    grid-column: 1 / -1;
                    padding: var(--spacing-normal);
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

            `
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
            console.log(response)
            this.requestUpdate();

        } catch (error) {
            console.error('Error fetching groups:', error);
            this.loading = false
        }
    }

    render() {
        return html`

            <div class="left-column">
                <list-sidebar .listId="${this.listId}"></list-sidebar>
            </div>
            <div class="main-content">
                <a href="/list/${this.listId}" class="back-arrow">
                    <arrow-long-left-icon></arrow-long-left-icon>
                    Back To List
                </a>
                <all-images-display .itemData="${this.itemData}"></all-images-display>
                <div class="details-section">
                    <h1>${this.itemData.name}</h1>
                    <price-display .itemData="${this.itemData}"></price-display>
                    <links-display .itemData="${this.itemData}"></links-display>
                    <h3>Notes</h3>
                    <notes-display .itemData="${this.itemData}"></notes-display>
                    <h3>Priority</h3>
                    <priority-display value="${this.itemData?.priority}"></priority-display>
                    <h3>Number Wanted</h3>
                    <amount-wanted-display .itemData="${this.itemData}"></amount-wanted-display>
                </div>
            </div>

        `;
    }
}

customElements.define('item-view-container', CustomElement);
