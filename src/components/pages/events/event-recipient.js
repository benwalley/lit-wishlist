import {LitElement, html, css} from 'lit';
import buttonStyles from "../../../css/buttons.js";
import formStyles from "../../../css/forms.js";
import '../../global/custom-input.js';
import '../../global/custom-modal.js';
import '../gift-tracking/gift-tracking-row.js';
import {getUserImageIdByUserId, getUsernameById} from "../../../helpers/generalHelpers.js";
import {observeState} from "lit-element-state";
import {eventStatuses} from './event-statuses.js';

export class EventRecipient extends observeState(LitElement) {
    static properties = {
        recipient: {type: Object},
        isEditingNote: {type: Boolean},
        noteText: {type: String},
        originalStatus: {type: String, state: true},
        hasStatusChanged: {type: Boolean, state: true}
    };

    constructor() {
        super();
        this.recipient = {};
        this.isEditingNote = false;
        this.noteText = '';
        this.originalStatus = '';
        this.hasStatusChanged = false;
    }

    static get styles() {
        return [
            buttonStyles,
            formStyles,
            css`
                :host {
                    display: block;
                }

                .recipient-row {
                    display: grid;
                    grid-template-columns: 200px 1fr 120px;
                    gap: var(--spacing-normal);
                    align-items: center;
                    padding: var(--spacing-x-small) var(--spacing-small);
                    border-bottom: 1px solid var(--border-color);
                }

                .recipient-row:hover {
                    background-color: var(--background-light);
                }

                .recipient-name {
                    font-weight: bold;
                    color: var(--text-color-dark);
                }

                .status-select {
                    padding: var(--spacing-x-small) var(--spacing-small);
                    padding-right: 25px;
                    border-radius: var(--border-radius-normal);
                    font-size: var(--font-size-small);
                    font-weight: bold;
                    border: none;
                    text-transform: capitalize;
                    background: var(--background-color);
                    color: var(--text-color-dark);
                    cursor: pointer;
                    appearance: none;
                    -webkit-appearance: none;
                    -moz-appearance: none;
                    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3e%3cpath fill='%23666' d='M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z'/%3e%3c/svg%3e");
                    background-repeat: no-repeat;
                    background-position: right 5px center;
                    background-size: 12px;
                }

                .status-select:focus {
                    outline: none;
                }

                .status-select.changed {
                    border: 2px solid var(--changed-outline-color);
                }

                .budget-input {
                    width: 100%;
                }

                .note {
                    color: var(--text-color-dark);
                    font-size: var(--font-size-small);
                    cursor: pointer;
                    padding: var(--spacing-x-small);
                    border-radius: var(--border-radius-small);
                    transition: background-color 0.2s ease;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    max-width: 100%;
                }

                .note.empty {
                    color: var(--text-color-medium-dark);
                    font-style: italic;
                }

                .note-modal-content {
                    padding: var(--spacing-normal);
                }

                .note-modal-content h3 {
                    margin: 0 0 var(--spacing-normal) 0;
                    color: var(--text-color-dark);
                }

                .note-textarea {
                    width: 100%;
                    min-height: 120px;
                    padding: var(--spacing-small);
                    border: 1px solid var(--border-color);
                    border-radius: var(--border-radius-normal);
                    background: var(--background-color);
                    color: var(--text-color-dark);
                    font-family: inherit;
                    font-size: var(--font-size-normal);
                    resize: vertical;
                    box-sizing: border-box;
                }

                .note-textarea:focus {
                    outline: none;
                    border-color: var(--primary-color);
                    box-shadow: 0 0 0 2px var(--primary-color-light);
                }

                .note-modal-actions {
                    display: flex;
                    gap: var(--spacing-small);
                    justify-content: flex-end;
                    margin-top: var(--spacing-normal);
                }

                .created-date {
                    color: var(--medium-text-color);
                    font-size: var(--font-size-small);
                }
                
                .note-container {
                    textarea {
                        width: 100%;
                        background: none;
                        border: 1px solid var(--border-color);
                        color: var(--text-color-dark);
                        padding: var(--spacing-x-small);
                        box-sizing: border-box;
                    }
                }
                
                .gift-tracking-grid {
                    --gift-tracking-columns: 1fr 200px 150px 80px 80px 40px;
                    display: grid;
                    grid-template-columns: 1fr;
                    overflow: hidden;
                }

                @media (max-width: 768px) {
                    .recipient-row {
                        grid-template-columns: 1fr;
                        gap: var(--spacing-x-small);
                        padding: var(--spacing-normal);
                    }

                    .mobile-label {
                        font-weight: 500;
                        color: var(--medium-text-color);
                        font-size: var(--font-size-small);
                        margin-bottom: var(--spacing-x-small);
                    }

                    .recipient-name {
                        font-size: 1.1rem;
                        margin-bottom: var(--spacing-small);
                    }
                }
            `
        ];
    }

    _handleBudgetChange(event) {
        const newBudget = event.detail.value;
        this.dispatchEvent(new CustomEvent('budget-changed', {
            detail: {
                recipientId: this.recipient.id,
                budget: newBudget
            },
            bubbles: true
        }));
    }

    _formatDate(dateString) {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString();
    }

    _openNoteModal() {
        this.noteText = this.recipient.note || '';
        this.isEditingNote = true;
    }

    _closeNoteModal() {
        this.isEditingNote = false;
        this.noteText = '';
    }

    _handleNoteChange(event) {
        this.recipient.note = event.target.value;
    }

    _handleStatusChange(event) {
        const newStatus = event.target.value;
        // Update the recipient status locally for immediate UI feedback
        this.recipient = { ...this.recipient, status: newStatus };
        this.hasStatusChanged = newStatus !== this.originalStatus;

        this.dispatchEvent(new CustomEvent('status-changed', {
            detail: {
                recipientId: this.recipient.id,
                status: newStatus
            },
            bubbles: true
        }));
    }

    _getStatusStyles(statusId) {
        const status = eventStatuses.find(s => s.id === statusId);
        return status ? `background-color: ${status.backgroundColor}; color: ${status.color};` : '';
    }

    render() {
        if (!this.recipient) return html``;

        return html`
            <div class="recipient-row">
                <a class="recipient-name" href="/user/${this.recipient.userId}">
                    <custom-avatar
                            size="24"
                            username="${getUsernameById(this.recipient?.userId)}"
                            imageId="${getUserImageIdByUserId(this.recipient?.userId)}"
                            round="true"
                    ></custom-avatar>
                    ${getUsernameById(this.recipient?.userId)}
                </a>

                <div class="note-container">
                    <div 
                        class="note ${!this.recipient.note ? 'empty' : ''}" 
                        @click=${this._openNoteModal}
                        title="${this.recipient.note || 'Click to add a note'}"
                    >
                        ${this.recipient.note || 'Add note...'}
                    </div>
                </div>
                <div class="status-container">
                    <select 
                        class="status-select ${this.hasStatusChanged ? 'changed' : ''}"
                        style="${this._getStatusStyles(this.recipient.status)}"
                        @change=${this._handleStatusChange}
                    >
                        ${eventStatuses.map(status => html`
                            <option value="${status.id}" ?selected=${status.id === this.recipient.status}>${status.label}</option>
                        `)}
                    </select>
                </div>
            </div>

            ${this.recipient.getting && this.recipient.getting.length > 0 ? html`
                <div class="gift-tracking-grid">
                    ${this.recipient.getting.map((item, index) => html`
                        <gift-tracking-row 
                            .item=${item}
                            .showUsername=${false}
                            .itemIndex=${index}
                            .lastItem=${index === this.recipient.getting.length - 1}
                        ></gift-tracking-row>
                    `)}
                </div>
            ` : ''}

            <custom-modal 
                ?isOpen=${this.isEditingNote}
                maxWidth="500px"
                @modal-closed=${this._closeNoteModal}
            >
                <div class="note-modal-content">
                    <h3>Edit Note for ${getUsernameById(this.recipient?.userId)}</h3>
                    <textarea 
                        class="note-textarea"
                        .value=${this.noteText}
                        @input=${this._handleNoteChange}
                        placeholder="Add a note..."
                        rows="4"
                    ></textarea>
                    <div class="note-modal-actions">
                        <button class="primary-button" @click=${this._closeNoteModal}>
                            Done
                        </button>
                    </div>
                </div>
            </custom-modal>
        `;
    }
}

customElements.define('event-recipient', EventRecipient);
