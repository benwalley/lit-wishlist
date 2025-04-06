import { LitElement, html, css } from 'lit';
import '../pages/account/avatar.js';
import '../../svg/success.js';
import '../../svg/check.js'

export class UserListItem extends LitElement {
    static properties = {
        userData: { type: Object },
        isSelected: { type: Boolean }
    };

    static styles = css`
        :host {
            display: block;
            color: var(--text-color-dark);
        }

        button.user-container {
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

        button.user-container:hover {
            background-color: var(--background-light);
        }
        
        button.user-container.selected {
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
        
        .user-info {
            flex: 1;
            display: flex;
            gap: 2px;
            flex-direction: column;
        }

        .user-name {
            font-size: var(--font-size-small);
            font-weight: bold;
            color: var(--text-color-dark);
        }

        .user-desc {
            font-size: var(--font-size-x-small);
            color: var(--text-color-medium-dark);
        }
    `;

    _handleClick() {
        this.dispatchEvent(new CustomEvent('user-selected', {
            detail: { user: this.userData },
            bubbles: true,
            composed: true
        }));
    }

    render() {
        return html`
            <button
                class="user-container ${this.isSelected ? 'selected' : ''}"
                @click="${this._handleClick}"
            >
                <div class="checkbox ${this.isSelected ? 'selected' : ''}">
                    ${this.isSelected ? html`<check-icon></check-icon>` : null}
                </div>
                <custom-avatar size="24" 
                    username="${this.userData?.name}" 
                    imageId="${this.userData?.image}"
                ></custom-avatar>

                <div class="user-info">
                    <div class="user-name">${this.userData?.name}</div>
                    ${this.userData?.publicDescription
                        ? html`<div class="user-desc">${this.userData?.publicDescription}</div>`
                        : null
                    }
                </div>
            </button>
        `;
    }
}

customElements.define('user-list-item', UserListItem);
