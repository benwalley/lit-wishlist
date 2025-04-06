import { LitElement, html, css } from 'lit';
import '../pages/account/avatar.js';
import '../../svg/check.js';

class GroupItemComponent extends LitElement {
    static properties = {
        group: { type: Object },
        isSelected: { type: Boolean }
    };

    static styles = css`
        :host {
            display: block;
            color: var(--text-color-dark);
        }

        button.group-container {
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

        button.group-container:hover {
            background-color: var(--background-light);
        }
        
        button.group-container.selected {
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

        .group-info {
            flex: 1;
            display: flex;
            gap: 2px;
            flex-direction: column;
        }

        .group-name {
            font-size: var(--font-size-small);
            font-weight: bold;
            color: var(--text-color-dark);
        }

        .group-desc {
            font-size: var(--font-size-x-small);
            color: var(--text-color-medium-dark);
        }
    `;

    _handleClick() {
        this.dispatchEvent(new CustomEvent('group-selected', {
            detail: { group: this.group },
            bubbles: true,
            composed: true
        }));
    }

    render() {
        return html`
            <button
                class="group-container ${this.isSelected ? 'selected' : ''}"
                @click="${this._handleClick}"
            >
                <div class="checkbox ${this.isSelected ? 'selected' : ''}">
                    ${this.isSelected ? html`<check-icon></check-icon>` : null}
                </div>
                <custom-avatar size="24" 
                    username="${this.group?.groupName}" 
                    imageId="${this.group?.image}"
                ></custom-avatar>

                <div class="group-info">
                    <div class="group-name">${this.group?.groupName}</div>
                    ${this.group?.description
                        ? html`<div class="group-desc">${this.group?.description}</div>`
                        : null
                    }
                </div>
            </button>
        `;
    }
}

customElements.define('group-list-item', GroupItemComponent);
