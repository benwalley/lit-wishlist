import {LitElement, html, css} from 'lit';
import '../../global/custom-input.js';
import '../../global/custom-toggle.js';
import buttonStyles from '../../../css/buttons.js'
import {login} from "../../../helpers/api/users.js";
import { messagesState } from "../../../state/messagesStore.js"
import {navigate} from "../../../router/main-router.js";
import {userState} from "../../../state/userStore.js";
import {setJwt, setRefreshToken} from "../../../localStorage/tokens.js";
import {triggerUpdateUser} from "../../../events/eventListeners.js";


export class LoginForm extends LitElement {
    static get properties() {
        return {
            loginAsSubuser: { type: Boolean }
        };
    }

    constructor() {
        super();
        this.loginAsSubuser = false;
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                form {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                input {
                    padding: 0.5rem;
                    font-size: 1rem;
                }

                button {
                    padding: 0.5rem;
                    font-size: 1rem;
                    cursor: pointer;
                }

                .subuser-username.hidden {
                    display: none;
                }

                .toggle-container {
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    width: 100%;
                    gap: var(--spacing-small);
                    margin-bottom: -20px;
                }

                .toggle-label {
                    font-size: var(--font-size-small);
                    color: var(--text-color-dark);
                    font-weight: 500;
                }
            `
        ];
    }

    render() {
        return html`
            <form @submit=${this._handleSubmit}>
                <custom-input id="email" type="email" placeholder="Email" required label="Email"></custom-input>

                <div class="toggle-container">
                    <span class="toggle-label">Login as subuser</span>
                    <custom-toggle
                            .checked=${this.loginAsSubuser}
                            @change=${this._handleSubuserToggle}
                    ></custom-toggle>
                </div>
                
                <div class="subuser-username ${this.loginAsSubuser ? '' : 'hidden'}">
                    <custom-input id="username" type="text" placeholder="Username"
                                  label="Username" ?required=${this.loginAsSubuser}></custom-input>
                </div>
                
                <custom-input id="password" type="password" placeholder="Password" required
                              label="Password"></custom-input>
                
                <button type="submit" class="full-width secondary button">Login</button>
            </form>
        `;
    }

    _handleSubuserToggle(event) {
        this.loginAsSubuser = event.detail.checked;
    }

    async _handleSubmit(event) {
        event.preventDefault();
        const emailInput = this.shadowRoot.querySelector('#email');
        const passwordInput = this.shadowRoot.querySelector('#password');
        const usernameInput = this.shadowRoot.querySelector('#username');

        const email = emailInput?.value;
        const password = passwordInput?.value;
        const username = this.loginAsSubuser ? usernameInput?.value : null;

        const userData = await login(email, password, username);
        if(userData?.user?.id) {
            this.handleSuccess(userData)
            return;
        }
            this.handleError(userData);
    }

    handleError(data) {
        messagesState.addMessage(data.message || 'Login failed. Please check your credentials.', 'error', 5000);
    }

    handleSuccess(userData) {
        const id = userData?.user?.id;
        const jwt = userData?.tokens?.jwtToken
        const refreshToken = userData?.tokens?.refreshToken
        if(!id || !jwt || !refreshToken) {
            this.handleError()
            return;
        }
        userState.userData = userData.user;
        userState.loadingUser = false;
        setJwt(jwt)
        setRefreshToken(refreshToken)
        triggerUpdateUser();
        messagesState.addMessage('Successfully logged in.', 'success', 5000);
        navigate(`/account`)
    }
}

customElements.define('login-form', LoginForm);
