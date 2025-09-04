import {LitElement, html, css} from 'lit';
import {observeState} from 'lit-element-state';
import {userState} from '../../state/userStore.js';
import {userListState} from "../../state/userListStore.js";
import {viewedItemsState} from "../../state/viewedItemsStore.js";
import {globalState} from '../../state/globalStore.js';
import {groupInvitationsState} from '../../state/groupInvitationsStore.js';
import './loading-screen.js';
import {initRouter, navigate} from "../../router/main-router.js";
import {getAccessibleUsers, getCurrentUser, getYourUsers} from "../../helpers/api/users.js";
import {getUserGroups} from "../../helpers/api/groups.js";
import {fetchMyLists} from "../../helpers/api/lists.js";
import {getSubusers} from "../../helpers/api/subusers.js";
import {getViewedItems, startQueueProcessor, stopQueueProcessor} from "../../helpers/viewedItems/index.js";
import {
    listenGroupUpdated,
    listenUpdateUser,
    listenUpdateList,
    triggerInitialUserLoaded,
    triggerUpdateUser,
    triggerUserListLoaded,
    triggerViewedItemsLoaded
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
import {getRefreshToken} from "../../localStorage/tokens.js";

export class AuthContainer extends observeState(LitElement) {
    static styles = css`
        :host {
            display: flex;
            flex-direction: column;
            height: 100vh;
        }
        
        loading-screen {
            margin-top: auto;
            margin-bottom: auto;
            grid-row: 1 / -1;
        }

        @media (min-width: 1200px) {
            :host {
                display: grid;
                grid-template-rows: auto 1fr;
            }
            
            /* When user is authenticated, show sidebar layout */
            :host(.authenticated) {
                grid-template-columns: 275px 1fr;
            }
            
            /* When user is not authenticated, full width layout */
            :host(.unauthenticated) {
                grid-template-columns: 1fr;
            }
        }
    `;

    async firstUpdated() {
        listenUpdateUser(() => {
            this.fetchUserData();
            this.fetchGroupData();
            this.fetchAccessibleUsers();
            this.fetchViewedItems();
            this.fetchUserLists();
        });
        listenGroupUpdated(() => {
            this.fetchAccessibleUsers();
            this.fetchGroupData();
        });
        listenUpdateList(() => {
            this.fetchUserLists();
        });
        initializeProposalHelpers();
        if(!getRefreshToken()) {
            userState.loadingUser = false;
            return;
        }
        await this.fetchUserData();
        await this.fetchGroupData();
        await this.fetchAccessibleUsers();
        await this.fetchViewedItems();
        triggerInitialUserLoaded();

    }

    updated(changedProperties) {
        super.updated(changedProperties);
        this._updateAuthenticationClass();
    }

    _updateAuthenticationClass() {
        if (userState.loadingUser) {
            // Don't change class while loading
            return;
        }

        if (userState.userData?.id) {
            this.classList.remove('unauthenticated');
            this.classList.add('authenticated');
        } else {
            this.classList.remove('authenticated');
            this.classList.add('unauthenticated');
        }
    }

    async fetchGroupData() {
        console.log('fetching group data');
        const myGroups = await getUserGroups();
        userState.myGroups = myGroups;
        await groupInvitationsState.fetchInvitations();
    }

    async fetchUserData() {
        try {
            const userData = await getCurrentUser();

            userState.userData = userData;


            // Fetch user lists if user is authenticated
            if (userData?.id) {
                const listsResponse = await fetchMyLists();
                if (listsResponse?.success) {
                    userState.myLists = listsResponse.data || [];
                } else {
                    userState.myLists = [];
                }
            }
            // Fetch subusers if user is authenticated
            if (userData?.id) {
                const subusers = await getSubusers();
                if(subusers?.success) {
                    userState.subusers = subusers.data;
                } else {
                    userState.subusers = [];
                }
            }

            userState.loadingUser = false;
            if (!userData?.id) {
                // User not authenticated, stop queue processor
                stopQueueProcessor();
                navigate(globalState.landingPage)
            } else {
                // User authenticated, start queue processor
                startQueueProcessor();
            }
        } catch (e) {
            userState.loadingUser = false;
        }
    }

    async fetchAccessibleUsers() {
        try {
            const usersData = await getAccessibleUsers()
            userListState.users = usersData;
            userListState.usersLoaded = true;
            triggerUserListLoaded()
        } catch (e) {
            userState.loadingUser = false;
        }
    }

    async fetchViewedItems() {
        if (!userState.userData?.id) {
            return;
        }

        try {
            const viewedItemsResponse = await getViewedItems();
            if (viewedItemsResponse?.success) {
                viewedItemsState.viewedItems = viewedItemsResponse.data;
            } else {
                viewedItemsState.viewedItems = [];
            }
            viewedItemsState.viewedItemsLoaded = true;
            triggerViewedItemsLoaded();
        } catch (e) {
            console.error('Error fetching viewed items:', e);
            viewedItemsState.viewedItems = [];
        }
    }

    async fetchUserLists() {
        if (!userState.userData?.id) {
            return;
        }

        try {
            const listsResponse = await fetchMyLists();
            if (listsResponse?.success) {
                userState.myLists = listsResponse.data || [];
            } else {
                userState.myLists = [];
            }
        } catch (e) {
            console.error('Error fetching user lists:', e);
            userState.myLists = [];
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
