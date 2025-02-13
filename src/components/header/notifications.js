import {LitElement, html, css} from 'lit';
import '../../svg/bell.js'
import '../global/custom-tooltip.js'
import buttonStyles from "../../css/buttons.js";

export class NotificationsElement extends LitElement {
    static properties = {
        notifications: []
    };

    constructor() {
        super();
        this.notifications = ['asdfas', 'asdfas']
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
                    top: 2px;
                    right: 2px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            `
        ];
    }


    render() {
        return html`
                <button class="notifications-button button icon-button" title="${this.notifications?.length} notifications">
                    <bell-icon></bell-icon>
                    <span class="number-notifications"></span>
                </button>
                <custom-tooltip>You have ${this.notifications.length} notifications</custom-tooltip>
    `;
    }
}
customElements.define('notifications-element', NotificationsElement);

