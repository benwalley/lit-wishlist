import {LitElement, html, css} from 'lit';
import '../../pages/account/avatar.js';
import '../custom-modal.js';
import {getUserImageIdByUserId, getUsernameById} from "../../../helpers/generalHelpers.js";
import {observeState} from "lit-element-state";

export class GettingStack extends observeState(LitElement) {
    static properties = {
        itemData: {type: Object},
        maxDisplayed: {type: Number},
        modalOpen: {type: Boolean, state: true},
        simple: {type: Boolean, reflect: true},
        showAvatars: {type: Boolean}
    };

    constructor() {
        super();
        this.itemData = {};
        this.maxDisplayed = 5; // Default max avatars to display
        this.modalOpen = false;
        this.simple = false;
        this.showAvatars = true;
    }

    get gettingList() {
        return this.itemData?.getting || [];
    }

    get displayedUsers() {
        return this.gettingList.slice(0, this.maxDisplayed);
    }

    get remainingCount() {
        return Math.max(0, this.gettingList.length - this.maxDisplayed);
    }

    get numberPeopleGetting() {
        return this.gettingList.length;
    }

    openModal() {
        this.modalOpen = true;
    }

    closeModal() {
        this.modalOpen = false;
    }

    static get styles() {
        return css`
            :host {
                display: inline-block;
            }

            h3 {
                margin-top: 0;
        }
            
            .getting-stack {
                display: flex;
                align-items: center;
                gap: var(--spacing-small);
            }
            
            .simple-view {
                display: inline-flex;
                align-items: center;
                font-size: 0.875rem;
                color: var(--medium-text-color);
            }
            
            .avatar-container {
                display: flex;
                align-items: center;
            }
            
            .avatar-stack {
                display: flex;
                margin-left: -12px;
            }
            
            .avatar-stack custom-avatar:not(:first-child) {
                margin-left: -12px;
            }
            
            .avatar-stack custom-avatar {
                position: relative;
                z-index: 1;
                cursor: pointer;
            }
            
            .avatar-stack custom-avatar:hover {
                z-index: 10;
            }
            
            .remaining-count {
                background: var(--border-color);
                color: var(--dark-text-color);
                border-radius: 50%;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.75rem;
                font-weight: bold;
                margin-left: -8px;
                border: 2px solid var(--background-color);
                cursor: pointer;
            }
            
            .getting-text {
                font-size: 0.875rem;
                color: var(--medium-text-color);
                cursor: pointer;
            }
            
            .getting-text:hover {
                color: var(--dark-text-color);
            }
            
            .modal-content {
                padding: var(--spacing-normal);
            }
            
            .user-item {
                display: flex;
                align-items: center;
                gap: var(--spacing-small);
                padding: var(--spacing-small);
                border-bottom: 1px solid var(--border-color);
            }
            
            .user-item:last-child {
                border-bottom: none;
            }
            
            .user-info {
                flex: 1;
            }
            
            .user-name {
                font-weight: 500;
                color: var(--dark-text-color);
            }
            
            .getting-amount {
                font-size: 0.875rem;
                color: var(--medium-text-color);
            }
        `;
    }

    render() {
        if (this.gettingList.length === 0) {
            return html``;
        }

        if (this.simple) {
            return html`
                <div class="simple-view">
                    ${this.gettingList.length} people getting
                </div>
            `;
        }

        const totalGetting = this.gettingList.reduce((sum, item) => sum + (item.numberGetting || 0), 0);

        return html`
            <div class="getting-stack">
                ${this.showAvatars ? html`
                    <div class="avatar-container">
                        <div class="avatar-stack">
                            ${this.displayedUsers.map(user => html`
                                <custom-avatar
                                    size="24"
                                    round
                                    border
                                    username="${getUsernameById(user.giverId)}"
                                    imageId="${getUserImageIdByUserId(user.giverId)}"
                                    title="${getUsernameById(user.giverId)} is getting ${user.numberGetting || 1}"
                                ></custom-avatar>
                            `)}
                            ${this.remainingCount > 0 ? html`
                                <div class="remaining-count" @click="${this.openModal}" title="View all">
                                    +${this.remainingCount}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                ` : ''}
                
                <div class="getting-text" @click="${this.openModal}">
                    ${this.numberPeopleGetting} ${this.numberPeopleGetting === 1 ? 'person' : 'people'} getting
                </div>
            </div>
            
            <custom-modal 
                .isOpen="${this.modalOpen}" 
                @modal-closed="${this.closeModal}"
                maxWidth="400px"
            >
                <div class="modal-content">
                    <h3>People Getting This Item</h3>
                    ${this.gettingList.map(user => html`
                        <div class="user-item">
                            <custom-avatar
                                size="40"
                                username="${getUsernameById(user.giverId)}"
                                imageId="${getUserImageIdByUserId(user.giverId)}"
                            ></custom-avatar>
                            <div class="user-info">
                                <div class="user-name">${getUsernameById(user.giverId)}</div>
                                <div class="getting-amount">Getting ${user.numberGetting || 1}</div>
                            </div>
                        </div>
                    `)}
                </div>
            </custom-modal>
        `;
    }
}

customElements.define('getting-stack', GettingStack);
