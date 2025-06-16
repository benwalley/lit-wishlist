import {LitElement, html, css} from 'lit';
import buttonStyles from "../../../css/buttons.js";
import {fetchEvent} from "../../../helpers/api/events.js";
import {messagesState} from "../../../state/messagesStore.js";
import '../../loading/skeleton-loader.js';
import '../../../svg/calendar.js';
import '../../../svg/arrow-long-left.js';
import {formatDate, getUsernameById} from "../../../helpers/generalHelpers.js";
import './event-recipient.js';
import './event-view-actions.js';
import {bulkUpdateGiftStatus} from "../../../helpers/api/gifts.js";
import {listenUpdateItem, triggerUpdateItem} from "../../../events/eventListeners.js";
import {observeState} from "lit-element-state";

export class EventViewContainer extends observeState(LitElement) {
    static properties = {
        eventId: {type: String},
        event: {type: Object},
        loading: {type: Boolean},
        daysRemaining: {type: Number},
        saving: {type: Boolean, state: true}
    };

    constructor() {
        super();
        this.eventId = '';
        this.event = {};
        this.loading = true;
        this.daysRemaining = null;
        this.saving = false;
    }

    onBeforeEnter(location, commands, router) {
        this.eventId = location.params.eventId;
    }

    connectedCallback() {
        super.connectedCallback();
        if (this.eventId) {
            this.fetchEventData();
        }
        listenUpdateItem(() => this.fetchEventData())
    }


    async fetchEventData() {
        this.loading = true;

        try {
            const response = await fetchEvent(this.eventId);
            if (response.success) {
                console.log(response.data)
                this.event = response.data || {};
                this.calculateDaysRemaining();
            } else {
                messagesState.addMessage(response.error || 'Failed to fetch event', 'error');
            }
        } catch (error) {
            console.error('Error fetching event:', error);
            messagesState.addMessage('An error occurred while fetching the event', 'error');
        } finally {
            this.loading = false;
        }
    }

    calculateDaysRemaining() {
        const eventDate = this.event?.dueDate;
        if (!eventDate) {
            this.daysRemaining = null;
            return;
        }

        const now = new Date();
        const eventTime = new Date(eventDate);
        const difference = eventTime - now;
        const days = Math.ceil(difference / (1000 * 60 * 60 * 24));

        this.daysRemaining = days > 0 ? days : 0;
    }

    _sortRecipients(recipients) {
        return recipients.slice().sort((a, b) => {
            const usernameA = getUsernameById(a.userId) || '';
            const usernameB = getUsernameById(b.userId) || '';
            return usernameA.toLowerCase().localeCompare(usernameB.toLowerCase());
        });
    }


    async _handleSaveGiftTracking() {
        this.saving = true;

        try {
            const changedItems = [];
            const changedRecipients = [];
            const recipients = this.shadowRoot.querySelectorAll('event-recipient');

            recipients.forEach(recipient => {
                const recipientData = recipient.recipient;
                const recipientId = recipientData?.id;

                if (recipientId) {
                    // Check for recipient status and note changes
                    const hasStatusChanged = recipient.hasStatusChanged;
                    const currentNote = recipientData?.note || '';
                    const originalNote = ''; // You may need to track original note separately
                    const noteChanged = currentNote !== originalNote;

                    if (hasStatusChanged || noteChanged) {
                        changedRecipients.push({
                            recipientId,
                            status: recipientData.status,
                            note: currentNote
                        });
                    }
                }

                const rows = recipient.shadowRoot.querySelectorAll('gift-tracking-row');
                rows.forEach(row => {
                    const statusComponent = row.shadowRoot.querySelector('tracking-status');
                    const qtyComponent = row.shadowRoot.querySelector('tracking-qty-input');
                    const priceComponent = row.shadowRoot.querySelector('tracking-amount-input');
                    const rowId = row.item?.id;
                    if (!rowId) return;

                    // Get current values from components
                    const currentStatus = statusComponent?.status;
                    const currentQty = qtyComponent?.value || 0;
                    const currentPrice = priceComponent?.value || 0;

                    // Get original values for comparison
                    const originalStatus = row.item?.status;
                    const originalQty = row.item?.numberGetting || 0;
                    const originalPrice = row.item?.actualPrice || 0;

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
                        });
                    }
                });
            })



            if (changedItems.length === 0 && changedRecipients.length === 0) {
                messagesState.addMessage('No changes to save');
                return;
            }

            // Send changed items to the server
            const data = {
                changedItems,
                changedRecipients
            }
            const response = await bulkUpdateGiftStatus(data);

            if (response.success) {
                messagesState.addMessage('Gift tracking data updated successfully');
                triggerUpdateItem();
                this.fetchEventData(); // Refresh event data
            } else {
                messagesState.addMessage('Failed to update gift tracking data', 'error');
            }

        } catch (error) {
            console.error('Error in _handleSaveGiftTracking:', error);
            messagesState.addMessage('An error occurred while updating gift tracking data', 'error');
        } finally {
            this.saving = false;
        }
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    display: block;
                    padding: var(--spacing-normal);
                    margin: 0 auto;
                    box-sizing: border-box;
                    width: 100%;
                }

                .back-link {
                    display: inline-flex;
                    align-items: center;
                    gap: var(--spacing-x-small);
                    color: var(--primary-color);
                    text-decoration: none;
                    margin-bottom: var(--spacing-normal);
                    font-weight: 500;
                    transition: var(--transition-normal);
                }

                .back-link:hover {
                    color: var(--blue-normal);
                    transform: translateX(-2px);
                }


                .event-title {
                    margin: 0;
                    font-size: 2rem;
                    line-height: 1;
                    color: var(--text-color-dark);
                }

                .event-date {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-x-small);
                    color: var(--medium-text-color);
                    font-size: var(--font-size-normal);
                }

                .event-content {
                    background: var(--background-light);
                    border: 1px solid var(--border-color);
                    border-radius: var(--border-radius-normal);
                    padding: var(--spacing-large);
                    box-shadow: var(--shadow-0-soft);
                }

                .event-description {
                    color: var(--text-color-medium);
                    line-height: 1.6;
                    margin: 0;
                    font-size: 1.1rem;
                }

                .loading-container {
                    padding: var(--spacing-large);
                }

                .loading-header {
                    margin-bottom: var(--spacing-large);
                    padding-bottom: var(--spacing-normal);
                    border-bottom: 1px solid var(--border-color);
                }

                .loading-content {
                    background: var(--background-light);
                    border: 1px solid var(--border-color);
                    border-radius: var(--border-radius-normal);
                    padding: var(--spacing-large);
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-normal);
                }

                .event-header {
                    margin-bottom: var(--spacing-normal);
                    padding-bottom: var(--spacing-normal);
                    border-bottom: 1px solid var(--border-color);
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    align-items: flex-start;
                    
                    .top-row {
                        display: flex;
                        flex-direction: row;
                        justify-content: space-between;
                        gap: var(--spacing-small);
                        width: 100%;
                    }
                }

                .event-header-left {
                    flex: 1;
                }

                .event-header-right {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-small);
                }

                .days-remaining {
                    color: var(--delete-red);
                    background: var(--delete-red-light);;
                    border-radius: var(--border-radius-normal);
                    padding: var(--spacing-x-small) var(--spacing-small);
                    font-weight: bold;
                    font-size: 1.1rem;
                }

                .recipients-section {
                    margin-top: var(--spacing-large);
                }

                .recipients-section h3 {
                    margin: 0 0 var(--spacing-normal) 0;
                    color: var(--text-color-dark);
                    font-size: 1.2rem;
                }

                .recipients-list {
                    background: var(--background-light);
                    border: 1px solid var(--border-color);
                    border-radius: var(--border-radius-normal);
                    overflow: hidden;
                }
                
                .save-button {
                    display: block;
                    margin-left: auto;
                    margin-bottom: var(--spacing-normal);
                }

            `
        ];
    }

    render() {
        return html`
            ${this.loading ? html`
                <div class="loading-container">
                    <div class="loading-header">
                        <skeleton-loader width="60%" height="32px" style="margin-bottom: var(--spacing-small);"></skeleton-loader>
                        <skeleton-loader width="30%" height="20px"></skeleton-loader>
                    </div>
                    <div class="loading-content">
                        <skeleton-loader width="100%" height="20px"></skeleton-loader>
                        <skeleton-loader width="95%" height="20px"></skeleton-loader>
                        <skeleton-loader width="85%" height="20px"></skeleton-loader>
                        <skeleton-loader width="90%" height="20px"></skeleton-loader>
                    </div>
                </div>
            ` : html`
                <div class="event-header">
                    <div class="top-row">
                        <div class="event-header-left">
                            <h1 class="event-title">${this.event.name || 'Untitled Event'}</h1>
                        </div>
                        
                        <div class="event-header-right">
                            ${this.daysRemaining !== null ? html`
                                <div class="days-remaining">
                                    ${this.daysRemaining === 0 ? 'Today!' : `${this.daysRemaining} days`}
                                </div>
                            ` : ''}
                            
                            <event-view-actions .event="${this.event}"></event-view-actions>
                        </div>
                    </div>
   
                        ${this.event.dueDate ? html`
                            <div class="event-date">
                                <calendar-icon></calendar-icon>
                                <span>Due: ${formatDate(this.event.dueDate)}</span>
                            </div>
                        ` : ''}
                </div>

                <button 
                    class="save-button primary" 
                    @click="${this._handleSaveGiftTracking}"
                    ?disabled="${this.saving}"
                >
                    ${this.saving ? 'Saving...' : 'Save Changes'}
                </button>
                
                ${this.event.recipients && this.event.recipients.length > 0 ? html`
                    <div class="recipients-list">
                        ${this._sortRecipients(this.event.recipients).map(recipient => html`
                            <event-recipient 
                                .recipient=${recipient}
                            ></event-recipient>
                        `)}
                    </div>
                ` : ''}
            `}
            <edit-event-modal></edit-event-modal>
        `;
    }
}

customElements.define('event-view-container', EventViewContainer);
