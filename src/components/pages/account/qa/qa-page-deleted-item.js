import {LitElement, html, css} from 'lit';
import buttonStyles from "../../../../css/buttons";
import '../../../../svg/restore.js';
import '../../../../svg/delete.js';
import '../../../global/custom-tooltip.js';
import {observeState} from 'lit-element-state';
import {getUserImageIdByUserId, getUsernameById} from '../../../../helpers/generalHelpers.js';
import {showConfirmation} from "../../../global/custom-confirm/confirm-helper.js";
import {triggerAddQuestionEvent} from "../../../../events/custom-events.js";

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

                .question-card {
                    padding: 1rem;
                    box-shadow: var(--shadow-1-soft);
                    border-radius: var(--border-radius-large);
                    background: var(--background-light);
                    position: relative;
                }

                .question-text {
                    font-size: var(--font-size-large);
                    font-weight: 500;
                    margin: 0 auto 0 0;
                }

                .answers-list {
                    display: grid;
                    gap: var(--spacing-small); /* Space between answers */
                    padding-left: var(--spacing-small); /* Indent answers slightly */
                    border-left: 2px solid var(--border-color); /* Visual cue for answer section */
                    margin-left: var(--spacing-x-small);
                }

                .answer-item {
                    display: flex;
                    justify-content: space-between; /* Pushes user info to the right */
                    align-items: flex-start; /* Align items to the top */
                    padding: 0; /* Compact vertical padding */
                }

                .answer-text {
                    flex-grow: 1; /* Allows text to take available space */
                    margin-right: var(--spacing-small); /* Space between answer and user */
                    line-height: 1.4;
                    word-break: break-word; /* Prevent long words overflowing */
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
                    align-items: center;
                    padding-bottom: var(--spacing-small);
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
                    gap: var(--spacing-x-small);
                }
            `
        ];
    }

    _handleRestoreQuestion() {
        const editData = {
            questionText: this.question.questionText,
            dueDate: this.question.dueDate,
            sharedWithUserIds: this.question.sharedWithUserIds || this.question.sharedWithUsers?.map(user => user.id) || [],
            sharedWithGroupIds: this.question.sharedWithGroupIds || this.question.sharedWithGroups?.map(group => group.id) || [],
            isAnonymous: this.question.isAnonymous,
            questionId: this.question.id,
        }
        triggerAddQuestionEvent(editData);
    }

    async _handleForceDeleteQuestion() {
        const confirmed = await showConfirmation({
            message: 'Are you sure you want to permanently delete this question and all of its answers?',
            submessage: 'This action cannot be undone, and it will remove the question from all users.',
            heading: 'Delete Item?',
            confirmLabel: 'Yes, Delete',
            cancelLabel: 'No, Keep it'
        });

        if (confirmed) {
            this.dispatchEvent(new CustomEvent('force-delete-question', {
                detail: {question: this.question},
                bubbles: true,
                composed: true
            }));
        }

    }

    render() {
        return html`
            <div class="question-card">
                <div class="question-header">
                    <h2 class="question-text">${this.question.questionText}</h2>
                 
                    <button class="restore-button icon-button"
                            aria-label="Restore Question"
                            @click="${this._handleRestoreQuestion}"
                            style="--icon-color: var(--blue-normal); 
                                            --icon-color-hover: var(--blue-darker); 
                                            --icon-hover-background: var(--blue-light); 
                                            font-size: var(--font-size-large)">
                        <restore-icon></restore-icon>
                    </button>
                    <custom-tooltip style="min-width: 200px;" class="restore-item-tooltip">
                        Restore item?
                    </custom-tooltip>
                    <button class="restore-button icon-button"
                            aria-label="Restore Question"
                            @click="${this._handleForceDeleteQuestion}"
                            style="--icon-color: var(--delete-red); 
                                            --icon-color-hover: var(--delete-red-darker); 
                                            --icon-hover-background: var(--delete-red-light); 
                                            font-size: var(--font-size-large)">
                        <delete-icon></delete-icon>
                    </button>
                </div>
                <div class="answers-list">
                    ${this.question.answers.length === 0
            ? html`
                                <div class="no-answers">No answers yet.</div>`
            : this.question.answers.map(answer => html`
                                <div class="answer-item">
                                    <div class="answer-text">${answer.answerText}</div>
                                    <a href="/user/${answer.answererId}" class="user-info">
                                        <custom-avatar size="24"
                                                       username="${getUsernameById(answer.answererId)}"
                                                       imageId="${getUserImageIdByUserId(answer.answererId)}"
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

customElements.define('qa-page-deleted-item', CustomElement);
