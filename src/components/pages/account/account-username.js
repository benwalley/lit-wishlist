import {LitElement, html, css} from 'lit';

export class AccountUsername extends LitElement {
    static styles = css`
        :host {
            display: inline-block;
            font-weight: bold;
            font-size: var(--font-size-x-large);
        }
    `;

    render() {
        // Replace this with real username data
        return html`<span>Username</span>`;
    }
}

customElements.define('account-username', AccountUsername);
