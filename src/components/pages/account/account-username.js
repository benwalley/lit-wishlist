import {LitElement, html, css} from 'lit';
import {observeState} from "lit-element-state";
import {userState} from "../../../state/userStore.js";

export class AccountUsername extends observeState(LitElement) {
    static styles = css`
        :host {
            display: inline-block;
            font-weight: bold;
            font-size: var(--font-size-x-large);
        }
    `;

    render() {
        return html`<span>${userState?.userData?.name}</span>`;
    }
}

customElements.define('account-username', AccountUsername);
