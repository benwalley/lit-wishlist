import { LitElement, html, css } from 'lit';
import './login-form.js';
import './create-account-form.js';
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
    }

    render() {
        return html`
          <div class="content">
            ${this.activeTab === 'login'
                ? html`<login-form></login-form>`
                : html`<create-account-form></create-account-form>`}
          </div>
          <button
                  @click=${() => this._setActiveTab(this.activeTab === 'login' ? 'create' : 'login')}
          >
              ${this.activeTab === 'login' ? 'Create An Account' : 'Log In'}
          </button>
    `;
    }

    _setActiveTab(tab) {
        this.activeTab = tab;
    }
}

customElements.define('login-account-tabs', TabbedSection);
