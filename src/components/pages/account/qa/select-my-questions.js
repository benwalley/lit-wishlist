import {LitElement, html, css} from 'lit';
import {observeState} from 'lit-element-state';
import './select-question-item.js';
import '../../../../svg/check.js';
import {getAskedQAItems} from "./qa-helpers.js";
import {listenInitialUserLoaded, listenUpdateQa} from "../../../../events/eventListeners.js";
import {userState} from "../../../../state/userStore.js";
import {messagesState} from "../../../../state/messagesStore.js";
import '../../../../components/global/selectable-list/selectable-list.js';

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
            }
        `;
    }

    connectedCallback() {
        super.connectedCallback();
        this.fetchQuestions(); // Fetch questions when the component is added to the DOM
        listenUpdateQa(this.fetchQuestions.bind(this));
        listenInitialUserLoaded(this.fetchQuestions.bind(this))
    }

    async fetchQuestions() {
        const userId = userState?.userData?.id;
        if (!userId) return;

        try {
            this.loading = true;
            const response = await getAskedQAItems(userId);

            if (response?.success) {
                // Ensure response is properly formatted and contains data
                this.questions = response.data;
            } else {
                throw new Error(response?.message || 'Failed to fetch questions');
            }
        } catch (error) {
           messagesState.addMessage('Error fetching questions: ', 'error');
           this.questions = [];
        } finally {
            this.loading = false;
        }
    }

    _handleSelectionChange(event) {
        this.selectedQuestionIds = event.detail.selectedItemIds;

        // Forward the event with our component's naming convention
        this.dispatchEvent(new CustomEvent('change', {
            detail: {
                selectedQuestionIds: this.selectedQuestionIds,
                selectedQuestions: event.detail.selectedItems,
                count: event.detail.count
            },
            bubbles: true,
            composed: true
        }));
    }

    // Custom renderer for the select-question-item component
    _renderItem(item, isSelected, handleClick) {
        return html`
            <select-question-item
                .itemData=${item}
                .isSelected=${isSelected}
                @item-clicked=${() => handleClick(item)}
            ></select-question-item>
        `;
    }

    render() {
        return html`
            <selectable-list
                .items=${this.questions}
                .selectedItemIds=${this.selectedQuestionIds}
                .loading=${this.loading}
                .itemRenderer=${this._renderItem}
                .title=${"Questions"}
                .customEmptyMessage=${"No questions available."}
                @selection-changed=${this._handleSelectionChange}
            ></selectable-list>
        `;
    }
}

customElements.define('select-my-questions', CustomElement);
