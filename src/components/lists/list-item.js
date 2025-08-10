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
import {getUserImageIdByUserId, getUsernameById} from "../../helpers/generalHelpers.js";
import {observeState} from "lit-element-state";
import {triggerDeleteList, triggerUpdateList} from "../../events/eventListeners.js";
import {triggerEditListEvent} from "../../events/custom-events.js";
import {canUserEditList} from "../../helpers/userHelpers.js";
import {userState} from "../../state/userStore.js";

export class CustomElement extends observeState(LitElement) {
    static properties = {
        itemData: {type: Object},
        isSelectList: {type: Boolean},
        showOwner: {type: Boolean},
        publicOnly: {type: Boolean},
    };

    constructor() {
        super();
        this.itemData = {};
        this.showOwner = false;
        this.publicOnly = false;
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    --item-background: var(--background-dark);
                }
                
                .list-name-avatar {
                    margin-bottom: auto;
                }
                
                .container {
                    transition: var(--transition-normal);
                    background: var(--item-background);
                    display: flex;
                    position: relative;
                    flex-direction: row;
                    align-items: flex-start;
                    gap: var(--spacing-small);
                    text-decoration: none;
                    margin: 0;
                    border-radius: var(--border-radius-normal);
                    padding: var(--spacing-small);
                    border: 1px solid var(--border-color);

                    &:hover {
                        border: 1px solid var(--primary-color);
                        box-shadow: var(--shadow-1-soft);
                    }
                }
                
                .name-section {
                    padding: 0;
                    flex-grow: 1;
                    gap: 8px;
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
                    line-height: 1;
                    font-size: var(--font-size-large);
                    color: var(--text-color-dark);
                    width: 100%;
                    padding-bottom: 2px;
                }

                .icon-button.icon-button {
                    font-size: 1.2em;
                    padding: 5px;
                }
                
                .actions-section {
                    position: absolute;
                    top: var(--spacing-x-small);
                    right:  var(--spacing-x-small);
                    display: flex;
                    flex-direction: row;
                }
                
                    

                .owner-info {
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    gap: var(--spacing-x-small);
                    font-size: var(--font-size-x-small);
                    color: var(--medium-text-color);
                    line-height: 1;

                    span {
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                }
                
                .new-items-counter {
                    background: var(--purple-normal);
                    color: var(--light-text-color);
                    padding: 5px;
                    border-radius: 40px;
                    min-width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: absolute;
                    top: 0;
                    right: 0;
                    transform: translate(50%, -50%);
                }

            `
        ];
    }

    async _handleDelete(e) {
        e.preventDefault();
        e.stopPropagation();
        triggerDeleteList(this.itemData)
    }

    get canEdit() {
        return canUserEditList(userState.userData, this.itemData);
    }

    _handleEdit(e) {
        e.preventDefault();
        e.stopPropagation();
        triggerEditListEvent(this.itemData)
    }

    render() {
        const listUrl = this.publicOnly ? `/public/list/${this.itemData.id}` : `/list/${this.itemData.id}`;
        
        return html`
            <a class="container" href="${listUrl}">
               <custom-avatar 
                       classs="list-name-avatar"
                    size="65" 
                    username="${this.itemData.listName}"
                    imageId="${this.itemData.imageId}"
               ></custom-avatar>
                <div class="name-section">
                    <div>
                        <h3>${this.itemData.listName }</h3>
                        ${this.itemData.ownerId && this.showOwner ? html`
                        <div class="owner-info bottom-row">
                            <span>${getUsernameById(this.itemData?.ownerId)}</span>
                        </div>
                    ` : ''}
                    </div>
                    
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
                <div class="actions-section">
                    ${this.canEdit && !this.publicOnly ? html`
                            <div style="position: relative;">
                                <button class="edit-button icon-button"
                                        aria-label="Edit List Details"
                                        @click="${this._handleEdit}"
                                        style="--icon-color: var(--blue-normal); 
                                --icon-color-hover: var(--blue-darker); 
                                --icon-hover-background: var(--blue-light)">
                                    <edit-icon style="width: 1em; height: 1em"></edit-icon>
                                </button>
                                <custom-tooltip style="min-width: 100px;">Edit this list</custom-tooltip>
                            </div>
                            <div style="position: relative;">
                                <button class="delete-button icon-button" aria-label="Delete List"
                                        @click="${this._handleDelete}"
                                        style="--icon-color: var(--delete-red); --icon-color-hover: var(--delete-red); --icon-hover-background: var(--delete-red-light)">
                                    <delete-icon style="width: 1em; height: 1em"></delete-icon>
                                </button>
                                <custom-tooltip style="min-width: 150px;">Delete this list</custom-tooltip>
                            </div>
                        ` : ''}
                </div>
                ${this.itemData?.unviewedItemsCount ?  html`<div class="new-items-counter">
                    ${this.itemData?.unviewedItemsCount}
                </div>` : '' }
                
            </a>
        `;
    }
}

customElements.define('list-item', CustomElement);
