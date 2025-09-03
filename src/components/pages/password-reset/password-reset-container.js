import {LitElement, html, css} from 'lit';
import '../../global/custom-input.js';
import buttonStyles from '../../../css/buttons.js';
import { messagesState } from "../../../state/messagesStore.js";
import {customFetch} from "../../../helpers/fetchHelpers.js";
import {navigate} from "../../../router/main-router.js";

export class PasswordResetContainer extends LitElement {
    static get properties() {
        return {
            token: { type: String },
            isSubmitting: { type: Boolean },
            isValidatingToken: { type: Boolean },
            tokenValid: { type: Boolean },
            userInfo: { type: Object }
        };
    }

    constructor() {
        super();
        this.token = '';
        this.isSubmitting = false;
        this.isValidatingToken = false;
        this.tokenValid = false;
        this.userInfo = null;
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    display: block;
                    font-family: var(--font-family, Arial, sans-serif);
                    min-height: 100vh;
                    background: var(--background-color);
                }

                .container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    padding: var(--spacing-normal);
                }

                .form-container {
                    background: var(--background-light);
                    padding: var(--spacing-large);
                    border-radius: var(--border-radius-normal);
                    box-shadow: var(--shadow-2-soft);
                    width: 100%;
                    max-width: 400px;
                }

                h1 {
                    margin: 0 0 var(--spacing-normal) 0;
                    font-size: var(--font-size-x-large);
                    font-weight: 700;
                    color: var(--text-color-dark);
                    text-align: center;
                }

                .user-info {
                    text-align: center;
                    margin-bottom: var(--spacing-normal);
                    padding: var(--spacing-normal);
                    background: var(--background-color-light);
                    border-radius: var(--border-radius);
                }

                .user-info p {
                    margin: 0;
                    color: var(--text-color-medium-dark);
                }

                .user-name {
                    font-weight: 600;
                    color: var(--text-color-dark);
                }

                form {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-normal);
                }

                .error-message {
                    text-align: center;
                    color: var(--error-color);
                    padding: var(--spacing-normal);
                    background: var(--error-light);
                    border-radius: var(--border-radius);
                    border: 1px solid var(--error-color);
                }

                .loading {
                    text-align: center;
                    padding: var(--spacing-large);
                    color: var(--text-color-medium-dark);
                }

                .back-link {
                    text-align: center;
                    margin-top: var(--spacing-normal);
                }

                .back-link button {
                    background: none;
                    border: none;
                    color: var(--primary-color);
                    cursor: pointer;
                    text-decoration: underline;
                    font-size: var(--font-size-normal);
                }

                .back-link button:hover {
                    color: var(--primary-color);
                    opacity: 0.8;
                }

                button:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .password-requirements {
                    font-size: var(--font-size-small);
                    color: var(--text-color-medium-dark);
                    margin-top: var(--spacing-x-small);
                }
            `
        ];
    }

    connectedCallback() {
        super.connectedCallback();
        this._extractTokenFromURL();
        if (this.token) {
            this._validateToken();
        }
    }

    _extractTokenFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        this.token = urlParams.get('token') || '';
    }

    async _validateToken() {
        if (!this.token) {
            this.tokenValid = false;
            return;
        }

        this.isValidatingToken = true;

        try {
            const data = await customFetch(`/auth/passwordReset/validate/${this.token}`);

            if (data.success) {
                this.tokenValid = true;
                this.userInfo = data.data;
            } else {
                this.tokenValid = false;
                messagesState.addMessage(data.message || 'Invalid or expired reset token.', 'error', 5000);
            }
        } catch (error) {
            this.tokenValid = false;
            messagesState.addMessage('Error validating reset token.', 'error', 5000);
        } finally {
            this.isValidatingToken = false;
        }
    }

    async _handleSubmit(event) {
        event.preventDefault();

        if (this.isSubmitting) return;

        const passwordInput = this.shadowRoot.querySelector('#password');
        const confirmPasswordInput = this.shadowRoot.querySelector('#confirmPassword');

        const password = passwordInput?.value;
        const confirmPassword = confirmPasswordInput?.value;

        if (!password) {
            messagesState.addMessage('Please enter a new password.', 'error', 5000);
            return;
        }

        if (password !== confirmPassword) {
            messagesState.addMessage('Passwords do not match.', 'error', 5000);
            return;
        }

        this.isSubmitting = true;

        try {
            const data = await customFetch('/auth/passwordReset/reset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: this.token,
                    newPassword: password
                })
            });

            if (data.success) {
                messagesState.addMessage('Password reset successfully! You can now log in with your new password.', 'success', 8000);
                navigate('/');
            } else {
                messagesState.addMessage(data.message || 'Failed to reset password. Please try again.', 'error', 5000);
            }
        } catch (error) {
            messagesState.addMessage('An error occurred. Please try again.', 'error', 5000);
        } finally {
            this.isSubmitting = false;
        }
    }

    _goToLogin() {
        navigate('/');
    }

    render() {
        if (!this.token) {
            return html`
                <div class="container">
                    <div class="form-container">
                        <h1>Invalid Reset Link</h1>
                        <div class="error-message">
                            <p>This password reset link is invalid or missing a token.</p>
                            <p>Please request a new password reset from the login page.</p>
                        </div>
                    </div>
                </div>
            `;
        }

        if (this.isValidatingToken) {
            return html`
                <div class="container">
                    <div class="form-container">
                        <div class="loading">
                            Validating reset token...
                        </div>
                    </div>
                </div>
            `;
        }

        if (!this.tokenValid) {
            return html`
                <div class="container">
                    <div class="form-container">
                        <h1>Invalid Reset Link</h1>
                        <div class="error-message">
                            <p>This password reset link is invalid or has expired.</p>
                            <p>Reset tokens expire after 15 minutes for security reasons.</p>
                            <p>Please request a new password reset from the login page.</p>
                        </div>
                    </div>
                </div>
            `;
        }

        return html`
            <div class="container">
                <div class="form-container">
                    <h1>Reset Password</h1>
                    
                    ${this.userInfo ? html`
                        <div class="user-info">
                            <p>Resetting password for:</p>
                            <p class="user-name">${this.userInfo.name || this.userInfo.email}</p>
                        </div>
                    ` : ''}

                    <form @submit=${this._handleSubmit}>
                        <custom-input 
                            id="password" 
                            type="password" 
                            placeholder="Enter new password" 
                            required 
                            label="New Password"
                            ?disabled=${this.isSubmitting}>
                        </custom-input>

                        <custom-input 
                            id="confirmPassword" 
                            type="password" 
                            placeholder="Confirm new password" 
                            required 
                            label="Confirm Password"
                            ?disabled=${this.isSubmitting}>
                        </custom-input>
                        
                        <button 
                            type="submit" 
                            class="full-width primary button"
                            ?disabled=${this.isSubmitting}>
                            ${this.isSubmitting ? 'Resetting Password...' : 'Reset Password'}
                        </button>
                    </form>
                </div>
            </div>
        `;
    }
}

customElements.define('password-reset-container', PasswordResetContainer);
