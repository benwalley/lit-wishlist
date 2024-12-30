import {LitElement, html, css} from 'lit';

export class AccountNotifications extends LitElement {
    static styles = css`
    :host {
      display: block;
    }
  `;

    render() {
        // Replace with real notification logic
        return html`
      <h2>Notifications</h2>
      <ul>
        <li>No new notifications.</li>
      </ul>
    `;
    }
}

customElements.define('account-notifications', AccountNotifications);
