import {LitElement, html, css} from 'lit';
import buttonStyles from "../../../../css/buttons";
import '../../../../svg/delete.js';
import '../../../../svg/edit.js';
import '../../../../svg/share.js';
import '../../../global/custom-tooltip.js';
import {observeState} from 'lit-element-state';
import {getUserImageIdByUserId, getUsernameById, formatDate} from '../../../../helpers/generalHelpers.js';
import {triggerAddQuestionEvent} from "../../../../events/custom-events.js";
import {handleDeleteQuestion} from "./qa-helpers.js";
import {userState} from "../../../../state/userStore.js";
import {getGroupImageIdByGroupId, getGroupNameById} from "../../../../helpers/userHelpers.js";

export class CustomElement extends observeState(LitElement) {
    static properties = {
        question: {type: Object},
    };

    constructor() {
        super();
        this.question = {};
    }

    static get styles() {
        return [
            buttonStyles,
            css`

                .shared-button {
                    margin-left: auto;    
                }
                
                .question-card {
                    padding: var(--spacing-normal-variable);
                    box-shadow: var(--shadow-1-soft);
                    border-radius: var(--border-radius-large);
                    background: var(--background-light);
                    position: relative;
                }

                .question-text {
                    font-size: var(--font-size-large);
                    font-weight: 500;
                    margin: 0;
                    padding-right: var(--spacing-normal-variable);
                }

                .answers-list {
                    display: grid;
                    gap: var(--spacing-small);
                }

                .answer-item {
                    display: flex;
                    flex-wrap: wrap;
                    flex-direction: column;
                    gap: var(--spacing-small);
                    justify-content: space-between;
                    align-items: flex-start;
                    border: 1px solid var(--border-color);
                    padding: var(--spacing-small);
                    border-radius: var(--border-radius-normal);
                }

                .answer-text {
                    flex-grow: 1; 
                    margin-right: var(--spacing-small); 
                    line-height: 1.4;
                    word-break: break-word; 
                    flex-wrap: wrap;
                }

                .no-answers {
                    font-style: italic;
                    color: var(--text-color-medium-dark);
                    font-size: var(--font-size-small);
                    padding: var(--spacing-x-small) 0 var(--spacing-x-small) var(--spacing-small);
                }

                .question-header {
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                    align-items: center;
                }
                
                .created-by-details {
                    display: flex;
                    gap: var(--spacing-small);
                    flex-direction: row;
                    align-items: center;
                    font-size: var(--font-size-small);
                    padding-bottom: var(--spacing-normal);
                    
                    .created-by-user {
                        display: flex;
                        gap: var(--spacing-x-small);
                        flex-direction: row;
                        align-items: center;
                    }
                    
                    .created-by-label {
                        color: var(--medium-text-color);
                    }
                    
                    .created-by-username {
                        font-weight: 600;
                        letter-spacing: 0.4px;
                    }
                }

                .shared-with-list ul {
                    list-style: none;
                    padding-left: var(--spacing-small);
                    margin: 0 var(--spacing-x-small);
                }

                .shared-with-list li {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;
                }

                .shared-with-list h4 {
                    margin: 0;
                }
                
                .user-info {
                    color: var(--text-color-dark);
                    text-decoration: none;
                    display: flex;
                    flex-direction: row-reverse;
                    gap: var(--spacing-x-small);
                }
                
                .answer-button {
                    margin-right: auto;
                    padding-left: var(--spacing-small);
                    padding-right: var(--spacing-small);
                }
                
                .user-name {
                    font-weight: 600;
                    color: var(--medium-text-color);
                }
                
                .due-date-container {
                    padding: 0 10px;
                    background: var(--green-light);
                    border: 1px solid var(--green-normal);
                    border-radius: 100px;
                    font-size: var(--font-size-x-small);
                }
            `
        ];
    }

    isQuestionCreator() {
       return userState.userData && userState.userData.id === this.question.askedById;
    }

    hasCurrentUserAnswered() {
        return this.question.answers.some(answer => parseInt(answer.answererId) === parseInt(userState.userData?.id));
    }

    _handleEditQuestion(onlyAnswerMode = false) {
        const myAnswer = this.question.answers.find(answer => {
            return answer.answererId === userState.userData?.id;
        });
        const editData = {
            questionText: this.question.questionText,
            answerText: myAnswer ? myAnswer.answerText : '',
            dueDate: this.question.dueDate,
            sharedWithUserIds: this.question.sharedWithUserIds,
            sharedWithGroupIds: this.question.sharedWithGroupIds,
            isAnonymous: this.question.isAnonymous,
            questionId: this.question.id,
            askedById: this.question.askedById,
            isEditMode: true,
            showOnlyAnswerMode: onlyAnswerMode,
        }
        triggerAddQuestionEvent(editData);
    }

    async _handleDeleteQuestion() {
        await handleDeleteQuestion(this.question);
    }

    render() {
        return html`
            <div class="question-card">
                <div class="question-header">
                    <h2 class="question-text">${this.question.questionText}</h2>
                    ${!this.hasCurrentUserAnswered() ? html`
                        <button class="primary fancy small answer-button"
                                @click="${() => this._handleEditQuestion(true)}">
                            Add your answer
                        </button>` : ''}
                    <button class="shared-button icon-button primary-text" aria-label="Shared With"
                            style="font-size: var(--font-size-large)">
                        <share-icon></share-icon>
                    </button>
                    <custom-tooltip style="min-width: 200px;" class="shared-with-list">
                        ${this.question.sharedWithGroupIds && this.question.sharedWithGroupIds.length > 0 ? html`
                            <h4>Groups</h4>
                            <ul>
                                ${this.question.sharedWithGroupIds.map(groupId => html`
                                    <li>
                                        <span>${getGroupNameById(groupId)}</span>
                                        <custom-avatar size="20"
                                                       round
                                                       username="${getGroupNameById(groupId)}"
                                                       imageId="${getGroupImageIdByGroupId(groupId)}"
                                        ></custom-avatar>
                                    </li>
                                `)}
                            </ul>
                        ` : ''}

                        ${this.question.sharedWithUserIds && this.question.sharedWithUserIds.length > 0 ? html`
                            <h4>Users</h4>
                            <ul>
                                ${this.question.sharedWithUserIds.map(userId => html`
                                    <li>
                                        <span>${getUsernameById(userId)}</span>
                                        <custom-avatar size="20"
                                                       round
                                                       username="${getUsernameById(userId)}"
                                                       imageId="${getUserImageIdByUserId(userId)}"
                                        ></custom-avatar>
                                    </li>
                                `)}
                            </ul>
                        ` : ''}
                    </custom-tooltip>

                    ${this.isQuestionCreator() ? html`
                        <button class="edit-button icon-button blue-text"
                                aria-label="Edit Question"
                                @click="${() => this._handleEditQuestion(false)}"
                                style="font-size: var(--font-size-large)">
                            <edit-icon></edit-icon>
                        </button>
    
                        <button class="delete-button icon-button danger-text"
                                aria-label="Delete Question"
                                @click="${this._handleDeleteQuestion}"
                                style="font-size: var(--font-size-large)">
                            <delete-icon></delete-icon>
                        </button>` : ''}
                </div>
                <div class="created-by-details">
                    <span class="created-by-label">Asked By:</span>
                    <span class="created-by-user">
                        <custom-avatar
                            size="18"
                            round
                            username="${getUsernameById(this.question.askedById)}"
                            imageId="${getUserImageIdByUserId(this.question.askedById)}"
                            shadow
                        ></custom-avatar>
                        <span class="created-by-username">${getUsernameById(this.question.askedById)}</span>
                    </span>
                    ${this.question.dueDate ? html`
                        <div class="due-date-container">
                            <span class="">Due:</span>
                            <span class="created-by-username">${formatDate(this.question.dueDate)}</span>
                        </div>
                    ` : ''}
                </div>
                
                <div class="answers-list">
                    ${this.question.answers.length === 0
                            ? html`
                                <div class="no-answers">No answers yet.</div>`
                            : this.question.answers.map(answer => html`
                                <div class="answer-item">
                                    <div class="answer-text">
                                        ${answer.answerText}
                                        ${parseInt(answer.answererId) === parseInt(userState.userData?.id) ? html`
                                            <button class="icon-button blue-text"
                                                    aria-label="Edit Answer"
                                                    @click="${() => this._handleEditQuestion(true)}"
                                                    style="margin-left: var(--spacing-x-small);">
                                                <edit-icon style="font-size: 14px;"></edit-icon>
                                            </button>
                                        ` : ''}
                                    </div>
                                    <a href="/user/${answer.answererId}" class="user-info">
                                        <custom-avatar size="24"
                                                     username="${getUsernameById(answer.answererId)}"
                                                     imageId="${getUserImageIdByUserId(answer.answererId)}"
                                                       shadow
                                                       round
                                        ></custom-avatar>
                                        <span class="user-name">${getUsernameById(answer.answererId)}</span>
                                    </a>
                                </div>
                            `)
                    }
                </div>
            </div>
        `;
    }
}

customElements.define('qa-page-question', CustomElement);
