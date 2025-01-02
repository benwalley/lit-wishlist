import {LitElement, html, css} from 'lit';
import {ADD_MODAL_EVENT} from "../../events/custom-events.js";
import '../global/custom-modal.js'
import '../global/custom-input.js'
import './price-input.js'
import buttonStyles from "../../css/buttons.js";
import './multi-input.js'
import './wysiwyg-editor.js'
import './amount-you-want.js'
import './priority-selector.js'
import './delete-automatically-selector.js'
import './visibility-selector/visibility-selector-container.js'

export class AddToListModal extends LitElement {
    static properties = {
        advancedOpen: {type: Boolean},
    };

    constructor() {
        super();
        this.advancedOpen = false;
    }


    static get styles() {
        return [
            buttonStyles,
            css`
                .modal-contents {
                    display: grid;
                    gap: var(--spacing-normal);
                }
                
                .save-button {
                    position: sticky;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                }
            `
        ];
    }

    renderAdvancedOptions() {
        return html`
            is public
            advanced visibility
            <delete-automatically-selector></delete-automatically-selector>
            <visibility-selector-container></visibility-selector-container>
            linked items
        `
    }

    _handleToggleAdvancedOptions() {
        this.advancedOpen = !this.advancedOpen
    }

    render() {
        return html`
            <custom-modal triggerEvent="${ADD_MODAL_EVENT}">
                <h2>Add To List</h2>
                <div class="modal-contents">
                    select list
                    <div>
                        <custom-input id="item-name-input" label="Item Name" fullWidth="true" placeholder="Item Name"></custom-input>
                    </div>
                    <div>
                        <price-input></price-input>
                    </div>
                    <div>
                        <multi-input values="" sectionName="Link(s)" placeholder=${'Url, displayed link name'}></multi-input>
                    </div>
                    <wysiwyg-editor @content-changed=${(e) => console.log(e.detail.content)} content='<p>Add notes here...</p>'></wysiwyg-editor>
                    images
                    <amount-you-want></amount-you-want>
                    <priority-selector></priority-selector>
                    <button class="button primary" @click=${this._handleToggleAdvancedOptions}>${this.advancedOpen ? "Hide Advanced Options" : "Show Advanced Options"}</button>
                    ${this.advancedOpen ? this.renderAdvancedOptions() : ''}
                    
                    <button class="button primary save-button">Save Item</button>
                </div>
                
            </custom-modal>
    `;
    }
}
customElements.define('add-to-list-modal', AddToListModal);
