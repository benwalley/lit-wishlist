import {LitElement, html, css} from 'lit';

export class AccountComments extends LitElement {
    static styles = css`
    :host {
      display: block;
    }
  `;

    render() {
        // Replace this with real comments data
        return html`
      <h2>Comments</h2>
      <ul>
        <li>Sample comment #1</li>
        <li>Sample comment #2</li>
      </ul>
    `;
    }
}

customElements.define('account-comments', AccountComments);
