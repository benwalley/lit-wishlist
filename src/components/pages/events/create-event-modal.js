import {LitElement, html, css} from 'lit';
import '../../global/custom-modal.js';
import '../../global/custom-input.js';
import '../../global/due-date-picker.js';
import '../../users/your-users-list.js';
import '../account/avatar.js';
import {messagesState} from '../../../state/messagesStore.js';
import {createEvent} from '../../../helpers/api/events.js';
import {triggerUpdateEvents} from '../../../events/eventListeners.js';
import {observeState} from 'lit-element-state';
import {userState} from '../../../state/userStore.js';
import buttonStyles from '../../../css/buttons.js';
import formStyles from '../../../css/forms.js';
import modalSections from '../../../css/modal-sections.js';

export class CreateEventModal extends observeState(LitElement) {
    static properties = {
        isOpen: {type: Boolean},
        eventName: {type: String, state: true},
        dueDate: {type: String, state: true},
        loading: {type: Boolean, state: true},
        selectedUserIds: {type: Array, state: true},
        selectedUsers: {type: Array, state: true}
    };

    constructor() {
        super();
        this.isOpen = false;
        this.eventName = '';
        this.dueDate = '';
        this.loading = false;
        this.selectedUserIds = [];
        this.selectedUsers = [];
    }

    static get styles() {
        return [
            buttonStyles,
            formStyles,
            modalSections,
            css`

                .form-content {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-normal);
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

    openModal() {
        this.isOpen = true;
        this._resetForm();
    }

    closeModal() {
        this.isOpen = false;
        this._resetForm();
    }

    _resetForm() {
        this.eventName = '';
        this.dueDate = '';
        this.loading = false;
        this.selectedUserIds = [];
        this.selectedUsers = [];
    }

    _handleModalChanged(event) {
        if (!event.detail.isOpen) {
            this.isOpen = false;
            this._resetForm();
        }
    }

    _handleEventNameChanged(event) {
        this.eventName = event.detail.value;
    }

    _handleDueDateChanged(event) {
        this.dueDate = event.detail.value;
    }

    _handleUsersSelectionChanged(event) {
        const selectedUsers = event.detail.selectedUsers || [];
        this.selectedUsers = selectedUsers;
        this.selectedUserIds = this.selectedUsers.map(user => user.id);
    }

    _validateForm() {
        const errors = [];

        if (!this.eventName.trim()) {
            errors.push('Event name is required');
        }

        if (!this.dueDate) {
            errors.push('Due date is required');
        }

        if (this.selectedUsers.length === 0) {
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
                eventData: {
                    name: this.eventName.trim(),
                    dueDate: this.dueDate,
                },
                userIds: this.selectedUserIds,
            };

            const response = await createEvent(eventData);

            if (response.success) {
                messagesState.addMessage('Event created successfully!');
                this.closeModal();
                triggerUpdateEvents();
            } else {
                messagesState.addMessage(response.error || 'Failed to create event', 'error');
            }
        } catch (error) {
            messagesState.addMessage('Failed to create event', 'error');
        } finally {
            this.loading = false;
        }
    }

    _handleCancel() {
        this.closeModal();
    }

    render() {
        return html`
            <custom-modal 
                ?isOpen=${this.isOpen}
                @modal-closed=${this.closeModal}
                maxWidth="600px"
                noPadding
            >
                <div class="modal-container">
                    <div class="modal-header">
                        <h2>Create New Event</h2>
                    </div>

                    <div class="modal-content">
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
                                Choose who you will get gifts for in this event.
                            </div>
                            <div class="user-selector-container">
                                <your-users-list
                                    class="full-width"
                                    apiEndpoint="/users/accessible"
                                    .selectedUsers=${this.selectedUserIds}
                                    @selection-changed=${this._handleUsersSelectionChanged}
                                    multiSelect="true"
                                ></your-users-list>
                            </div>
                            
                            ${this.selectedUsers.length > 0 ? html`
                                <div class="selected-users-display">
                                    ${this.selectedUsers.map(user => html`
                                        <div class="selected-user-chip">
                                            <custom-avatar
                                                size="20"
                                                username="${user.name}"
                                                imageId="${user.image || ''}"
                                                round="true"
                                            ></custom-avatar>
                                            <span>${user.name}</span>
                                        </div>
                                    `)}
                                </div>
                            ` : ''}
                        </div>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button
                            type="button"
                            class="secondary"
                            @click=${this._handleCancel}
                            ?disabled=${this.loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            class="primary"
                            @click=${this._handleSubmit}
                            ?disabled=${this.loading}
                        >
                            ${this.loading ? 'Creating...' : 'Create Event'}
                        </button>
                    </div>
                </div>
            </custom-modal>
        `;
    }
}

customElements.define('create-event-modal', CreateEventModal);
