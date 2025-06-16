import {LitElement, html, css} from 'lit';
import '../../global/custom-modal.js';
import '../../global/custom-input.js';
import '../../global/due-date-picker.js';
import '../../users/your-users-list.js';
import '../account/avatar.js';
import {messagesState} from '../../../state/messagesStore.js';
import {updateEvent} from '../../../helpers/api/events.js';
import {triggerUpdateEvents, listenEditEvent} from '../../../events/eventListeners.js';
import {observeState} from 'lit-element-state';
import {userState} from '../../../state/userStore.js';
import buttonStyles from '../../../css/buttons.js';
import formStyles from '../../../css/forms.js';
import {getUserImageIdByUserId, getUsernameById} from "../../../helpers/generalHelpers.js";

export class EditEventModal extends observeState(LitElement) {
    static properties = {
        isOpen: {type: Boolean},
        eventData: {type: Object},
        eventName: {type: String, state: true},
        dueDate: {type: String, state: true},
        loading: {type: Boolean, state: true},
        selectedUserIds: {type: Array, state: true},
    };

    constructor() {
        super();
        this.isOpen = false;
        this.eventData = null;
        this.eventName = '';
        this.dueDate = '';
        this.loading = false;
        this.selectedUserIds = [];
        this._removeEditEventListener = null;
    }

    connectedCallback() {
        super.connectedCallback();
        this._removeEditEventListener = listenEditEvent(this._handleEditEvent.bind(this));
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this._removeEditEventListener) {
            this._removeEditEventListener();
            this._removeEditEventListener = null;
        }
    }

    _handleEditEvent(event) {
        const eventData = event.detail?.eventData;
        if(!eventData) return;
        this.eventData = eventData;
        this.isOpen = true;
        this._populateForm();
    }

    static get styles() {
        return [
            buttonStyles,
            formStyles,
            css`
                .modal-content {
                    display: flex;
                    flex-direction: column;
                    gap: 0;
                    max-height: 85vh;
                    overflow: hidden;
                }

                .modal-header {
                    text-align: left;
                    border-bottom: 1px solid var(--border-color);
                    padding: var(--spacing-normal);
                }

                .modal-title {
                    font-size: 1.3em;
                    font-weight: bold;
                    color: var(--text-color-dark);
                    margin: 0;
                }

                .form-content {
                    padding: var(--spacing-normal);
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-normal);
                    flex: 1;
                    overflow-y: auto;
                }

                .form-section {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-small);
                }

                .form-section label {
                    font-weight: bold;
                    color: var(--text-color-dark);
                }

                .form-section-description {
                    font-size: 0.9em;
                    color: var(--medium-text-color);
                    margin-bottom: var(--spacing-small);
                }

                .user-selector-container {
                    border-radius: var(--border-radius-normal);
                    border: 1px solid var(--border-color);
                    background: var(--background-dark);
                    overflow-y: auto;
                }

                .selected-users-display {
                    display: flex;
                    flex-wrap: wrap;
                    gap: var(--spacing-small);
                    margin-top: var(--spacing-small);
                }

                .selected-user-chip {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-x-small);
                    background: var(--blue-light);
                    color: var(--blue-normal);
                    padding: var(--spacing-x-small) var(--spacing-small);
                    border-radius: var(--border-radius-large);
                    font-size: var(--font-size-small);
                    font-weight: 500;
                }

                .modal-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: var(--spacing-small);
                    padding: var(--spacing-normal);
                    border-top: 1px solid var(--border-color);
                }

                .form-row {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: var(--spacing-normal);
                }

                @media (min-width: 768px) {
                    .form-row {
                        grid-template-columns: 1fr 1fr;
                    }
                }
            `
        ];
    }

    closeModal() {
        this.isOpen = false;
        this._resetForm();
    }

    _populateForm() {
        this.eventName = this.eventData.name || '';
        // Convert ISO date string to yyyy-MM-dd format for HTML date input
        if (this.eventData.dueDate) {
            const date = new Date(this.eventData.dueDate);
            this.dueDate = date.toISOString().split('T')[0];
        } else {
            this.dueDate = '';
        }
        this.selectedUserIds = this.eventData?.recipients?.map(recipient => recipient.userId) || [];
    }

    _resetForm() {
        this.eventData = null;
        this.eventName = '';
        this.dueDate = '';
        this.loading = false;
        this.selectedUserIds = [];
    }

    _handleModalChanged(event) {
        this.isOpen = event.detail.isOpen;
        if (!this.isOpen) {
            this._resetForm();
        }
    }

    _handleModalClosed(event) {
        this.isOpen = false;
        this._resetForm();
    }

    _handleEventNameChanged(event) {
        this.eventName = event.detail.value;
    }

    _handleDueDateChanged(event) {
        this.dueDate = event.detail.value;
    }

    _handleUsersSelectionChanged(event) {
        const selectedUsers = event.detail.selectedUsers || [];
        this.selectedUserIds = selectedUsers.map(user => user.id);
    }

    _validateForm() {
        const errors = [];

        if (!this.eventName.trim()) {
            errors.push('Event name is required');
        }

        if (!this.dueDate) {
            errors.push('Due date is required');
        }

        if (this.selectedUserIds.length === 0) {
            errors.push('Please select at least one participant');
        }

        return errors;
    }

    async _handleSubmit() {
        const errors = this._validateForm();
        if (errors.length > 0) {
            messagesState.addMessage(errors[0], 'error');
            return;
        }

        this.loading = true;

        try {
            const eventData = {
                eventId: this.eventData.id,
                eventData: {
                    name: this.eventName.trim(),
                    dueDate: this.dueDate,
                },
                userIds: this.selectedUserIds,
            };

            const response = await updateEvent(eventData);

            if (response.success) {
                messagesState.addMessage('Event updated successfully!');
                this.isOpen = false;
                triggerUpdateEvents();
            } else {
                messagesState.addMessage(response.error || 'Failed to update event', 'error');
            }
        } catch (error) {
            messagesState.addMessage('Failed to update event', 'error');
        } finally {
            this.loading = false;
        }
    }

    _handleCancel() {
        this.isOpen = false;
    }

    render() {
        return html`
            <custom-modal 
                ?isOpen=${this.isOpen}
                @modal-changed=${this._handleModalChanged}
                @modal-closed=${this._handleModalClosed}
                maxWidth="600px"
                noPadding
            >
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 class="modal-title">Edit Event</h2>
                    </div>

                    <div class="form-content">
                        <div class="form-row">
                            <div class="form-section">
                                <label>Event Name</label>
                                <custom-input
                                    placeholder="Enter event name"
                                    .value=${this.eventName}
                                    @value-changed=${this._handleEventNameChanged}
                                    required
                                ></custom-input>
                            </div>

                            <div class="form-section">
                                <label>Due Date</label>
                                <due-date-picker
                                    .value=${this.dueDate}
                                    @date-changed=${this._handleDueDateChanged}
                                    required
                                ></due-date-picker>
                            </div>
                        </div>

                        <div class="form-section">
                            <label>Select Participants</label>
                            <div class="form-section-description">
                                Choose who should be invited to this event
                            </div>
                            <div class="user-selector-container">
                                <your-users-list
                                    class="full-width"
                                    apiEndpoint="/users/accessible"
                                    .selectedUserIds=${this.selectedUserIds}
                                    @selection-changed=${this._handleUsersSelectionChanged}
                                    multiSelect="true"
                                ></your-users-list>
                            </div>
                            
                            ${this.selectedUserIds.length > 0 ? html`
                                <div class="selected-users-display">
                                    ${this.selectedUserIds.map(userId => html`
                                        <div class="selected-user-chip">
                                            <custom-avatar
                                                size="20"
                                                username="${getUsernameById(userId)}"
                                                imageId="${getUserImageIdByUserId(userId)}"
                                                round="true"
                                            ></custom-avatar>
                                            <span>${getUsernameById(userId)}</span>
                                        </div>
                                    `)}
                                </div>
                            ` : ''}
                        </div>
                    </div>

                    <div class="modal-actions">
                        <button
                            class="secondary"
                            @click=${this._handleCancel}
                            ?disabled=${this.loading}
                        >
                            Cancel
                        </button>
                        <button
                            class="primary"
                            @click=${this._handleSubmit}
                            ?disabled=${this.loading}
                        >
                            ${this.loading ? 'Updating...' : 'Update Event'}
                        </button>
                    </div>
                </div>
            </custom-modal>
        `;
    }
}

customElements.define('edit-event-modal', EditEventModal);
