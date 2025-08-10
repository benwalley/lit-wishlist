import {LitElement, html, css} from 'lit';
import '../global/custom-tooltip.js'
import './login-account-link.js'
import '../notifications/notifications.js'
import './logout-element.js'
import './switch-user-element.js'
import './dark-mode-toggle.js'
import '../../svg/hamburger.js'
import '../../svg/arrow-long-left.js'
import buttonStyles from '../../css/buttons.js'
import {observeState} from 'lit-element-state';
import {globalState} from "../../state/globalStore.js";
import {userState} from "../../state/userStore.js";

export class HeaderContainer extends observeState(LitElement) {
    static properties = {
        showBackButton: {type: Boolean}
    };

    constructor() {
        super();
        this.showBackButton = true;
    }

    goBack() {
        window.history.back();
    }

    loggedIn() {
        return !!userState.userData;
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    position: sticky;
                    top: 0;
                    z-index: 1;
                }

                /* When parent has authenticated class (sidebar visible), header is in column 2 */

                :host-context(.authenticated) {
                    grid-column: 2;
                }

                /* When parent has unauthenticated class (no sidebar), header spans full width */

                :host-context(.unauthenticated) {
                    grid-column: 1;
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
                    box-shadow: var(--shadow-2-soft);
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
                    font-size: var(--font-size-large);
                    margin-right: auto;
                    display: none;
                }

                .back-button:hover {
                    color: var(--primary-color);
                }

                .header-left {
                    align-items: center;
                    margin-right: auto;
                    display: flex;
                }

                @media (min-width: 1200px) {
                    :host {
                        position: relative;
                    }

                    .header-left .back-button {
                        display: flex;
                    }

                    header {
                        gap: 10px;
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
                ${this.loggedIn() ? html`
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
                    </div>` : html`
                    ${this.showBackButton ? html`
                        <div class="header-left">
                            <button @click="${this.goBack}"
                                    class="back-button button icon-button"
                                    title="Go back"
                                    style="--icon-color: var(--blue-normal); 
                                    --icon-color-hover: var(--blue-darker); 
                                    --icon-hover-background: var(--blue-light)"
                            >
                                <arrow-long-left-icon></arrow-long-left-icon>
                            </button>
                        </div>
                    ` : ''}
                `}
                <dark-mode-toggle></dark-mode-toggle>
                ${this.loggedIn() ? html`
                    <notifications-element></notifications-element>` : ''}
                <logout-element></logout-element>
                ${this.loggedIn() ? html`
                    <switch-user-element></switch-user-element>` : ''}
                <div class="divider"></div>
                <login-account-link></login-account-link>
            </header>
        `;
    }
}

customElements.define('header-container', HeaderContainer);
