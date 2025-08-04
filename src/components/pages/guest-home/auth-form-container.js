import { LitElement, html, css } from 'lit';
import './login-form.js';
import './create-account-form.js';
import './forgot-password-form.js';
import '../../global/floating-box.js'
import buttonStyles from '../../../css/buttons.js';

export class AuthFormContainer extends LitElement {

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    padding: var(--spacing-medium-variable);
                    box-shadow: var(--shadow-5-soft);
                    border-radius: var(--border-radius-large);
                    width: 100%;
                    box-sizing: border-box;
                    max-width: 450px;
                    display: block;
                    background: var(--background-light);
                }
                
                .form-header {
                    text-align: center;
                    
                    h2 {
                        margin: 0;
                    }
                }
                
                .form-content {
                    padding-bottom: var(--spacing-normal);
                }
                
                .form-actions {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-top: var(--spacing-small);
                    border-top: 1px solid var(--border-color);
                }
            `
        ];
    }

    static properties = {
        activeTab: { type: String },
        isLoading: { type: Boolean },
    };

    constructor() {
        super();
        this.activeTab = 'login';
        this.isLoading = false;

        this.addEventListener('password-reset-sent', this._showLogin);
        this.addEventListener('auth-success', this._handleAuthSuccess);
        this.addEventListener('auth-error', this._handleAuthError);
        this.addEventListener('form-switch', this._handleFormSwitch);
    }

    render() {
        const formConfig = this._getFormConfig();

        return html`
            <div class="container">
                <div class="form-header">
                    <h2 class="form-title">${formConfig.title}</h2>
                    <p class="form-description">${formConfig.description}</p>
                </div>
                <div class="form-content">
                    ${formConfig.form}
                </div>
                
                <div class="form-actions">
                    ${formConfig.actions}
                </div>
            </div>
        `;
    }

    _getFormConfig() {
        const configs = {
            login: {
                title: 'Sign in',
                description: 'Welcome back! Please sign in to your account.',
                form: html`<login-form></login-form>`,
                actions: html`
                    <button class="link-button blue-text" @click="${() => this._setActiveTab('forgot-password')}">Forgot password</button>
                    <button class="link-button blue-text" @click="${() => this._setActiveTab('create')}">Create account</button>`
            },
            create: {
                title: 'Sign up',
                description: 'Join us! Create an account to start enjoying our services.',
                form: html`<create-account-form></create-account-form>`,
                actions: html`
                    <button class="link-button blue-text" @click="${() => this._setActiveTab('forgot-password')}">Forgot password</button>
                    <button class="link-button blue-text" @click="${() => this._setActiveTab('login')}">Sign in</button>`
            },
            'forgot-password': {
                title: 'Reset Password',
                description: 'Enter your email to receive a password reset link.',
                form: html`<forgot-password-form></forgot-password-form>`,
                actions: html`
                    <button class="link-button blue-text" @click="${() => this._setActiveTab('create')}">Create account</button>
                    <button class="link-button blue-text" @click="${() => this._setActiveTab('login')}">Sign in</button>`
            }
        };

        return configs[this.activeTab] || configs.login;
    }

    _setActiveTab(tab) {
        if (this.activeTab === tab) return;

        this.isLoading = true;

        // Brief delay for smooth transition
        setTimeout(() => {
            this.activeTab = tab;
            this.isLoading = false;
        }, 100);
    }

    _handleFormSwitch(event) {
        const { targetForm } = event.detail;
        if (targetForm) {
            this._setActiveTab(targetForm);
        }
    }
}

customElements.define('auth-form-container', AuthFormContainer);
