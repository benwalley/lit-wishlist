import {LitElement, html, css} from 'lit';
import '../../global/custom-input.js';
import buttonStyles from '../../../css/buttons.js'
import { messagesState } from "../../../state/messagesStore.js"
import {customFetch} from "../../../helpers/fetchHelpers.js";

export class ForgotPasswordForm extends LitElement {
    static get properties() {
        return {
            isSubmitting: { type: Boolean }
        };
    }

    constructor() {
        super();
        this.isSubmitting = false;
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

                button:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .back-to-login {
                    background: none;
                    border: none;
                    color: var(--text-color-dark);
                    cursor: pointer;
                    text-decoration: underline;
                    font-size: var(--font-size-small);
                    align-self: flex-start;
                }

                .back-to-login:hover {
                    color: var(--primary-color);
                }
            `
        ];
    }

    render() {
        return html`
            <form @submit=${this._handleSubmit}>
                <custom-input 
                    id="email" 
                    type="email" 
                    placeholder="Enter your email" 
                    required 
                    label="Email"
                    ?disabled=${this.isSubmitting}>
                </custom-input>
                
                <button 
                    type="submit" 
                    class="full-width secondary button"
                    ?disabled=${this.isSubmitting}>
                    ${this.isSubmitting ? 'Sending...' : 'Reset Password'}
                </button>
            </form>
        `;
    }

    _backToLogin() {
        this.dispatchEvent(new CustomEvent('back-to-login', {
            bubbles: true,
            composed: true
        }));
    }

    async _handleSubmit(event) {
        event.preventDefault();

        if (this.isSubmitting) return;

        const emailInput = this.shadowRoot.querySelector('#email');
        const email = emailInput?.value;

        if (!email) {
            messagesState.addMessage('Please enter your email address.', 'error', 5000);
            return;
        }

        this.isSubmitting = true;

        try {
            const data = await customFetch('/auth/passwordReset/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });


            if (data.success) {
                messagesState.addMessage('Password reset email sent. Please check your inbox.', 'success', 5000);
                emailInput.value = '';

            } else {
                const errorMessage = data.message || 'Failed to send password reset email. Please try again.';
                messagesState.addMessage(errorMessage, 'error', 5000);

                // Dispatch standardized error event
                this.dispatchEvent(new CustomEvent('auth-error', {
                    bubbles: true,
                    composed: true,
                    detail: {
                        type: 'password-reset',
                        message: errorMessage,
                        data
                    }
                }));
            }
        } catch (error) {
            const errorMessage = 'An error occurred. Please try again.';
            messagesState.addMessage(errorMessage, 'error', 5000);

            // Dispatch standardized error event
            this.dispatchEvent(new CustomEvent('auth-error', {
                bubbles: true,
                composed: true,
                detail: {
                    type: 'password-reset',
                    message: errorMessage,
                    error
                }
            }));
        } finally {
            this.isSubmitting = false;
        }
    }
}

customElements.define('forgot-password-form', ForgotPasswordForm);
