import {LitElement, html, css} from 'lit';
import buttonStyles from "../../../css/buttons";
import '../../global/custom-image.js';
import {currencyHelper} from "../../../helpers.js";
import './priority-display.js';
import '../../../svg/new-tab.js';
import '../../../svg/edit.js';
import '../../../svg/delete.js';
import '../../global/custom-tooltip.js'
import '../listItem/price-display.js'
import { navigate} from "../../../router/main-router.js";
import {openEditItemModal} from '../../add-to-list/edit-item-modal.js';
import {showConfirmation} from "../../global/custom-confirm/confirm-helper.js";
import {deleteItem} from "../../../helpers/api/listItems.js";
import {messagesState} from "../../../state/messagesStore.js";
import {userState} from "../../../state/userStore.js";
import {observeState} from "lit-element-state";


export class ItemTile extends observeState(LitElement) {
    static properties = {
        itemData: {type: Object},
        listId: {type: String},
        small: {type: Boolean},
    };

    constructor() {
        super();
        this.itemData = {};
        this.listId = '';
        this.small = false;
    }

    /**
     * Checks if the current user is the owner of the list
     * @returns {boolean} True if current user is list owner, false otherwise
     */
    isListOwner() {
        const currentUser = userState.userData;
        if(!currentUser) return false;
        if(!this.itemData?.createdById) return false
        return currentUser.id === this.itemData?.createdById;
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    container-type: inline-size;
                    container-name: item-tile;
                }
                
                p {
                    margin: 0;
                }
                
                custom-image {
                    width: 100%;
                    aspect-ratio: 1.25/1;
                    display: flex;
                    object-fit: cover;
                }
                
                .small custom-image {
                    width: 100%;
                }

                .item-name {
                    margin: 0;
                }
                @container item-tile (max-width: 200px) {
                    .item-name {
                        font-size: var(--font-size-small);
                    }
                }
                
                .small .item-name {
                    padding-right: 30px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                
                .right-side-container {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-small);
                    padding: var(--spacing-small);
                }
                
                .small .right-side-container {
                    justify-content: center;
                    min-width: 100px;
                }

                .item-actions {
                    display: flex;
                    gap: 0;
                    position: absolute;
                    bottom: 0;
                    right: var(--spacing-x-small);
                }
                
                .small .item-actions {
                    top: 50%;
                    transform: translateY(-50%);
                    right: var(--spacing-small);
                }
                
                .edit-button {
                    z-index: 10;
                }
                
                priority-display {
                    margin-top: auto;
                    padding-right: 30px;
                }
                
                custom-tooltip {
                    min-width: 250px;
                }

                .item-link {
                    transition: var(--transition-normal);
                    cursor: pointer;
                    display: grid;
                    height: 100%;
                    position: relative;
                    overflow: hidden;
                    border: 1px solid var(--border-color);
                    border-radius: var(--border-radius-normal);
                    color: var(--text-color-dark);
                    text-decoration: none;
                    
                    &:hover {
                        box-shadow: var(--shadow-1-soft);
                        transform: scale(1.01);
                        border: 1px solid var(--primary-color);
                    }
                }
                
                .small.item-link {
                    padding: var(--spacing-x-small);
                    box-shadow: none;
                    border-bottom: 1px solid var(--border-color);
                    border-radius: 0;
                    transition: all 200ms;
                    
                    &:hover {
                        box-shadow: none;
                        transform: none;
                        background: var(--lavender-300);
                    }
                }
            `
        ];
    }

    /**
     * Get the first valid link from the item data.
     * @returns {string|null} The URL of the first link, or null if no valid link is found.
     */
    getLink() {
        try {
            const links = this.itemData.links;
            if (links?.length === 0) return;
            const firstLinkJson = JSON.parse(links[0]);
            if(!firstLinkJson?.url) return false;
            return firstLinkJson;
        } catch (error) {
            return false;
        }
    }

    _handleEditClick(e) {
        e.preventDefault();
        e.stopPropagation();

        if (this.itemData) {
            openEditItemModal(this.itemData);
        }
    }

    async _handleDeleteClick(e) {
        e.preventDefault();
        e.stopPropagation();

        try {
            const confirmed = await showConfirmation({
                heading: 'Delete Item',
                message: 'Are you sure you want to delete this item?',
                confirmLabel: 'Delete',
                cancelLabel: 'Cancel'
            });

            if (confirmed) {
                const response = await deleteItem(this.itemData.id);
                if (response.success) {
                    messagesState.addMessage('Item deleted successfully');
                    window.location.href = `/list/${this.listId}`;
                } else {
                    messagesState.addMessage('Error deleting item. Please try again.', 'error');
                }
            }
        } catch (error) {
            messagesState.addMessage('Error deleting item. Please try again.', 'error');
        }
    }


    render() {
        const link = this.getLink();

        return html`<a class="item-link ${this.small ? 'small' : ''}" href="/list/${this.listId}/item/${this.itemData?.id}">
            <custom-image
                    imageId="${this.itemData?.imageIds?.[0]}"
                    alt="${this.itemData?.name}"
                    width="200"
                    height="200"
            ></custom-image>
            <div class="right-side-container">
                <h3 class="item-name">${this.itemData?.name}</h3>
                ${!this.small ? html`<div>
                    <price-display .itemData="${this.itemData}"></price-display>
                </div>` : ''}
                ${!this.small ? html`<priority-display
                        .value="${this.itemData.priority}"
                        heartSize="20px"
                ></priority-display>` : ''}
                
                <div class="item-actions">
                    ${link ? html`<a
                                  class="button icon-button blue-text"
                                  aria-label="Open link to product"
                                  href="${link.url}"
                                  target="_blank"
                                  rel="noopener noreferrer"
                          >
                              <new-tab-icon></new-tab-icon>
                          </a>
                          <custom-tooltip>Link to ${link.displayName ?? link.url} (opens in new tab)</custom-tooltip>
                          ` : ''}
                    
                    ${this.isListOwner() ? html`
                        <button
                                class="button icon-button delete-button danger-text"
                                aria-label="Delete item"
                                @click="${this._handleDeleteClick}"
                        >
                            <delete-icon></delete-icon>
                        </button>
                        <button 
                            class="button icon-button edit-button blue-text" 
                            aria-label="Edit item"
                            @click="${this._handleEditClick}"
                        >
                            <edit-icon></edit-icon>
                        </button>
                    ` : ''}
                </div>
            </div>
        </a>
        `;
    }
}

customElements.define('item-tile', ItemTile);
