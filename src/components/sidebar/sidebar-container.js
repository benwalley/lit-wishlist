import {LitElement, html, css} from 'lit';
import buttonStyles from "../../css/buttons";
import logo from '../../assets/logo.svg';
import {observeState} from 'lit-element-state';
import {globalState} from "../../state/globalStore.js";
import '../../svg/x.js'

export class CustomElement extends observeState(LitElement) {
    static properties = {
        value: { type: String },
    };

    constructor() {
        super();
        this.value = '';
    }

    // Closes the menu if user clicks on the overlay
    _closeMenu() {
        globalState.menuExpanded = false;
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    grid-column: 1;
                    grid-row: 1 / span 2;
                    height: 100vh;
                    display: flex;
                    position: sticky;
                    top: 0;
                }

                nav {
                    display: flex;
                    flex-grow: 1;
                    flex-direction: column;
                }

                .navigation-section {
                    display: flex;
                    height: 100%;
                    box-sizing: border-box;
                    border-right: 1px solid var(--border-color);
                    padding: var(--spacing-normal);
                    background: var(--header-background);
                    max-width: 300px;
                    flex-direction: column;
                    transition: var(--transition-normal);
                    /* Put the sidebar above the overlay */
                    z-index: 1001;
                }
                
                .menu-section-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .menu-item-link {
                    padding: 12px 16px;
                    display: block;
                    color: var(--text-color-dark);
                    text-decoration: none;
                }

                .menu-section-heading {
                    font-size: var(--font-size-x-small);
                    text-transform: uppercase;
                    color: var(--medium-text-color);
                    padding: 12px 16px;
                }

                .settings-section-container {
                    margin-top: auto;
                    border-top: 1px solid var(--border-color);
                    padding: 16px 0;
                    
                    ul {
                        margin: 0;
                        list-style: none;
                        padding: 0;
                        display: flex;
                        flex-direction: column;
                        gap: var(--spacing-small)
                    }
                    
                }

                /* ================================================
                   OVERLAY STYLES
                   ================================================ */
                .overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background-color: rgba(0, 0, 0, 0.4);
                    z-index: 1000;

                    /* This allows us to animate the fade in/out using opacity. */
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.3s ease;
                }
                
                .close-button {
                    display: none;
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    font-size: var(--font-size-large);
                }

                /* On mobile, slide the nav from the left, show/hide overlay */
                @media (max-width: 767px) {
                    :host {
                        position: absolute;
                    }
                    
                    .close-button {
                        display: block;
                    }
                    
                    .navigation-section {
                        position: fixed;
                        top: 0;
                        bottom: 0;
                        left: -100%; /* Hidden off-screen by default */
                        width: 300px;
                        transition: left 0.3s ease; /* for the sliding nav */
                    }

                    /* Show sidebar when expanded */
                    .navigation-section.expanded {
                        left: 0;
                        bottom: 0;
                        top: 0;
                        right: 0;
                    }

                    /* Show overlay (fade it in) only on mobile with expanded menu */
                    .overlay.expanded {
                        opacity: 1;
                        pointer-events: auto;
                    }
                }
            `
        ];
    }

    render() {
        return html`
            <aside
                    class="navigation-section ${globalState.menuExpanded ? 'expanded' : 'collapsed'}"
                    aria-label="Main Menu"
            >
                <button @click="${this._closeMenu}" class="button icon-button close-button">
                    <x-icon></x-icon>
                </button>
                <a href="/">
                    <img src="${logo}" alt="Logo" width="40px">
                </a>
                <nav>
                    <h2 class="menu-section-heading">Main Menu</h2>
                    <ul class="menu-section-list">
                        <li><a href="/" class="menu-item-link">Dashboard</a></li>
                        <li><a href="/lists" class="menu-item-link">All Lists</a></li>
                        <li><a href="/gifts-tracking" class="menu-item-link">Gifts Tracking</a></li>
                        <li><a href="#" class="menu-item-link">All Users</a></li>
                        <li><a href="#" class="menu-item-link">Recent</a></li>
                        <li><a href="/qa" class="menu-item-link">Questions & Answers</a></li>
                    </ul>

                    <h2 class="menu-section-heading">Other Links</h2>
                    <ul class="menu-section-list">
                        <li><a href="#" class="menu-item-link">Dashboard</a></li>
                        <li><a href="#" class="menu-item-link">My Lists</a></li>
                        <li><a href="#" class="menu-item-link">Recent</a></li>
                    </ul>

                    <div class="settings-section-container">
                        <ul>
                            <li>
                                <button>Settings</button>
                            </li>
                            <li>
                                <span>For feature suggestions or to report a bug, email</span>
                                <a href="mailto:benwalleyorigami@gmail.com">benwalleyorigami@gmail.com</a>
                            </li>
                        </ul>
                    </div>
                </nav>
            </aside>

            <!-- Overlay element that covers the page when menu is expanded on mobile -->
            <div
                    class="overlay ${globalState.menuExpanded ? 'expanded' : 'collapsed'}"
                    @click="${this._closeMenu}"
            ></div>
        `;
    }
}

customElements.define('sidebar-container', CustomElement);
