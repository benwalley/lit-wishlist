import { LitElement, html, css } from 'lit';
import '../../pages/account/avatar.js'
import '../list/item-tile.js'
import '../../../svg/user.js'
import '../../../svg/world.js'
import '../../../svg/lock.js'
import '../../global/loading-screen.js'
import '../../global/custom-modal.js'
import buttonStyles from '../../../css/buttons.js';
import {screenSizeState} from "../../../state/screenSizeStore.js";
import {getPublicListById} from "../../../helpers/api/lists.js";

export class PublicListView extends LitElement {
    static properties = {
        listId: { type: String },
        listData: {type: Object},
        items: {type: Array},
        owner: {type: Object},
        loading: {type: Boolean},
        showPublicityModal: {type: Boolean},
        listNotFound: {type: Boolean}
    };

    constructor() {
        super();
        this.listId = '';
        this.listData = {};
        this.items = [];
        this.owner = {};
        this.loading = true;
        this.showPublicityModal = false;
        this.listNotFound = false;
    }

    connectedCallback() {
        super.connectedCallback();
        if(!this.listId?.length) {
            this.loading = false;
            return;
        }
        this.fetchListData();
    }

    async fetchListData() {
        try {
            const response = await getPublicListById(this.listId);
            if(response?.success) {
                const {items, list, owner} = response.data;
                this.items = items || [];
                this.listData = list || {};
                this.owner = owner || {};
                this.listNotFound = false;
            } else {
                this.listNotFound = true;
            }
        } catch (error) {
            console.error('Error fetching public list:', error);
            this.listNotFound = true;
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
                    max-width: 1400px;
                    margin: 0 auto;
                    
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
                    margin: 0 auto;
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

                .not-found-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: var(--spacing-large);
                    text-align: center;
                    min-height: 400px;
                }

                .not-found-message {
                    font-size: var(--font-size-large);
                    color: var(--text-color-medium-dark);
                    margin-bottom: var(--spacing-normal);
                }

                .not-found-subtitle {
                    font-size: var(--font-size-medium);
                    color: var(--text-color-light);
                }
            `
        ];
    }

    onBeforeEnter(location, commands, router) {
        this.listId = location.params.listId;
    }

    _handlePublicityClick() {
        this.showPublicityModal = true;
    }

    _closePublicityModal() {
        this.showPublicityModal = false;
    }

    render() {
        if (this.loading) {
            return html`<loading-screen></loading-screen>`;
        }

        if (this.listNotFound) {
            return html`
                <div class="not-found-container">
                    <h2 class="not-found-message">Public List Not Found</h2>
                    <p class="not-found-subtitle">This list does not exist or is not publicly accessible.</p>
                </div>
            `;
        }

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
                                    <a href="/public/user/${this.owner?.id}">${this.owner?.name}</a>
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
                    </div>
                    
                    <div>${this.listData?.description}</div>
                </div>
            </div>
            <div class="list-items">
                ${this.items?.length 
                    ? this.items.map(item => html`
                        <item-tile .itemData="${item}" .listId="${this.listId}" .publicView="${true}"></item-tile>
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

customElements.define('public-list-view', PublicListView);
