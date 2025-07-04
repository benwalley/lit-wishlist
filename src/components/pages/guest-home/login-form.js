import {LitElement, html, css} from 'lit';
import '../../global/custom-input.js';
import buttonStyles from '../../../css/buttons.js'
import {login} from "../../../helpers/api/users.js";
import { messagesState } from "../../../state/messagesStore.js"
import {navigate} from "../../../router/main-router.js";
import {userState} from "../../../state/userStore.js";
import {setJwt, setRefreshToken} from "../../../localStorage/tokens.js";
import {triggerUpdateUser} from "../../../events/eventListeners.js";


export class LoginForm extends LitElement {
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
            `
        ];
    }

    render() {
        return html`
            <form @submit=${this._handleSubmit}>
                <custom-input id="email" type="email" placeholder="Email" required label="Email"></custom-input>
                <custom-input id="password" type="password" placeholder="Password" required
                              label="Password"></custom-input>
                <button type="submit" class="full-width secondary button">Login</button>
            </form>
        `;
    }

    async _handleSubmit(event) {
        event.preventDefault();
        const emailInput = this.shadowRoot.querySelector('#email');
        const passwordInput = this.shadowRoot.querySelector('#password');
        const email = emailInput?.value;
        const password = passwordInput?.value;
        const userData = await login(email, password);
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
