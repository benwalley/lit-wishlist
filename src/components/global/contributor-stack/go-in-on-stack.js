import {LitElement, html, css} from 'lit';
import '../../pages/account/avatar.js';
import '../custom-modal.js';
import {getUserImageIdByUserId, getUsernameById} from "../../../helpers/generalHelpers.js";
import {observeState} from "lit-element-state";
import {userState} from "../../../state/userStore.js";

export class GoInOnStack extends observeState(LitElement) {
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

    get goInOnList() {
        return this.itemData?.goInOn || [];
    }

    get displayedUsers() {
        return this.goInOnList.slice(0, this.maxDisplayed);
    }

    get remainingCount() {
        return Math.max(0, this.goInOnList.length - this.maxDisplayed);
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
                margin: 0;
                padding: var(--spacing-normal);
                background: var(--background-dark);
                border-bottom: 1px solid var(--border-color);
            }
            
            .go-in-on-stack {
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
            
            .go-in-on-text {
                font-size: 0.875rem;
                color: var(--purple-normal);
                font-weight: 600;
                cursor: pointer;
                display: flex;
                flex-direction: row;
                gap: var(--spacing-x-small);
                
                .mobile-hidden {
                    display: none;
                }
            }
            
            @media (min-width: 600px) {
                .go-in-on-text {
                    .mobile-hidden {
                        display: block;
                    }
                }
            }
            
            
            .user-item {
                display: flex;
                align-items: center;
                gap: var(--spacing-small);
                padding: 15px;
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
                text-decoration: none;
                display: flex;
                align-items: center;
                
                &:hover {
                    text-decoration: underline;
                }
            }
            
            .participating-status {
                font-size: 0.875rem;
                color: var(--medium-text-color);
            }
            
            .current-user-dot {
                width: 7px;
                height: 7px;
                background-color: var(--info-yellow);
                border-radius: 50%;
                margin-left: var(--spacing-x-small);
                flex-shrink: 0;
            }
        `;
    }

    render() {
        if (this.goInOnList.length === 0) {
            return html``;
        }

        if (this.simple) {
            return html`
                <div class="simple-view">
                    ${this.goInOnList.length} people want to go in on
                </div>
            `;
        }

        return html`
            <div class="go-in-on-stack" @click="${this.openModal}">
                ${this.showAvatars ? html`
                    <div class="avatar-container">
                        <div class="avatar-stack">
                            ${this.displayedUsers.map(user => html`
                                <custom-avatar
                                    size="24"
                                    round
                                    border
                                    username="${getUsernameById(user.giverId, 'Unknown')}"
                                    imageId="${getUserImageIdByUserId(user.giverId)}"
                                    title="${getUsernameById(user.giverId, 'Unknown')} wants to go in on this"
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
                
                <div class="go-in-on-text" >
                    <span>${this.goInOnList.length}</span>
                    <span class="mobile-hidden">${this.goInOnList.length === 1 ? 'person wants' : 'people want'} to go in on</span>
                </div>
            </div>
            
            <custom-tooltip>Click for details</custom-tooltip>
            
            <custom-modal 
                .isOpen="${this.modalOpen}" 
                @modal-closed="${this.closeModal}"
                maxWidth="400px"
                noPadding
            >
                <div class="modal-content">
                    <h3>People Who Want to Go In On This</h3>
                    ${this.goInOnList.map(user => html`
                        <div class="user-item">
                            <custom-avatar
                                size="40"
                                username="${getUsernameById(user.giverId, 'Unknown')}"
                                imageId="${getUserImageIdByUserId(user.giverId)}"
                            ></custom-avatar>
                            <div class="user-info">
                                <a href="/user/${user.giverId}" class="user-name">
                                    <span>${getUsernameById(user.giverId, 'Unknown')}</span>
                                    ${user.giverId === userState?.userData?.id ? html`
                                        <div class="current-user-dot"></div>
                                    ` : ''}
                                </a>
                                <div class="participating-status">Wants to contribute</div>
                            </div>
                        </div>
                    `)}
                </div>
            </custom-modal>
        `;
    }
}

customElements.define('go-in-on-stack', GoInOnStack);
