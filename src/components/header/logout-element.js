import {LitElement, html, css} from 'lit';
import {observeState} from 'lit-element-state';
import {userState} from '../../state/userStore.js';
import {globalState} from '../../state/globalStore.js';
import {logout} from '../../helpers/api/users.js';
import {setJwt, setRefreshToken} from '../../localStorage/tokens.js';
import {clearAllStorage} from '../../localStorage/helpers.js';
import {navigate} from '../../router/main-router.js';
import {messagesState} from '../../state/messagesStore.js';
import {invalidateCache} from '../../helpers/caching.js';
import '../../svg/leave.js';
import buttonStyles from '../../css/buttons.js';

export class LogoutElement extends observeState(LitElement) {
    static properties = {
        showText: { type: Boolean }
    };

    constructor() {
        super();
        this.showText = false;
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    display: inline-block;
                }
                
                .logout-button {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: var(--font-size-medium);
                    color: var(--text-color);
                    background: none;
                    border: none;
                    padding: 8px;
                    cursor: pointer;
                    border-radius: var(--border-radius);
                    transition: all 0.2s ease;
                }
                
                .logout-button:hover {
                    color: var(--error-color);
                    background-color: var(--error-background);
                }
                
                .logout-icon {
                    font-size: var(--font-size-large);
                }
            `
        ];
    }

    async handleLogout(e) {
        e.preventDefault();
        const logoutResponse = await logout();
        if(logoutResponse.success) {
            this._handleSuccess();
            return;
        }
        this._handleFailure()
    }

    _handleSuccess() {
        this._frontendLogout()
    }

    _handleFailure() {
        this._frontendLogout()
    }

    _frontendLogout() {
        clearAllStorage();
        userState.userData = undefined;
        userState.myGroups = [];
        userState.subusers = [];
        messagesState.addMessage('Successfully logged out', 'success')
        invalidateCache()
        navigate(globalState.landingPage);
    }

    render() {
        if (!userState.userData) {
            return '';
        }

        return html`
            <button 
                @click="${this.handleLogout}" 
                class="logout-button button icon-button danger-text"
                title="Logout"
            >
                <leave-icon class="logout-icon"></leave-icon>
                ${this.showText ? html`<span>Logout</span>` : ''}
            </button>
            <custom-tooltip>
                Log Out
            </custom-tooltip>
        `;
    }
}

customElements.define('logout-element', LogoutElement);
