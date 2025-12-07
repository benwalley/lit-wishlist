import {LitElement, html, css} from 'lit';
import buttonStyles from '../../../../css/buttons';
import '../avatar.js';
import '../../../../svg/edit.js';
import {observeState} from 'lit-element-state';
import {userState} from '../../../../state/userStore.js';
import {getUsernameById, getUserImageIdByUserId} from '../../../../helpers/generalHelpers.js';
import {getGroupNameById, getGroupImageIdByGroupId} from '../../../../helpers/userHelpers.js';
import {triggerAddQuestionEvent} from '../../../../events/custom-events.js';

export class ViewAnswersPopup extends observeState(LitElement) {
    static properties = {
        questionData: {type: Object},
    };

    constructor() {
        super();
        this.questionData = null;
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    max-height: 85vh;
                }

                .question-section {
                    padding: var(--spacing-normal);
                    border-bottom: 1px solid var(--border-color);
                    background: var(--background-light);
                }

                .question-text {
                    font-size: var(--font-size-large);
                    font-weight: 600;
                    margin: 0;
                    color: var(--text-color-dark);
                }

                .answer-count {
                    margin: var(--spacing-x-small) 0 0 0;
                    color: var(--grayscale-600);
                    font-size: var(--font-size-small);
                }

                .answers-section {
                    padding: var(--spacing-normal-variable);
                    flex: 1;
                    overflow-y: auto;
                }

                .answers-list {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-small);
                }

                .answer-item {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-small);
                    padding: var(--spacing-small);
                    border: 1px solid var(--border-color);
                    border-radius: var(--border-radius-normal);
                    
                }

                .answer-content {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-x-small);
                }

                .answer-text {
                    color: var(--text-color-dark);
                    line-height: 1.5;
                    word-break: break-word;
                    margin: 0;
                }

                .answer-meta {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-small);
                    flex-wrap: wrap;
                }

                .user-link {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-x-small);
                    text-decoration: none;
                    color: var(--medium-text-color);
                    font-weight: 600;
                    font-size: var(--font-size-x-small);
                    transition: var(--transition-normal);
                }

                .user-link:hover {
                    color: var(--blue-normal);
                }

                .no-answers {
                    text-align: center;
                    color: var(--grayscale-600);
                    font-style: italic;
                    padding: var(--spacing-large);
                }

                .modal-footer {
                    border-top: 1px solid var(--border-color);
                    padding: var(--spacing-normal);
                    display: flex;
                    justify-content: flex-end;
                    background: var(--background-light);
                }

                .shared-with-section {
                    padding: var(--spacing-small) var(--spacing-normal-variable) var(--spacing-normal);
                    border-bottom: 1px solid var(--border-color);
                    background: var(--background-light);
                }

                .shared-with-label {
                    font-size: var(--font-size-small);
                    font-weight: 600;
                    color: var(--text-color-dark);
                    margin-bottom: var(--spacing-x-small);
                }

                .chips-container {
                    display: flex;
                    flex-wrap: wrap;
                    gap: var(--spacing-x-small);
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

                .no-sharing-message {
                    font-size: var(--font-size-small);
                    color: var(--grayscale-600);
                    font-style: italic;
                }
            `
        ];
    }

    _isCurrentUserAnswer(answererId) {
        return parseInt(answererId) === parseInt(userState.userData?.id);
    }

    _handleEditAnswer() {
        // Find current user's answer
        const myAnswer = this.questionData.answers.find(
            answer => this._isCurrentUserAnswer(answer.answererId)
        );

        const editData = {
            questionText: this.questionData.questionText,
            answerText: myAnswer ? myAnswer.answerText : '',
            dueDate: this.questionData.dueDate,
            sharedWithUserIds: this.questionData.sharedWithUserIds,
            sharedWithGroupIds: this.questionData.sharedWithGroupIds,
            isAnonymous: this.questionData.isAnonymous,
            questionId: this.questionData.id,
            askedById: this.questionData.askedById,
            isEditMode: true,
            showOnlyAnswerMode: true,
            onlyCreatorCanSeeResponses: this.questionData.onlyCreatorCanSeeResponses,
        };

        triggerAddQuestionEvent(editData);
        this._handleClose();
    }

    _handleClose() {
        this.dispatchEvent(new CustomEvent('close-popup', {
            bubbles: true,
            composed: true
        }));
    }

    _renderUserChips() {
        let userIds = [];
        if(this.questionData.onlyCreatorCanSeeResponses) {
            userIds = [this.questionData.askedById];
        } else {
            userIds = this.questionData.sharedWithUserIds;
        }
        if (!userIds || userIds.length === 0) {
            return '';
        }
        return userIds.map(userId => html`
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
        if(this.questionData.onlyCreatorCanSeeResponses) {return'';}
        if (!this.questionData.sharedWithGroupIds || this.questionData.sharedWithGroupIds.length === 0) {
            return '';
        }
        return this.questionData.sharedWithGroupIds.map(groupId => html`
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

    _renderSharedWithSection() {
        const hasUsers = this.questionData.sharedWithUserIds && this.questionData.sharedWithUserIds.length > 0;
        const hasGroups = this.questionData.sharedWithGroupIds && this.questionData.sharedWithGroupIds.length > 0;

        if (!hasUsers && !hasGroups) {
            return html`
                <div class="shared-with-section">
                    <div class="shared-with-label">Answers visible to:</div>
                    <div class="no-sharing-message">Not visible to anyone</div>
                </div>
            `;
        }

        return html`
            <div class="shared-with-section">
                <div class="shared-with-label">Answers visible to:</div>
                <div class="chips-container">
                    ${this._renderUserChips()}
                    ${this._renderGroupChips()}
                </div>
            </div>
        `;
    }

    _renderAnswersList() {
        if (!this.questionData?.answers || this.questionData.answers.length === 0) {
            return html`<div class="no-answers">No answers yet.</div>`;
        }

        return html`
            <div class="answers-list">
                ${this.questionData.answers.map(answer => html`
                    <div class="answer-item">
                        <div class="answer-content">
                            <p class="answer-text">${answer.answerText}</p>
                            <div class="answer-meta">
                                <a href="/user/${answer.answererId}" class="user-link">
                                    <custom-avatar
                                        size="18"
                                        round
                                        shadow
                                        username="${getUsernameById(answer.answererId)}"
                                        imageId="${getUserImageIdByUserId(answer.answererId)}"
                                    ></custom-avatar>
                                    <span>${getUsernameById(answer.answererId)}</span>
                                </a>
                                ${this._isCurrentUserAnswer(answer.answererId) ? html`
                                    <button
                                        class="icon-button small blue-text"
                                        aria-label="Edit your answer"
                                        @click="${this._handleEditAnswer}"
                                    >
                                        <edit-icon></edit-icon>
                                        Edit
                                    </button>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                `)}
            </div>
        `;
    }

    render() {
        if (!this.questionData) {
            return html`<div class="no-answers">Loading...</div>`;
        }

        const totalAnswers = this.questionData.answers?.length || 0;

        return html`
            <div class="question-section">
                <h2 class="question-text">${this.questionData.questionText}</h2>
                <p class="answer-count">
                    ${totalAnswers} ${totalAnswers === 1 ? 'answer' : 'answers'}
                </p>
            </div>

            ${this._renderSharedWithSection()}

            <div class="answers-section">
                ${this._renderAnswersList()}
            </div>

            <div class="modal-footer">
                <button class="button secondary" @click="${this._handleClose}">
                    Close
                </button>
            </div>
        `;
    }
}

customElements.define('view-answers-popup', ViewAnswersPopup);
