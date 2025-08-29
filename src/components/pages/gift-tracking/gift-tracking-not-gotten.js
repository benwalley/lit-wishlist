import {LitElement, html, css} from 'lit';
import buttonStyles from "../../../css/buttons.js";
import '../../../svg/hourglass.js';
import '../../../svg/success.js';
import {listenUpdateItem} from "../../../events/eventListeners.js";
import {fetchGiftsUserIsGetting} from "../../../helpers/api/gifts.js";
import '../../global/floating-box.js';
import '../account/avatar.js';
import '../../loading/skeleton-loader.js';
import './gift-tracking-loader.js';
import './gift-tracking-row.js';
import {messagesState} from "../../../state/messagesStore.js";
import {processContributionsData} from "./gift-giving-helpers.js";
import {observeState} from "lit-element-state";

export class GiftTrackingNotGotten extends observeState(LitElement) {
    static properties = {
        sortedByUser: {type: Array},
        loading: {type: Boolean}
    };

    constructor() {
        super();
        this.sortedByUser = [];
        this.loading = true;
    }

    connectedCallback() {
        super.connectedCallback();
        this.fetchNotGottenData();
        listenUpdateItem(() => {
            this.fetchNotGottenData();
        });
    }

    async fetchNotGottenData() {
        this.loading = true;

        try {
            const {getting, acceptedProposals} = await fetchGiftsUserIsGetting();
            if (getting.success && acceptedProposals.success) {
                // Filter only items that are not gotten (status is not 'given')
                const notGottenItems = getting.data.filter(item => 
                    item.status !== 'given' && item.status !== 'wrapped'
                );
                const notGottenProposals = acceptedProposals.data.filter(proposal => 
                    proposal.status !== 'given' && proposal.status !== 'wrapped'
                );
                
                this.sortedByUser = processContributionsData(notGottenItems, notGottenProposals);
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
                    padding-top: var(--spacing-normal);
                    --gift-tracking-columns: 200px 1fr 120px 200px 80px 80px 40px 40px;
                }
                
                .user-group {
                    border-top: 1px solid var(--grayscale-300);
                }

                .groups-container {
                    display: flex;
                    flex-direction: column;
                    background: var(--background-light);
                    box-shadow: var(--shadow-1-soft);
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
                    grid-template-columns: var(--gift-tracking-columns);
                    
                    .table-header-name {
                        border: 0.5px solid var(--grayscale-300);
                        padding: var(--spacing-x-small);
                        line-height: 1;
                    }
                    
                    .right-align {
                        text-align: right;
                    }
                }

                .hourglass-icon {
                    font-size: 3em;
                    color: var(--medium-text-color);
                    margin-bottom: var(--spacing-small);
                }
            `
        ];
    }

    render() {
        return html`
            ${this.loading ? html`
                <gift-tracking-loader></gift-tracking-loader>
            ` : this.sortedByUser.length === 0 ? html`
                <div class="empty-state">
                    <hourglass-icon class="hourglass-icon"></hourglass-icon>
                    <p>Great job! You've gotten all your gifts!</p>
                    <p>All items you're getting have been marked as given or wrapped.</p>
                    <a href="/lists" class="button primary">Browse Lists</a>
                </div>
            ` : html`
                <div class="groups-container">
                    <div class="table-header">
                        <div class="table-header-name">User</div>
                        <div class="table-header-name">Item</div>
                        <div class="table-header-name">Contributors</div>
                        <div class="table-header-name">Status</div>
                        <div class="table-header-name right-align">qty</div>
                        <div class="table-header-name right-align">Price</div>
                        <div class="table-header-name"></div>
                        <div class="table-header-name"></div>
                    </div>
                    ${this.sortedByUser.map(group => html`
                        <div class="user-group">
                            ${group.items.map((item, index) => html`
                                <gift-tracking-row 
                                    .item=${item} 
                                    compact
                                    readOnly
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

customElements.define('gift-tracking-not-gotten', GiftTrackingNotGotten);