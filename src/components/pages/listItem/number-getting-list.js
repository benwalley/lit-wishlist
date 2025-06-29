import {LitElement, html, css} from 'lit';
import buttonStyles from "../../../css/buttons";
import {cachedFetch} from "../../../helpers/caching.js";
import '../../../svg/plus.js';
import '../../../svg/minus.js';
import {listenInitialUserLoaded, listenUpdateItem} from "../../../events/eventListeners.js";
import {observeState} from "lit-element-state";
import '../account/avatar.js';
import '../../global/qty-input.js';
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
        // Calculate total from current user selection
        const userListTotal = this.userList.reduce((acc, user) => acc + (user.qty || 0), 0);
        
        // Calculate total from all other users not in the current user's group
        const myUserIds = this.userList.map(user => user.id);
        const othersTotal = (this.itemData?.getting || [])
            .filter(getter => !myUserIds.includes(getter.giverId))
            .reduce((acc, getter) => acc + (getter.numberGetting || 0), 0);
        
        // Total is user selection + others getting it
        const total = userListTotal + othersTotal;
        
        this.dispatchEvent(new CustomEvent('data-changed', {
            bubbles: true,
            composed: true,
            detail: {
                data: this.userList,
                total: total
            }
        }));
    }

    _setUserData() {
        if(!userState?.myUsers) {
            return;
        }

        if(!this.itemData) {
            return;
        }

        const newUserList = []
        for(const user of userState.myUsers) {
            const userData = {...user}; // Create a copy to avoid mutating original
            let qty = 0;
            for(const getter of this.itemData?.getting || []) {
                if (user.id === getter.giverId) {
                    qty = getter.numberGetting || 0;
                }
            }
            userData.qty = qty;
            newUserList.push(userData);
        }

        this.userList = newUserList;
        this.triggerDataChangedEvent();
    }

    _incrementQty(index) {
        const updatedUserList = this.userList.map((userData, i) => {
            if(i === index) {
                return {...userData, qty: userData.qty + 1};
            }
            return userData;
        });
        this.userList = updatedUserList;
        this.triggerDataChangedEvent();
    }

    _handleQtyChange(e, index) {
        const value = parseInt(e.target.value, 10);
        if (isNaN(value) || value < 0) {
            e.target.value = this.userList[index].qty; // Reset to previous value if invalid
            return;
        }
        const updatedUserList = this.userList.map((userData, i) => {
            if (i === index) {
                return {...userData, qty: value};
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
                            ${userData.qty > 0 ? html`
                                <qty-input 
                                        @change="${(e) => {this._handleQtyChange(e, index)}}"
                                        .value="${userData.qty}"
                                        size="small"
                                ></qty-input>
                            ` : html`
                                <button @click="${() => this._incrementQty(index)}"
                                        class="primary button shadow get-this-button"
                                >
                                    Get
                                </button>
                            `}

                        </div>
                    `
            )}
        `;
    }
}

customElements.define('number-getting-list', CustomElement);
