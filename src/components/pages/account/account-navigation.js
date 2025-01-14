import {LitElement, html, css} from 'lit';

export class AccountNavigation extends LitElement {
    static styles = css`
    :host {
      display: block;
    }
    nav a {
      margin-right: 1rem;
      text-decoration: none;
      color: var(--link-color);
    }
  `;

    render() {
        return html`
      <nav>
        <a href="/overview">Overview</a>
        <a href="/settings">Settings</a>
        <a href="/activity">Activity</a>
      </nav>
    `;
    }
}

customElements.define('account-navigation', AccountNavigation);
