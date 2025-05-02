import { LitElement, html, css } from 'lit';
import {customFetch} from "../../../helpers/fetchHelpers.js";
import '../../pages/account/avatar.js'
import './item-tile.js'
import '../../lists/edit-list-modal.js'
import '../../../svg/edit.js'
import '../../../svg/delete.js'
import {openEditListModal} from '../../lists/edit-list-modal.js'
import {listenUpdateItem, listenUpdateList, triggerDeleteList} from "../../../events/eventListeners.js";
import buttonStyles from '../../../css/buttons.js';
import {messagesState} from "../../../state/messagesStore.js";
import {redirectToDefaultPage} from "../../../helpers/generalHelpers.js";

export class ListViewContainer extends LitElement {
    static properties = {
        listId: { type: String },
        listData: {type: Object},
        loading: {type: Boolean},
        selectedItem: {type: String}
    };

    constructor() {
        super();
        this.listId = '';
        this.listData = {};
        this.loading = true;
        this.selectedItem = '';
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
            const response = await customFetch(`/lists/${this.listId}`, {}, true);
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
                    
                    h1 {
                        margin: 0;
                    }
                }
                
                .header-content {
                    flex-grow: 1;
                }
                
                .header-actions {
                    display: flex;
                    gap: var(--spacing-small);
                    margin-top: var(--spacing-x-small);
                }
                
                .edit-button {
                    font-size: var(--font-size-large);;
                }

                .delete-button {
                    font-size: var(--font-size-large);
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

    render() {
        // If this.loading is true, show a loading message
        if (this.loading) {
            return html`<p>Loading...</p>`;
        }

        // Otherwise, show the list data
        return html`
            <div class="list-header">
                <custom-avatar size="100" username="${this.listData?.listName}"></custom-avatar>
                <div class="header-content">
                    <h1>${this.listData?.listName}</h1>
                    <div>${this.listData?.description}</div>
                    ${this.listId > 0 ? html`
                        <div class="header-actions">
                            <button class="edit-button icon-button blue-text"
                                    @click="${this._handleEditList}"
                                    aria-label="Edit List"
                            >
                                <edit-icon></edit-icon>
                            </button>
                            <button class="delete-button icon-button danger-text"
                                    @click="${this._handleDeleteList}"
                                    aria-label="Delete List">
                                <delete-icon></delete-icon>
                            </button>
                        </div>
                    ` : ''}
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
            
            <edit-list-modal></edit-list-modal>
        `;
    }
}

customElements.define('list-view-container', ListViewContainer);
