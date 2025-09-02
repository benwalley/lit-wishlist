import {LitElement, html, css} from 'lit';
import buttonStyles from "../../../../css/buttons"; // Assuming path is correct
import '../../../global/custom-tooltip.js'
import '../../../global/custom-modal.js'
import './qa-page-question.js';
import './qa-page-deleted-item.js';
import {forceDeleteQA, getAskedQAItems, handleDeleteQuestion} from "./qa-helpers.js";
import {messagesState} from "../../../../state/messagesStore.js";
import {userState} from "../../../../state/userStore.js";
import {listenInitialUserLoaded, listenUpdateQa, triggerUpdateQa} from "../../../../events/eventListeners.js";
import { observeState } from 'lit-element-state';
import { triggerAddQuestionEvent } from "../../../../events/custom-events.js";


export class CustomElement extends observeState(LitElement) {
    static properties = {
        questions: {type: Array},
        deletedQuestions: {type: Array},
        isLoading: {type: Boolean},
        deletedQuestionsVisible: {type: Boolean},
    };

    constructor() {
        super();
        this.questions = [];
        this.deletedQuestions = [];
        this.isLoading = false;
        this.deletedQuestionsVisible = false;
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    display: block;
                    padding: var(--spacing-normal);
                    font-size: var(--font-size-normal);
                    color: var(--text-color-dark);
                }

                .header-container {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: var(--spacing-normal);
                    padding-bottom: var(--spacing-normal);
                    border-bottom: 1px solid var(--border-color);
                }

                h1 {
                    margin: 0;
                    font-size: var(--font-size-large);
                    font-weight: 600;
                }

                .questions-list {
                    display: grid;
                    gap: var(--spacing-normal);
                }

                .deleted-questions-list {
                    display: grid;
                    gap: var(--spacing-normal);
                }
                
                .show-deleted-button {
                    margin-top: var(--spacing-normal);
                    cursor: pointer;
                    text-decoration: underline;
                }
            `
        ];
    }

    async _fetchQAItems() {
        this.isLoading = true;
        try {
            if (!userState.userData || !userState.userData.id) {
                console.warn('User data not available yet');
                return;
            }

            const userId = userState.userData.id;
            const response = await getAskedQAItems(userId);
            const qaItems = response?.data || [];
            if(response.success) {
                const filteredQuestions = qaItems.filter(item => item.deleted !== true);
                const deletedQuestions = qaItems.filter(item => item.deleted === true);
                
                // Sort questions: unanswered first, then by date asked (newest first)
                filteredQuestions.sort((a, b) => {
                    const aUnanswered = a.answers.length === 0 || !a.answers[0]?.answerText?.trim();
                    const bUnanswered = b.answers.length === 0 || !b.answers[0]?.answerText?.trim();
                    
                    // Unanswered questions come first
                    if (aUnanswered && !bUnanswered) return -1;
                    if (!aUnanswered && bUnanswered) return 1;
                    
                    // If both have same answered status, sort by question ID (assuming higher ID = more recent)
                    return b.id - a.id;
                });
                
                this.questions = filteredQuestions;
                this.deletedQuestions = deletedQuestions;
            }
        } catch (error) {
            messagesState.addMessage(error.message, 'error');
            console.error(error);
        } finally {
            this.isLoading = false;
        }
    }

    connectedCallback() {
        super.connectedCallback();

        if (userState.userData) {
            this._fetchQAItems();
        } else {
            listenInitialUserLoaded(this._fetchQAItems.bind(this))
        }

        listenUpdateQa(() => this._fetchQAItems());
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        // Clean up event listeners if needed
    }

    _handleAddQuestion() {
        triggerAddQuestionEvent({ });
    }

    async _handleDeleteQuestion(event) {
        await handleDeleteQuestion(event.detail.question);
    }

    async _handleForceDeleteQuestion(event) {
        const question = event.detail.question;
        try {
            const response = await forceDeleteQA(question);
            if (response.success) {
                messagesState.addMessage('Question deleted successfully', 'success');
            } else {
                messagesState.addMessage('Failed to delete question', 'error');
            }
        } catch (error) {
            console.error('Error deleting question:', error);
            messagesState.addMessage('An error occurred while deleting the question', 'error');
        } finally {
            triggerUpdateQa()
        }
    }


    _toggleDeletedQuestions() {
        this.deletedQuestionsVisible = !this.deletedQuestionsVisible;
    }

    render() {
        return html`
            <div class="header-container">
                <h1>Questions and Answers</h1>
                <button
                        class="button primary"
                        @click=${this._handleAddQuestion}
                >
                    Add Question
                </button>
            </div>

            <div class="questions-list">
                ${this.isLoading 
                    ? html`<p>Loading questions...</p>`
                    : this.questions.length === 0
                        ? html`<p>You haven't added any questions yet.</p>`
                        : this.questions.map(question => html`
                            <qa-page-question 
                                    .question="${question}"
                                    @delete-question="${this._handleDeleteQuestion}"
                            ></qa-page-question>
                        `)
                }
            </div>
            
            ${this.deletedQuestions?.length ? html`
                <div class="deleted-questions">
                    <button class="button button-as-link show-deleted-button" @click="${this._toggleDeletedQuestions}">
                        ${this.deletedQuestionsVisible ? 'Hide deleted questions' : 'Show deleted questions'}
                    </button>
                    ${this.deletedQuestionsVisible ? html`<div class="deleted-questions-list">
                        <h2>Deleted Questions</h2>
                        ${this.deletedQuestions.map(question => html`
                        <qa-page-deleted-item
                                .question="${question}"
                                @force-delete-question="${this._handleForceDeleteQuestion}"
                        ></qa-page-deleted-item>
                    `)}
                    </div>` : ''}
                </div>
            ` : ''}
        `;
    }
}

customElements.define('qa-page-container', CustomElement);
