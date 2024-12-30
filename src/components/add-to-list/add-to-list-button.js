import { LitElement, html, css } from 'lit';
import '../global/floating-button.js';
import '../../svg/plus.js';
import {triggerAddModalEvent} from "../../events/custom-events.js";

export class AddToListButton extends LitElement {
    static properties = {
        version: {},
    };

    static styles = css`
        :host {
            display: inline-block;
        }
    `;

    constructor() {
        super();
    }

    handleClick() {
        triggerAddModalEvent();
    }

    render() {
        return html`
            <floating-button label="Add item to a list" @click="${this.handleClick}">
                <plus-icon></plus-icon>
            </floating-button>
        `;
    }
}

customElements.define('add-to-list-button', AddToListButton);
