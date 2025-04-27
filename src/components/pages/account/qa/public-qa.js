import { LitElement, html, css } from 'lit';
import { observeState } from 'lit-element-state';

import '../../../../svg/plus.js';
import '../../../global/custom-input.js';
import '../../../global/custom-toggle.js';
import '../../../global/custom-modal.js';
import '../qa-item.js';
import buttonStyles from "../../../../css/buttons";
import formStyles from "../../../../css/forms.js";
import { messagesState } from "../../../../state/messagesStore.js";
import { getQAItems } from "./qa-helpers.js";
import { listenUpdateQa } from "../../../../events/eventListeners.js";
import { triggerAddQuestionEvent } from "../../../../events/custom-events.js";

export class PublicQA extends observeState(LitElement) {
    static properties = {
        userId: { type: String },
        qaItems: { type: Array },
        isLoading: { type: Boolean },
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
            
            .loading-state {
                text-align: center;
                padding: var(--spacing-large);
            }
            
            .qa-list qa-item {
                pointer-events: none;
            }
        `,
    ];

    constructor() {
        super();
        this.userId = '';
        this.qaItems = [];
        this.isLoading = false;
    }

    connectedCallback() {
        super.connectedCallback();
        this._fetchQAItems();
        listenUpdateQa(this._fetchQAItems.bind(this));
    }

    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has('userId') && this.userId) {
            this._fetchQAItems();
        }
    }

    async _fetchQAItems() {
        if (!this.userId) {
            messagesState.addMessage('Error fetching Questions. Please reload page and try again.', 'error');
            return;
        }

        this.isLoading = true;
        try {
            const response = await getQAItems(this.userId);
            if (response.success) {
                // Filter for only public QA items that have answers
                this.qaItems = (response.qaItems || [])
                    .filter(item => !item.deleted) // Not deleted
            } else {
                messagesState.addMessage(response.message || 'Failed to fetch public Q&A items.', 'error');
            }
        } catch (error) {
            messagesState.addMessage(`Error fetching public Q&A items: ${error.message}`, 'error');
            console.error('Error fetching public Q&A items:', error);
        } finally {
            this.isLoading = false;
        }
    }

    _handleAskQuestion() {
        triggerAddQuestionEvent({sharedWithUserIds: [parseInt(this.userId)] });
    }

    render() {
        return html`
            <div class="header">
                <h2>Public Q&A</h2>
            </div>

            ${this.isLoading
                ? html`<div class="loading-state">Loading public Q&A...</div>`
                : ''}

            <div class="qa-list">
                ${!this.isLoading && this.qaItems.length === 0
                    ? html`<div class="empty-state">No public Q&A items available.</div>`
                    : this.qaItems.map(item => html`<qa-item .item=${item}></qa-item>`)}
            </div>
            <button class="primary" @click=${this._handleAskQuestion}>Ask a question</button>
        `;
    }
}

customElements.define('public-qa', PublicQA);
