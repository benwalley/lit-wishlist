import {LitElement, html, css} from 'lit';
import buttonStyles from "../../css/buttons.js";
import '../../svg/x.js';

export class NotificationItem extends LitElement {
    static properties = {
        notification: {type: Object},
    };

    constructor() {
        super();
        this.notification = {};
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    display: block;
                }
                
                .notification-item {
                    padding: var(--spacing-small);
                    border: 1px solid var(--blue-normal);
                    background: var(--blue-light);
                    color: var(--blue-normal);
                    border-radius: var(--border-radius-normal);
                    box-sizing: border-box;
                    width: 240px;
                    position: relative;
                    
                    &.success {
                        border-color: var(--green-normal);
                        background: var(--green-light);
                        color: var(--green-normal);
                    }

                    .close-button {
                        position: absolute;
                        font-size: 8px;
                        border-radius: 20px;
                        background: var(--border-color);
                        top: 50%;
                        transform: translateY(-50%);
                        right: var(--spacing-x-small);
                        padding: var(--spacing-x-small);
                        color: var(--text-color-dark);
                        
                        &:hover {
                            filter: brightness(0.9);
                            background: var(--border-color);
                            color: var(--text-color-dark);

                            box-shadow: var(--shadow-1-soft);
                        }
                    }
                }
                
                .notification-message {
                    margin: 0;
                }
            `
        ];
    }

    _handleDismiss() {
        this.dispatchEvent(new CustomEvent('dismiss', {
            bubbles: true,
            composed: true,
            detail: {notificationId: this.notification.id}
        }));
    }

    render() {
        if (!this.notification) return html``;

        return html`
            <div class="notification-item ${this.notification.notificationType}">
                <p class="notification-message">${this.notification.message}</p>
                <button class="close-button icon-button small" @click="${this._handleDismiss}">
                    <x-icon></x-icon>
                </button>
            </div>
        `;
    }
}
customElements.define('notification-item', NotificationItem);
