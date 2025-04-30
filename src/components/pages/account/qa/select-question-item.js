import {LitElement, html, css} from 'lit';
import '../../../../svg/check.js';
import '../../../../svg/question-mark.js';

export class CustomElement extends LitElement {
    static properties = {
        itemData: {type: Object},
        isSelected: {type: Boolean}
    };

    constructor() {
        super();
        this.itemData = {};
        this.isSelected = false;
    }

    static get styles() {
        return css`
            :host {
                display: block;
                color: var(--text-color-dark);
            }

            button.question-container {
                display: flex;
                align-items: center;
                width: 100%;
                padding: var(--spacing-x-small);
                border: none;
                background: none;
                cursor: pointer;
                text-align: left;
                gap: 8px;
                transition: var(--transition-normal);
                border-radius: var(--border-radius-small);
            }

            button.question-container:hover {
                background-color: var(--background-light);
            }
            
            button.question-container.selected {
                background-color: var(--background-light);
            }
            
            .checkbox {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 16px;
                height: 16px;
                border-radius: 4px;
                border: 2px solid var(--grayscale-300);
                transition: var(--transition-normal);
            }
            
            .checkbox.selected {
                border-color: var(--blue-normal);
                background-color: var(--blue-normal);
                color: white;
            }
            
            check-icon {
                width: 16px;
                height: 16px;
                color: white;
            }
            
            question-mark-icon {
                width: 24px;
                height: 24px;
                color: var(--primary-color);
                background-color: var(--background-light);
                border-radius: 50%;
                padding: 2px;
            }
            
            .question-info {
                flex: 1;
                display: flex;
                gap: 2px;
                flex-direction: column;
            }

            .question-text {
                font-size: var(--font-size-small);
                font-weight: bold;
                color: var(--text-color-dark);
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
            }

            .has-answer {
                font-size: var(--font-size-x-small);
                color: var(--success-color);
            }
            
            .no-answer {
                font-size: var(--font-size-x-small);
                color: var(--warning-color);
            }
            
            .due-date {
                font-size: var(--font-size-x-small);
                color: var(--text-color-medium-dark);
            }
        `;
    }

    _handleItemClick() {
        this.dispatchEvent(new CustomEvent('item-clicked', {
            detail: { itemData: this.itemData }
        }));
    }

    _formatDueDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    }

    render() {
        const hasAnswer = this.itemData.answers && this.itemData.answers.length > 0;
        const dueDate = this.itemData.dueDate;

        return html`
            <button 
                class="question-container ${this.isSelected ? 'selected' : ''}" 
                @click="${this._handleItemClick}"
            >
                <div class="checkbox ${this.isSelected ? 'selected' : ''}">
                    ${this.isSelected ? html`<check-icon></check-icon>` : null}
                </div>
                <div class="question-text">${this.itemData.questionText}</div>

            </button>
        `;
    }
}
customElements.define('select-question-item', CustomElement);
