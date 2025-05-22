import {LitElement, html, css} from 'lit';
import buttonStyles from "../../../css/buttons.js";
import '../../../svg/success.js';
import '../../../svg/contribute.js';
import {listenUpdateItem} from "../../../events/eventListeners.js";
import {fetchGiftsUserIsGetting} from "../../../helpers/api/gifts.js";
import '../../global/floating-box.js';
import '../account/avatar.js';
import '../../loading/skeleton-loader.js';
import './gift-tracking-loader.js';
import './gift-tracking-row.js';
import {messagesState} from "../../../state/messagesStore.js";
import {getUsernameById} from "../../../helpers/generalHelpers.js";
import {processContributionsData} from "./gift-giving-helpers.js";
import {observeState} from "lit-element-state";


export class GiftTrackingGetting extends observeState(LitElement) {
    static properties = {
        contributionsData: {type: Array},
        sortedByUser: {type: Array},
        loading: {type: Boolean},
    };

    constructor() {
        super();
        this.contributionsData = [];
        this.sortedByUser = [];
        this.loading = true;
    }

    connectedCallback() {
        super.connectedCallback();
        this.fetchGettingData();
        listenUpdateItem(() => {
            this.fetchGettingData();
        });
    }

    async fetchGettingData() {
        this.loading = true;

        try {
            const response = await fetchGiftsUserIsGetting()
            if (response.success) {
                this.contributionsData = response.data;
                this.sortedByUser = processContributionsData(response.data);
                return;
            }
            messagesState.addMessage('An error occurred while fetching your gift tracking data.', 'error');

        } catch (e) {
            messagesState.addMessage('An error occurred while fetching your gift tracking data.', 'error');
        } finally {
            this.loading = false;
        }
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    display: block;
                    position: relative;
                    --gift-tracking-columns: 200px 1fr 200px 80px 80px 40px;
                }
                
                .save-button {
                    position: absolute;
                    right: 0;
                    bottom: calc(100% + 10px);
                }
                
                .user-group {
                    border-top: 1px solid var(--grayscale-300);
                }

                .groups-container {
                    display: flex;
                    flex-direction: column;
                    background: var(--background-light);
                }

                .empty-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: var(--spacing-large);
                    text-align: center;
                    gap: var(--spacing-small);
                    background-color: var(--background-light);
                    border-radius: var(--border-radius-normal);
                }
                
                .table-header {
                    display: grid;
                    grid-template-columns:var(--gift-tracking-columns);
                    
                    .table-header-name {
                        border: 0.5px solid var(--grayscale-300);
                        padding: var(--spacing-x-small);
                        line-height: 1;
                    }
                }

                .item-count {
                    display: none;
                }
            `
        ];
    }

    _handleSubmit() {
        console.log('submitting')
    }

    render() {
        return html`
            ${this.loading ? html`
                <gift-tracking-loader></gift-tracking-loader>
            ` : this.sortedByUser.length === 0 ? html`
                <div class="empty-state">
                    <p>You haven't gotten any gifts yet.</p>
                    <p>Visit a list to start contributing!</p>
                    <a href="/lists" class="button primary">Browse Lists</a>
                </div>
            ` : html`
                <button class="save-button primary" @click="${this._handleSubmit}">
                    Save
                </button>
                <div class="groups-container">
                    <div class="table-header">
                        <div class="table-header-name">User</div>
                        <div class="table-header-name">Item</div>
                        <div class="table-header-name">Status</div>
                        <div class="table-header-name">qty</div>
                        <div class="table-header-name">Price</div>
                        <div class="table-header-name"></div>
                    </div>
                    ${this.sortedByUser.map(group => html`
                        <div class="user-group">
                            ${group.items.map((item, index) => html`
                                <gift-tracking-row 
                                    .item=${item} 
                                    compact
                                    .showUsername=${index === 0} 
                                    .lastItem=${index === group.items.length - 1}
                                    .itemIndex=${index}
                                ></gift-tracking-row>
                            `)}
                        </div>
                    `)}
                </div>
            `}
        `;
    }
}

customElements.define('gift-tracking-getting', GiftTrackingGetting);
