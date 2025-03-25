import {LitElement, html, css} from 'lit';
import buttonStyles from "../../../css/buttons";
import '../../../svg/edit.js';
import '../../../svg/delete.js';
import '../../../svg/check.js';
import '../../global/custom-input.js';

export class QAItem extends LitElement {
    static properties = {
        item: { type: Object },
        isEditing: { type: Boolean },
        editedQuestion: { type: String },
        editedAnswer: { type: String },
        isNew: { type: Boolean }
    };

    constructor() {
        super();
        this.item = {
            id: 0,
            question: '',
            answer: ''
        };
        this.isEditing = false;
        this.isNew = false;
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

                .item-container:hover {
                    border: 1px solid var(--primary-color);
                    box-shadow: var(--shadow-1-soft);
                    transform: scale(1.01);
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
            `
        ];
    }

    connectedCallback() {
        super.connectedCallback();

        // If this is a new item, automatically enter edit mode
        if (this.isNew) {
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
        this.editedQuestion = this.item.question;
        this.editedAnswer = this.item.answer;
        this.isEditing = true;
    }

    // Toggle edit mode
    _toggleEdit() {
        if (this.isEditing) {
            this.isEditing = false;
        } else {
            this.enterEditMode();
        }
    }

    // Save edits
    _saveEdit() {
        const updatedItem = {
            ...this.item,
            question: this.editedQuestion,
            answer: this.editedAnswer
        };

        this.dispatchEvent(new CustomEvent('qa-item-updated', {
            detail: { item: updatedItem, isNew: this.isNew },
            bubbles: true,
            composed: true
        }));

        this.isEditing = false;

        // Reset the isNew flag after saving
        if (this.isNew) {
            this.isNew = false;
        }
    }

    // Delete item
    _deleteItem() {
        // If it's a new item, just close without confirmation
        if (this.isNew) {
            this.dispatchEvent(new CustomEvent('qa-item-deleted', {
                detail: { itemId: this.item.id },
                bubbles: true,
                composed: true
            }));
            return;
        }

        // For existing items, confirm deletion
        if (confirm('Are you sure you want to delete this Q&A item?')) {
            this.dispatchEvent(new CustomEvent('qa-item-deleted', {
                detail: { itemId: this.item.id },
                bubbles: true,
                composed: true
            }));
        }
    }

    // Handle question input change
    _onQuestionChange(e) {
        this.editedQuestion = e.target.value;
    }

    // Handle answer input change
    _onAnswerChange(e) {
        this.editedAnswer = e.target.value;
    }

    render() {
        return html`
            <div class="item-container ${this.isEditing ? 'editing' : ''}">
                ${this.isEditing
                        ? html`
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
                        `
                        : html`
                            <h3 class="question">${this.item.question}</h3>
                            <p class="answer">${this.item.answer}</p>
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
                        `
                }
            </div>
        `;
    }
}

customElements.define('qa-item', QAItem);
