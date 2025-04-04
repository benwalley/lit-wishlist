import {LitElement, html, css} from 'lit';
import buttonStyles from "../../../css/buttons";
import '../../../svg/edit.js';
import '../../../svg/delete.js';
import '../../../svg/check.js';
import '../../global/custom-input.js';
import {messagesState} from "../../../state/messagesStore.js";
import '../../loading/skeleton-loader.js'

export class QAItem extends LitElement {
    static properties = {
        item: { type: Object },
        isEditing: { type: Boolean },
        editedQuestion: { type: String },
        editedAnswer: { type: String },
    };

    constructor() {
        super();
        this.item = {
            id: 0,
            questionText: '',
            answers: [],
            loading: false,
        };
        this.isEditing = false;
        this.editedQuestion = '';
        this.editedAnswer = '';
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    display: block;
                }

                .item-container {
                    transition: var(--transition-normal);
                    background: var(--background-dark);
                    display: flex;
                    position: relative;
                    flex-direction: column;
                    align-items: flex-start;
                    text-decoration: none;
                    margin: 0;
                    border-radius: var(--border-radius-normal);
                    padding: var(--spacing-small);
                    border: 1px solid var(--border-color);
                    overflow: hidden;
                    height: auto;
                }

                .item-container.editing {
                    border-color: var(--primary-color);
                    box-shadow: var(--shadow-1-soft);
                }

                .item-container.empty-answer {
                    border-left: 4px solid var(--info-yellow);
                }

                .empty-answer .missing-info {
                    display: inline-block;
                    color: var(--info-yellow);
                    font-size: var(--font-size-small);
                    margin-top: var(--spacing-tiny);
                    font-style: italic;
                }

                .actions {
                    position: absolute;
                    right: 0;
                    top: 0;
                    opacity: 0;
                    transform: translateX(20px);
                    pointer-events: none;
                    transition: opacity 0.3s ease, transform 0.3s ease;
                    display: flex;
                    gap: var(--spacing-tiny);
                    padding: var(--spacing-tiny);
                }

                /* Reveal actions on hover */
                .item-container:hover .actions {
                    opacity: 1;
                    transform: translateX(0);
                    pointer-events: auto;
                }

                .question {
                    margin: 0;
                    text-align: left;
                    color: var(--text-color-dark);
                    font-weight: bold;
                }

                .answer {
                    margin: var(--spacing-tiny) 0;
                    text-align: left;
                    color: var(--text-color-medium);
                }

                .icon-button:hover {
                    transform: scale(1.05);
                }

                .edit-actions {
                    display: flex;
                    justify-content: space-between;
                    padding: var(--spacing-small);
                    gap: var(--spacing-small);
                    width: 100%;
                    box-sizing: border-box;
                }
                
                .loader-container {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-small);
                }
            `
        ];
    }

    connectedCallback() {
        super.connectedCallback();

        // If this is a new item, automatically enter edit mode
        if (this.item?.isNew) {
            this.enterEditMode();
        }

        // Listen for the close-other-editors event
        this.addEventListener('close-other-editors', this._handleCloseOtherEditors);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListener('close-other-editors', this._handleCloseOtherEditors);
    }

    // Handle the close-other-editors event
    _handleCloseOtherEditors(e) {
        // Only close if we're editing and not the item that triggered the event
        if (this.isEditing && e.detail.sourceItemId !== this.item.id) {
            this.isEditing = false;
        }
    }

    // Enter edit mode
    enterEditMode() {
        // Notify other items to close their editors
        this.dispatchEvent(new CustomEvent('close-other-editors', {
            bubbles: true,
            composed: true,
            detail: { sourceItemId: this.item.id }
        }));

        // Initialize edited values
        this.editedQuestion = this.item.questionText;
        this.editedAnswer = this.item.answers[0]?.answerText || '';
        this.isEditing = true;
    }

    // Toggle edit mode
    _toggleEdit() {
        if(this.item.isNew) {
            this._deleteItem();
        }
        if (this.isEditing) {
            this.isEditing = false;
        } else {
            this.enterEditMode();
        }
    }

    // Save edits
    _saveEdit() {
        if(!this.editedQuestion?.length) {
            messagesState.addMessage('Please add a question.', 'error');
            return;
        }
        const updatedItem = {...this.item}
        updatedItem.questionText = this.editedQuestion;
        if(updatedItem.answers?.length) {
            updatedItem.answers[0].answerText = this.editedAnswer;
        } else {
            updatedItem.answers = [{answerText: this.editedAnswer}];
        }

        this.dispatchEvent(new CustomEvent('qa-item-updated', {
            detail: { item: updatedItem },
            bubbles: true,
            composed: true
        }));

        this.isEditing = false;
    }

    // Delete item
    _deleteItem() {
        if (this.item.isNew) {
            this.dispatchEvent(new CustomEvent('qa-item-deleted', {
                detail: { item: this.item },
                bubbles: true,
                composed: true
            }));
            return;
        }

        // For existing items, confirm deletion
        if (confirm('Are you sure you want to delete this Q&A item?')) {
            this.dispatchEvent(new CustomEvent('qa-item-deleted', {
                detail: { item: this.item },
                bubbles: true,
                composed: true
            }));
        }
    }

    _onQuestionChange(e) {
        this.editedQuestion = e.target.value;
    }

    _onAnswerChange(e) {
        this.editedAnswer = e.target.value;
    }

    _renderViewMode() {
        const hasEmptyAnswer = this.item.answers?.length === 0 || !this.item.answers[0]?.answerText?.trim();

        return html`
            <h3 class="question">${this.item.questionText}</h3>
            ${hasEmptyAnswer
                    ? html`<span class="missing-info">Needs an answer</span>`
                    : html`<p class="answer">${this.item.answers[0]?.answerText}</p>`
            }
            <div class="actions">
                <button
                        aria-label="edit"
                        class="icon-button"
                        style="--icon-color: var(--blue-normal);
                         --icon-color-hover: var(--blue-darker);
                         --icon-hover-background: var(--blue-light);"
                        @click="${this._toggleEdit}"
                >
                    <edit-icon></edit-icon>
                </button>
                <button
                        aria-label="delete"
                        class="icon-button"
                        style="--icon-color: var(--delete-red);
                         --icon-color-hover: var(--delete-red-darker);
                         --icon-hover-background: var(--delete-red-light);"
                        @click="${this._deleteItem}"
                >
                    <delete-icon></delete-icon>
                </button>
            </div>
        `;
    }

    /** Renders the component in edit mode. */
    _renderEditMode() {
        return html`
            <custom-input
                    label="Question"
                    .value="${this.editedQuestion}"
                    @value-changed="${this._onQuestionChange}"
            ></custom-input>
            <custom-input
                    label="Answer"
                    .value="${this.editedAnswer}"
                    @value-changed="${this._onAnswerChange}"
            ></custom-input>
            <div class="edit-actions">
                <button class="secondary" @click="${this._toggleEdit}">Cancel</button>
                <button class="primary" @click="${this._saveEdit}">Save</button>
            </div>
        `;
    }

    _renderLoading() {
        return html`<div class="loader-container">
            <skeleton-loader width="100%" height="24px"></skeleton-loader>
            <skeleton-loader width="100%" height="20px"></skeleton-loader>
        </div>`;
    }

    _renderContent() {
        if (this.item.loading) {
            // Assumes you have _renderLoading() defined
            return this._renderLoading();
        } else if (this.isEditing) {
            // Assumes you have _renderEditMode() defined
            return this._renderEditMode();
        } else {
            // Assumes you have _renderViewMode() defined
            return this._renderViewMode();
        }
    }

    render() {
        const hasEmptyAnswer = !this.isEditing && !this.item.loading && (this.item.answers?.length === 0 || !this.item.answers[0]?.answerText?.trim());

        return html`
            <div class="item-container ${this.isEditing ? 'editing' : ''} ${hasEmptyAnswer ? 'empty-answer' : ''}">
                ${this._renderContent()}
            </div>
        `;
    }
}

customElements.define('qa-item', QAItem);
