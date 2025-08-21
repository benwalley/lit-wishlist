import {LitElement, html, css} from 'lit';
import buttonStyles from "../../../css/buttons.js";
import '../../../svg/success.js';
import '../../../svg/contribute.js';
import {listenUpdateItem, triggerUpdateItem} from "../../../events/eventListeners.js";
import {bulkUpdateGiftStatus, fetchGiftsUserIsGetting} from "../../../helpers/api/gifts.js";
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
        sortedByUser: {type: Array},
        loading: {type: Boolean},
        changedItems: {type: Object, state: true},
        saving: {type: Boolean, state: true}
    };

    constructor() {
        super();
        this.sortedByUser = [];
        this.loading = true;
        this.changedItems = {};
        this.saving = false;
    }

    connectedCallback() {
        super.connectedCallback();
        this.fetchGettingData();
        listenUpdateItem(() => {
            this.fetchGettingData();
        });
    }

    disconnectedCallback() {
        super.disconnectedCallback();
    }

    async fetchGettingData() {
        this.loading = true;

        try {
            const {getting, acceptedProposals} = await fetchGiftsUserIsGetting()
            if (getting.success && acceptedProposals.success) {
                this.sortedByUser = processContributionsData(getting.data, acceptedProposals.data);

                return;
            }
            messagesState.addMessage('An error occurred while fetching your gift tracking data.', 'error');

        } catch (e) {
            console.log(e)
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
                    grid-template-columns:var(--gift-tracking-columns);
                    
                    .table-header-name {
                        border: 0.5px solid var(--grayscale-300);
                        padding: var(--spacing-x-small);
                        line-height: 1;
                    }
                    
                    .right-align {
                        text-align: right;
                    }
                }

                .item-count {
                    display: none;
                }
            `
        ];
    }

    async _handleSubmit() {
        this.saving = true;

        try {
            const changedItems = [];
            const rows = this.shadowRoot.querySelectorAll('gift-tracking-row');

            rows.forEach(row => {
                const statusComponent = row.shadowRoot.querySelector('tracking-status');
                const qtyComponent = row.shadowRoot.querySelector('tracking-qty-input');
                const priceComponent = row.shadowRoot.querySelector('tracking-amount-input');
                const type = row.item?.type;
                const rowId = row.item?.id;
                if (!rowId) return;

                // Get current values from components
                const currentStatus = statusComponent?.status;
                const currentQty = qtyComponent?.value || 0;
                const currentPrice = priceComponent?.value || 0;

                // Get original values for comparison
                const originalStatus = row.item?.status;
                const originalQty = row.item?.numberGetting || 0;
                const originalPrice = row.item?.contributeAmount || 0;

                // Check if any values have changed
                const statusChanged = currentStatus !== originalStatus;
                const qtyChanged = currentQty !== originalQty;
                const priceChanged = currentPrice !== originalPrice;

                if (statusChanged || qtyChanged || priceChanged) {
                    changedItems.push({
                        rowId,
                        status: currentStatus,
                        numberGetting: currentQty,
                        actualPrice: currentPrice,
                        type
                    });
                }
            });

            if (changedItems.length === 0) {
                messagesState.addMessage('No changes to save');
                return;
            }

            // Send changed items to the server
            const response = await bulkUpdateGiftStatus(changedItems);

            if (response.success) {
                messagesState.addMessage('Gift tracking data updated successfully');

                triggerUpdateItem();
            } else {
                messagesState.addMessage('Failed to update gift tracking data', 'error');
            }

        } catch (error) {
            console.error('Error in _handleSubmit:', error);
            messagesState.addMessage('An error occurred while updating gift tracking data', 'error');
        } finally {
            this.saving = false;
        }
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
                <button 
                    class="save-button primary" 
                    @click="${this._handleSubmit}"
                >
                    ${this.saving ? 'Saving...' : 'Save Changes'}
                </button>
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
