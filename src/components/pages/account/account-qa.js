import { LitElement, html, css } from 'lit';
import { observeState } from 'lit-element-state';

import '../../../svg/plus.js';
import '../../global/custom-input.js';
import '../../global/custom-toggle.js';
import '../../global/custom-modal.js';
import './qa-item.js';

import buttonStyles from "../../../css/buttons";
import formStyles from "../../../css/forms.js";

import { getUniqueId } from "../../../helpers/generalHelpers.js";
import { messagesState } from "../../../state/messagesStore.js";
import { userState } from "../../../state/userStore.js";
import { createQA, deleteQA, getQAItems, updateAnswer, updateQuestion } from "./qa/qa-helpers.js";
import {listenInitialUserLoaded, listenUpdateQa} from "../../../events/eventListeners.js";

export class AccountQA extends observeState(LitElement) {
    static properties = {
        qaItems: { type: Array },
        isLoading: { type: Boolean },
        initialFetchDone: { type: Boolean, state: true },
    };

    static styles = [
        buttonStyles,
        formStyles,
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
            }

            .header h2 {
                margin: 0;
                font-family: var(--heading-font-family);
            }

            .qa-list {
                display: flex;
                flex-direction: column;
                gap: var(--spacing-small);
            }

            .empty-state {
                text-align: center;
                padding: var(--spacing-large);
                border-radius: var(--border-radius-normal);
            }
            
            .all-questions-link {
                margin-top: auto;
            }
        `,
    ];

    constructor() {
        super();
        this.qaItems = [];
        this.isLoading = false;
        this.initialFetchDone = false;
    }

    connectedCallback() {
        super.connectedCallback();
        this.addEventListener('qa-item-updated', this._handleItemUpdated);
        this.addEventListener('qa-item-deleted', this._handleItemDeleted);
        this._fetchQAItems();
        listenUpdateQa(this._fetchQAItems.bind(this));
        listenInitialUserLoaded(this._fetchQAItems.bind(this))
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListener('qa-item-updated', this._handleItemUpdated);
        this.removeEventListener('qa-item-deleted', this._handleItemDeleted);
    }

    updated(changedProperties) {
        super.updated(changedProperties);
        if (userState.userData?.id && !this.initialFetchDone) {
            this.initialFetchDone = true;
            console.log('here')
            this._fetchQAItems();
        }
    }

    async _fetchQAItems() {
        if (!userState.userData?.id) {
            console.warn('User data not available yet for fetching QA items.');
            return;
        }

        this.isLoading = true;
        try {
            const userId = userState.userData.id;
            const response = await getQAItems(userId);
            if (response.success) {
                this.qaItems = response.qaItems || [];
                this.qaItems = this.qaItems.filter(item => item.deleted !== true);
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

    _addNewItem() {
        if (this.qaItems.some(item => item.isNew)) {
            messagesState.addMessage('Please save the currently open new item before adding another.', 'info');
            return;
        }

        const newItem = {
            id: getUniqueId(),
            questionText: '',
            answers: [],
            isNew: true,
            editing: true,
        };

        this.qaItems = [...this.qaItems, newItem];
    }

    async _handleItemUpdated(e) {
        const updatedItem = e.detail.item;
        const itemId = updatedItem.id;
        let success = false;
        let message = '';

        try {
            if (updatedItem.isNew) {
                const response = await createQA({
                    questionText: updatedItem.questionText,
                    answerText: updatedItem.answers?.[0]?.answerText,
                    userId: userState.userData.id,
                    shareWithUsers: [userState.userData.id]
                });
                if (response.success) {
                    this.qaItems = this.qaItems.map(item => (item.id === itemId ? response.qaData : item));
                    success = true;
                    message = 'Question added successfully.';
                } else {
                    message = response.message || 'Failed to create Q&A item.';
                }
            } else {
                const questionResponse = await updateQuestion(updatedItem);
                let finalUpdatedItem = updatedItem;

                if (questionResponse.success) {
                    finalUpdatedItem = { ...finalUpdatedItem, ...questionResponse.updatedValue };

                    if (updatedItem.answers?.length > 0) {
                        const data = {
                            questionId: updatedItem.id,
                            answerText: updatedItem.answers[0]?.answerText || '',
                        }
                        const answerResponse = await updateAnswer(data);
                        if (answerResponse.success) {
                            finalUpdatedItem.answers = [answerResponse.updatedValue];
                            success = true;
                            message = 'Question and answer saved successfully.';
                        } else {
                            message = answerResponse.message || 'Failed to save answer, but question was saved.';
                        }
                    } else {
                        success = true;
                        message = 'Question saved successfully.';
                        finalUpdatedItem.answers = [];
                    }

                    this.qaItems = this.qaItems.map(item =>
                        item.id === itemId ? { ...finalUpdatedItem, isNew: false, editing: false, loading: false } : item
                    );
                } else {
                    message = questionResponse.message || 'Failed to save question.';
                    this.qaItems = this.qaItems.map(item =>
                        item.id === itemId ? { ...item, loading: false } : item
                    );
                }
            }
        } catch (error) {
            console.error('Error updating Q&A item:', error);
            message = `Error saving Q&A: ${error.message}`;
            this.qaItems = this.qaItems.map(item =>
                item.id === itemId ? { ...item, loading: false } : item
            );
        } finally {
            messagesState.addMessage(message, success ? 'success' : 'error');
        }
    }

    async _handleItemDeleted(e) {
        const itemToDelete = e.detail.item;
        const originalItems = [...this.qaItems];

        this.qaItems = this.qaItems.filter(item => item.id !== itemToDelete.id);

        if(itemToDelete.isNew) return;
        try {
            const response = await deleteQA(itemToDelete);
            if (response.success) {
                messagesState.addMessage('Q&A item deleted successfully.', 'success');
            } else {
                this.qaItems = originalItems;
            }
        } catch (error) {
            this.qaItems = originalItems;
            messagesState.addMessage(`Error deleting Q&A item: ${error.message}`, 'error');
            console.error('Error deleting Q&A item:', error);
        }
    }

    render() {
        return html`
            <div class="header">
                <h2>Q&A Section</h2>
                <button
                        class="primary"
                        @click=${this._addNewItem}
                        ?disabled=${this.isLoading || this.qaItems.some(item => item.isNew)}
                >
                    <plus-icon></plus-icon> 
                    Add Question
                </button>
            </div>

            ${this.isLoading && !this.qaItems.length
                    ? html`<div class="loading-state">Loading Q&A...</div>`
                    : ''}

            <div class="qa-list">
                ${!this.isLoading && this.qaItems.length === 0
                        ? html`<div class="empty-state">No Q&A items yet. Add your first question!</div>`
                        : this.qaItems.map(item => html`<qa-item .item=${item}></qa-item>`)}
            </div>
            <a class="all-questions-link" href="/qa">Your Questions</a>
        `;
    }
}

customElements.define('account-qa', AccountQA);
