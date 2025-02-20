import {LitElement, html, css} from 'lit';
import '../global/custom-tooltip.js'
import './login-account-link.js'
import './notifications.js'
import './dark-mode-toggle.js'
import '../../svg/hamburger.js'
import buttonStyles from '../../css/buttons.js'
import {observeState} from 'lit-element-state';
import {globalState} from "../../state/globalStore.js";

export class HeaderContainer extends observeState(LitElement) {
    static properties = {

    };

    constructor() {
        super();
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    grid-column: 2;
                    position: sticky;
                    top: 0;
                }
                header {
                    padding: 10px;
                    display: flex;
                    background: var(--header-background);
                    color: var(--header-text-color);
                    align-items: center;
                    gap: 8px;
                    border-bottom: 1px solid var(--border-color);
                    justify-content: flex-end;
                    box-shadow: var(--shadow-1-soft);
                }

                .divider {
                    width: 1px;
                    background: var(--border-color);
                    height: var(--font-size-large);
                }
                
                .mobile-sidebar-toggle {
                    display: flex;
                    margin-right: auto;
                    font-size: var(--font-size-large);
                }
                
                @media (min-width: 768px) {
                    :host {
                        position: relative;
                    }
                    header {
                        gap: 16px;
                    }
                    .mobile-sidebar-toggle {
                        display: none
                    }
                }
            `
        ];
    }

    _handleToggleMobile() {
        console.log(globalState.menuExpanded)
        globalState.menuExpanded = !globalState.menuExpanded;
    }

    render() {
        return html`
            <header class="header">
                <button @click="${this._handleToggleMobile}" class="mobile-sidebar-toggle button icon-button">
                    <hamburger-icon></hamburger-icon>
                </button>
                <dark-mode-toggle></dark-mode-toggle>
                <notifications-element></notifications-element>
                <div class="divider"></div>
                <login-account-link></login-account-link>

            </header>
        `;
    }
}

customElements.define('header-container', HeaderContainer);
