import {LitElement, html, css} from 'lit';
import buttonStyles from "../../css/buttons";
import '../pages/account/avatar.js';
import '../../svg/delete.js'
import '../../svg/edit.js'
import '../../svg/arrow-long.js'
import '../../svg/eye.js'
import '../global/custom-tooltip.js'

export class CustomElement extends LitElement {
    static properties = {
        itemData: {type: Object},
        isSelectList: {type: Boolean},
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
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    gap: var(--spacing-small);
                    border-bottom: 1px solid var(--border-color);
                    margin: 0;
                    padding: var(--spacing-x-small);
                    
                }
                
                h3 {
                    margin: 0;
                }
                
                .containing-button {
                    background: none;
                    border: none;
                    padding: 0;
                    flex-grow: 1;
                    justify-content: flex-start;
                }
                
                .icon-button {
                    font-size: 1.2em;
                }
                
            `
        ];
    }

    render() {
        return html`
            <button class="containing-button">
                <custom-avatar size="24" username="${this.itemData.listName}"></custom-avatar>
                <h3>${this.itemData.listName}</h3>
            </button>
            <a href="/list/${this.itemData.id}" class="button view-button icon-button" aria-label="View List" style="--icon-color: var(--primary-color)">
                <eye-icon open="true" style="width: 1em; height: 1em"></eye-icon>
            </a>
            <custom-tooltip>Open this list</custom-tooltip>
            <button class="edit-button icon-button" aria-label="Edit List Details" style="--icon-color: var(--blue)">
                <edit-icon style="width: 1em; height: 1em"></edit-icon>
            </button>
            <custom-tooltip>Edit this list</custom-tooltip>
            <button class="delete-button icon-button" aria-label="Delete List" style="--icon-color: var(--delete-red)">
                <delete-icon style="width: 1em; height: 1em"></delete-icon>
            </button>
            <custom-tooltip>Delete this list</custom-tooltip>

        `;
    }
}
customElements.define('list-item', CustomElement);
