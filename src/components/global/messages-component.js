// Messages.js
import { LitElement, html, css } from 'lit';
import { observeState } from 'lit-element-state';
import { messagesState } from "../../state/messagesStore.js";

class Messages extends observeState(LitElement) {

    static styles = css`
        :host {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            font-family: Arial, sans-serif;
        }

        .notification {
            display: flex;
            align-items: center;
            padding: 16px;
            border-radius: 4px;
            color: #fff;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            margin-bottom: 10px;
            opacity: 0;
            transform: translateY(-20px);
            transition: opacity 0.3s ease, transform 0.3s ease;
        }

        .notification.show {
            opacity: 1;
            transform: translateY(0);
        }

        .success {
            background-color: var(--success-green);
        }

        .error {
            background-color: var(--delete-red);
        }

        .info {
            background-color: var(--info-yellow);
        }

        .message {
            flex: 1;
        }

        .close-btn {
            background: none;
            border: none;
            color: #fff;
            font-size: 16px;
            cursor: pointer;
        }
    `;

    constructor() {
        super();
        // Observe the messagesState and update the component when it changes
        // observeState(this, messagesState, 'messages');
    }

    render() {
        return html`
            ${messagesState.messages.map(
                msg => html`
                    <div class="notification ${msg.type} show">
                        <div class="message">${msg.message}</div>
                        <button class="close-btn" @click="${() => this.dismiss(msg.id)}">&times;</button>
                    </div>
                `
            )}
        `;
    }

    /**
     * Dismisses a message by its ID.
     * @param {number|string} id - The unique identifier of the message.
     */
    dismiss(id) {
        messagesState.removeMessage(id);
    }
}

customElements.define('messages-component', Messages);
