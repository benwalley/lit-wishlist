import {LitElement, html, css} from 'lit';
import {observeState} from 'lit-element-state';
import {customFetch} from "../../../../helpers/fetchHelpers.js";
import './select-question-item.js';
import '../../../../svg/check.js';
import {cachedFetch} from "../../../../helpers/caching.js";
import {getAskedQAItems} from "./qa-helpers.js";
import {listenInitialUserLoaded, listenUpdateQa} from "../../../../events/eventListeners.js";
import {userState} from "../../../../state/userStore.js";
import {messagesState} from "../../../../state/messagesStore.js";

export class CustomElement extends observeState(LitElement) {
    static properties = {
        questions: {type: Array}, // Track questions fetched from the server
        selectedQuestionIds: {type: Array},
        loading: {type: Boolean},
        userId: {type: String}, // ID of the user whose questions to fetch (can be overridden)
        includeAnswered: {type: Boolean}, // Option to include answered questions
        includeUnanswered: {type: Boolean} // Option to include unanswered questions
    };

    constructor() {
        super();
        this.questions = []; // Initialize questions
        this.selectedQuestionIds = [];
        this.loading = true;
        this.userId = ''; // Can be overridden via props
        this.includeAnswered = true;
        this.includeUnanswered = true;
    }

    static get styles() {
        return css`
            :host {
                display: block;
                border: 1px solid var(--border-color);
                border-radius: var(--border-radius-normal);
                background-color: var(--background-color);
            }

            .header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: var(--spacing-x-small);
                border-bottom: 1px solid var(--border-color);
            }

            .title {
                font-weight: bold;
                font-size: var(--font-size-small);
                color: var(--text-color-dark);
            }

            .selection-info {
                display: flex;
                align-items: center;
                gap: var(--spacing-x-small);
            }

            .selected-count {
                font-size: var(--font-size-x-small);
                color: var(--primary-color);
                font-weight: bold;
            }

            .action-buttons {
                display: flex;
                gap: var(--spacing-x-small);
            }

            button {
                border: none;
                background: none;
                padding: var(--spacing-x-small) var(--spacing-small);
                border-radius: var(--border-radius-small);
                font-size: var(--font-size-x-small);
                cursor: pointer;
                transition: var(--transition-normal);
            }

            .select-all {
                color: var(--primary-color);
            }

            .select-all:hover {
                background-color: var(--purple-light);
            }

            .clear {
                color: var(--text-color-medium-dark);
            }

            .clear:hover {
                background-color: var(--grayscale-150);
            }

            .questions-container {
                display: flex;
                flex-direction: column;
                gap: var(--spacing-x-small);
                max-height: 200px;
                overflow-y: auto;
                padding: var(--spacing-x-small);
            }

            .questions-container::-webkit-scrollbar {
                width: 8px;
            }

            .questions-container::-webkit-scrollbar-track {
                background: var(--background-color);
                border-radius: 4px;
            }

            .questions-container::-webkit-scrollbar-thumb {
                background: var(--grayscale-300);
                border-radius: 4px;
            }

            .questions-container::-webkit-scrollbar-thumb:hover {
                background: var(--grayscale-400);
            }

            .empty-message {
                color: var(--text-color-medium-dark);
                font-size: var(--font-size-small);
                padding: var(--spacing-small);
                text-align: center;
            }

            .loading {
                padding: var(--spacing-small);
                text-align: center;
                color: var(--text-color-medium-dark);
                font-size: var(--font-size-small);
            }
            
            .filters {
                display: flex;
                gap: var(--spacing-x-small);
                padding: var(--spacing-x-small);
                border-bottom: 1px solid var(--border-color);
                font-size: var(--font-size-x-small);
            }
            
            .filter-option {
                display: flex;
                align-items: center;
                gap: 4px;
            }
            
            .filter-option input {
                margin: 0;
            }
        `;
    }

    connectedCallback() {
        super.connectedCallback();
        this.fetchQuestions(); // Fetch questions when the component is added to the DOM
        listenUpdateQa(() => this.fetchQuestions.bind(this));
        listenInitialUserLoaded(this.fetchQuestions.bind(this))
    }

    async fetchQuestions() {
        const userId = userState?.userData?.id;
        if (!userId) return;

        try {
            const response = await getAskedQAItems(userId);

            if (response?.success) {
                // Ensure response is properly formatted and contains data
                this.questions = response.data;
            } else {
                throw new Error(response?.message || 'Failed to fetch questions');
            }
        } catch (error) {
           messagesState.addMessage('Error fetching questions: ', 'error');
        } finally {
            this.loading = false;
        }
    }

    _filterQuestions() {
        if (!this.allQuestions) return;

        this.questions = this.allQuestions.filter(question => {
            const hasAnswer = question.answers && question.answers.length > 0;

            if (this.includeAnswered && hasAnswer) return true;
            if (this.includeUnanswered && !hasAnswer) return true;

            return false;
        });

        // Update selected questions based on filtered list
        this.selectedQuestionIds = this.selectedQuestionIds.filter(id =>
            this.questions.some(q => q.id === id)
        );

        this.requestUpdate();
    }

    _handleItemClick(event) {
        const itemData = event.detail.itemData;
        const index = this.selectedQuestionIds.indexOf(itemData.id);
        if (index > -1) {
            this.selectedQuestionIds.splice(index, 1);
        } else {
            this.selectedQuestionIds.push(itemData.id);
        }
        this.requestUpdate();
        this._emitChangeEvent();
    }

    _handleFilterChange(event) {
        const target = event.target;
        if (target.id === 'include-answered') {
            this.includeAnswered = target.checked;
        } else if (target.id === 'include-unanswered') {
            this.includeUnanswered = target.checked;
        }
    }

    selectAll() {
        // Set selectedQuestionIds to include all question IDs, ensuring questions is an array
        const questionsArray = Array.isArray(this.questions) ? this.questions : [];
        this.selectedQuestionIds = questionsArray
            .filter(question => question && question.id)
            .map(question => question.id);
        this._emitChangeEvent();
        this.requestUpdate();
    }

    clearSelection() {
        this.selectedQuestionIds = [];
        this._emitChangeEvent();
        this.requestUpdate();
    }

    _emitChangeEvent() {
        // Ensure questions is an array before using find method
        const questionsArray = Array.isArray(this.questions) ? this.questions : [];

        const selectedQuestions = this.selectedQuestionIds
            .map(id => questionsArray.find(question => question && question.id === id))
            .filter(Boolean);

        this.dispatchEvent(new CustomEvent('change', {
            detail: {
                selectedQuestionIds: this.selectedQuestionIds,
                selectedQuestions,
                count: this.selectedQuestionIds.length
            },
            bubbles: true,
            composed: true
        }));
    }

    render() {
        if (this.loading) {
            return html`
                <div class="loading">Loading questions...</div>
            `;
        }

        if (!this.questions || !Array.isArray(this.questions) || this.questions.length === 0) {
            return html`
                <div class="empty-message">No questions available.</div>
            `;
        }

        return html`
            <div class="header">
                <div class="selection-info">
                    <div class="title">Questions</div>
                    ${this.selectedQuestionIds.length > 0 ? html`
                        <div class="selected-count">(${this.selectedQuestionIds.length} selected)</div>
                    ` : ''}
                </div>

                <div class="action-buttons">
                    ${this.questions.length > 0 ? html`
                        <button class="select-all" @click=${this.selectAll}>Select All</button>
                    ` : ''}

                    ${this.selectedQuestionIds.length > 0 ? html`
                        <button class="clear" @click=${this.clearSelection}>Clear</button>
                    ` : ''}
                </div>
            </div>

            <div class="questions-container">
                ${Array.isArray(this.questions) 
                    ? this.questions.map(
                        question => question ? html`
                            <select-question-item
                                .itemData=${question}
                                .isSelected="${this.selectedQuestionIds.includes(question?.id)}"
                                @item-clicked="${this._handleItemClick}"
                            ></select-question-item>
                        ` : ''
                    )
                    : html`<div class="empty-message">No questions available.</div>`
                }
            </div>
        `;
    }
}

customElements.define('select-my-questions', CustomElement);
