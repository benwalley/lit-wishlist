import {LitElement, html, css} from 'lit';
import buttonStyles from "../../../css/buttons.js";
import {fetchEvents} from "../../../helpers/api/events.js";
import {messagesState} from "../../../state/messagesStore.js";
import {listenUpdateEvents} from "../../../events/eventListeners.js";
import '../../loading/skeleton-loader.js';
import '../../../svg/calendar.js';
import '../../../svg/plus.js';
import './create-event-modal.js';
import './edit-event-modal.js';
import './event-tile.js';

export class EventsPage extends LitElement {
    static properties = {
        events: {type: Array},
        loading: {type: Boolean}
    };

    constructor() {
        super();
        this.events = [];
        this.loading = true;
    }

    connectedCallback() {
        super.connectedCallback();
        this.fetchEventsData();
        listenUpdateEvents(this.fetchEventsData.bind(this));
    }

    async fetchEventsData() {
        this.loading = true;

        try {
            const response = await fetchEvents();
            if (response.success) {
                const events = response.data || [];
                // Sort events so newest is last (by creation date or id)
                this.events = events.sort((a, b) => {
                    // Use creation date if available, otherwise fall back to id
                    const dateA = a.createdAt ? new Date(a.createdAt) : new Date(a.id);
                    const dateB = b.createdAt ? new Date(b.createdAt) : new Date(b.id);
                    return dateA - dateB;
                });
            } else {
                messagesState.addMessage(response.error || 'Failed to fetch events', 'error');
            }
        } catch (error) {
            console.error('Error fetching events:', error);
            messagesState.addMessage('An error occurred while fetching events', 'error');
        } finally {
            this.loading = false;
        }
    }


    handleCreateEventClick() {
        const modal = this.shadowRoot.querySelector('create-event-modal');
        modal.openModal();
    }


    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    display: block;
                    padding: var(--spacing-normal);
                    max-width: 1200px;
                    margin: 0 auto;
                    width: 100%;
                    box-sizing: border-box;
                }

                .page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: var(--spacing-large);
                }

                .page-title {
                    margin: 0;
                    font-size: 2rem;
                    color: var(--text-color-dark);
                }

                .create-event-button {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-x-small);
                }

                .events-list {
                    display: grid;
                    gap: var(--spacing-normal);
                    grid-template-columns: 1fr;
                }

                @media (min-width: 768px) {
                    .events-list {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }

                @media (min-width: 1024px) {
                    .events-list {
                        grid-template-columns: repeat(3, 1fr);
                    }
                }


                .empty-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: var(--spacing-x-large);
                    text-align: center;
                    gap: var(--spacing-normal);
                    background-color: var(--background-light);
                    border-radius: var(--border-radius-normal);
                    border: 1px solid var(--border-color);
                }

                .empty-state calendar-icon {
                    font-size: 3em;
                    color: var(--medium-text-color);
                }

                .loading-grid {
                    display: grid;
                    gap: var(--spacing-normal);
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                }

                .loading-card {
                    background: var(--background-light);
                    border: 1px solid var(--border-color);
                    border-radius: var(--border-radius-normal);
                    padding: var(--spacing-normal);
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-small);
                }

            `
        ];
    }

    render() {
        return html`
            <div class="page-header">
                <h1 class="page-title">Events</h1>
                <button class="button primary create-event-button" @click="${this.handleCreateEventClick}">
                    <plus-icon></plus-icon>
                    <span>Create Event</span>
                </button>
            </div>

            ${this.loading ? html`
                <div class="loading-grid">
                    ${Array(6).fill().map(() => html`
                        <div class="loading-card">
                            <skeleton-loader width="60%" height="24px"></skeleton-loader>
                            <skeleton-loader width="40%" height="16px"></skeleton-loader>
                            <skeleton-loader width="100%" height="16px"></skeleton-loader>
                            <skeleton-loader width="80%" height="16px"></skeleton-loader>
                        </div>
                    `)}
                </div>
            ` : this.events.length === 0 ? html`
                <div class="empty-state">
                    <calendar-icon></calendar-icon>
                    <h2>No Events Found</h2>
                    <p>There are currently no events to display.</p>
                </div>
            ` : html`
                <div class="events-list">
                    ${this.events.map(event => html`
                        <event-tile .eventData="${event}"></event-tile>
                    `)}
                </div>
            `}

            <create-event-modal></create-event-modal>
            <edit-event-modal></edit-event-modal>
        `;
    }
}

customElements.define('events-page', EventsPage);
