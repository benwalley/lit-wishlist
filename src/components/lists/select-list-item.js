import {LitElement, html, css} from 'lit';
import '../pages/account/avatar.js';
import '../../svg/check.js'

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
        return css`
            :host {
                display: block;
                color: var(--text-color-dark);
            }

            button.list-container {
                display: flex;
                align-items: center;
                width: 100%;
                padding: var(--spacing-x-small);
                border: none;
                background: none;
                cursor: pointer;
                text-align: left;
                gap: 8px;
                transition: var(--transition-normal);
                border-radius: var(--border-radius-small);
            }

            button.list-container:hover {
                background-color: var(--background-light);
            }
            
            button.list-container.selected {
                background-color: var(--background-light);
            }
            
            .checkbox {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 16px;
                height: 16px;
                border-radius: 4px;
                border: 2px solid var(--grayscale-300);
                transition: var(--transition-normal);
            }
            
            .checkbox.selected {
                border-color: var(--blue-normal);
                background-color: var(--blue-normal);
                color: white;
            }
            
            check-icon {
                width: 16px;
                height: 16px;
                color: white;
            }
            
            .list-info {
                flex: 1;
                display: flex;
                gap: 2px;
                flex-direction: column;
            }

            .list-name {
                font-size: var(--font-size-small);
                font-weight: bold;
                color: var(--text-color-dark);
            }

            .list-desc {
                font-size: var(--font-size-x-small);
                color: var(--text-color-medium-dark);
            }
        `;
    }

    _handleItemClick() {
        this.dispatchEvent(new CustomEvent('item-clicked', {
            detail: { itemData: this.itemData }
        }));
    }

    render() {
        return html`
            <button 
                class="list-container ${this.isSelected ? 'selected' : ''}" 
                @click="${this._handleItemClick}"
            >
                <div class="checkbox ${this.isSelected ? 'selected' : ''}">
                    ${this.isSelected ? html`<check-icon></check-icon>` : null}
                </div>
                <custom-avatar 
                    size="24" 
                    username="${this.itemData.listName}" 
                    imageId="${this.itemData.image}"
                ></custom-avatar>
                <div class="list-info">
                    <div class="list-name">${this.itemData.listName}</div>
                    ${this.itemData.description 
                        ? html`<div class="list-desc">${this.itemData.description}</div>` 
                        : null
                    }
                </div>
            </button>
        `;
    }
}
customElements.define('select-list-item', CustomElement);
