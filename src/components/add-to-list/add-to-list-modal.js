import {LitElement, html} from 'lit';
import {ADD_MODAL_EVENT} from "../../events/custom-events.js";
import '../global/custom-modal.js'

export class AddToListModal extends LitElement {
    static properties = {
    };

    constructor() {
        super();

    }

    render() {
        return html`
            <custom-modal triggerEvent="${ADD_MODAL_EVENT}">
                <h2>Add To List</h2>
                
            </custom-modal>
    `;
    }
}
customElements.define('add-to-list-modal', AddToListModal);
