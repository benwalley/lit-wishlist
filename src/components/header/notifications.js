import {LitElement, html, css} from 'lit';
import '../../svg/bell.js'
import '../global/custom-tooltip.js'

export class NotificationsElement extends LitElement {
    static properties = {
        notifications: []
    };

    constructor() {
        super();
        this.notifications = ['asdfas', 'asdfas']
    }

    static styles = css`
        :host {

        }

        .notifications-button {
            background: none;
            border: none;
            position: relative;
        }

        .number-notifications {
            position: absolute;
            top: 0;
            right: 0;
            background: var(--delete-red);
            width: 16px;
            width: 16px;
            height: 16px;
            font-size: 12px;
            color: white;
            font-weight: bold;
            border-radius: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    `;

    render() {
        return html`
                <button class="notifications-button" title="${this.notifications?.length} notifications">
                    <bell-icon style="color: var(--header-text-color); width: 24px; height: 24px;"></bell-icon>
                    <span class="number-notifications">${this.notifications.length}</span>
                </button>
                <custom-tooltip>You have ${this.notifications.length} notifications</custom-tooltip>
    `;
    }
}
customElements.define('notifications-element', NotificationsElement);

