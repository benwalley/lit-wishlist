import {LitElement, html, css} from 'lit';
import {observeState} from 'lit-element-state';
import {userState} from '../../state/userStore.js';
import './loading-screen.js';
import {initRouter, navigate} from "../../router/main-router.js";
import {getCurrentUser} from "../../helpers/api/users.js";
import {globalState} from "../../state/globalStore.js";

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
    }

    async fetchUserData() {
        try {
            const userData = await getCurrentUser();
            userState.userData = userData;
            userState.loadingUser = false;
            if (!userData?.id) {
                navigate('/')
            }
        } catch (e) {
            console.log('user is not logged in')
            userState.loadingUser = false;
        }

    }

    render() {
        return html`
            ${userState.loadingUser
                    ? html`
                        <loading-screen></loading-screen>`
                    : html`
                        <slot></slot>`
            }
        `;
    }
}

customElements.define('auth-container', AuthContainer);
