import { LitElement, html, css } from 'lit';
import '../pages/account/avatar.js';
import buttonStyles from '../../css/buttons.js';

class SubuserLoginItem extends LitElement {
    static get properties() {
        return {
            userData: { type: Object },
            isCurrent: { type: Boolean }
        };
    }

    constructor() {
        super();
        this.userData = null;
        this.isCurrent = false;
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    display: block;
                }

                .user-item {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-small);
                    padding: var(--spacing-small);
                    border: 1px solid var(--border-color);
                    border-radius: var(--border-radius-normal);
                    cursor: pointer;
                    transition: var(--transition-normal);
                    background: var(--background-dark);
                }

                .user-item:hover {
                    background: var(--background-light);
                    border-color: var(--primary-color);
                    transform: translateY(-1px);
                    box-shadow: var(--shadow-1-soft);
                }

                .user-item.current {
                    background: var(--primary-light);
                    border-color: var(--primary-color);
                    cursor: default;
                }

                .user-item.current:hover {
                    transform: none;
                }

                .user-info {
                    flex: 1;
                    min-width: 0;
                }

                .user-name {
                    font-weight: 600;
                    color: var(--text-color-dark);
                    font-size: var(--font-size-medium);
                    margin-bottom: 2px;
                }

                .user-label {
                    font-size: var(--font-size-x-small);
                    color: var(--text-color-medium-dark);
                }

                .user-item.current .user-label {
                    color: var(--primary-color);
                    font-weight: 500;
                }
            `
        ];
    }

    _handleClick() {
        if (this.isCurrent) return;
        
        this.dispatchEvent(new CustomEvent('user-selected', {
            detail: { userData: this.userData },
            bubbles: true,
            composed: true
        }));
    }

    render() {
        if (!this.userData) {
            return html``;
        }

        return html`
            <div 
                class="user-item ${this.isCurrent ? 'current' : ''}"
                @click="${this._handleClick}"
            >
                <custom-avatar
                    size="40"
                    username="${this.userData.name}"
                    imageId="${this.userData.imageId || this.userData.image || 0}"
                ></custom-avatar>
                
                <div class="user-info">
                    <div class="user-name">${this.userData.name}</div>
                    <div class="user-label">
                        ${this.isCurrent ? 'Current User' : 'Subuser'}
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('subuser-login-item', SubuserLoginItem);