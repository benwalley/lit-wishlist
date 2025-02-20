import {LitElement, html, css} from 'lit';
import buttonStyles from "../../../css/buttons";
import {unsafeHTML} from 'lit/directives/unsafe-html.js';


export class CustomElement extends LitElement {
    static properties = {
        itemData: {type: Object},
    };

    constructor() {
        super();
        this.itemData = {};
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    display: block;
                    color: var(--text-color-dark);
                }
                
                ul {
                    padding-left: var(--spacing-normal);
                }
            `
        ];
    }

    render() {
        return html`
            ${unsafeHTML(this.itemData.note || '--')}
    `;
    }
}
customElements.define('notes-display', CustomElement);
