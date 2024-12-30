import {LitElement, html} from 'lit';

export class NotFound extends LitElement {
    static properties = {
    };

    constructor() {
        super();
    }

    render() {
        return html`
    <p>Page not found</p>
    `;
    }
}
customElements.define('not-found', NotFound);
