import {LitElement, html, css} from 'lit';

export class AccountPublicDescription extends LitElement {
    static styles = css`
    :host {
      display: block;
    }
  `;

    render() {
        // Replace this with real public description data
        return html`
      <p>This is the public description that other users can see.</p>
    `;
    }
}

customElements.define('account-public-description', AccountPublicDescription);
