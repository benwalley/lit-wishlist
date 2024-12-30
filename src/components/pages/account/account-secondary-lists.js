import {LitElement, html, css} from 'lit';

export class AccountSecondaryLists extends LitElement {
    static styles = css`
    :host {
      display: block;
    }
  `;

    render() {
        // Replace with real data for lists where you are a secondary admin
        return html`
      <h2>Lists you are a Secondary Admin of</h2>
      <ul>
        <li>Team Project Tracker</li>
        <li>Shared Resources</li>
      </ul>
    `;
    }
}

customElements.define('account-secondary-lists', AccountSecondaryLists);
