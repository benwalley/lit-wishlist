import {LitElement, html, css} from 'lit';
import {observeState} from "lit-element-state";
import {userState} from "../../../state/userStore.js";

export class AccountUsername extends observeState(LitElement) {
    static properties = {
        username: {type: String}
    };

    constructor() {
        super();
        this.username = '';
    }

    static styles = css`
        :host {
            display: flex;
            font-weight: bold;
            font-size: var(--font-size-x-large);
            
            span {
                display: flex;
                line-height: 1;
            }
        }
    `;

    render() {
        const displayUsername = this.username || userState?.userData?.name;
        return html`<span>${displayUsername}</span>`;
    }
}

customElements.define('account-username', AccountUsername);
