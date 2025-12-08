import {LitElement, html, css} from 'lit';
import buttonStyles from "../../../../css/buttons";
import formStyles from "../../../../css/forms";
import '../../../global/custom-input.js'
import '../../../global/custom-textarea.js'
import '../../../users/your-users-list.js'
import '../../../groups/your-groups-list.js'
import '../../../../svg/message.js';
import {messagesState} from "../../../../state/messagesStore.js";
import '../../../global/due-date-picker.js';
import '../../../global/custom-toggle.js';
import '../../../../svg/hourglass.js';
import { observeState } from 'lit-element-state';
import { userState } from "../../../../state/userStore.js";
import {createQA, updateQuestion} from "./qa-helpers.js";
import {triggerUpdateNotifications, triggerUpdateQa} from "../../../../events/eventListeners.js";
import {getUsernameById, getUserImageIdByUserId} from "../../../../helpers/generalHelpers.js";
import {getGroupNameById, getGroupImageIdByGroupId} from "../../../../helpers/userHelpers.js";


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
        showOnlyAnswerMode: {type: Boolean},
        onlyCreatorCanSeeResponses: {type: Boolean},
        isSaving: {type: Boolean},
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
        this.showOnlyAnswerMode = false;
        this.onlyCreatorCanSeeResponses = false;
        this.isSaving = false;
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

                .privacy-notice {
                    line-height: 1.4;
                    padding: var(--spacing-normal) 0;
                }
                
                .simple-notice {
                    background: var(--info-yellow-light);
                    padding: var(--spacing-small);
                    border-radius: var(--border-radius-normal);
                    border: 1px solid var(--info-yellow);
                    margin-top: var(--spacing-small);
                }
                
                .edit-notice {
                    background: var(--info-yellow-light);
                    padding: var(--spacing-small);
                    border-radius: var(--border-radius-normal);
                    border: 1px solid var(--info-yellow);
                    margin-top: var(--spacing-small);
                }

                .privacy-section {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-x-small);
                }

                .chips-container {
                    display: flex;
                    flex-wrap: wrap;
                    gap: var(--spacing-x-small);
                    margin-top: var(--spacing-x-small);
                }

                .chip {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-x-small);
                    padding: 2px 10px 2px 2px;
                    border-radius: 20px;
                    font-size: var(--font-size-small);
                    border: 1px solid var(--border-color);
                    background: var(--background-light);
                    color: var(--text-color-dark);
                }

                .group-chip {
                    border-color: var(--purple-normal);
                    background: var(--purple-light);
                    color: var(--purple-darker);
                }

                .user-chip {
                    border-color: var(--blue-normal);
                    background: var(--blue-light);
                    color: var(--blue-darker);
                }

                .chip-link {
                    text-decoration: none;
                    color: inherit;
                    font-weight: 500;
                }

                .chip-link:hover {
                    text-decoration: underline;
                }

                .shared-with-label {
                    font-size: var(--font-size-small);
                    font-weight: 600;
                    color: var(--text-color-dark);
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

    showFullEditMode() {
        return this.isQuestionCreator() && !this.showOnlyAnswerMode;
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
        this.showOnlyAnswerMode = data.showOnlyAnswerMode || false;
        this.onlyCreatorCanSeeResponses = data.onlyCreatorCanSeeResponses !== undefined ? data.onlyCreatorCanSeeResponses : false;
    }


    _handleQuestionInput(event) {
        this.questionText = event.target.value;
    }

    _handleAnonymousToggle() {
        this.isAnonymous = !this.isAnonymous;
    }

    _handlePrivacyToggle(event) {
        this.onlyCreatorCanSeeResponses = event.detail.checked;
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

        this.isSaving = true;

        const questionData = {
            questionText: this.questionText,
            answerText: this.answerText,
            dueDate: this.dueDate,
            sharedWithUserIds: userIds,
            sharedWithGroupIds: this.sharedWithGroupIds,
            isAnonymous: this.isAnonymous,
            isEditMode: this.isEditMode,
            questionId: this.questionId,
            onlyCreatorCanSeeResponses: this.onlyCreatorCanSeeResponses,
        };

        try {
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
                this.isSaving = false;
            }
        } catch (error) {
            messagesState.addMessage('An error occurred while saving', 'error');
            this.isSaving = false;
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
        this.onlyCreatorCanSeeResponses = false;
        this.isSaving = false;
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

    _handleKeyDown(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this._handleSubmit();
        }
    }

    _renderUserChips() {
        if (!this.sharedWithUserIds || this.sharedWithUserIds.length === 0) {
            return '';
        }
        return this.sharedWithUserIds.map(userId => html`
            <div class="chip user-chip">
                <custom-avatar
                    username="${getUsernameById(userId)}"
                    imageId="${getUserImageIdByUserId(userId)}"
                    size="20"
                    round
                ></custom-avatar>
                <a class="chip-link" href="/user/${userId}">${getUsernameById(userId) || "a user who's not in your groups"}</a>
            </div>
        `);
    }

    _renderGroupChips() {
        if (!this.sharedWithGroupIds || this.sharedWithGroupIds.length === 0) {
            return '';
        }
        return this.sharedWithGroupIds.map(groupId => html`
            <div class="chip group-chip">
                <custom-avatar
                    username="${getGroupNameById(groupId)}"
                    imageId="${getGroupImageIdByGroupId(groupId)}"
                    size="20"
                    round
                ></custom-avatar>
                <a class="chip-link" href="/group/${groupId}">${getGroupNameById(groupId) || "A group you're not a member of"}</a>
            </div>
        `);
    }

    render() {
        return html`
            <h2 class="modal-header">
                Q&A
            </h2>

            <div class="modal-contents">
               <div class="form-group">
                    <label for="questionText" class="section-label" style="margin: 0;">Question:</label>
                     ${this.showFullEditMode() ? html`<custom-input
                            id="questionText"
                            .value=${this.questionText}
                            @value-changed="${(e) => this.questionText = e.detail.value}"
                            @keydown="${this._handleKeyDown}"
                            placeholder="Type your question here..."
                            required
                    ></custom-input>` : html`
                        <em style="margin: 0;">${this.questionText}</em>
                     `}
                </div>

                ${this.showFullEditMode() ? html`
                <div class="privacy-section">
                    <custom-toggle
                            style="font-weight: bold;"
                        .checked=${this.onlyCreatorCanSeeResponses}
                        @change="${this._handlePrivacyToggle}"
                        label="Make responses only visible to you"
                    ></custom-toggle>
                    ${this.onlyCreatorCanSeeResponses ? html`
                        <div class="privacy-notice edit-notice">
                            You can see all responses. Others will only see their own response.
                        </div>
                    ` : html`
                        <div class="privacy-notice edit-notice">
                            Everyone who this question is shared with, can see all responses to this question.
                        </div>
                    `}
                </div>` : ''}

                ${!this.isQuestionCreator() ? html`
                <div class="privacy-section">
                    ${this.onlyCreatorCanSeeResponses ? html`
                        <div class="privacy-notice simple-notice">
                            Only ${getUsernameById(this.askedById)} can see your answer.
                        </div>
                    ` : html`
                        <div class="privacy-notice">
                            <div class="shared-with-label">Answers visible to:</div>
                            <div class="chips-container">
                                ${this._renderUserChips()}
                                ${this._renderGroupChips()}
                            </div>
                        </div>
                    `}
                </div>` : ''}

                <div class="form-group">
                    <label class="section-label" style="margin: 0;">Your answer:</label>
                    <custom-textarea
                            .value=${this.answerText || ''}
                            @value-changed="${(e) => this.answerText = e.detail.value}"
                            placeholder="Type your answer here..."
                            rows="4"
                    ></custom-textarea>
                </div>

                ${this.showFullEditMode() ? html`
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
                                    .selectedUserIds="${this.sharedWithUserIds}"
                                    @selection-changed="${this._handleUserSelectionChanged}"
                                    requireCurrentUser
                            ></your-users-list>
                        </div>
                    </div>
                </div>` : ''}


            </div>
           
            <div class="modal-footer">
                <button class="button secondary" @click=${this._handleCancel} ?disabled=${this.isSaving}>Cancel</button>
                <button class="button primary" @click=${this._handleSubmit} ?disabled=${this.isSaving}>
                    ${this.isSaving ? html`<hourglass-icon></hourglass-icon>` : html`<message-icon></message-icon>`}
                    ${this.isSaving ? 'Saving...' : 'Save'}
                </button>
            </div>
        `;
    }
}

customElements.define('add-qa-popup', CustomElement);
