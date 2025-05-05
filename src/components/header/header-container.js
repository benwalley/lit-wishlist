import {LitElement, html, css} from 'lit';
import '../global/custom-tooltip.js'
import './login-account-link.js'
import './notifications.js'
import './dark-mode-toggle.js'
import '../../svg/hamburger.js'
import '../../svg/arrow-long-left.js'
import buttonStyles from '../../css/buttons.js'
import {observeState} from 'lit-element-state';
import {globalState} from "../../state/globalStore.js";

export class HeaderContainer extends observeState(LitElement) {
    static properties = {
        showBackButton: { type: Boolean }
    };

    constructor() {
        super();
        this.showBackButton = true;
    }

    goBack() {
        window.history.back();
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    grid-column: 2;
                    position: sticky;
                    top: 0;
                    z-index: 10;
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
                    margin-right: 16px;
                    font-size: var(--font-size-large);
                }
                
                .back-button {
                    display: flex;
                    font-size: var(--font-size-large);
                    margin-right: auto;
                }
                
                .back-button:hover {
                    color: var(--primary-color);
                }
                
                .header-left {
                    display: flex;
                    align-items: center;
                    margin-right: auto;
                }
                
                @media (min-width: 768px) {
                    :host {
                        position: relative;
                    }
                    header {
                        gap: 16px;
                    }
                    .mobile-sidebar-toggle {
                        display: none;
                    }
                    .back-button {
                        margin-right: 0;
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
                <div class="header-left">
                    <button @click="${this._handleToggleMobile}" class="mobile-sidebar-toggle button icon-button">
                        <hamburger-icon></hamburger-icon>
                    </button>
                    ${this.showBackButton ? html`
                        <button @click="${this.goBack}" 
                            class="back-button button icon-button" 
                            title="Go back"
                                style="--icon-color: var(--blue-normal); 
                                --icon-color-hover: var(--blue-darker); 
                                --icon-hover-background: var(--blue-light)"
                        >
                            <arrow-long-left-icon></arrow-long-left-icon>
                        </button>
                    ` : ''}
                </div>
                <dark-mode-toggle></dark-mode-toggle>
                <notifications-element></notifications-element>
                <div class="divider"></div>
                <login-account-link></login-account-link>
            </header>
        `;
    }
}

customElements.define('header-container', HeaderContainer);
