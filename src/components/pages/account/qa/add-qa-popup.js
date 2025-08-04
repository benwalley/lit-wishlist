import {LitElement, html, css} from 'lit';
import buttonStyles from "../../../../css/buttons";
import formStyles from "../../../../css/forms";
import '../../../global/custom-input.js'
import '../../../users/your-users-list.js'
import '../../../groups/your-groups-list.js'
import '../../../../svg/message.js';
import '../../../../svg/check.js';
import {messagesState} from "../../../../state/messagesStore.js";
import '../../../global/due-date-picker.js';
import { observeState } from 'lit-element-state';
import { userState } from "../../../../state/userStore.js";
import {createQA, updateQuestion} from "./qa-helpers.js";
import {triggerUpdateQa} from "../../../../events/eventListeners.js";


export class CustomElement extends observeState(LitElement) {
    static properties = {
        questionText: {type: String},
        answerText: {type: String},
        dueDate: {type: String},
        sharedWithUserIds: {type: Array},
        sharedWithGroupIds: {type: Array},
        isAnonymous: {type: Boolean},
        isEditMode: {type: Boolean},
        questionId: {type: Number},
        askedById: {type: Number},
        preSelectedUsers: {type: Array},
    };

    constructor() {
        super();
        this.questionText = '';
        this.answerText = '';
        this.sharedWithUserIds = [];
        this.sharedWithGroupIds = [];
        this.dueDate = '';
        this.isAnonymous = false;
        this.isEditMode = false;
        this.questionId = null;
        this.askedById = null;
        this.preSelectedUsers = [];
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
                    display: flex;
                    padding: var(--spacing-normal-variable);
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
                    background: var(--background-light);
                    border-top: 1px solid var(--border-color);
                    padding: var(--spacing-normal);
                    text-align: right;
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
                
                .checkbox-group {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-small);
                    cursor: pointer;
                }
                
                .checkbox {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-width: 16px;
                    height: 16px;
                    border-radius: 4px;
                    border: 2px solid var(--grayscale-300);
                    transition: var(--transition-normal);
                }

                .checkbox.selected {
                    border-color: var(--blue-normal);
                    background-color: var(--blue-normal);
                    color: white;
                }

                check-icon {
                    width: 16px;
                    height: 16px;
                    color: white;
                }
                
                .anonymous-label {
                    font-weight: bold;
                    font-size: var(--font-size-normal);
                    cursor: pointer;
                }
                
                .sharing-container {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: var(--spacing-normal);
                }
                
                @media only screen and (min-width: 800px) {
                    .sharing-container {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                    }
                }
            `
        ];
    }

    isQuestionCreator() {
        if (!this.isEditMode) {
            return true;
        }
        return userState.userData && userState.userData.id === this.askedById;
    }

    updated(changedProperties) {
        if (changedProperties.has('preSelectedUsers')) {
            if (this.preSelectedUsers.length > 0 && !this.sharedWithUserIds.length) {
                // Defer the update to avoid scheduling during current update cycle
                requestAnimationFrame(() => {
                    this.sharedWithUserIds = [...this.preSelectedUsers];
                });
            }
        }
    }

    editQuestion(data) {
        this.isEditMode = true;
        this.questionText = data.questionText || '';
        this.answerText = data.answerText || '';
        // Convert dueDate to ISO format and extract the date portion for the date picker
        this.dueDate = data.dueDate
            ? new Date(data.dueDate).toISOString().split('T')[0]
            : '';
        this.sharedWithUserIds = data.sharedWithUserIds || [];
        this.sharedWithGroupIds = data.sharedWithGroupIds || [];
        this.isAnonymous = data.isAnonymous || false;
        this.questionId = data.questionId || null;
        this.askedById = data.askedById || null;
    }


    _handleQuestionInput(event) {
        this.questionText = event.target.value;
    }

    _handleAnonymousToggle() {
        this.isAnonymous = !this.isAnonymous;
    }

    _validateInput() {
        const questionText = this.questionText.trim();
        if (questionText.length === 0) {
            messagesState.addMessage('Please enter a question.', 'error');
            return false;
        }

        return true;
    }

    async _handleSubmit() {
        const userIds = this.sharedWithUserIds?.length ? this.sharedWithUserIds : [userState.userData.id];
        // Gather the data
        if (!this._validateInput()) return;
        const questionData = {
            questionText: this.questionText,
            answerText: this.answerText,
            dueDate: this.dueDate,
            sharedWithUserIds: userIds,
            sharedWithGroupIds: this.sharedWithGroupIds,
            isAnonymous: this.isAnonymous,
            isEditMode: this.isEditMode,
            questionId: this.questionId,
        };
        let response
        if (questionData.isEditMode) {
            response = await updateQuestion(questionData);
        } else {
            response = await createQA(questionData);
        }

        if (response.success) {
            messagesState.addMessage(questionData.isEditMode ? 'Question updated successfully!' : 'Question sent successfully!');
            this._handleCancel()
            triggerUpdateQa();
        } else {
            messagesState.addMessage(response.message || 'Failed to save question', 'error');
        }
    }

    clearForm() {
        this.questionText = '';
        this.answerText = '';
        this.dueDate = '';
        this.sharedWithUserIds = [];
        this.sharedWithGroupIds = [];
        this.isAnonymous = false;
        this.isEditMode = false;
        this.questionId = null;
        this.askedById = null;
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
        this.sharedWithUserIds = userIds;
    }

    _handleGroupSelectionChanged(event) {
        const selectedUsers = event.detail.selectedGroups;
        const groupIds = selectedUsers.map(user => user.id);
        this.sharedWithGroupIds = groupIds;
    }

    _handleDueDateChanged(event) {
        this.dueDate = event.detail.value;
    }

    render() {
        return html`
            <h2 class="modal-header">
                Q&A
            </h2>

            <div class="modal-contents">
               <div class="form-group">
                    <label for="questionText" class="section-label" style="margin: 0;">Question:</label>
                     ${this.isQuestionCreator() ? html`<custom-input
                            id="questionText"
                            .value=${this.questionText}
                            @value-changed="${(e) => this.questionText = e.detail.value}"
                            placeholder="Type your question here..."
                            required
                    ></custom-input>` : html`
                        <em style="margin: 0;">${this.questionText}</em>
                     `}
                </div>

                <div class="form-group">
                    <label class="section-label" style="margin: 0;">Your answer:</label>
                    <custom-input
                            .value=${this.answerText || ''}
                            @value-changed="${(e) => this.answerText = e.detail.value}"
                            placeholder="Type your answer here..."
                    ></custom-input>
                </div>

                ${this.isQuestionCreator() ? html`
                <div style="display: flex; flex-direction: column;">
                    <h3 class="section-label">Optionally choose a due date</h3>
                    <due-date-picker 
                            .value="${this.dueDate}"
                            @date-changed="${this._handleDueDateChanged}"
                    ></due-date-picker>
                </div>

                <div class="sharing-container">
                    <div>
                        <h3 class="section-label">Ask everyone in groups</h3>
                        <div class="container">
                            <your-groups-list
                                    class="full-width"
                                    .selectedGroups="${this.sharedWithGroupIds}"
                                    @selection-changed="${this._handleGroupSelectionChanged}"
                            ></your-groups-list>
                        </div>
                    </div>

                    <div>
                        <h3 class="section-label">Ask Users</h3>
                        <div class="container">
                            <your-users-list
                                    apiEndpoint="/users/accessible"
                                    .selectedUsers="${this.sharedWithUserIds}"
                                    @selection-changed="${this._handleUserSelectionChanged}"
                                    requireCurrentUser
                            ></your-users-list>
                        </div>
                    </div>
                </div>` : ''}
              

            </div>
           
            <div class="modal-footer">
                <button class="button secondary" @click=${this._handleCancel}>Cancel</button>
                <button class="button primary" @click=${this._handleSubmit}>
                    <message-icon></message-icon>
                    Save
                </button>
            </div>
        `;
    }
}

customElements.define('add-qa-popup', CustomElement);
