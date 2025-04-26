import {LitElement, html, css} from 'lit';
import buttonStyles from "../../../../css/buttons";
import '../../../../svg/delete.js';
import '../../../../svg/edit.js';
import '../../../../svg/share.js';
import '../../../global/custom-tooltip.js';
import {observeState} from 'lit-element-state';
import {getUserImageIdByUserId, getUsernameById} from '../../../../helpers/generalHelpers.js';
import {showConfirmation} from "../../../global/custom-confirm/confirm-helper.js";

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

    _handleEditQuestion() {
        this.dispatchEvent(new CustomEvent('edit-question', {
            detail: {question: this.question},
            bubbles: true,
            composed: true
        }));
    }

    async _handleDeleteQuestion() {
        const confirmed = await showConfirmation({
            message: 'Are you sure you want to delete this question?',
            submessage: 'The users who answerd this question will still see it with a message telling them it was deleted',
            heading: 'Delete Item?',
            confirmLabel: 'Yes, Delete',
            cancelLabel: 'No, Keep it'
        });

        if (confirmed) {
            this.dispatchEvent(new CustomEvent('delete-question', {
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
                    <button class="shared-button icon-button" aria-label="Shared With"
                            style="--icon-color: var(--primary-color); 
                                            --icon-color-hover: var(--primary-color-darker); 
                                            --icon-hover-background: var(--primary-color-light); 
                                            font-size: var(--font-size-large)">
                        <share-icon></share-icon>
                    </button>
                    <custom-tooltip style="min-width: 200px;" class="shared-with-list">
                        ${this.question.sharedWithGroups && this.question.sharedWithGroups.length > 0 ? html`
                            <h4>Groups</h4>
                            <ul>
                                ${this.question.sharedWithGroups.map(group => html`
                                    <li>
                                        <span>${group.groupName}</span>
                                        <custom-avatar size="20"
                                                       username="${group.groupName}"></custom-avatar>
                                    </li>
                                `)}
                            </ul>
                        ` : ''}

                        ${this.question.sharedWithUsers && this.question.sharedWithUsers.length > 0 ? html`
                            <h4>Users</h4>
                            <ul>
                                ${this.question.sharedWithUsers.map(user => html`
                                    <li>
                                        <span>${user.name}</span>
                                        <custom-avatar size="20"
                                                       username="${user.name}"></custom-avatar>
                                    </li>
                                `)}
                            </ul>
                        ` : ''}
                    </custom-tooltip>

                    <button class="edit-button icon-button"
                            aria-label="Edit Question"
                            @click="${this._handleEditQuestion}"
                            style="--icon-color: var(--blue-normal); 
                                            --icon-color-hover: var(--blue-darker); 
                                            --icon-hover-background: var(--blue-light); 
                                            font-size: var(--font-size-large)">
                        <edit-icon></edit-icon>
                    </button>

                    <button class="delete-button icon-button"
                            aria-label="Delete Question"
                            @click="${this._handleDeleteQuestion}"
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

customElements.define('qa-page-question', CustomElement);
