import {LitElement, html, css} from 'lit';
import buttonStyles from "../../../css/buttons";
import '../../../svg/edit.js';
import '../../../svg/delete.js';
import '../../../svg/check.js';
import '../../../svg/stopwatch.js';
import '../../../svg/message.js';
import '../../global/custom-input.js';
import {messagesState} from "../../../state/messagesStore.js";
import '../../loading/skeleton-loader.js';
import { observeState } from 'lit-element-state';
import { userState } from "../../../state/userStore.js";
import '../../pages/account/avatar.js'
import {getUserImageIdByUserId, getUsernameById} from "../../../helpers/generalHelpers.js";
import {triggerAddQuestionEvent, triggerViewAnswersEvent} from "../../../events/custom-events.js";
import {handleDeleteQuestion} from "./qa/qa-helpers.js";

export class QAItem extends observeState(LitElement) {
    static properties = {
        item: { type: Object },
    };

    constructor() {
        super();
        this.item = {
            id: 0,
            questionText: '',
            answers: [],
            loading: false,
        };
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    display: block;
                    overflow: visible;
                }

                .item-container {
                    transition: var(--transition-normal);
                    display: flex;
                    position: relative;
                    flex-direction: column;
                    align-items: flex-start;
                    text-decoration: none;
                    margin: 0;
                    padding: var(--spacing-small);
                    border: 1px solid var(--border-color);
                    border-radius: var(--border-radius-normal);
                    height: auto;
                    //background: var(--background-medium);
                }

                .item-container.editing {
                    border-color: var(--primary-color);
                    box-shadow: var(--shadow-1-soft);
                }

                .actions {
                    position: absolute;
                    right: var(--spacing-small);
                    top: var(--spacing-small);
                    opacity: 1;
                    transform: translateX(0);
                    display: flex;
                }

                .answer-count {
                    display: flex;
                    align-items: flex-start;
                    gap: var(--spacing-x-small);
                    font-size: var(--font-size-x-small);
                    color: var(--text-color-medium-dark);
                    line-height: 1;
                }

                .answer-count message-icon {
                    width: 16px;
                    height: 16px;
                }

                .question {
                    margin: 0;
                    text-align: left;
                    color: var(--text-color-dark);
                    font-weight: bold;
                    font-size: var(--font-size-normal);
                    cursor: pointer;
                    transition: var(--transition-normal);
                }

                .answer {
                    text-align: left;
                    color: var(--blue-darker);
                    margin: 0;
                    font-size: var(--font-size-x-small);
                    line-height: 1.3;
                }
                
                .edit-actions {
                    display: flex;
                    justify-content: space-between;
                    padding: var(--spacing-small);
                    gap: var(--spacing-small);
                    width: 100%;
                    box-sizing: border-box;
                }
                
                .loader-container {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-small);
                }
                
                .answer-container {
                    width: 100%;
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    background: var(--blue-light);
                    border: 1px solid var(--blue-normal);
                    border-radius: var(--border-radius-normal);
                    padding: var(--spacing-small);
                    line-height: 1;
                    box-sizing: border-box;
                }
                
                .qa-item-asker {
                    font-size: var(--font-size-x-small);
                    width: 100%;
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-x-small);
                    padding-top: var(--spacing-x-small);
                }
                
                .due-soon-indicator {
                    color: var(--green-normal);
                    font-size: var(--font-size-medium);
                    cursor: help;
                    display: flex;
                    padding-left: var(--spacing-small);
                    
                    &.due-week {
                        color: var(--delete-red);
                    }
                    
                    &.due-month {
                        color: var(--info-yellow);
                    }
                }
                
                .top-row {
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-start;
                    gap: 0 var(--spacing-small);
                    flex-wrap: wrap;
                    width: 100%;
                    padding-bottom: var(--spacing-small);
                    padding-right: 40px;
                    box-sizing: border-box;
                }

                .top-row.no-answer {
                    border-bottom: 1px solid var(--border-color);
                }

                .bottom-row {
                    width: 100%;
                    padding-top: var(--spacing-small);
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                    gap: var(--spacing-small);
                }
                
                .edit-button {
                    font-weight: bold;
                }
            `
        ];
    }

    connectedCallback() {
        super.connectedCallback();

        // If this is a new item, automatically enter edit mode
        if (this.item?.isNew) {
            this.enterEditMode();
        }

    }

    disconnectedCallback() {
        super.disconnectedCallback();
    }


    // Enter edit mode
    enterEditMode() {
        this._openEditPopup();
    }

    _isUsersPage() {
        if(window.location.pathname === '/account') {
            return true;
        }
        return false;
    }


    // Check if the current user is the question creator
    _isQuestionCreator() {
        if (this.item.isNew) return true;
        return userState.userData && this.item.askedById === userState.userData.id;
    }

    // Get the current user's answer from the answers array
    _getCurrentUserAnswer() {
        if (!this.item.answers || !userState.userData?.id) {
            return null;
        }
        return this.item.answers.find(
            answer => parseInt(answer.answererId) === parseInt(userState.userData.id)
        );
    }

    // Get the label for the edit/answer button
    _getEditButtonLabel(hasUserAnswered) {
        const isCreator = this._isQuestionCreator();

        if (isCreator && hasUserAnswered) {
            return 'Edit question or answer';
        } else if (isCreator && !hasUserAnswered) {
            return 'Answer or edit question';
        } else if (!isCreator && hasUserAnswered) {
            return 'Edit answer';
        } else {
            return 'Answer';
        }
    }

    // Open the edit popup for this question
    _openEditPopup() {
        const editData = {
            questionText: this.item.questionText,
            answerText: this._getCurrentUserAnswer()?.answerText || '',
            dueDate: this.item.dueDate,
            sharedWithUserIds: this.item.sharedWithUserIds || this.item.sharedWithUsers?.map(user => user.id) || [],
            sharedWithGroupIds: this.item.sharedWithGroupIds || this.item.sharedWithGroups?.map(group => group.id) || [],
            isAnonymous: this.item.isAnonymous,
            questionId: this.item.id,
            askedById: this.item.askedById,
            isEditMode: true,
            onlyCreatorCanSeeResponses: this.item.onlyCreatorCanSeeResponses,
        };

        triggerAddQuestionEvent(editData);

    }

    // Toggle edit mode
    _toggleEdit() {
        this.enterEditMode();
    }

    // Handle viewing all answers
    _handleViewAllAnswers(e) {
        e.preventDefault();
        e.stopPropagation();

        const questionData = {
            id: this.item.id,
            questionText: this.item.questionText,
            answers: this.item.answers || [],
            askedById: this.item.askedById,
            onlyCreatorCanSeeResponses: this.item.onlyCreatorCanSeeResponses,
            sharedWithUserIds: this.item.sharedWithUserIds || [],
            sharedWithGroupIds: this.item.sharedWithGroupIds || [],
            dueDate: this.item.dueDate,
            isAnonymous: this.item.isAnonymous,
        };

        triggerViewAnswersEvent(questionData);
    }

    // Save edits
    _saveEdit() {
        // Validate question text only if user is the question creator
        if (this._isQuestionCreator() && !this.editedQuestion?.length) {
            messagesState.addMessage('Please add a question.', 'error');
            return;
        }

        const updatedItem = {...this.item};

        // Only update the question text if the user is the question creator
        if (this._isQuestionCreator()) {
            updatedItem.questionText = this.editedQuestion;
        }

        updatedItem.questionId = this.item.id;

        // Always update the answer
        if(updatedItem.answers?.length) {
            updatedItem.answers[0].answerText = this.editedAnswer;
        } else {
            updatedItem.answers = [{answerText: this.editedAnswer}];
        }

        this.dispatchEvent(new CustomEvent('qa-item-updated', {
            detail: { item: updatedItem },
            bubbles: true,
            composed: true
        }));

        this.isEditing = false;
    }

    // Delete item
    async _deleteItem(e) {
        e.preventDefault();
        e.stopPropagation();
        if (this.item.isNew) {
            this.dispatchEvent(new CustomEvent('qa-item-deleted', {
                detail: {item: this.item},
                bubbles: true,
                composed: true
            }));
            return;
        }

        // Only the question creator can delete the entire QA item
        if (!this._isQuestionCreator()) {
            messagesState.addMessage('You can only delete questions you created.', 'error');
            return;
        }

        // Use the shared helper function
        await handleDeleteQuestion(this.item);
    }

    _onQuestionChange(e) {
        this.editedQuestion = e.target.value;
    }

    _onAnswerChange(e) {
        this.editedAnswer = e.target.value;
    }

    _getDueStatus() {
        if (!this.item.dueDate) return null;

        const dueDate = new Date(this.item.dueDate);
        const today = new Date();
        const oneWeekFromNow = new Date();
        oneWeekFromNow.setDate(today.getDate() + 7);
        const oneMonthFromNow = new Date();
        oneMonthFromNow.setMonth(today.getMonth() + 1);

        if (dueDate < today) return null; // Past due, don't show indicator
        if (dueDate <= oneWeekFromNow) return 'due-week'; // Red - due within a week
        if (dueDate <= oneMonthFromNow) return 'due-month'; // Yellow - due within a month
        return 'due-future'; // Green - due beyond a month
    }

    _formatDueDate() {
        if (!this.item.dueDate) return '';

        const dueDate = new Date(this.item.dueDate);
        return `Due: ${dueDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`;
    }

    _renderViewMode() {
        const currentUserAnswer = this._getCurrentUserAnswer();
        const hasEmptyAnswer = !currentUserAnswer || !currentUserAnswer.answerText?.trim();
        const dueStatus = this._getDueStatus();
        const totalAnswers = this.item.answers?.length || 0;
        const hasUserAnswered = !hasEmptyAnswer;

        return html`
            <div class="top-row ${hasEmptyAnswer ? 'no-answer' : ''}">
                <h3 class="question" @click="${this._openEditPopup}">${this.item.questionText}</h3>
                <div class="qa-item-asker">
                    <span>${getUsernameById(this.item.askedById)}</span>

                    <custom-avatar
                                .username="${getUsernameById(this.item.askedById)}"
                                imageId="${getUserImageIdByUserId(this.item.askedById)}"
                                size="16"
                                shadow
                        >
                        </custom-avatar>
                    ${dueStatus ? html`<div class="due-soon-indicator tooltip ${dueStatus}">
                    <stopwatch-icon></stopwatch-icon>
                    <custom-tooltip>${this._formatDueDate()}</custom-tooltip>
                </div>` : ''}
                </div>
            </div>
            
            ${hasEmptyAnswer ? '' : html`<div class="answer-container editable">
               <p class="answer"><strong>Your Answer: </strong>${currentUserAnswer.answerText}</p>
            </div>`}
            <div class="bottom-row">
                <button
                        aria-label="${this._getEditButtonLabel(hasUserAnswered)}"
                        class="small-link-button blue-text edit-button"
                        @click="${this._toggleEdit}"
                >
                    ${this._getEditButtonLabel(hasUserAnswered)}
                </button>
                ${totalAnswers > 0 ? html`
                    <button
                            aria-label="view all answers"
                            class="small-link-button grey-text"
                            @click="${this._handleViewAllAnswers}"
                    >
                        View all (${totalAnswers})
                    </button>
                ` : ''}
                ${this._isQuestionCreator() ? html`<button
                        aria-label="delete"
                        class="small-link-button danger-text"
                        @click="${this._deleteItem}"
                >
                    Delete
                </button>` : ''}
            </div>
                <div class="actions">
                    <div class="answer-count" @click="${this._handleViewAllAnswers}">
                        <message-icon></message-icon>
                        <span>${totalAnswers}</span>
                    </div>
                </div>
        `;
    }


    _renderLoading() {
        return html`<div class="loader-container">
            <skeleton-loader width="100%" height="24px"></skeleton-loader>
            <skeleton-loader width="100%" height="20px"></skeleton-loader>
        </div>`;
    }

    _renderContent() {
        if (this.item.loading) {
            return this._renderLoading();
        } else {
            return this._renderViewMode();
        }
    }

    _hasEmptyAnswer() {
        if(this.item.loading) return false;
        if(this.item.answers.length === 0) return true;
        return false;
    }

    render() {
        const hasEmptyAnswer = this._hasEmptyAnswer();
        return html`
            <div class="item-container ${hasEmptyAnswer ? 'empty-answer' : ''}">
                ${this._renderContent()}
            </div>
        `;
    }
}

customElements.define('qa-item', QAItem);
