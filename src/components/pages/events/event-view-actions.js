import {LitElement, html, css} from 'lit';
import '../../global/action-dropdown.js';
import '../../../svg/dots.js';
import '../../../svg/edit.js';
import '../../../svg/delete.js';
import '../../../svg/share.js';
import {messagesState} from "../../../state/messagesStore.js";

export class EventViewActions extends LitElement {
    static properties = {
        event: {type: Object}
    };

    constructor() {
        super();
        this.event = {};
    }

    static get styles() {
        return css`
            :host {
                display: block;
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
            
            dots-icon {
                font-size: var(--font-size-large);
            }
        `;
    }

    _handleEditEvent() {
        const modal = this.shadowRoot.querySelector('edit-event-modal');
        if (modal) {
            modal.openModal(this.event);
        }
    }

    _handleDeleteEvent() {
        console.log('Delete event:', this.event.id);
        // TODO: Implement delete functionality
        messagesState.addMessage('Delete event functionality not yet implemented');
    }

    get _eventActions() {
        return [
            {
                id: 'edit',
                label: 'Edit Event',
                icon: html`<edit-icon></edit-icon>`,
                classes: 'blue-text',
                action: this._handleEditEvent.bind(this)
            },
            {
                id: 'delete',
                label: 'Delete Event',
                icon: html`<delete-icon></delete-icon>`,
                classes: 'danger-text',
                action: this._handleDeleteEvent.bind(this)
            }
        ];
    }


    render() {
        return html`
            ${this._eventActions.length > 0 ? html`
            <div class="event-actions">
                <action-dropdown .items="${this._eventActions}" placement="bottom-end">
                    <button slot="toggle" aria-label="Event actions">
                        <dots-icon></dots-icon>
                    </button>
                </action-dropdown>
            </div>
            ` : ''}
        `;
    }
}

customElements.define('event-view-actions', EventViewActions);
