import {LitElement, html, css} from 'lit';
import buttonStyles from "../../../css/buttons";
import {getGroupById} from "../../../helpers/api/groups.js";
import './group-details.js';
import './group-users-list.js';
import './invites-section.js';
import '../../groups/group-lists-list.js';
import '../../global/loading-screen.js';
import {listenGroupUpdated} from "../../../events/eventListeners.js";
import {isGroupAdmin} from "../../../helpers/groupHelpers.js";
import {userState} from "../../../state/userStore.js";
import {observeState} from "lit-element-state";

export class GroupViewContainer extends observeState(LitElement) {
    static properties = {
        groupId: {type: String},
        loading: {type: Boolean},
        groupData: {type: Object}
    };

    constructor() {
        super();
        this.groupId = '';
        this.loading = true;
        this.groupData = {};
    }

    onBeforeEnter(location, commands, router) {
        this.groupId = location.params.groupId;
    }

    connectedCallback() {
        super.connectedCallback();
        if(!this.groupId?.length) {
            this.loading = false;
            return;
        }
        this.fetchGroupData();
        listenGroupUpdated(this.fetchGroupData.bind(this));
    }

    async fetchGroupData() {
        try {
            const response = await getGroupById(this.groupId);
            if(response?.error) {
                console.error('Error fetching group data:', response.error);
                return;
            }
            this.groupData = response.data;
        } catch (error) {
            console.error('Error fetching group:', error);
        } finally {
            this.loading = false;
        }
    }

    _handleInviteUser() {
        // Open invitation modal or navigate to invitation page
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {

                }
                .group-container {
                    display: grid;
                    gap: var(--spacing-normal);
                    padding: var(--spacing-normal-variable);
                    max-width: 1200px;
                    padding-bottom: 100px;
                    transition: var(--transition-200);
                }

                @media (min-width: 700px) {
                    .group-container {
                        grid-template-columns: 1fr 1fr;
                    }
                }

                section {
                    padding: var(--spacing-normal-variable);
                    box-shadow: var(--shadow-1-soft);
                    border-radius: var(--border-radius-large);
                    background: var(--background-light);
                    position: relative;
                }
                
                .groups-list-container {
                    grid-column: 1 / -1;
                }
                
                loading-screen {
                    height: 100%;
                }


            `
        ];
    }

    render() {
        if (this.loading) {
            return html`<loading-screen size="medium"></loading-screen>`;
        }

        return html`
            <main class="group-container">
                <section>
                    <group-details .groupData="${this.groupData}"></group-details>
                </section>

                <section>
                    <group-users-list 
                        .groupData="${this.groupData}"
                        @invite-user="${this._handleInviteUser}"
                    ></group-users-list>
                </section>
                <section class="groups-list-container">
                    <group-lists-list
                            .groupData="${this.groupData}"
                    ></group-lists-list>
                </section>
                ${isGroupAdmin(this.groupData, userState.userData?.id) ? html`<section>
                    <invites-section 
                        .groupData="${this.groupData}"
                        @group-updated="${(e) => { this.groupData = e.detail.groupData; }}"
                    ></invites-section>
                </section>` : ''}
         
            </main>
        `;
    }
}
customElements.define('group-view-container', GroupViewContainer);
