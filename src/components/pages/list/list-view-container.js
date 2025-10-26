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
import '../../../svg/plus.js'
import '../../global/action-dropdown.js'
import '../../global/loading-screen.js'
import '../../global/custom-modal.js'
import '../../add-to-list/add-custom-item-modal.js'
import '../../instructions/info-tooltip.js'
import '../../instructions/publicity-details.js'
import './list-shared-with-details.js'
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
import '../../global/list-sort-dropdown.js';
import {getListSortOption, setListSortOption} from "../../../localStorage/listSortStorage.js";

export class ListViewContainer extends observeState(LitElement) {
    static properties = {
        listId: { type: String },
        listData: {type: Object},
        loading: {type: Boolean},
        selectedItem: {type: String},
        sortOption: {type: String}
    };

    constructor() {
        super();
        this.listId = '';
        this.listData = {};
        this.loading = true;
        this.selectedItem = '';
        this.sortOption = getListSortOption();
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
                    display: grid;
                    grid-template-columns: auto 1fr;
                    align-items: flex-start;
                    gap: 0 1rem;
                    padding: 1rem;
                    position: relative;
                    
                    h1 {
                        margin: 0;
                        line-height: 1;
                    }
                }

                .desktop-only {
                    display: none;
                }
                
                .mobile-only {
                    display: block;
                    grid-column: 1 / -1;
                }
                
                @media (min-width: 500px) {
                    .desktop-only {
                        display: block;
                    }

                    .mobile-only {
                        display: none;
                    }
                }
                
                list-shared-with-details {
                    margin-top: var(--spacing-x-small);
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
                
                .sort-container {
                    padding: 0 var(--spacing-normal);
                    margin-bottom: var(--spacing-normal);
                    display: flex;
                    justify-content: flex-end;
                    max-width: 1400px;
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
                    padding-top: var(--spacing-x-small);
                    
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

    _handleAddCustomItem() {
        const modal = this.shadowRoot.querySelector('add-custom-item-modal');
        if (modal && typeof modal.openModal === 'function') {
            modal.openModal();
        }
    }

    _getActionDropdownItems() {
        const { ownerId, public: isPublic } = this.listData;
        const userId = userState?.userData?.id;
        const parentId = userState?.userData?.parentId;

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

        // If user isn't the owner and isn't a subuser of the owner, add custom item action and return
        const isSubuserOfOwner = parentId && parentId === ownerId;
        if (ownerId !== userId && !isSubuserOfOwner) {
            baseActions.push({
                id: 'add-custom',
                label: 'Add Custom Item',
                icon: html`<plus-icon class="action-icon"></plus-icon>`,
                classes: 'green-text',
                action: () => this._handleAddCustomItem()
            });
            return baseActions;
        }

        // If user is subuser of owner, return just base actions (no custom item action)
        if (isSubuserOfOwner) {
            return baseActions;
        }

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

    _handleSortChange(event) {
        this.sortOption = event.detail.value;
        setListSortOption(this.sortOption);
        this.requestUpdate();
    }

    _getSortedItems() {
        if (!this.listData.listItems?.length) {
            return [];
        }

        const items = [...this.listData.listItems];

        switch (this.sortOption) {
            case 'name-asc':
                return items.sort((a, b) => {
                    const nameCompare = (a.name || '').localeCompare(b.name || '');
                    if (nameCompare !== 0) return nameCompare;
                    return new Date(a.dateCreated || 0) - new Date(b.dateCreated || 0);
                });
            case 'name-desc':
                return items.sort((a, b) => {
                    const nameCompare = (b.name || '').localeCompare(a.name || '');
                    if (nameCompare !== 0) return nameCompare;
                    return new Date(a.dateCreated || 0) - new Date(b.dateCreated || 0);
                });
            case 'wanted-desc':
                return items.sort((a, b) => {
                    const aAmount = parseFloat(a.priority) || 0;
                    const bAmount = parseFloat(b.priority) || 0;
                    const priorityCompare = bAmount - aAmount;
                    if (priorityCompare !== 0) return priorityCompare;
                    const dateCompare = new Date(a.dateCreated || 0) - new Date(b.dateCreated || 0);
                    if (dateCompare !== 0) return dateCompare;
                    return (a.name || '').localeCompare(b.name || '');
                });
            case 'date-asc':
                return items.sort((a, b) => {
                    const dateCompare = new Date(a.dateCreated || 0) - new Date(b.dateCreated || 0);
                    if (dateCompare !== 0) return dateCompare;
                    return (a.name || '').localeCompare(b.name || '');
                });
            case 'gotten':
                return items.sort((a, b) => {
                    const aGotten = (a.getting?.length || 0) > 0;
                    const bGotten = (b.getting?.length || 0) > 0;
                    const gottenCompare = bGotten - aGotten; // Gotten items first
                    if (gottenCompare !== 0) return gottenCompare;
                    const dateCompare = new Date(a.dateCreated || 0) - new Date(b.dateCreated || 0);
                    if (dateCompare !== 0) return dateCompare;
                    return (a.name || '').localeCompare(b.name || '');
                });
            case 'not-gotten':
                return items.sort((a, b) => {
                    const aGotten = (a.getting?.length || 0) > 0;
                    const bGotten = (b.getting?.length || 0) > 0;
                    const notGottenCompare = aGotten - bGotten; // Not gotten items first
                    if (notGottenCompare !== 0) return notGottenCompare;
                    const dateCompare = new Date(a.dateCreated || 0) - new Date(b.dateCreated || 0);
                    if (dateCompare !== 0) return dateCompare;
                    return (a.name || '').localeCompare(b.name || '');
                });
            case 'want-to-go-in-on':
                return items.sort((a, b) => {
                    const aContributing = (a.goInOn?.length || 0) > 0;
                    const bContributing = (b.goInOn?.length || 0) > 0;
                    const contributingCompare = bContributing - aContributing; // Contributing items first
                    if (contributingCompare !== 0) return contributingCompare;
                    const dateCompare = new Date(a.dateCreated || 0) - new Date(b.dateCreated || 0);
                    if (dateCompare !== 0) return dateCompare;
                    return (a.name || '').localeCompare(b.name || '');
                });
            default:
                return items;
        }
    }



    render() {
        // If this.loading is true, show a loading message
        if (this.loading) {
            return html`<loading-screen></loading-screen>`;
        }

        // Otherwise, show the list data
        return html`
            <div class="list-header">
                <custom-avatar size="${screenSizeState.width < 500 ? '50' : '120'}" 
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
                                ${this.listData.public ? html`
                                    <info-tooltip 
                                        tooltipText="This list is public. (Click for more details about publicity.)"
                                        buttonClasses="public-section purple-text"
                                    >
                                        <world-icon slot="icon"></world-icon>
                                        <publicity-details slot="modal-content"></publicity-details>
                                    </info-tooltip>
                                ` : html`
                                    <info-tooltip 
                                        tooltipText="This list is private. (Click for more details about publicity.)"
                                        buttonClasses="public-section"
                                    >
                                        <lock-icon slot="icon"></lock-icon>
                                        <publicity-details slot="modal-content"></publicity-details>
                                    </info-tooltip>
                                `}
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
                    <div class="description desktop-only">${this.listData?.description}</div>
                    <list-shared-with-details class="desktop-only" .listData="${this.listData}"></list-shared-with-details>
                </div>
                <div class="description mobile-only">${this.listData?.description}</div>
                <list-shared-with-details class="mobile-only" .listData="${this.listData}"></list-shared-with-details>
            </div>
            ${this.listData.listItems?.length ? html`
                <div class="sort-container">
                    <list-sort-dropdown 
                        .selectedValue="${this.sortOption}"
                        @sort-changed="${this._handleSortChange}"
                    ></list-sort-dropdown>
                </div>
            ` : ''}
            <div class="list-items">
                ${this.listData.listItems?.length
                    ? this._getSortedItems().map(item => html`
                        <item-tile .itemData="${item}" .listId="${this.listId}" .listOwnerId="${this.listData?.ownerId}" @navigate="${this._navigateToItem}"></item-tile>
                    `)
                    : html`<p>No items in this list yet.</p>`
                }
            </div>
            <add-custom-item-modal .listId="${this.listId}"></add-custom-item-modal>
        `;
    }
}

customElements.define('list-view-container', ListViewContainer);
