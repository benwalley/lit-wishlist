import {LitElement, html, css} from 'lit';

import '../account/avatar.js';
import '../account/account-public-description.js';
import '../account/qa/public-qa.js';
import '../../global/loading-screen.js';
import '../../lists/user-lists.js';
import '../account/user-details.js';
import {customFetch} from "../../../helpers/fetchHelpers.js";
import {messagesState} from "../../../state/messagesStore.js";

export class PublicUserView extends LitElement {
    static properties = {
        userId: { type: String },
        userData: { type: Object },
        loading: { type: Boolean },
        userNotFound: { type: Boolean }
    };

    constructor() {
        super();
        this.userId = '';
        this.userData = {};
        this.loading = true;
        this.userNotFound = false;
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
            const response = await customFetch(`/users/public/${this.userId}`, {}, false);
            if(response?.success) {
                this.userData = response.data;
                this.userNotFound = false;
            } else {
                this.userNotFound = true;
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
        return css`
            :host {
                
            }
            .account-container {
                display: grid;
                gap: var(--spacing-normal);
                padding: var(--spacing-normal);
                max-width: 1200px;
                margin: 0 auto;
            }

            @media (min-width: 768px) {
                .account-container {
                    grid-template-columns: 1fr 1fr;
                }
            }

            section {
                padding: 1rem;
                box-shadow: var(--shadow-1-soft);
                border-radius: var(--border-radius-large);
                background: var(--background-light);
                position: relative;
            }

            .not-found-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: var(--spacing-large);
                text-align: center;
                min-height: 300px;
            }

            .not-found-message {
                font-size: var(--font-size-large);
                color: var(--text-color-medium-dark);
                margin-bottom: var(--spacing-normal);
            }

            .not-found-subtitle {
                font-size: var(--font-size-medium);
                color: var(--text-color-light);
            }
        `;
    }

    render() {
        if (this.loading) {
            return html`<loading-screen></loading-screen>`;
        }

        if (this.userNotFound) {
            return html`
                <div class="not-found-container">
                    <h2 class="not-found-message">Public User Not Found</h2>
                    <p class="not-found-subtitle">This user does not exist or their profile is not public.</p>
                </div>
            `;
        }

        return html`
            <main class="account-container">
                <section>
                    <user-details .userData="${this.userData}" .isUser="${false}"></user-details>
                </section>

                <section>
                    <user-lists .userId="${this.userId}" .isUser="${false}" .publicOnly="${true}"></user-lists>
                </section>
            </main>
        `;
    }
}

customElements.define('public-user-view', PublicUserView);
