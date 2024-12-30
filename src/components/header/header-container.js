import {LitElement, html, css} from 'lit';
import logo from '../../assets/logo.svg'
import '../global/custom-tooltip.js'
import './username-link.js'
import './login-account-link.js'
import './notifications.js'
export class HeaderContainer extends LitElement {
    static properties = {

    };

    constructor() {
        super();
    }

    static styles = css`
        :host {
            
        }
        header {
            padding: 10px;
            display: grid;
            background: var(--header-background);
            grid-template-columns: auto 1fr auto auto;
            color: var(--header-text-color);
            align-items: center;
            gap: 20px;
        }
    `;

    render() {
        return html`
            <header class="header">
                <a href="/">
                    <img src="${logo}" alt="" width="40px">
                </a>
                <custom-tooltip>
                    Go to All Lists page
                </custom-tooltip>
                <username-link></username-link>
                <login-account-link></login-account-link>
                <notifications-element></notifications-element>
                
                

            </header>
        `;
    }
}

customElements.define('header-container', HeaderContainer);
