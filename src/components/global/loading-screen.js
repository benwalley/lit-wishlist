import {LitElement, html} from 'lit';

export class LoadingScreen extends LitElement {
    static properties = {
        version: {},
    };

    constructor() {
        super();
        this.version = 'STARTING';
    }

    render() {
        return html`
    I am loading
    `;
    }
}
customElements.define('loading-screen', LoadingScreen);
