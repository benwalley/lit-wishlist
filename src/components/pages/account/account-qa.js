import {LitElement, html, css} from 'lit';
import '../../../svg/plus.js';
import '../../../svg/delete.js';
import '../../../svg/edit.js';
import '../../global/custom-input.js';
import '../../global/custom-toggle.js';
import '../../global/custom-modal.js';
import './qa-item.js'
import buttonStyles from "../../../css/buttons";
import {getUniqueId} from "../../../helpers/generalHelpers.js";
import {messagesState} from "../../../state/messagesStore.js";
import {cachedFetch} from "../../../helpers/caching.js";
import {customFetch} from "../../../helpers/fetchHelpers.js";
import {createQA, deleteQA, getQAItems, saveQA, updateAnswer, updateQuestion} from "./qa/qa-helpers.js";
import {listenUpdateQa, triggerUpdateQa} from "../../../events/eventListeners.js";


export class AccountQA extends LitElement {
    static properties = {
        qaItems: { type: Array },
        isLoading: {type: Boolean}
    };

    constructor() {
        super();
        this.qaItems = [];
        this.isLoading = false;
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    display: flex;
                    gap: var(--spacing-normal);
                    flex-direction: column;
                    font-family: var(--font-family);
                }

                .header {
                    display: flex;
                    flex-wrap: wrap;
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;

                    h2 {
                        margin: 0;
                        font-family: var(--heading-font-family);
                    }
                }

                .qa-list {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-small)
                }

                .empty-state {
                    text-align: center;
                    padding: var(--spacing-large);
                    color: var(--text-color-medium);
                    background: var(--background-medium);
                    border-radius: var(--border-radius-normal);
                }
            `
        ];
    }

    async _fetchQAItems() {
        console.log('fetching')
        this.isLoading = true;
        try {
            const userId = 1;
            const response = await getQAItems(userId)
            if(response.success) {
                this.qaItems = response.qaItems;
            }

        } catch (error) {
            messagesState.addMessage(error.message, 'error');
            console.error(error);
        } finally {
            this.isLoading = false;
        }
    }

    // Add a new Q&A item with default values in edit mode
    _addNewItem() {
        const newId = getUniqueId();

        for(const item of this.qaItems) {
            if (item.isNew) {
                messagesState.addMessage('Please save the new item before adding another.', 'error');
                return;
            }
        }

        this.qaItems = [
            ...this.qaItems,
            {
                id: newId,
                questionText: '',
                answers: [],
                isNew: true
            }
        ];
    }

    setItemValue(itemId, key, value) {
        this.qaItems = this.qaItems.map(item => {
                if(item.id === itemId) {
                    item[key] = value;
                }
                return item;
            }
        );
    }

    // Handle the qa-item-updated event
    async _handleItemUpdated(e) {
        const updatedItem = e.detail.item;
        const itemId = updatedItem.id;
        this.setItemValue(itemId, 'loading', true)


        if(updatedItem.isNew) {
            // set loading state on editing item.
            // TODO: Make this seprate func

            const updatedData = await createQA(updatedItem.questionText, updatedItem.answers[0].answerText, 1);
            if(!updatedData.success) return;
            this.qaItems = this.qaItems.map(item =>
                item.id === itemId ? updatedData.qaData : item
            );
            messagesState.addMessage('Question added successfully', 'success');
            return;
        }

        const updatedQuestion = await updateQuestion(updatedItem);
        const returnValue = updatedQuestion.updatedValue;
        returnValue.answers = [];
        if(updatedItem.answers?.length) {
            const updatedAnswer = await updateAnswer(updatedItem.answers[0]);
            returnValue.answers.push(updatedAnswer.updatedValue)
        }
        this.qaItems = this.qaItems.map(item =>
            item.id === itemId ? returnValue : item
        );
        messagesState.addMessage('Saved question and answer', 'success');
    }

    async _handleItemDeleted(e) {
        const itemData = e.detail.item;
        this.qaItems = this.qaItems.filter(item => item.id !== itemData.id);
        const response = await deleteQA(itemData);

    }

    connectedCallback() {
        super.connectedCallback();
        this._fetchQAItems();
        this.addEventListener('qa-item-updated', this._handleItemUpdated);
        this.addEventListener('qa-item-deleted', this._handleItemDeleted);
        listenUpdateQa(this._fetchQAItems);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        // Remove event listeners
        this.removeEventListener('qa-item-updated', this._handleItemUpdated);
        this.removeEventListener('qa-item-deleted', this._handleItemDeleted);
    }

    render() {
        return html`
            <div class="header">
                <h2>Q&A Section</h2>
                <button class="primary" @click=${this._addNewItem}>
                    <plus-icon></plus-icon>
                    Add Question
                </button>
            </div>

            <div class="qa-list">
                ${this.qaItems.length === 0
                        ? html`<div class="empty-state">No Q&A items yet. Add your first question!</div>`
                        : this.qaItems.map(item => html`
                            <qa-item
                                    .item="${item}"
                            ></qa-item>
                        `)
                }
            </div>
        `;
    }
}

customElements.define('account-qa', AccountQA);
