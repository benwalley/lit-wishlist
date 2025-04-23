import {LitElement, html, css} from 'lit';
import buttonStyles from "../../../../css/buttons";
import formStyles from "../../../../css/forms";
import '../../../global/custom-input.js'
import '../../../users/your-users-list.js'
import '../../../groups/your-groups-list.js'
import '../../../../svg/message.js';
import {messagesState} from "../../../../state/messagesStore.js";
import '../../../global/due-date-picker.js';
import { observeState } from 'lit-element-state';


export class CustomElement extends observeState(LitElement) {
    static properties = {
        questionText: {type: String},
        dueDate: {type: String},
        shareWithUsers: {type: Array},
        shareWithGroups: {type: Array},
        isAnonymous: {type: Boolean},
        isEditMode: {type: Boolean},
        questionId: {type: Number},
    };

    constructor() {
        super();
        this.questionText = '';
        this.shareWithUsers = [];
        this.shareWithGroups = [];
        this.dueDate = '';
        this.isAnonymous = false;
        this.isEditMode = false;
        this.questionId = null;
    }

    static get styles() {
        return [
            buttonStyles,
            formStyles,
            css`
                :host {
                    display: flex;
                    flex-direction: column;
                }
                .modal-header {
                    padding: var(--spacing-normal);
                    border-bottom: 1px solid var(--border-color);
                    margin: 0;
                }
                
                .modal-contents {
                    padding: var(--spacing-normal);
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-normal);
                }
                
                .container {
                    padding: var(--spacing-x-small);
                    box-sizing: border-box;
                    margin: 0 auto;
                    width: 100%;
                    background: var(--background-color);
                    border-radius: var(--border-radius-normal);
                    border: 1px solid var(--border-color);
                    
                }
                h3 {
                    margin: 0;
                }
                
                .modal-footer {
                    position: sticky;
                    bottom: 0;
                    border-top: 1px solid var(--border-color);
                    padding: var(--spacing-normal);
                    text-align: right;
                    background-color: var(--background-dark);
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: flex-end;
                    gap: var(--spacing-small);
                }
                .section-label {
                    font-weight: bold;
                    display: block;
                    font-size: var(--font-size-normal);
                    padding-bottom: var(--spacing-x-small);
                }
                
                .anonymous-label {
                    font-weight: bold;
                    display: block;
                    font-size: var(--font-size-normal);
                }

            `
        ];
    }

    editQuestion(data) {
        this.isEditMode = true;
        this.questionText = data.questionText || '';
        // Convert dueDate to ISO format and extract the date portion for the date picker
        this.dueDate = data.dueDate
            ? new Date(data.dueDate).toISOString().split('T')[0]
            : '';
        this.shareWithUsers = data.sharedWithUsers || [];
        this.shareWithGroups = data.sharedWithGroups || [];
        this.isAnonymous = data.isAnonymous || false;
        this.questionId = data.questionId || null;
    }


    _handleQuestionInput(event) {
        this.questionText = event.target.value;
    }

    _handleAnonymousChange(event) {
        this.isAnonymous = event.target.checked;
    }

    _validateInput() {
        const questionText = this.questionText.trim();
        if (questionText.length === 0) {
            messagesState.addMessage('Please enter a question.', 'error');
            return false;
        }
        if (this.shareWithUsers.length === 0 && this.shareWithGroups.length === 0) {
            messagesState.addMessage('Please select at least one user or group to share with.', 'error');
            return false;
        }
        return true;
    }

    _handleSubmit() {
        // Gather the data
        if(!this._validateInput()) return;
        const questionData = {
            questionText: this.questionText,
            dueDate: this.dueDate,
            shareWithUsers: this.shareWithUsers,
            shareWithGroups: this.shareWithGroups,
            isAnonymous: this.isAnonymous,
            isEditMode: this.isEditMode,
            questionId: this.questionId,
        };

        // Dispatch an event so the parent component knows data is ready
        this.dispatchEvent(new CustomEvent('submit-question', {
            detail: questionData,
            bubbles: true, // Allow event to bubble up
            composed: true // Allow event to cross shadow DOM boundaries
        }));
        this.clearForm();
    }

    clearForm() {
        this.questionText = '';
        this.isEditMode = false;
        this.questionId = null;
    }

    _handleCancel() {
        this.clearForm();
        this.dispatchEvent(new CustomEvent('cancel-popup', {
            bubbles: true,
            composed: true
        }));
    }

    _handleUserSelectionChanged(event) {
        const selectedUsers = event.detail.selectedUsers;
        const userIds = selectedUsers.map(user => user.id);
        this.shareWithUsers = userIds;
    }

    _handleGroupSelectionChanged(event) {
        const selectedUsers = event.detail.selectedGroups;
        const groupIds = selectedUsers.map(user => user.id);
        this.shareWithGroups = groupIds;
    }

    _handleDueDateChanged(event) {
        this.dueDate = event.detail.value;
    }


    // --- Render Method ---

    render() {
        return html`
            <h2 class="modal-header">
                Ask a Question
            </h2>

            <div class="modal-contents">
                <div class="form-group">
                    <label for="questionText" class="section-label" style="margin: 0;">Your Question:</label>
                    <custom-input
                            id="questionText"
                            .value=${this.questionText}
                            @value-changed="${(e) => this.questionText = e.detail.value}"
                            placeholder="Type your question here..."
                            required
                    ></custom-input>
                </div>


                <div class="checkbox-group">
                    <input
                            type="checkbox"
                            id="anonymousCheck"
                            .checked=${this.isAnonymous}
                            @change=${this._handleAnonymousChange}
                    />
                    <label for="anonymousCheck" class="anonymous-label">Ask Anonymously</label>
                </div>
                
                <div style="display: flex; flex-direction: column;">
                    <h3 class="section-label">Optionally choose a due date</h3>
                    <due-date-picker 
                            .value="${this.dueDate}"
                            @date-changed="${this._handleDueDateChanged}"
                    ></due-date-picker>
                </div>

                <div>
                    <h3 class="section-label">Ask everyone in groups</h3>
                    <div class="container">
                        <your-groups-list 
                                class="full-width"
                                .selectedGroups ="${this.shareWithGroups}"
                                @selection-changed="${this._handleGroupSelectionChanged}"
                        ></your-groups-list>
                    </div>
                </div>

                <div>
                    <h3 class="section-label">Ask Users</h3>
                    <div class="container">
                        <your-users-list 
                                apiEndpoint="/users/accessible"
                                .selectedUsers="${this.shareWithUsers}"
                                @selection-changed="${this._handleUserSelectionChanged}"
                        ></your-users-list>
                    </div>
                </div>
              

            </div>
           
            <div class="modal-footer">
                <button class="button secondary" @click=${this._handleCancel}>Cancel</button>
                <button class="button primary" @click=${this._handleSubmit}>
                    <message-icon></message-icon>
                    Save Question
                </button>
            </div>
        `;
    }
}

customElements.define('add-qa-popup', CustomElement);
