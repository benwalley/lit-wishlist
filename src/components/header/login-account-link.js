import {LitElement, html, css} from 'lit';
import {observeState} from 'lit-element-state';
import {userState} from "../../state/userStore.js";
import {globalState} from "../../state/globalStore.js";
import buttonStyles from "../../css/buttons.js";
import '../global/custom-tooltip.js'
import '../loading/skeleton-loader.js';
import '../pages/account/avatar.js';


export class LoginAccountLink extends observeState(LitElement) {
    constructor() {
        super();
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    max-width: 200px;
                    
                }
                .name {
                    display: grid;
                    grid-template-columns: 32px 1fr;
                    gap: var(--spacing-small);
                    text-decoration: none;
                    color: var(--text-color-dark);
                    line-height: 1;
                    padding: var(--spacing-x-small);
                    transition: var(--transition-normal);
                    
                    &:hover {
                        background: var(--purple-light);
                        border-radius: var(--border-radius-normal);
                    }
                }
                
                
                .name-text {
                    font-weight: bold;
                    font-size: var(--font-size-small);
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    max-width: 120px;

                }
                
                .name-subtitle {
                    font-size: var(--font-size-x-small);
                }
                
                .right-side {
                    display: none;
                    flex-direction: column;
                    gap: var(--spacing-x-small);
                }

                @media only screen and (min-width: 400px) {
                    .right-side {
                        display: flex;
                        justify-content: center;

                    }
                }
            `
        ];
    }

    render() {
        if (userState.loadingUser) {
            return html`<skeleton-loader width="100" height="20"></skeleton-loader>`;
        }
        if (userState.userData) {
           return html`
            <a class="name" href="/account">
                <custom-avatar 
                        .username="${userState?.userData?.name}"
                        imageId="${userState?.userData?.image}"
                        size="32"
                        shadow
                ></custom-avatar>
                <div class="right-side">
                    <span class="name-text">${userState?.userData?.name || 'Name not found'}</span>
                    
                </div>
                
            </a>
            <custom-tooltip>
                Go to your account page
            </custom-tooltip>
            `
        }
        return html`
            <a href="${globalState.landingPage}" class="button secondary">Log In</a>
            <custom-tooltip>
                Create an account for more functionality
            </custom-tooltip>
        `;
    }
}

// Register the custom element
customElements.define('login-account-link', LoginAccountLink);
