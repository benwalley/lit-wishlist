import { LitElement, html, css } from 'lit';
import { observeState } from 'lit-element-state';

import '../../../svg/plus.js';
import '../../global/custom-input.js';
import '../../global/custom-toggle.js';
import '../../global/custom-modal.js';
import './qa-item.js';

import buttonStyles from "../../../css/buttons";
import formStyles from "../../../css/forms.js";
import scrollbarStyles from "../../../css/scrollbars.js";
import { messagesState } from "../../../state/messagesStore.js";
import { userState } from "../../../state/userStore.js";
import { getQAItems } from "./qa/qa-helpers.js";
import {listenInitialUserLoaded, listenUpdateQa} from "../../../events/eventListeners.js";
import {triggerAddQuestionEvent} from "../../../events/custom-events.js";

export class AccountQA extends observeState(LitElement) {
    static properties = {
        qaItems: { type: Array },
        isLoading: { type: Boolean },
        initialFetchDone: { type: Boolean, state: true },
    };

    static styles = [
        buttonStyles,
        formStyles,
        scrollbarStyles,
        css`
            :host {
                display: flex;
                gap: var(--spacing-normal);
                flex-direction: column;
                height: 100%;
                font-family: var(--font-family);
            }

            .header {
                display: flex;
                flex-wrap: wrap;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                padding: var(--spacing-small) 0 0 0;
            }

            .header h2 {
                margin: 0;
                font-family: var(--heading-font-family);
            }

            .qa-list {
                display: flex;
                flex-direction: column;
                max-height: 300px;
                overflow: auto;
            }

            .empty-state {
                text-align: center;
                padding: var(--spacing-large);
                border-radius: var(--border-radius-normal);
            }
            
            .all-questions-link {
                margin-top: auto;
                text-align: center;
                font-weight: 500;
                font-size: var(--font-size-small);
            }
        `,
    ];

    constructor() {
        super();
        this.qaItems = [];
        this.isLoading = true;
    }

    connectedCallback() {
        super.connectedCallback();
        this._fetchQAItems();
        listenUpdateQa(() => this._fetchQAItems());
        listenInitialUserLoaded(() => this._fetchQAItems())
    }

    disconnectedCallback() {
        super.disconnectedCallback();
    }


    async _fetchQAItems() {
        if (!userState.userData?.id) return;

        this.isLoading = true;
        try {
            const userId = userState.userData.id;
            const response = await getQAItems(userId);
            if (response.success) {
                this.qaItems = response.data || [];
                this.qaItems = this.qaItems.filter(item => item.deleted !== true);
                
                // Sort questions: unanswered first, then by due date
                this.qaItems.sort((a, b) => {
                    const aUnanswered = a.answers.length === 0 || !a.answers[0]?.answerText?.trim();
                    const bUnanswered = b.answers.length === 0 || !b.answers[0]?.answerText?.trim();
                    
                    // Unanswered questions come first
                    if (aUnanswered && !bUnanswered) return -1;
                    if (!aUnanswered && bUnanswered) return 1;
                    
                    // If both have same answered status, sort by due date (if available)
                    const aDate = a.dueDate ? new Date(a.dueDate) : null;
                    const bDate = b.dueDate ? new Date(b.dueDate) : null;
                    
                    if (aDate && bDate) {
                        return aDate - bDate; // Earlier dates first
                    }
                    if (aDate && !bDate) return -1; // Questions with due dates come first
                    if (!aDate && bDate) return 1;
                    
                    return 0; // No specific order for questions without due dates
                });
            } else {
                messagesState.addMessage(response.message || 'Failed to fetch Q&A items.', 'error');
            }
        } catch (error) {
            messagesState.addMessage(`Error fetching Q&A items: ${error.message}`, 'error');
            console.error('Error fetching Q&A items:', error);
        } finally {
            this.isLoading = false;
        }
    }

    _openAddPopup() {
        triggerAddQuestionEvent()
    }

    render() {
        return html`
            <div class="header">
                <h2>Q&A Section</h2>
                <button
                        class="primary"
                        @click=${this._openAddPopup}
                        ?disabled=${this.isLoading || this.qaItems.some(item => item.isNew)}
                >
                    <plus-icon></plus-icon> 
                    Add Question
                </button>
            </div>

            ${this.isLoading && !this.qaItems.length
                    ? html`<div class="loading-state">Loading Q&A...</div>`
                    : ''}

            <div class="qa-list custom-scrollbar">
                ${!this.isLoading && this.qaItems.length === 0
                        ? html`<div class="empty-state">No Q&A items yet. Add your first question!</div>`
                        : this.qaItems.map(item => html`<qa-item .item=${item}></qa-item>`)}
            </div>
            <a class="all-questions-link" href="/qa">View all questions</a>
        `;
    }
}

customElements.define('account-qa', AccountQA);
