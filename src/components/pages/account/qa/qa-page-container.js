import {LitElement, html, css} from 'lit';
import buttonStyles from "../../../../css/buttons"; // Assuming path is correct
import '../../../global/custom-tooltip.js'
import '../../../global/custom-modal.js'
import './qa-page-question.js';
import './qa-page-deleted-item.js';
import './add-qa-popup.js'
import {createQA, deleteQA, forceDeleteQA, getAskedQAItems, getQAItems, updateQuestion} from "./qa-helpers.js";
import {messagesState} from "../../../../state/messagesStore.js";
import {userState} from "../../../../state/userStore.js";
import {listenInitialUserLoaded, listenUpdateQa, triggerUpdateQa} from "../../../../events/eventListeners.js";
import { observeState } from 'lit-element-state';


export class CustomElement extends observeState(LitElement) {
    static properties = {
        questions: {type: Array},
        deletedQuestions: {type: Array},
        modalOpen: {type: Boolean},
        isLoading: {type: Boolean},
        deletedQuestionsVisible: {type: Boolean},
    };

    constructor() {
        super();
        this.modalOpen = false;
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
            console.log(`Fetching questions for user ID: ${userId}`);
            const response = await getAskedQAItems(userId);
            if(response.success) {
                const filteredQuestions = response.qaItems.filter(item => item.deleted !== true);
                const deletedQuestions = response.qaItems.filter(item => item.deleted === true);
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
        this.modalOpen = true;
    }

    _handleRestoreQuestion(event) {
        const question = event.detail.question;
        console.log(question)
        const form = this.shadowRoot.querySelector('add-qa-popup');
        const editData = {
            questionText: question.questionText,
            dueDate: question.dueDate,
            sharedWithUsers: question.sharedWithUserIds,
            sharedWithGroups: question.sharedWithGroupIds,
            isAnonymous: question.isAnonymous,
            questionId: question.id,
        }
        form.editQuestion(editData);
        this.modalOpen = true;
    }

    async _handleSaveQuestion(event) {
        const data = event.detail;
        data.deleted = false;
        if(data.isEditMode) {
            const response = await updateQuestion(data);
            if(response.success) {
                messagesState.addMessage('Question added successfully', 'success');
            }
        } else {
            if (!userState.userData || !userState.userData.id) {
                messagesState.addMessage('User data not available', 'error');
                return;
            }

            // Add user ID to the data
            data.userId = userState.userData.id;

            const response = await createQA(data);
            if(response.success) {
                messagesState.addMessage('Question added successfully', 'success');
            }
        }
        triggerUpdateQa()
        this.modalOpen = false;

    }

    _handleEditQuestion(event) {
        const question = event.detail.question;
        console.log(question)
        const form = this.shadowRoot.querySelector('add-qa-popup');
        const editData = {
            questionText: question.questionText,
            dueDate: question.dueDate,
            sharedWithUsers: question.sharedWithUserIds,
            sharedWithGroups: question.sharedWithGroupIds,
            isAnonymous: question.isAnonymous,
            questionId: question.id,
        }
        form.editQuestion(editData);
        this.modalOpen = true;
    }

    async _handleDeleteQuestion(event) {
        const question = event.detail.question;
        try {
            const response = await deleteQA(question);
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

    handleModalChanged(e) {
        this.modalOpen = e.detail.isOpen;
        if(!e.detail.isOpen) {
            this.shadowRoot.querySelector('add-qa-popup').clearForm();
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
                                    @edit-question="${this._handleEditQuestion}"
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
                                @restore-question="${this._handleRestoreQuestion}"
                                @force-delete-question="${this._handleForceDeleteQuestion}"
                        ></qa-page-deleted-item>
                    `)}
                    </div>` : ''}
                </div>
            ` : ''}
            <custom-modal .isOpen="${this.modalOpen}" 
                          noPadding 
                          maxWidth="700px"
                          @cancel-popup="${() => this.modalOpen = false}"
                          @submit-question="${this._handleSaveQuestion}"
                          @modal-changed="${this.handleModalChanged}"
            >
                <add-qa-popup></add-qa-popup>
            </custom-modal>
        `;
    }
}

customElements.define('qa-page-container', CustomElement);
