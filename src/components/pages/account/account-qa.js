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


export class AccountQA extends LitElement {
    static properties = {
        qaItems: { type: Array }
    };

    constructor() {
        super();
        this.qaItems = [
            { id: 1, question: 'What are your favorite colors?', answer: 'Blue and green' },
            { id: 2, question: 'What is your favorite hobby?', answer: 'Hiking and reading' }
        ];
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

    // Add a new Q&A item with default values in edit mode
    _addNewItem() {
        const newId = getUniqueId();

        this.qaItems = [
            ...this.qaItems,
            {
                id: newId,
                question: 'New Question',
                answer: 'New Answer',
                isNew: true
            }
        ];
    }

    // Handle the qa-item-updated event
    _handleItemUpdated(e) {
        const updatedItem = e.detail.item;
        this.qaItems = this.qaItems.map(item =>
            item.id === updatedItem.id ? updatedItem : item
        );
    }

    _handleItemDeleted(e) {
        const itemId = e.detail.itemId;
        this.qaItems = this.qaItems.filter(item => item.id !== itemId);
    }

    connectedCallback() {
        super.connectedCallback();
        this.addEventListener('qa-item-updated', this._handleItemUpdated);
        this.addEventListener('qa-item-deleted', this._handleItemDeleted);
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
                            ?isNew="${item.isNew === true}"
                        ></qa-item>
                    `)
                }
            </div>
        `;
    }
}

customElements.define('account-qa', AccountQA);
