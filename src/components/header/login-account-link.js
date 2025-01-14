import {LitElement, html, css} from 'lit';
import {observeState} from 'lit-element-state';
import {userState} from "../../state/userStore.js";
import buttonStyles from "../../css/buttons.js";

export class LoginAccountLink extends observeState(LitElement) {
    constructor() {
        super();
    }

    static get styles() {
        return [
            buttonStyles,
        ];
    }

    render() {
        if (userState.loadingUser) {
            return html`<div>Loading...</div>`;
        }
        if (userState.userData) {
            return html`<a href="/account" class="button secondary">Account</a>`;
        }
        return html`<a href="/" class="button secondary">Log In</a>`;
    }
}

// Register the custom element
customElements.define('login-account-link', LoginAccountLink);
