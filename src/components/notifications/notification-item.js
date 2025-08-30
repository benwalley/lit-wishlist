import {LitElement, html, css} from 'lit';
import buttonStyles from "../../css/buttons.js";
import '../../svg/x.js';
import {renderNotification} from '../../helpers/notificationRenderer.js';

export class NotificationItem extends LitElement {
    static properties = {
        notification: {type: Object},
    };

    constructor() {
        super();
        this.notification = {};
    }

    /**
     * Maps notification types to color schemes
     * @param {string} notificationType - The notification type
     * @returns {string} The color name to use for styling
     */
    getColorFromType(notificationType) {
        const colorMap = {
            someone_go_in_on: 'green',
            proposal_created: 'blue',
            proposal_accepted: 'green',
            proposal_deleted: 'red',
            gotten_item_deleted: 'red',
            item_shared: 'purple',
            list_shared: 'purple',
            group_invite: 'yellow',
            item_gotten: 'green',
            question_asked: 'green',
            removed_from_group: 'yellow',
            subuser_added: 'blue'
        };

        return colorMap[notificationType] || 'blue'; // Default to blue
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
                    padding-right: 30px;
                    border: 1px solid var(--blue-normal);
                    background: var(--blue-light);
                    color: var(--blue-normal);
                    border-radius: var(--border-radius-normal);
                    box-sizing: border-box;
                    width: 260px;
                    line-height: 1.4;
                    position: relative;
                    
                    &.success,
                    &.green{
                        border-color: var(--green-normal);
                        background: var(--green-light);
                        color: var(--green-normal);
                    }
                    
                    &.red {
                        border-color: var(--delete-red);
                        background: var(--delete-red-light);
                        color: var(--delete-red);
                    }
                    
                    &.yellow {
                        border-color: var(--info-yellow);
                        background: var(--info-yellow-light);
                        color: var(--text-color-dark);
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
                
                .notification-message a {
                    color: inherit;
                    text-decoration: underline;
                }
                
                .notification-message a:hover {
                    color: inherit;
                    text-decoration: underline;
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
            <div class="notification-item ${this.getColorFromType(this.notification.notificationType)}">
                <p class="notification-message">${renderNotification(this.notification)}</p>
                <button class="close-button icon-button small" @click="${this._handleDismiss}">
                    <x-icon></x-icon>
                </button>
            </div>
        `;
    }
}
customElements.define('notification-item', NotificationItem);
