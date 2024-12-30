import {LitElement, html, css} from 'lit';

export class AccountLists extends LitElement {
    static styles = css`
    :host {
      display: block;
    }
  `;

    render() {
        // Replace with lists data
        return html`
      <h2>Your Lists</h2>
      <ul>
        <li>My Favorite Projects</li>
        <li>Todos</li>
      </ul>
    `;
    }
}

customElements.define('account-lists', AccountLists);
