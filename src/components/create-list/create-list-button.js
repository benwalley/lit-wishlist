import {LitElement, html, css} from 'lit';
import '../global/custom-modal.js';
import buttonStyles from "../../css/buttons.js";
import './create-list-form.js'

export class CreateListButton extends LitElement {
    static properties = {};

    constructor() {
        super();
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                
            `
        ];
    }

    // Dispatch event to open the modal
    _openModal() {
        this.dispatchEvent(new CustomEvent('open-create-list-modal', {
            detail: { trigger: this },
            bubbles: true,
            composed: true,
        }));
    }

    render() {
        return html`
      <button @click="${this._openModal}">Create New List</button>

      <!-- Custom Modal with a Create List Form -->
      <custom-modal class="list-modal" triggerEvent="open-create-list-modal" maxWidth="800px">
        <create-list-form size="100px"></create-list-form>
      </custom-modal>
    `;
    }

    _handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const listName = formData.get('listName');
        // Handle form submission: e.g., send listName to server or update state

        // Optionally, close the modal after submission if needed
        const modal = this.shadowRoot.querySelector('custom-modal');
        if(modal && typeof modal.closeModal === 'function') {
            modal.closeModal();
        }
    }
}

customElements.define('create-list-button', CreateListButton);
