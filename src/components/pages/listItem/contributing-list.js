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
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-small);
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
                
                .toggle-container {
                    position: relative;
                    display: inline-block;
                }
                
                .toggle-input {
                    position: absolute;
                    opacity: 0;
                    width: 0;
                    height: 0;
                }
                
                .toggle-switch {
                    position: relative;
                    width: 50px;
                    height: 24px;
                    background-color: var(--border-color);
                    border-radius: 12px;
                    cursor: pointer;
                    transition: background-color 0.3s;
                    display: block;
                }
                
                .toggle-input:checked + .toggle-switch {
                    background-color: var(--primary-button-background);
                }
                
                .toggle-input:focus + .toggle-switch {
                    outline: 2px solid var(--primary-button-background);
                    outline-offset: 2px;
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
                
                .toggle-input:checked + .toggle-switch .toggle-slider {
                    transform: translateX(26px);
                }
            `
        ];
    }

    connectedCallback() {
        super.connectedCallback();
        // Try to set data immediately if both are available
        if (this.itemData && userState?.userData) {
            this._setUserData();
        }
        listenInitialUserLoaded(this._setUserData.bind(this))
    }

    updated(changedProperties) {
        if (changedProperties.has('itemData')) {
            if (this.itemData && userState?.userData) {
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
                data: this.userList, // Send all users with their contributing status
                contributingUsers: contributingUsers, // Keep for backward compatibility
                total: contributingUsers.length
            }
        }));
    }

    _setUserData() {
        if(!userState?.userData) {
            return;
        }

        if(!this.itemData) {
            return;
        }

        const newUserList = []
        const myUsers = [userState.userData, ...userState.subusers];
        for(const user of myUsers) {
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
                                imageId="${userData.image}"
                        ></custom-avatar>
                        <div class="user-info">
                            <div class="user-name">${userData.name}</div>
                        </div>
                        <div class="contributing-toggle">
                            <label class="toggle-container" for="contributing-${userData.id}">
                                <input 
                                    type="checkbox"
                                    id="contributing-${userData.id}"
                                    class="toggle-input"
                                    .checked="${userData.contributing}"
                                    @change="${() => this._toggleContributing(index)}"
                                    aria-label="Toggle contributing status for ${userData.name}"
                                >
                                <span class="toggle-switch">
                                    <span class="toggle-slider"></span>
                                </span>
                            </label>
                        </div>
                    </div>
                `
            )}
        `;
    }
}

customElements.define('contributing-list', CustomElement);
