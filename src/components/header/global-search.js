import {LitElement, html, css} from 'lit';
import buttonStyles from "../css/buttons";

export class CustomElement extends LitElement {
    static properties = {
        value: {type: String},
    };

    constructor() {
        super();
        this.value = '';
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    
                }
            `
        ];
    }

    render() {
        return html`
            <input type="search" placeholder="Search all wishlists or users" .value="${this.value}">
    `;
    }
}
customElements.define('custom-element', CustomElement);
