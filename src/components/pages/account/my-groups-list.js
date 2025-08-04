import {LitElement, html, css} from 'lit';
import {observeState} from 'lit-element-state';
import buttonStyles from "../../../css/buttons";
import helperStyles from "../../../css/helpers";
import '../../groups/group-list-display-item.js';
import {messagesState} from "../../../state/messagesStore.js";
import {userState} from '../../../state/userStore.js';
import '../../global/custom-modal.js';
import '../../groups/create-group-form.js';
import {listenGroupUpdated, triggerUpdateUser} from "../../../events/eventListeners.js";
import '../../../svg/group.js';
import '../../../svg/plus.js';
import scrollbarStyles from "../../../css/scrollbars.js";


export class MyGroupsList extends observeState(LitElement) {
    static properties = {
        isCreateModalOpen: { type: Boolean },
        lightTiles: { type: Boolean },
    };

    constructor() {
        super();
        this.isCreateModalOpen = false;
        this.lightTiles = false;
    }

    connectedCallback() {
        super.connectedCallback();
        listenGroupUpdated(() => triggerUpdateUser())
    }

    static get styles() {
        return [
            buttonStyles,
            helperStyles,
            scrollbarStyles,

            css`
                :host {
                    display: block;
                    width: 100%;
                }
                
                .section-header {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: space-between;
                    padding: var(--spacing-small) 0 var(--spacing-normal) 0;
                }

                @media (min-width: 600px) {
                    .section-header {
                        padding: 0 0 var(--spacing-normal) 0;
                    }
                }
                
                .title {
                    font-weight: bold;
                    margin: 0;
                }
                
                .groups-container {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-normal-variable);
                    max-height: 250px;
                    overflow: auto;
                }
                
                group-list-display-item {
                    --item-background: var(--background-dark);
                }
                
                group-list-display-item.light-tiles {
                    --item-background: var(--background-light);
                }
                
                .empty-state {
                    padding: 48px 24px;
                    text-align: center;
                    color: var(--text-color-medium-dark);
                    background-color: var(--background-light);
                    border-radius: var(--border-radius-normal);
                    border: 2px dashed var(--border-color);
                }

                .empty-state-icon {
                    width: 48px;
                    height: 48px;
                    margin: 0 auto 16px;
                    opacity: 0.5;
                    color: var(--text-color-medium-dark);
                }

                .empty-state-title {
                    font-size: var(--font-size-large);
                    font-weight: 600;
                    margin: 0 0 8px 0;
                    color: var(--text-color-dark);
                }

                .empty-state-description {
                    font-size: var(--font-size-normal);
                    margin: 0;
                    line-height: 1.5;
                }
                
                .loading {
                    height: 100px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--text-color-medium-dark);
                }
                
                .new-group-button {
                    margin: auto 0;
                }
            `
        ];
    }
    _handleOpenNewGroupPopup() {
        this.isCreateModalOpen = true;
    }

    _handleCloseModal() {
        this.isCreateModalOpen = false;
    }

    async _handleGroupCreated(e) {
        const newGroup = e.detail.group;
        this._handleCloseModal();
    }

    render() {
        return html`
            <div class="section-header">
                <h2 class="title">My Groups</h2>
                <button 
                    class="primary new-group-button"
                    @click="${this._handleOpenNewGroupPopup}"
                >
                    <plus-icon></plus-icon>
                    New Group
                </button>
            </div>
            
            ${userState.loadingUser ? 
                html`<div class="loading">Loading groups...</div>` :
                this.renderGroups()
            }
            
            <custom-modal
                ?isOpen="${this.isCreateModalOpen}"
                maxWidth="600px"
                @modal-changed="${(e) => this.isCreateModalOpen = e.detail.isOpen}"
                @modal-closed="${(e) => this.isCreateModalOpen = false}"
            >
                <create-group-form
                    @close-modal="${this._handleCloseModal}"
                    @group-created="${this._handleGroupCreated}"
                ></create-group-form>
            </custom-modal>
        `;
    }

    renderGroups() {
        const groups = userState.myGroups || [];

        if (!groups || groups.length === 0) {
            return html`
                <div class="empty-state">
                    <group-icon class="empty-state-icon"></group-icon>
                    <h3 class="empty-state-title">No Groups Yet</h3>
                    <p class="empty-state-description">
                        Create your first group to start collaborating with others on wishlists and gift giving.
                    </p>
                </div>
            `;
        }

        return html`
            <div class="groups-container custom-scrollbar">
                ${groups.map(group => html`
                    <group-list-display-item 
                        class="${this.lightTiles ? 'light-tiles' : ''}"
                        .group=${group}
                    ></group-list-display-item>
                `)}
            </div>
        `;
    }
}

customElements.define('my-groups-list', MyGroupsList);
