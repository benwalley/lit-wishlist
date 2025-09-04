import { LitElement, html, css } from 'lit';
import '../../global/custom-input.js';
import buttonStyles from '../../../css/buttons.js';
import {customFetch} from "../../../helpers/fetchHelpers.js";
import {userState} from "../../../state/userStore.js";
import {setJwt, setRefreshToken} from "../../../localStorage/tokens.js";
import {messagesState} from "../../../state/messagesStore.js";
import {navigate} from "../../../router/main-router.js";
import {triggerUpdateUser} from "../../../events/eventListeners.js";

export class CreateAccountForm extends LitElement {
    static get properties() {
        return {
            name: { type: String },
            email: { type: String },
            password: { type: String },
            confirmPassword: { type: String },
        };
    }

    constructor() {
        super();
        this.name = '';
        this.email = '';
        this.password = '';
        this.confirmPassword = '';
    }

    static get styles() {
        return [
            buttonStyles,
            css`
        :host {
          /* host styles if needed */
        }
        form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        input {
          padding: 0.5rem;
          font-size: 1rem;
        }
      `,
        ];
    }

    render() {
        return html`
      <form @submit=${this._handleSubmit}>
        <custom-input
          type="text"
          placeholder="Name"
          required
          label="Name"
          @value-changed=${this._handleNameChange}
        ></custom-input>

        <custom-input
          type="email"
          placeholder="Email"
          required
          label="Email"
          @value-changed=${this._handleEmailChange}
        ></custom-input>

        <custom-input
          type="password"
          placeholder="Password"
          required
          label="Password"
          @value-changed=${this._handlePasswordChange}
        ></custom-input>

        <custom-input
          type="password"
          placeholder="Confirm Password"
          required
          label="Confirm Password"
          @value-changed=${this._handleConfirmPasswordChange}
        ></custom-input>

        <button class="button full-width primary" type="submit">
          Create Account
        </button>
      </form>
    `;
    }

    _handleNameChange(e) {
        this.name = e.detail.value;
    }

    _handleEmailChange(e) {
        this.email = e.detail.value;
    }

    _handlePasswordChange(e) {
        this.password = e.detail.value;
    }

    _handleConfirmPasswordChange(e) {
        this.confirmPassword = e.detail.value;
    }

    async _handleSubmit(event) {
        event.preventDefault();

        const data = {
            username: this.name,
            email: this.email,
            password: this.password,
        };
        // Use the captured form field values
        try {
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            };

            const userData = await customFetch('/auth/create', options, false);

            if (userData?.success && userData?.user?.id) {
                this.handleSuccess(userData);
            } else {
                this.handleError(userData);
            }

            return userData;
        } catch(e) {
            this.handleError({ message: 'Network error occurred. Please try again.' });
            return {error: e}
        }
    }

    handleSuccess(userData) {
        const id = userData?.user?.id;
        const jwt = userData?.jwtToken
        const refreshToken = userData?.refreshToken
        if(!id || !jwt || !refreshToken) {
            this.handleError({ message: 'Invalid response from server.' });
            return;
        }
        userState.userData = userData.user;
        userState.loadingUser = false;
        setJwt(jwt)
        setRefreshToken(refreshToken)
        triggerUpdateUser();
        messagesState.addMessage('Account created successfully!', 'success', 5000);

        navigate(`/account`)
    }

    handleError(data) {
        const errorMessage = data?.message || 'Failed to create account. Please try again.';
        messagesState.addMessage(errorMessage, 'error', 5000);

        // Dispatch standardized error event
        this.dispatchEvent(new CustomEvent('auth-error', {
            bubbles: true,
            composed: true,
            detail: {
                type: 'create-account',
                message: errorMessage,
                data
            }
        }));
    }
}

customElements.define('create-account-form', CreateAccountForm);
