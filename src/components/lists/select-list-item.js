import {LitElement, html, css} from 'lit';
import buttonStyles from "../../css/buttons";
import '../pages/account/avatar.js';
import '../../svg/delete.js'
import '../../svg/edit.js'
import '../../svg/arrow-long.js'
import '../../svg/eye.js'
import '../global/custom-tooltip.js'
import '../../svg/checkbox-empty.js'
import '../../svg/checkbox-checked.js'

export class CustomElement extends LitElement {
    static properties = {
        itemData: {type: Object},
        isSelected: {type: Boolean}
    };

    constructor() {
        super();
        this.itemData = {};
        this.isSelected = false;
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
                }
                
                h3 {
                    margin: 0;
                    margin-right: auto;
                }
                
                .containing-button {
                    display: flex;
                    gap: var(--spacing-small);
                    align-items: center;
                    padding: 5px;
                    border: none;
                    border-radius: 0;
                    width: 100%;
                    cursor: pointer;
                    background: none;
                }
                
                .containing-button.selected {
                    background-color: color-mix(in srgb, var(--primary-color), light-dark(#ffffff, #000000) 80%);;
                }

                .checkbox {
                    color: var(--blue);
                    display: flex;
                }
                
            `
        ];
    }

    _handleItemClick() {
        this.dispatchEvent(new CustomEvent('item-clicked', {
            detail: { itemData: this.itemData }
        }));
    }

    render() {
        return html`
            <button 
                    class="containing-button ${this.isSelected ? 'selected' : ''}" 
                    @click="${this._handleItemClick}"
            >
                <span class="checkbox">
                    ${this.isSelected ?
                            html`<checkbox-checked-icon></checkbox-checked-icon>` :
                            html`<checkbox-empty-icon></checkbox-empty-icon>`}
                </span>
                <custom-avatar size="24" username="${this.itemData.listName}"></custom-avatar>
                <h3>${this.itemData.listName}</h3>
                
                
            </button>
        `;
    }
}
customElements.define('select-list-item', CustomElement);
