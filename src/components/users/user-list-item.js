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
            padding: var(--spacing-small);
            border: none;
            background: none;
            cursor: pointer;
            text-align: left;
            gap: 8px;
            transition: var(--transition-normal);
        }

        button.user-container:hover {
            background-color: var(--option-select-background-hover);
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

        check-icon {
            color: var(--primary-color);
        }
    `;

    render() {
        return html`
            <button
                    class="user-container ${this.isSelected ? 'selected' : ''}"
            >
            <custom-avatar size="32" 
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

                <!-- Show a check if selected -->
                ${this.isSelected
                        ? html`<check-icon></check-icon>`
                        : null
                }
            </button>
        `;
    }
}

customElements.define('user-list-item', UserListItem);
