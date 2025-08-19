import {LitElement, html, css} from 'lit';

import '../account/avatar.js';
import '../account/account-public-description.js';
import '../account/qa/public-qa.js';
import '../account/account-notifications.js';
import '../account/account-private-notes.js';
import '../account/user-details.js';
import '../account/account-lists.js';
import '../account/logout-button.js'
import '../account/invited-groups.js'
import '../../global/image-upload/image-uploader.js'
import '../../global/custom-image.js'
import '../../lists/user-lists.js'
import '../../lists/edit-list-modal.js'
import '../../global/loading-screen.js'
import '../account/my-groups-list.js'
import '../../../svg/edit.js'
import buttonStyles from '../../../css/buttons.js'
import '../../users/edit-user-form.js';
import {customFetch} from "../../../helpers/fetchHelpers.js";
import {messagesState} from "../../../state/messagesStore.js";

export class UserViewContainer extends LitElement {
    static properties = {
        userId: { type: String },
        userData: { type: Object },
        loading: { type: Boolean }
    };

    constructor() {
        super();
        this.userId = '';
        this.userData = {};
        this.loading = true;
    }

    connectedCallback() {
        super.connectedCallback();
        if(!this.userId?.length) {
            this.loading = false;
            return;
        }
        this.fetchUserData();
    }

    async fetchUserData() {
        try {
            const response = await customFetch(`/users/${this.userId}`, {}, true);
            if(response?.success) {
                this.userData = response.data;
            } else {
                messagesState.addMessage(response.message || 'Error fetching user data', 'error');
            }
        } catch (error) {
            messagesState.addMessage('Error fetching user data', 'error');
        } finally {
            this.loading = false;
        }
    }

    onBeforeEnter(location, commands, router) {
        this.userId = location.params.userId;
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    
                }
                .account-container {
                    display: grid;
                    gap: var(--spacing-normal);
                    padding: var(--spacing-normal);
                }

                @media (min-width: 768px) {
                    .account-container {
                        grid-template-columns: 400px 1fr;
                    }
                }

                section {
                    padding: 1rem;
                    box-shadow: var(--shadow-1-soft);
                    border-radius: var(--border-radius-large);
                    background: var(--background-light);
                    position: relative;
                    overflow: hidden;
                    
                    &.no-padding {
                        padding: 0;
                    }
                }
            `
        ];
    }


    render() {
        if (this.loading) {
            return html`<loading-screen></loading-screen>`;
        }

        return html`
            <main class="account-container">
                <section class="no-padding">
                    <user-details .userData="${this.userData}" .isUser="${false}"></user-details>
                </section>

                <section>
                    <user-lists .userId="${this.userId}" .isUser="${false}"></user-lists>
                </section>
            </main>
        `;
    }
}

customElements.define('user-view-container', UserViewContainer);

