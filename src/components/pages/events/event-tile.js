import {LitElement, html, css} from 'lit';
import {formatDate} from "../../../helpers/generalHelpers.js";
import '../../global/action-dropdown.js';
import '../../../svg/calendar.js';
import '../../../svg/dots.js';
import '../../../svg/edit.js';
import '../../../svg/delete.js';
import {deleteEvent} from "../../../helpers/api/events.js";
import {triggerUpdateEvents, triggerEditEvent} from "../../../events/eventListeners.js";
import {showConfirmation} from "../../global/custom-confirm/confirm-helper.js";
import {messagesState} from "../../../state/messagesStore.js";

export class EventTile extends LitElement {
    static properties = {
        eventData: {type: Object}
    };

    constructor() {
        super();
        this.eventData = {};
    }

    handleEventClick() {
        if (this.eventData.id) {
            window.location.href = `/events/${this.eventData.id}`;
        }
    }

    getEventActionItems() {
        return [
            {
                id: 'edit',
                label: 'Edit Event',
                icon: html`<edit-icon></edit-icon>`,
                classes: 'blue-text',
                action: () => this.handleEditEvent()
            },
            {
                id: 'delete',
                label: 'Delete Event',
                icon: html`<delete-icon></delete-icon>`,
                classes: 'danger-text',
                action: () => this.handleDeleteEvent()
            }
        ];
    }

    handleEditEvent() {
        triggerEditEvent(this.eventData);
    }

    async handleDeleteEvent() {
        try {
            const confirmed = await showConfirmation({
                heading: 'Delete Event',
                message: `Are you sure you want to delete "${this.eventData.name}"? This action cannot be undone.`,
                confirmLabel: 'Delete',
                cancelLabel: 'Cancel'
            });

            if (confirmed) {
                const response = await deleteEvent(this.eventData.id);
                if (response.success) {
                    messagesState.addMessage('Event deleted successfully');
                    triggerUpdateEvents();
                } else {
                    messagesState.addMessage(response.error || 'Error deleting event. Please try again.', 'error');
                }
            }
        } catch (error) {
            messagesState.addMessage('Error deleting event. Please try again.', 'error');
        }
    }

    static get styles() {
        return css`
            :host {
                display: block;
            }

            .event-card {
                background: var(--background-light);
                border: 1px solid var(--border-color);
                border-radius: var(--border-radius-normal);
                padding: var(--spacing-normal);
                box-shadow: var(--shadow-0-soft);
                cursor: pointer;
                transition: var(--transition-normal);
                text-decoration: none;
                color: inherit;
                position: relative;
                height: 100%;
                box-sizing: border-box;
            }

            .event-card:hover {
                box-shadow: var(--shadow-1-soft);
            }

            .event-title {
                margin: 0 0 var(--spacing-small) 0;
                font-size: 1.2rem;
                font-weight: bold;
                color: var(--text-color-dark);
            }

            .event-date {
                display: flex;
                align-items: center;
                gap: var(--spacing-x-small);
                color: var(--medium-text-color);
                font-size: var(--font-size-small);
                margin-bottom: var(--spacing-small);
            }

            .event-description {
                color: var(--text-color-medium);
                line-height: 1.5;
                margin: 0;
            }

            .event-actions {
                position: absolute;
                top: var(--spacing-x-small);
                right: var(--spacing-x-small);
            }

            .event-actions button {
                border-radius: var(--border-radius-normal);
                padding: var(--spacing-small);
                background: none;
                border: none;
                display: flex;
                color: var(--text-color-dark);
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: var(--transition-normal);
            }

            .event-actions button:hover {
                background: var(--purple-light);
            }
        `;
    }

    render() {
        return html`
            <div class="event-card" @click="${this.handleEventClick}">
                <div class="event-actions" @click="${(e) => e.stopPropagation()}">
                    <action-dropdown .items="${this.getEventActionItems()}" placement="bottom-end">
                        <button slot="toggle" aria-label="Event actions">
                            <dots-icon></dots-icon>
                        </button>
                    </action-dropdown>
                </div>
                <h3 class="event-title">${this.eventData.name || 'Untitled Event'}</h3>
                ${this.eventData.date ? html`
                    <div class="event-date">
                        <calendar-icon></calendar-icon>
                        <span>${formatDate(this.eventData.date)}</span>
                    </div>
                ` : ''}
                ${this.eventData.description ? html`
                    <p class="event-description">${this.eventData.description}</p>
                ` : ''}
            </div>
        `;
    }
}

customElements.define('event-tile', EventTile);
