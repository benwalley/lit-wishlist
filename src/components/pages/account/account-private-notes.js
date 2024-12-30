import {LitElement, html, css} from 'lit';

export class AccountPrivateNotes extends LitElement {
    static styles = css`
    :host {
      display: block;
    }
  `;

    render() {
        // Replace this with a form or table for private notes
        return html`
      <h2>Private Notes</h2>
      <p>Only you can see these notes.</p>
    `;
    }
}

customElements.define('account-private-notes', AccountPrivateNotes);
