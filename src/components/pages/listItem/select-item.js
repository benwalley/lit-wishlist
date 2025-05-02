import {LitElement, html, css} from 'lit';
import '../../pages/account/avatar.js';
import '../../../svg/check.js';
import '../../global/custom-image.js';

export class SelectItem extends LitElement {
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

            button.item-container {
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

            button.item-container:hover {
                background-color: var(--background-light);
            }
            
            button.item-container.selected {
                background-color: var(--background-light);
            }
            
            .checkbox {
                display: flex;
                align-items: center;
                justify-content: center;
                min-width: 16px;
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
            
            .item-info {
                flex: 1;
                display: flex;
                gap: 2px;
                flex-direction: column;
                overflow: hidden;
            }

            .item-name {
                font-size: var(--font-size-small);
                font-weight: bold;
                color: var(--text-color-dark);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .item-price {
                font-size: var(--font-size-x-small);
                color: var(--green-normal);
                font-weight: bold;
            }
            
            .item-desc {
                font-size: var(--font-size-x-small);
                color: var(--text-color-medium-dark);
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
            }
            
            .image-container {
                width: 40px;
                height: 40px;
                border-radius: var(--border-radius-small);
                overflow: hidden;
                flex-shrink: 0;
            }
            
            custom-image {
                width: 100%;
                height: 100%;
                object-fit: cover;
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
                class="item-container ${this.isSelected ? 'selected' : ''}" 
                @click="${this._handleItemClick}"
            >
                <div class="checkbox ${this.isSelected ? 'selected' : ''}">
                    ${this.isSelected ? html`<check-icon></check-icon>` : null}
                </div>
                
                ${this.itemData.imageId ? html`
                    <div class="image-container">
                        <custom-image 
                            imageId="${this.itemData.imageId}" 
                            alt="${this.itemData.itemName || 'Item image'}"
                        ></custom-image>
                    </div>
                ` : html`
                    <custom-avatar 
                        size="40" 
                        username="${this.itemData.itemName || 'Item'}"
                    ></custom-avatar>
                `}
                
                <div class="item-info">
                    <div class="item-name">${this.itemData.itemName}</div>
                    ${this.itemData.price ? html`
                        <div class="item-price">$${parseFloat(this.itemData.price).toFixed(2)}</div>
                    ` : null}
                    ${this.itemData.description ? html`
                        <div class="item-desc">${this.itemData.description}</div>
                    ` : null}
                </div>
            </button>
        `;
    }
}

customElements.define('select-item', SelectItem);