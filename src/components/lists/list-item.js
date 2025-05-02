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
import '../../svg/user.js';
import '../global/custom-tooltip.js'
import {customFetch} from "../../helpers/fetchHelpers.js";
import {getUserImageIdByUserId, getUsernameById} from "../../helpers/generalHelpers.js";
import {observeState} from "lit-element-state";
import {showConfirmation} from "../global/custom-confirm/confirm-helper.js";
import {triggerUpdateList} from "../../events/eventListeners.js";

export class CustomElement extends observeState(LitElement) {
    static properties = {
        itemData: {type: Object},
        isSelectList: {type: Boolean},
        viewOnly: {type: Boolean},
        showOwner: {type: Boolean},
    };

    constructor() {
        super();
        this.itemData = {};
        this.viewOnly = false;
        this.showOwner = false;
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
                    justify-content: space-between;
                    width: 100%;
                    
                    .section-item {
                        display: flex;
                        align-items: center;
                        gap: 2px;
                    }
                    
                    .list-info {
                        display: flex;
                        gap: var(--spacing-small);
                        align-items: center;
                    }
                }
                
                .number-items {
                    color: var(--green-normal);
                    white-space: nowrap;
                }

                h3 {
                    margin: 0;
                    color: var(--text-color-dark);
                    width: 100%;
                }

                .icon-button.icon-button {
                    font-size: 1.2em;
                    padding: 5px;
                }
                
                .item-right-side {
                    display: flex;
                    flex-direction: column;
                    flex-wrap: wrap;
                    justify-content: flex-end;
                    color: var(--text-color-dark);
                    
                    .top-row {
                        display: flex;
                        justify-content: flex-end;
                    }

                    .owner-info {
                        display: flex;
                        align-items: center;
                        gap: 4px;
                        font-size: var(--font-size-x-small);
                        color: var(--text-color-medium-dark);

                        span {
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            max-width: 100px;
                        }
                    }
                }

            `
        ];
    }

    async _handleDelete(e) {
        e.preventDefault();
        e.stopPropagation();

        const confirmed = await showConfirmation({
            heading: 'Delete List',
            message: `Are you sure you want to delete "${this.itemData.listName}"?`,
            submessage: 'This action cannot be undone.',
            confirmLabel: 'Delete',
            cancelLabel: 'Cancel'
        });

        if (!confirmed) return;

        try {
            const response = await customFetch(`/lists/${this.itemData.id}`, {method: 'DELETE'}, true);

            triggerUpdateList();
        } catch (error) {
            console.error('Error deleting list:', error);
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
                        <div class="list-info">
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
                    
                </div>
                <div class="item-right-side">
                    <div class="top-row">
                        ${!this.viewOnly && this.itemData.id !== 0 ? html`
                            <button class="edit-button icon-button"
                                    aria-label="Edit List Details"
                                    @click="${this._handleEdit}"
                                    style="--icon-color: var(--blue-normal); 
                            --icon-color-hover: var(--blue-darker); 
                            --icon-hover-background: var(--blue-light)">
                                <edit-icon style="width: 1em; height: 1em"></edit-icon>
                            </button>
                            <custom-tooltip style="min-width: 100px;">Edit this list</custom-tooltip>
                            <button class="delete-button icon-button" aria-label="Delete List"
                                    @click="${this._handleDelete}"
                                    style="--icon-color: var(--delete-red); --icon-color-hover: var(--delete-red); --icon-hover-background: var(--delete-red-light)">
                                <delete-icon style="width: 1em; height: 1em"></delete-icon>
                            </button>
                            <custom-tooltip style="min-width: 150px;">Delete this list</custom-tooltip>
                        ` : ''}
                    </div>
                    
                    ${this.itemData.ownerId && this.showOwner ? html`
                        <div class="owner-info bottom-row">
                            <custom-avatar
                                    .username="${getUsernameById(this.itemData?.ownerId)}"
                                    imageId="${getUserImageIdByUserId(this.itemData?.ownerId)}"
                                    size="16"
                            >
                            </custom-avatar>
                            <span>${getUsernameById(this.itemData?.ownerId)}</span>
                        </div>
                    ` : ''}
                    
                </div>
                
            </a>
        `;
    }
}

customElements.define('list-item', CustomElement);
