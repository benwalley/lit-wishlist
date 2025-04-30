import {LitElement, html, css} from 'lit';
import {observeState} from 'lit-element-state';
import {userState} from '../../state/userStore.js';
import {userListState} from "../../state/userListStore.js";
import './loading-screen.js';
import {initRouter, navigate} from "../../router/main-router.js";
import {getAccessibleUsers, getCurrentUser} from "../../helpers/api/users.js";
import {
    listenUpdateUser,
    triggerInitialUserLoaded,
    triggerUpdateUser,
    triggerUserListLoaded
} from "../../events/eventListeners.js";
import '../global/messages-component.js';
import '../add-to-list/edit-item-modal.js';
import './add-question-modal.js';
import '../groups/bulk-add-to-group-modal.js'

export class AuthContainer extends observeState(LitElement) {
    static styles = css`
        :host {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
        }

        @media (min-width: 768px) {
            :host {
                display: grid;
                grid-template-columns: 275px 1fr;
                grid-template-rows: auto 1fr;
            }
        }
    `;

    async firstUpdated() {
        await this.fetchUserData();
        await this.fetchAccessibleUsers();
        listenUpdateUser(this.fetchUserData)
    }

    async fetchUserData() {
        try {
            const userData = await getCurrentUser();
            userState.userData = userData;
            userState.loadingUser = false;
            triggerInitialUserLoaded()
            if (!userData?.id) {
                navigate('/')
            }
        } catch (e) {
            console.log('user is not logged in')
            userState.loadingUser = false;
        }
    }

    async fetchAccessibleUsers() {
        try {
            const usersData = await getAccessibleUsers()
            userListState.users = usersData;
            userListState.loadingUsers = false;
            triggerUserListLoaded()
        } catch (e) {
            userState.loadingUser = false;
        }
    }

    render() {
        return html`
            <messages-component></messages-component>
            ${userState.loadingUser
                    ? html`
                        <loading-screen></loading-screen>`
                    : html`
                        <slot></slot>`
            }
            <edit-item-modal></edit-item-modal>
            <add-question-modal></add-question-modal>
            <bulk-add-to-group-modal></bulk-add-to-group-modal>
        `;
    }
}

customElements.define('auth-container', AuthContainer);
