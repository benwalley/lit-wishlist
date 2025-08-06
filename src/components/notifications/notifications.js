import {LitElement, html, css} from 'lit';
import '../../svg/bell.js'
import '../global/action-dropdown.js'
import './notification-item.js'
import buttonStyles from "../../css/buttons.js";
import {observeState} from "lit-element-state";
import {userState} from "../../state/userStore.js";
import {listenInitialUserLoaded} from "../../events/eventListeners.js";
import {getMyNotifications, markNotificationAsRead} from "../../helpers/api/notifications.js";

export class NotificationsElement extends observeState(LitElement) {
    static properties = {
        notifications: []
    };

    constructor() {
        super();
        this.notifications = []
    }

    connectedCallback() {
        super.connectedCallback();
        if(userState.userData?.id) {
            this._fetchNotifications();
        } else {
            listenInitialUserLoaded(() => {
                this._fetchNotifications();
            })
        }

    }

     async _fetchNotifications() {
         const notificationsRequest = await getMyNotifications();
         if (notificationsRequest.success) {
             this.notifications = notificationsRequest.data?.notifications || [];
         }
     }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {

                }

                .button.notifications-button {
                    font-size: var(--font-size-large);
                    position: relative;
                }

                .number-notifications {
                    position: absolute;
                    top: -4px;
                    right: -4px;
                    background-color: var(--delete-red);
                    color: white;
                    border-radius: 50%;
                    min-width: 18px;
                    height: 18px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: var(--font-size-x-small);
                    font-weight: 600;
                    border: 2px solid var(--background-light);
                }
            `
        ];
    }

    _getContent(notification) {
        return html`
            <notification-item .notification=${notification}></notification-item>
        `;
    }

    async _handleDismiss(event) {
        const notificationId = event.detail.notificationId;
        
        // Remove the notification from the array immediately
        this.notifications = this.notifications.filter(
            notification => notification.id !== notificationId
        );
        
        // Make API call to mark notification as read (fire and forget)
        try {
            await markNotificationAsRead(notificationId);
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    }


    render() {
        const notificationItems = this.notifications.length > 0 
            ? this.notifications.map(notification => ({
                id: notification.id,
                content: this._getContent(notification),
            }))
            : [{
                id: 'no-notifications',
                content: html`
                    <div style="padding: var(--spacing-normal); text-align: center; color: var(--text-color-medium-dark);">
                        You're all caught up! 📢
                    </div>
                `
            }];

        return html`
            <action-dropdown 
                    .items=${notificationItems}
                    info
                    @dismiss="${this._handleDismiss}"
            >
                <button 
                    class="notifications-button button icon-button" 
                    title="${this.notifications?.length} notifications"
                    slot="toggle"
                >
                    <bell-icon></bell-icon>
                    ${this.notifications?.length > 0 ? html`
                        <span class="number-notifications">${this.notifications.length > 99 ? '99+' : this.notifications.length}</span>
                    ` : ''}
                </button>
            </action-dropdown>
        `;
    }
}
customElements.define('notifications-element', NotificationsElement);

