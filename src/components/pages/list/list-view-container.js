import { LitElement, html, css } from 'lit';
import {customFetch} from "../../../helpers/fetchHelpers.js";
import '../../pages/account/avatar.js'
import './item-tile.js'
import '../../lists/edit-list-modal.js'
import '../../../svg/edit.js'
import {openEditListModal} from '../../lists/edit-list-modal.js'
import {listenUpdateList} from "../../../events/eventListeners.js";
import buttonStyles from '../../../css/buttons.js';

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
    }

    async fetchListData() {
        try {
            const response = await customFetch(`/lists/${this.listId}`, {}, true);
            if(response?.responseData?.error) {
                console.log('error');
                return;
            }
            this.listData = response;
            this.loading = false;
            console.log(response)
            this.requestUpdate();

        } catch (error) {
            console.error('Error fetching groups:', error);
            this.loading = false
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
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }

                .list-items {
                    display: grid;
                    grid-template-columns: repeat(1, 1fr);
                    gap: var(--spacing-normal);
                    padding: 0 var(--spacing-normal);
                }

                @media (min-width: 450px) {
                    .list-items {
                        grid-template-columns: repeat(1, 1fr);
                    }
                }

                @media (min-width: 768px) {
                    .list-items {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }

                @media (min-width: 1024px) {
                    .list-items {
                        grid-template-columns: repeat(3, 1fr);
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
                    <div class="header-actions">
                        <button class="secondary edit-button" @click="${this._handleEditList}">
                            <edit-icon></edit-icon> Edit List
                        </button>
                    </div>
                </div>
            </div>
            <div class="list-items">
                ${this.listData.listItems.map(item => html`
                <item-tile .itemData="${item}" .listId="${this.listId}" @navigate="${this._navigateToItem}"></item-tile>
            `)}
            </div>
            
            <edit-list-modal></edit-list-modal>
        `;
    }
}

customElements.define('list-view-container', ListViewContainer);
