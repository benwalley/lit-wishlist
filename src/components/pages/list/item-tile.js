import {LitElement, html, css} from 'lit';
import buttonStyles from "../../../css/buttons";
import '../../global/custom-image.js';
import {currencyHelper} from "../../../helpers.js";
import './priority-display.js';
import '../../../svg/new-tab.js';
import '../../../svg/edit.js';
import '../../../svg/delete.js';
import '../../../svg/dollar.js';
import '../../../svg/group.js';
import '../../../svg/info.js';
import '../../../svg/world.js';
import '../../../svg/lock.js';
import '../../global/custom-tooltip.js'
import '../listItem/price-display.js'
import './gotten-contributing-badges.js';
import { navigate} from "../../../router/main-router.js";
import {openEditItemModal} from '../../add-to-list/edit-item-modal.js';
import {showConfirmation} from "../../global/custom-confirm/confirm-helper.js";
import {deleteItem} from "../../../helpers/api/listItems.js";
import {messagesState} from "../../../state/messagesStore.js";
import {userState} from "../../../state/userStore.js";
import {observeState} from "lit-element-state";
import {canUserContribute, isParentUserItem} from "../../../helpers/userHelpers.js";
import {addItemToQueue} from "../../../helpers/viewedItems/index.js";
import {viewedItemsState} from "../../../state/viewedItemsStore.js";
import {listenInitialUserLoaded, listenUpdateItem, listenViewedItemsLoaded, listenUpdateViewedItems} from "../../../events/eventListeners.js";
import {isItemViewed} from "../../../helpers/generalHelpers.js";


export class ItemTile extends observeState(LitElement) {
    static properties = {
        itemData: {type: Object},
        listId: {type: String},
        small: {type: Boolean},
        publicView: {type: Boolean},
    };

    constructor() {
        super();
        this.itemData = {};
        this.listId = '';
        this.small = false;
        this.publicView = false;
        this.intersectionObserver = null;
    }

    connectedCallback() {
        super.connectedCallback();

        if(userState?.userData && viewedItemsState.viewedItemsLoaded) {
            this.setupViewportTracking();
        }

        // Set up event listeners
        listenInitialUserLoaded(() => {
            this.setupViewportTracking();
        });
        listenViewedItemsLoaded(() => {
            this.setupViewportTracking();
        });
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.cleanupViewportTracking();
        this.clearNewItemTimer();
    }

    setupViewportTracking() {
        if (!this.itemData?.id || !userState.userData?.id) return;
        if (!viewedItemsState.viewedItemsLoaded) return;
        if(viewedItemsState.viewedItems.includes(this.itemData?.id)) return;

        // Create intersection observer to track when item is visible
        this.intersectionObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && entry.intersectionRatio >= 0.9) {
                        this.markItemAsViewed();
                    }
                });
            },
            {
                threshold: 0.9,
                rootMargin: '0px'
            }
        );

        this.intersectionObserver.observe(this);
    }
    markItemAsViewed() {
        if (this.itemData?.id) {
            addItemToQueue(this.itemData.id);
            this.requestUpdate();
        }
    }

    cleanupViewportTracking() {
        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
            this.intersectionObserver = null;
        }
    }

    /**
     * Checks if the current user is the owner of the list
     * @returns {boolean} True if current user is list owner, false otherwise
     */
    canUserEdit() {
        const currentUser = userState.userData;
        if(!currentUser) return false;
        if(this.itemData?.createdById && this.itemData?.createdById === currentUser.id) {
            return true;
        }
        return false;
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    container-type: inline-size;
                    container-name: item-tile;
                    position: relative;
                    transition: var(--transition-normal);
                }
                
                p {
                    margin: 0;
                }
                
                custom-image {
                    width: 100%;
                    aspect-ratio: 1.25/1;
                    display: flex;
                    object-fit: cover;
                    overflow: hidden;
                }
                
                .middle-row {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                }
                
                .small custom-image {
                    width: 100%;
                }

                .item-name {
                    margin: 0;
                    margin-bottom: auto;
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
                    flex-grow: 1;
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
                    padding-right: 30px;
                }
                
                custom-tooltip {
                    min-width: 250px;
                }

                .item-link {
                    transition: var(--transition-normal);
                    background: var(--background-light);
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    position: relative;
                    overflow: hidden;
                    border: 1px solid var(--border-color);
                    border-radius: var(--border-radius-normal);
                    color: var(--text-color-dark);
                    outline: 1px solid transparent;
                    text-decoration: none;
                    
                    &:hover {
                        box-shadow: var(--shadow-1-soft);
                        border: 1px solid var(--primary-color);
                    }

                    &.new-item {
                        outline: 2px solid var(--purple-normal);
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
                
                .privacy-icon {
                    position: absolute;
                    top: var(--spacing-x-small);
                    left: var(--spacing-x-small);
                    font-size: var(--font-size-medium);
                    z-index: 5;
                    
                    world-icon {
                        color: var(--purple-normal);
                    }
                    
                    lock-icon {
                        color: var(--text-color-medium-dark);
                    }
                }
            `
        ];
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

    isNew() {
        if(!viewedItemsState?.viewedItemsLoaded) return false;
        if(viewedItemsState?.viewedItems.includes(this.itemData?.id)) return false;
        return true;
    }

    render() {
        const itemUrl = this.publicView ? 
            `/public/item/${this.itemData?.id}` : 
            `/list/${this.listId}/item/${this.itemData?.id}`;
            
        return html`<a class="item-link ${this.small ? 'small' : ''} ${this.isNew() ? 'new-item' : ''}" href="${itemUrl}">
            <div class="privacy-icon">
                ${this.itemData?.isPublic ? html`
                    <world-icon></world-icon>
                    <custom-tooltip>This item is visible to non logged-in users</custom-tooltip>
                ` : html`
                    <lock-icon></lock-icon>
                    <custom-tooltip>This item is not visible to non logged-in users</custom-tooltip>
                `}
            </div>
            ${canUserContribute(userState.userData, this.itemData) ? html`
                <gotten-contributing-badges
                    .itemData="${this.itemData}"
                ></gotten-contributing-badges>
            ` : ''}
            <custom-image
                    imageId="${this.itemData?.imageIds?.[0]}"
                    alt="${this.itemData?.name}"
                    width="200"
                    height="200"
            ></custom-image>
            <div class="right-side-container">
                <h3 class="item-name">${this.itemData?.name}</h3>
                <div class="middle-row">
                    ${!this.small ? html`<div>
                        <price-display .itemData="${this.itemData}"></price-display>
                    </div>` : ''}
                    <links-display condensed onlyFirst .itemData="${this.itemData}"></links-display>
                </div>
                
                ${!this.small ? html`<priority-display
                        .value="${this.itemData.priority}"
                        heartSize="20px"
                ></priority-display>` : ''}
                
               
            </div>
        </a>
        ${!this.publicView ? html`
            <div class="item-actions">
                ${this.canUserEdit() ? html`
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
                ${canUserContribute(userState.userData, this.itemData) ? html`
                            <get-this-button .itemId="${this.itemData?.id}" .itemData="${this.itemData}" compact></get-this-button>
                            <contribute-button .itemId="${this.itemData?.id}" .itemData="${this.itemData}" compact></contribute-button>
                        ` : ''}
                ${isParentUserItem(userState.userData, this.itemData) ? html`
                    <button class="icon-button blue-text large">
                        <info-icon style="font-size: var(--font-size-large)"></info-icon>
                    </button>
                    <custom-tooltip>Subusers can't see who has gotten gifts or mark gifts as gotten.</custom-tooltip>
                ` : ''}
            </div>
        ` : ''}
        `;
    }
}

customElements.define('item-tile', ItemTile);
