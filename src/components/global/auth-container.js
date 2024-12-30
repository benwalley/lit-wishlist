import { LitElement, html, css } from 'lit';
import { observeState } from 'lit-element-state';
import { userState } from '../../state/userStore.js';
import './loading-screen.js';
import {initRouter} from "../../router/main-router.js";
import {getCurrentUser} from "../../helpers/api/users.js";

export class AuthContainer extends observeState(LitElement) {
    static styles = css`
    :host {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        overflow-x: hidden;
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
        } catch(e) {
            console.log('user is not logged in')
            userState.loadingUser = false;
        }

    }

    render() {
        return html`
            ${userState.loadingUser
                    ? html`<loading-screen></loading-screen>`
                    : html`<slot></slot>`
            }
        `;
    }
}

customElements.define('auth-container', AuthContainer);
