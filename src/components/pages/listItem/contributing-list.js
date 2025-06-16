import {LitElement, html, css} from 'lit';
import buttonStyles from "../../../css/buttons";
import {listenInitialUserLoaded} from "../../../events/eventListeners.js";
import {observeState} from "lit-element-state";
import '../account/avatar.js';
import {userState} from "../../../state/userStore.js";

export class CustomElement extends observeState(LitElement) {
    static properties = {
        itemData: {type: Object},
        userList: {type: Array}
    };

    constructor() {
        super();
        this.itemData = {};
        this.userList = [];
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    display: block;
                    padding: 0 var(--spacing-normal);
                }
                
                .user-container {
                    display: flex;
                    flex-direction: row;
                    gap: var(--spacing-small);
                    align-items: center;
                }
                
                .user-info {
                    margin-right: auto;
                    font-weight: bold;
                }
                
                .contributing-toggle {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-small);
                }
                
                .toggle-switch {
                    position: relative;
                    width: 50px;
                    height: 24px;
                    background-color: var(--border-color);
                    border-radius: 12px;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }
                
                .toggle-switch.active {
                    background-color: var(--primary-button-background);
                }
                
                .toggle-slider {
                    position: absolute;
                    top: 2px;
                    left: 2px;
                    width: 20px;
                    height: 20px;
                    background-color: white;
                    border-radius: 50%;
                    transition: transform 0.3s;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }
                
                .toggle-switch.active .toggle-slider {
                    transform: translateX(26px);
                }
            `
        ];
    }

    connectedCallback() {
        super.connectedCallback();
        // Try to set data immediately if both are available
        if (this.itemData && userState?.myUsers) {
            this._setUserData();
        }
        listenInitialUserLoaded(this._setUserData.bind(this))
    }

    updated(changedProperties) {
        if (changedProperties.has('itemData')) {
            if (this.itemData && userState?.myUsers) {
                this._setUserData();
            }
        }
    }

    triggerDataChangedEvent() {
        const contributingUsers = this.userList.filter(user => user.contributing);
        this.dispatchEvent(new CustomEvent('data-changed', {
            bubbles: true,
            composed: true,
            detail: {
                data: contributingUsers,
                total: contributingUsers.length
            }
        }));
    }

    _setUserData() {
        if(!userState?.myUsers?.length) {
            return;
        }

        if(!this.itemData) {
            return;
        }

        const newUserList = []
        for(const user of userState.myUsers) {
            const userData = {...user};
            let contributing = false;

            for(const contributor of this.itemData?.goInOn || []) {
                if (user.id === contributor.giverId) {
                    contributing = true;
                    break;
                }
            }

            userData.contributing = contributing;
            newUserList.push(userData);
        }

        this.userList = newUserList;
        this.triggerDataChangedEvent();
    }

    _toggleContributing(index) {
        const updatedUserList = this.userList.map((userData, i) => {
            if(i === index) {
                return {...userData, contributing: !userData.contributing};
            }
            return userData;
        });
        this.userList = updatedUserList;
        this.triggerDataChangedEvent();
    }

    render() {
        return html`
            ${this.userList?.map(
                (userData, index) => html`
                    <div class="user-container">
                        <custom-avatar
                                size="32"
                                username="${userData.name}"
                                imageId="${userData.imageId}"
                        ></custom-avatar>
                        <div class="user-info">
                            <div class="user-name">${userData.name}</div>
                        </div>
                        <div class="contributing-toggle">
                            <div 
                                class="toggle-switch ${userData.contributing ? 'active' : ''}"
                                @click="${() => this._toggleContributing(index)}"
                            >
                                <div class="toggle-slider"></div>
                            </div>
                        </div>
                    </div>
                `
            )}
        `;
    }
}

customElements.define('contributing-list', CustomElement);
