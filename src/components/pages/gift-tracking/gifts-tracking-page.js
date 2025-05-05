import {LitElement, html, css} from 'lit';
import buttonStyles from "../../../css/buttons.js";
import '../../../svg/success.js';
import '../../../svg/contribute.js';
import {listenUpdateItem} from "../../../events/eventListeners.js";
import {fetchUserGiftTrackingData} from "../../../helpers/api/gifts.js";
import '../../global/floating-box.js';
import '../account/avatar.js';
import '../../loading/skeleton-loader.js';
import './gift-tracking-loader.js';
import './gift-tracking-row.js';
import './gift-tracking-user-group.js';
import {messagesState} from "../../../state/messagesStore.js";

export class GiftsTrackingPage extends LitElement {
    static properties = {
        contributionsData: {type: Array},
        sortedByUser: {type: Array},
        loading: {type: Boolean},
        error: {type: String}
    };

    constructor() {
        super();
        this.contributionsData = [];
        this.sortedByUser = [];
        this.loading = true;
        this.error = '';
    }

    connectedCallback() {
        super.connectedCallback();
        this.fetchContributionsData();
        listenUpdateItem(() => {
            this.fetchContributionsData();
        });
    }

    async fetchContributionsData() {
        this.loading = true;
        this.error = '';

        try {
            const response = await fetchUserGiftTrackingData();
            if(response.success) {
                this.contributionsData = this.processContributionsData(response.data);
                return;
            }
            messagesState.addMessage('An error occurred while fetching your gift tracking data.', 'error');

        } catch(e) {
            messagesState.addMessage('An error occurred while fetching your gift tracking data.', 'error');
        } finally {
            this.loading = false;
        }
    }

    /**
     * Process the raw contributions data to group items by user
     * @param {Array} data - Raw contribution data
     * @returns {Object} Object with users as keys and arrays of items as values
     */
    processContributionsData(data) {
        const giftGetters = new Map();
        for(const item of data) {
            const userId = item.createdById;
            if(!userId) continue;
            // Check if the item is already in the map
            if(giftGetters.has(userId)) {
                const userItems = giftGetters.get(userId);
                userItems.push(item);
                giftGetters.set(userId, userItems);
            } else {
                giftGetters.set(userId, [item]);
            }
        }
        // convert to array
        const tempArray = [];
        for(const [userId, items] of giftGetters.entries()) {
            const data = {userId: userId, items: items};
            tempArray.push(data);
        }
        this.sortedByUser = tempArray;
        return data; // Return the original data for backward compatibility
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    display: block;
                }
                
                .gift-tracking-container {
                    padding: var(--spacing-normal);
                    max-width: 100%;
                }
                
                .title-bar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: var(--spacing-normal);
                }
                
                .title {
                    margin: 0;
                    font-size: 1.5rem;
                }
                
                .groups-container {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-normal);
                }
                
                .empty-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: var(--spacing-large);
                    text-align: center;
                    gap: var(--spacing-small);
                    background-color: var(--color-background-secondary);
                    border-radius: var(--border-radius-normal);
                }
                
                .error-message {
                    color: var(--color-error);
                    padding: var(--spacing-normal);
                    text-align: center;
                    background-color: var(--color-error-light);
                    border-radius: var(--border-radius-normal);
                }
                
                .sub-heading {
                    color: var(--color-text-secondary);
                    font-size: 0.9rem;
                    margin-top: var(--spacing-small);
                }
            `
        ];
    }

    render() {
        return html`
            <div class="gift-tracking-container">
                <div class="title-bar">
                    <div>
                        <h1 class="title">Gift Tracking</h1>
                        <div class="sub-heading">Tracking items you're getting and contributing to</div>
                    </div>
                </div>

                ${this.loading ? html`
                    <gift-tracking-loader></gift-tracking-loader>
                ` : this.error ? html`
                    <div class="error-message">${this.error}</div>
                ` : this.sortedByUser.length === 0 ? html`
                    <div class="empty-state">
                        <p>You haven't contributed to or gotten any gifts yet.</p>
                        <p>Visit a list to start contributing!</p>
                        <a href="/lists" class="button primary">Browse Lists</a>
                    </div>
                ` : html`
                    <div class="groups-container">
                        ${this.sortedByUser.map(group => html`
                            <gift-tracking-user-group .group=${group}></gift-tracking-user-group>
                        `)}
                    </div>
                `}
            </div>
        `;
    }
}

customElements.define('gifts-tracking-page', GiftsTrackingPage);
