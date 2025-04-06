import {LitElement, html, css} from 'lit';
import buttonStyles from "../../../../css/buttons";

export class CustomElement extends LitElement {
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
            `
        ];
    }

    render() {
        return html`
            <div class="question-card">
                <div class="question-header">
                    <h2 class="question-text">${this.question.text}</h2>
                    <button class="shared-button icon-button" aria-label="Shared With"
                            style="--icon-color: var(--delete-red); 
                                            --icon-color-hover: var(--delete-red); 
                                            --icon-hover-background: var(--delete-red-light); 
                                            font-size: var(--font-size-large)">
                        <share-icon></share-icon>
                    </button>
                    <custom-tooltip style="min-width: 200px;" class="shared-with-list">
                        ${this.question.sharedGroups && this.question.sharedGroups.length > 0 ? html`
                            <h4>Groups</h4>
                            <ul>
                                ${this.question.sharedGroups.map(group => html`
                                    <li>
                                        <span>${group.name}</span>
                                        <custom-avatar size="20"
                                                       username="${group.name}"></custom-avatar>
                                    </li>
                                `)}
                            </ul>
                        ` : ''}

                        ${this.question.sharedUsers && this.question.sharedUsers.length > 0 ? html`
                            <h4>Users</h4>
                            <ul>
                                ${this.question.sharedUsers.map(user => html`
                                    <li>
                                        <span>${user.name}</span>
                                        <custom-avatar size="20"
                                                       username="${user.name}"></custom-avatar>
                                    </li>
                                `)}
                            </ul>
                        ` : ''}
                    </custom-tooltip>
                    <button class="edit-button icon-button" aria-label="Edit Question"
                            style="--icon-color: var(--blue-normal); 
                                            --icon-color-hover: var(--blue-darker); 
                                            --icon-hover-background: var(--blue-light); 
                                            font-size: var(--font-size-large)">
                        <edit-icon></edit-icon>
                    </button>
                </div>
                <div class="answers-list">
                    ${this.question.answers.length === 0
                            ? html`
                                <div class="no-answers">No answers yet.</div>`
                            : this.question.answers.map(answer => html`
                                <div class="answer-item">
                                    <div class="answer-text">${answer.answerText}</div>
                                    <a href="/user/${answer.user.id}" class="user-info">
                                        <custom-avatar size="24"
                                                       username="Ben"
                                        ></custom-avatar>
                                        <span class="user-name">${answer.user.name}</span>
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
