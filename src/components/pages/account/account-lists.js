import {LitElement, html, css} from 'lit';
import '../../create-list/create-list-button.js'

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
            <create-list-button></create-list-button>
        `;
    }
}

customElements.define('account-lists', AccountLists);
