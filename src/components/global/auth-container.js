import {LitElement, html, css} from 'lit';
import {observeState} from 'lit-element-state';
import {userState} from '../../state/userStore.js';
import {userListState} from "../../state/userListStore.js";
import {globalState} from '../../state/globalStore.js';
import './loading-screen.js';
import {initRouter, navigate} from "../../router/main-router.js";
import {getAccessibleUsers, getCurrentUser, getYourUsers} from "../../helpers/api/users.js";
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
import '../lists/bulk-add-to-list-modal.js';
import './delete-list/delete-list.js';
import '../lists/edit-list-modal.js';
import '../global/add-proposal-modal.js';
import {initializeProposalHelpers} from '../../helpers/proposalHelpers.js';

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
        listenUpdateUser(this.fetchUserData.bind(this));
        initializeProposalHelpers();
    }

    async fetchUserData() {
        try {
            const userData = await getCurrentUser();
            const myUsers = await getYourUsers();
            userState.userData = userData;
            if(myUsers?.success) {
                userState.myUsers = myUsers.data;
            }
            userState.loadingUser = false;
            triggerInitialUserLoaded()
            if (!userData?.id) {
                navigate(globalState.landingPage)
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
            ${userState.userData?.id ? html`
            <edit-item-modal></edit-item-modal>
            <add-question-modal></add-question-modal>
            <bulk-add-to-group-modal></bulk-add-to-group-modal>
            <bulk-add-to-list-modal></bulk-add-to-list-modal>
            <delete-list></delete-list>
            <edit-list-modal></edit-list-modal>
            <add-proposal-modal></add-proposal-modal>` : ''}
        `;
    }
}

customElements.define('auth-container', AuthContainer);
