import {LitElement, html, css} from 'lit';
import buttonStyles from "../../../css/buttons";
import '../../../svg/edit.js';
import '../../../svg/delete.js';
import '../../../svg/check.js';
import '../../../svg/stopwatch.js';
import '../../global/custom-input.js';
import {messagesState} from "../../../state/messagesStore.js";
import '../../loading/skeleton-loader.js';
import { observeState } from 'lit-element-state';
import { userState } from "../../../state/userStore.js";
import '../../pages/account/avatar.js'
import {getUserImageIdByUserId, getUsernameById} from "../../../helpers/generalHelpers.js";
import {triggerAddQuestionEvent} from "../../../events/custom-events.js";
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
                    border-bottom: 1px solid var(--border-color);
                    height: auto;
                    cursor: pointer;
                    
                    &:hover {
                        background: var(--purple-light);
                    }
                }

                .item-container.editing {
                    border-color: var(--primary-color);
                    box-shadow: var(--shadow-1-soft);
                }

                .item-container.empty-answer {
                    border-left: 4px solid var(--info-yellow);
                }

                .empty-answer .missing-info {
                    display: inline-block;
                    color: var(--info-yellow);
                    font-size: var(--font-size-small);
                    margin-top: var(--spacing-tiny);
                    font-style: italic;
                }

                .actions {
                    position: absolute;
                    right: var(--spacing-x-small);
                    top: var(--spacing-x-small);
                    opacity: 1;
                    transform: translateX(0);
                    pointer-events: auto;
                    display: flex;
                    gap: var(--spacing-tiny);
                    padding: var(--spacing-tiny);
                }

                .question {
                    margin: 0;
                    text-align: left;
                    color: var(--text-color-dark);
                    font-weight: bold;
                }
                
                .question.display-only {
                    padding-bottom: var(--spacing-normal);
                }

                .answer {
                    text-align: left;
                    color: var(--medium-text-color);
                    margin: 0;
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
                }
                
                .answer-container.editable {
                    cursor: pointer;
                }
                
                .qa-item-asker {
                    font-size: var(--font-size-x-small);
                }
                
                .due-soon-indicator {
                    color: var(--green-normal);
                    font-size: var(--font-size-medium);
                    cursor: help;
                    
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
                    gap: var(--spacing-small);
                    padding-right: 70px;
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

    // Open the edit popup for this question
    _openEditPopup() {
        const editData = {
            questionText: this.item.questionText,
            answerText: this.item.answers?.[0]?.answerText || '',
            dueDate: this.item.dueDate,
            sharedWithUserIds: this.item.sharedWithUserIds || this.item.sharedWithUsers?.map(user => user.id) || [],
            sharedWithGroupIds: this.item.sharedWithGroupIds || this.item.sharedWithGroups?.map(group => group.id) || [],
            isAnonymous: this.item.isAnonymous,
            questionId: this.item.id,
            askedById: this.item.askedById,
            isEditMode: true,
        };

        triggerAddQuestionEvent(editData);

    }

    // Toggle edit mode
    _toggleEdit() {
        this.enterEditMode();
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
        const hasEmptyAnswer = this.item.answers?.length === 0 || !this.item.answers[0]?.answerText?.trim();
        const dueStatus = this._getDueStatus();

        return html`
            <div class="top-row">
                <h3 class="question" style="cursor: pointer;">${this.item.questionText}</h3>
                ${dueStatus ? html`<div class="due-soon-indicator tooltip ${dueStatus}">
                    <stopwatch-icon></stopwatch-icon>
                    <custom-tooltip>${this._formatDueDate()}</custom-tooltip>
                </div>` : ''}
            </div>
            
            <div class="answer-container editable">
                ${hasEmptyAnswer
                        ? html`<span class="missing-info">click to answer</span>`
                        : html`<p class="answer">${this.item.answers[0]?.answerText}</p>`
                }
               <div class="qa-item-asker">
                    ${userState.userData?.id !== this.item.askedById ? html`
                        <span>Asked by</span>
                        <custom-avatar
                                .username="${getUsernameById(this.item.askedById)}"
                                imageId="${getUserImageIdByUserId(this.item.askedById)}"
                                size="16"
                                shadow
                        >
                        </custom-avatar>
                        <span>${getUsernameById(this.item.askedById)}</span>
                    `: html`<span class="you">You asked this</span>`}
                </div>
            </div>
            <div class="actions">
                <button
                        aria-label="edit"
                        class="icon-button blue-text"
                        @click="${this._toggleEdit}"
                >
                    <edit-icon></edit-icon>
                </button>
                ${this._isQuestionCreator() ? html`<button
                        aria-label="delete"
                        class="icon-button danger-text"
                        @click="${this._deleteItem}"
                >
                    <delete-icon></delete-icon>
                </button>` : ''}
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
            <div class="item-container ${hasEmptyAnswer ? 'empty-answer' : ''}" @click="${this._openEditPopup}">
                ${this._renderContent()}
            </div>
        `;
    }
}

customElements.define('qa-item', QAItem);
