import { LitElement, html, css } from 'lit';
import './login-form.js';
import './create-account-form.js';
import './forgot-password-form.js';
import '../../global/floating-box.js'


export class TabbedSection extends LitElement {
    static styles = css`
    :host {
      display: block;
      margin-top: var(--spacing-normal);
    }
    button {
        background: none;
        border: none;
        color: var(--primary-color);
        margin-left: auto;
        display: block;
        margin-top: 20px;
        font-size: var(--font-size-normal);
        cursor: pointer;
    }
  `;

    static properties = {
        activeTab: { type: String },
    };

    constructor() {
        super();
        this.activeTab = 'login';
        this.addEventListener('show-forgot-password', this._showForgotPassword);
        this.addEventListener('back-to-login', this._showLogin);
        this.addEventListener('password-reset-sent', this._showLogin);
    }

    render() {
        return html`
          <div class="content">
            ${this.activeTab === 'login'
                ? html`<login-form></login-form>`
                : this.activeTab === 'create'
                ? html`<create-account-form></create-account-form>`
                : html`<forgot-password-form></forgot-password-form>`}
          </div>
          ${this.activeTab !== 'forgot-password' ? html`
            <button
                    @click=${() => this._setActiveTab(this.activeTab === 'login' ? 'create' : 'login')}
            >
                ${this.activeTab === 'login' ? 'Create An Account' : 'Log In'}
            </button>
          ` : ''}
    `;
    }

    _setActiveTab(tab) {
        this.activeTab = tab;
    }

    _showForgotPassword() {
        this.activeTab = 'forgot-password';
    }

    _showLogin() {
        this.activeTab = 'login';
    }
}

customElements.define('login-account-tabs', TabbedSection);
