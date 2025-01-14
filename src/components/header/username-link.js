import {LitElement, html, css} from 'lit';
import '../global/custom-tooltip.js'
import {observeState} from 'lit-element-state';
import {userState} from "../../state/userStore.js";

export class UsernameLink extends observeState(LitElement) {
    static properties = {
    };

    constructor() {
        super();
    }

    static styles = css`
        :host {
            text-align: center;
            display: flex;
            align-items: center;
        }
        
        a {
            display: block;
            color: var(--header-text-color);
            font-size: 2rem;
            font-family: var(--heading-font-family, 'lato');
            text-decoration: none;
            font-weight: bold;
            margin: 0 auto;
        }
    `;

    render() {
        return userState?.userData?.name ?
            html`
                <a class="name" href="/account">${userState?.userData?.name || 'Name not found'}</a>

                <custom-tooltip>
                    Go to your account page
                </custom-tooltip>
            ` :
            html`
                <a href="/" class="name">Guest</a>
                <custom-tooltip>
                    Create an account for more functionality
                </custom-tooltip>
        `;
    }
}
customElements.define('username-link', UsernameLink);
