import { LitElement, html, css } from 'lit';
import {customFetch} from "../../../helpers/fetchHelpers.js";
import '../../pages/account/avatar.js'
import './item-tile.js'
import '../../lists/edit-list-modal.js'
import '../../../svg/edit.js'
import '../../../svg/delete.js'
import '../../../svg/user.js'
import '../../../svg/dots.js'
import '../../../svg/world.js'
import '../../../svg/lock.js'
import '../../../svg/share.js'
import '../../global/action-dropdown.js'
import '../../global/loading-screen.js'
import '../../global/custom-modal.js'
import {openEditListModal} from '../../lists/edit-list-modal.js'
import {listenUpdateItem, listenUpdateList, triggerDeleteList} from "../../../events/eventListeners.js";
import buttonStyles from '../../../css/buttons.js';
import {messagesState} from "../../../state/messagesStore.js";
import {copyCurrentPageUrl, copyUrlToClipboard} from "../../../helpers/shareHelpers.js";
import {getUsernameById, redirectToDefaultPage} from "../../../helpers/generalHelpers.js";
import {observeState} from "lit-element-state";
import {userState} from "../../../state/userStore.js";
import {screenSizeState} from "../../../state/screenSizeStore.js";
import {cachedFetch} from "../../../helpers/caching.js";

export class ListViewContainer extends observeState(LitElement) {
    static properties = {
        listId: { type: String },
        listData: {type: Object},
        loading: {type: Boolean},
        selectedItem: {type: String},
        showPublicityModal: {type: Boolean}
    };

    constructor() {
        super();
        this.listId = '';
        this.listData = {};
        this.loading = true;
        this.selectedItem = '';
        this.showPublicityModal = false;
    }

    connectedCallback() {
        super.connectedCallback();
        if(!this.listId?.length) {
            this.loading = false;
            return;
        }
        this.fetchListData();
        listenUpdateList(this.fetchListData.bind(this))
        listenUpdateItem(this.fetchListData.bind(this))
    }

    async fetchListData() {
        try {
            const response = await cachedFetch(`/lists/${this.listId}`, {}, true);
            if(response?.success) {
                this.listData = response.data;
            } else {
                if(response.message === "List not found") {
                    redirectToDefaultPage();
                    return;
                }
                messagesState.addMessage(response.message || 'Error fetching list', 'error');
            }
        } catch (error) {
            messagesState.addMessage('error fetching list', 'error');
        } finally {
            this.loading = false;
        }
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    padding-bottom: var(--spacing-large);
                }
                .list-header {
                    display: flex;
                    align-items: flex-start;
                    gap: 1rem;
                    padding: 1rem;
                    position: relative;
                    
                    h1 {
                        margin: 0;
                        line-height: 1;
                    }
                }
                
                .public-section {
                    font-size: var(--font-size-medium);
                    
                    world-icon {
                        color: var(--purple-normal);
                    }
                }
                
                .header-content {
                    flex-grow: 1;
                }
                
                .header-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                }
                
                .kebab-menu {
                    font-size: var(--font-size-large);
                    color: var(--text-color-medium-dark);
                }
                
                .header-actions {
                    display: flex;
                    gap: var(--spacing-small);
                    margin-top: var(--spacing-x-small);
                }
                
                .name-section {
                    p {
                        margin: 0;
                        padding-bottom: var(--spacing-small);
                        color: var(--text-color-medium-dark);
                        font-size: var(--font-size-small);
                        
                        a {
                            color: inherit;
                            text-decoration: none;
                            transition: var(--transition-200);
                            
                            &:hover {
                                color: var(--text-color-dark);
                            }
                        }
                    }
                }
                
                .edit-button {
                    font-size: var(--font-size-large);;
                }

                .delete-button {
                    font-size: var(--font-size-large);
                }
                
                .action-icon {
                    margin-right: var(--spacing-small);
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 18px;
                    height: 18px;
                }
                
                .user-details {
                    display: flex;
                    flex-direction: row;
                    gap: var(--spacing-small);
                    align-items: center;
                    color: var(--text-color-medium-dark);
                    
                    a {
                        text-decoration: none;
                        color: var(--text-color-medium-dark);
                        
                        &:hover {
                            text-decoration: underline;
                        }
                    }
                }

                .list-items {
                    display: grid;
                    grid-template-columns: repeat(1, 1fr);
                    gap: var(--spacing-normal);
                    padding: 0 var(--spacing-normal);
                    max-width: 1400px;
                }

                @media (min-width: 350px) {
                    .list-items {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }

                @media (min-width: 920px) {
                    .list-items {
                        grid-template-columns: repeat(3, 1fr);
                    }
                }

                @media (min-width: 1200px) {
                    .list-items {
                        grid-template-columns: repeat(4, 1fr);
                    }
                }

                @media (min-width: 1500px) {
                    .list-items {
                        grid-template-columns: repeat(5, 1fr);
                    }
                }
                
                .publicity-modal-content {
                    text-align: center;
                }
                
                .publicity-modal-header {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: var(--spacing-small);
                    margin-bottom: var(--spacing-normal);
                    font-size: var(--font-size-large);
                    font-weight: 600;
                    border-bottom: 1px solid var(--border-color);
                    padding-bottom: var(--spacing-small);
                }
                
                .publicity-modal-text {
                    line-height: 1.5;
                    color: var(--text-color-medium-dark);
                }
            `
        ];
    }

    onBeforeEnter(location, commands, router) {
        this.listId = location.params.listId;
    }

    _navigateToItem(event) {
        const { itemId } = event.detail;
    }

    _handleEditList() {
        openEditListModal(this.listData);
    }

    _handleDeleteList() {
        triggerDeleteList(this.listData);
    }

    _handleShareList() {
        copyUrlToClipboard('/public/list/' + this.listId);
    }

    _getActionDropdownItems() {
        const { ownerId, public: isPublic } = this.listData;
        const userId = userState?.userData?.id;

        // Base actions - only include share if list is public
        const baseActions = [];
        if (isPublic) {
            baseActions.push({
                id: 'share',
                label: 'Copy public link',
                icon: html`<share-icon class="action-icon"></share-icon>`,
                classes: 'purple-text',
                action: () => this._handleShareList()
            });
        }

        // If user isn't the owner, we're done
        if (ownerId !== userId) return baseActions;

        // Extra owner-only actions
        const editActions = [
            {
                id: 'edit',
                label: 'Edit List',
                icon: html`<edit-icon class="action-icon"></edit-icon>`,
                classes: 'blue-text',
                action: () => this._handleEditList()
            },
            {
                id: 'delete',
                label: 'Delete List',
                icon: html`<delete-icon class="action-icon"></delete-icon>`,
                classes: 'danger-text',
                action: () => this._handleDeleteList()
            }
        ];

        return [...baseActions, ...editActions];
    }

    _handlePublicityClick() {
        this.showPublicityModal = true;
    }

    _closePublicityModal() {
        this.showPublicityModal = false;
    }


    render() {
        // If this.loading is true, show a loading message
        if (this.loading) {
            return html`<loading-screen></loading-screen>`;
        }

        // Otherwise, show the list data
        return html`
            <div class="list-header">
                <custom-avatar size="${screenSizeState.width < 500 ? '50' : '100'}" 
                    username="${this.listData?.listName}"
                   imageId="${this.listData?.imageId || ''}"
                ></custom-avatar>
                <div class="header-content">
                    <div class="header-top">
                        <div class="name-section">
                            <h1>${this.listData?.listName}</h1>
                            <div class="user-details">
                                <user-icon></user-icon>
                                <span>
                                    <span>Owner:</span>
                                    <a href="/user/${this.listData?.ownerId}">${getUsernameById(this.listData?.ownerId)}</a>
                                </span>
                                <button class="public-section icon-button" @click="${this._handlePublicityClick}">
                                    ${this.listData.public ? html`
                                        <world-icon></world-icon>
                                    ` : html`
                                        <lock-icon></lock-icon>
                                    `}
                                    <custom-tooltip>This list is ${this.listData.public ? 'public' : 'private'} (click for details)</custom-tooltip>
                                </button>
                            </div>
                        </div>
                        
                        ${this.listId > 0 && this._getActionDropdownItems().length > 0 ? html`
                            <action-dropdown
                                .items="${this._getActionDropdownItems()}"
                                placement="bottom-end"
                            >
                                <button
                                    slot="toggle"
                                    class="kebab-menu icon-button"
                                    aria-label="List actions"
                                >
                                    <dots-icon></dots-icon>
                                </button>
                            </action-dropdown>
                        ` : ''}
                    </div>
                    
                    <div>${this.listData?.description}</div>
                </div>
            </div>
            <div class="list-items">
                ${this.listData.listItems?.length 
                    ? this.listData.listItems.map(item => html`
                        <item-tile .itemData="${item}" .listId="${this.listId}" @navigate="${this._navigateToItem}"></item-tile>
                    `)
                    : html`<p>No items in this list yet.</p>`
                }
            </div>
            <custom-modal 
                .isOpen="${this.showPublicityModal}" 
                maxWidth="400px"
                @modal-closed="${this._closePublicityModal}"
            >
                <div class="publicity-modal-content">
                    <div class="publicity-modal-header">
                        ${this.listData.public ? html`
                            <world-icon></world-icon>
                            <span>Public List</span>
                        ` : html`
                            <lock-icon></lock-icon>
                            <span>Private List</span>
                        `}
                    </div>
                    <div class="publicity-modal-text">
                        ${this.listData.public ? 
                            'This list is public, which means it can be seen by anyone, even if they are not logged in. Only items marked as public within the list can be seen by non-logged-in users.' : 
                            'This list is private, which means it can only be seen by you and users or groups you have shared it with.'
                        }
                    </div>
                </div>
            </custom-modal>
            
        `;
    }
}

customElements.define('list-view-container', ListViewContainer);
