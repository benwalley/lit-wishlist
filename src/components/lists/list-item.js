import {LitElement, html, css} from 'lit';
import buttonStyles from "../../css/buttons";
import '../pages/account/avatar.js';
import '../../svg/delete.js'
import '../../svg/edit.js'
import '../../svg/arrow-long.js'
import '../../svg/eye.js'
import '../../svg/world.js'
import '../../svg/lock.js'
import '../../svg/gift.js';
import '../../svg/dot.js';
import '../global/custom-tooltip.js'
import {cachedFetch} from "../../helpers/caching.js";
import {customFetch} from "../../helpers/fetchHelpers.js";

export class CustomElement extends LitElement {
    static properties = {
        itemData: {type: Object},
        isSelectList: {type: Boolean},
    };

    constructor() {
        super();
        this.itemData = {};
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    
                }
                
                .container {
                    transition: var(--transition-normal);
                    background: var(--background-dark);
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    gap: var(--spacing-small);
                    text-decoration: none;
                    margin: 0;
                    border-radius: var(--border-radius-normal);
                    padding: var(--spacing-small);
                    border: 1px solid var(--border-color);

                    &:hover {
                        border: 1px solid var(--primary-color);
                        box-shadow: var(--shadow-1-soft);
                        transform: translateY(-1px);
                    }
                }
                
                .name-section {
                    padding: 0;
                    flex-grow: 1;
                    justify-content: flex-start;
                    display: flex;
                    flex-direction: column;
                }
                
                .name-bottom-section {
                    display: flex;
                    gap: var(--spacing-small);
                    align-items: center;
                    font-size: var(--font-size-x-small);
                    color: var(--medium-text-color);
                    
                    .section-item {
                        display: flex;
                        align-items: center;
                        gap: 2px;
                    }
                }
                
                .number-items {
                    color: var(--green-normal);
                }

                h3 {
                    margin: 0;
                    color: var(--text-color-dark);
                    width: 100%;
                }

                .icon-button {
                    font-size: 1.2em;
                }

            `
        ];
    }

    async _handleDelete(e) {
        e.preventDefault();
        try {
            const response = await customFetch(`/lists/${this.itemData.id}`, {method: 'DELETE'}, true);

            if (response?.responseData?.error) {
                throw new Error(response?.responseData?.error);
            }

            // Use the View Transition API if available to animate the DOM changes.
            if (document.startViewTransition) {
                document.startViewTransition(() => {
                    this.lists = response;
                });
            } else {
                this.lists = response;
            }
            document.dispatchEvent(new CustomEvent('fetch-lists', {bubbles: true, composed: true,}));
        } catch (error) {
            console.error('Error fetching lists:', error);
        }
    }

    _handleEdit(e) {
        e.preventDefault();
        e.stopPropagation();

        // Import and use the openEditListModal function
        import('./edit-list-modal.js').then(module => {
            const { openEditListModal } = module;
            openEditListModal(this.itemData);
        });
    }

    render() {
        return html`
            <a class="container" href="${`/list/${this.itemData.id}`}">
               <custom-avatar 
                    size="35" 
                    username="${this.itemData.listName}"
                    imageId="${this.itemData.imageId}"
               ></custom-avatar>
                <div class="name-section">
                    <h3>${this.itemData.listName }</h3>
                    <div class="name-bottom-section">
                        ${this.itemData.public ? html`
                            <span class="section-item public">
                                <world-icon style="color: var(--primary-color)"></world-icon>
                                <span>Public</span>
                            </span>
                        ` : html`
                            <span class="section-item private">
                                <lock-icon style="color: var(--text-color-dark)"></lock-icon>
                                <span>Private</span>
                            </span>
                        `}
                        
                        <dot-icon style="font-size: 4px;"></dot-icon>
                        <span class="section-item number-items">
                            <gift-icon style="color: var(--green-normal);"></gift-icon>
                            <span>${`${this.itemData.numberItems ?? 0} items`}</span>
                        </span>
                    </div>
                    
                </div>
                ${this.itemData.id === 0 ? '' : html`
                    <button class="edit-button icon-button" 
                            aria-label="Edit List Details"
                            @click="${this._handleEdit}"
                            style="--icon-color: var(--blue-normal); 
                            --icon-color-hover: var(--blue-darker); 
                            --icon-hover-background: var(--blue-light)">
                        <edit-icon style="width: 1em; height: 1em"></edit-icon>
                    </button>
                    <custom-tooltip>Edit this list</custom-tooltip>
                    <button class="delete-button icon-button" aria-label="Delete List"
                            @click="${this._handleDelete}"
                            style="--icon-color: var(--delete-red); --icon-color-hover: var(--delete-red); --icon-hover-background: var(--delete-red-light)">
                        <delete-icon style="width: 1em; height: 1em"></delete-icon>
                    </button>
                    <custom-tooltip style="min-width: 150px;">Delete this list</custom-tooltip>
                `}
            </a>
        `;
    }
}

customElements.define('list-item', CustomElement);
