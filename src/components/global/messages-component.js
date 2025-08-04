// Messages.js
import { LitElement, html, css } from 'lit';
import { observeState } from 'lit-element-state';
import { messagesState } from "../../state/messagesStore.js";
import '../../svg/check.js';
import '../../svg/info.js';
import '../../svg/x.js';

class Messages extends observeState(LitElement) {

    static styles = css`
        :host {
            position: absolute;
        }

        .messages-container {
            position: fixed;
            margin: 0;
            bottom: 0;
            left: 0;
            padding: var(--spacing-small);
            border: none;
            top: auto;
            background: none;
            width: 300px;
            max-width: calc(100vw - 40px);
            pointer-events: none;
            display: flex;
            flex-direction: column;
            gap: var(--spacing-small)
        }

        .notification {
            display: flex;
            align-items: flex-start;
            padding: var(--spacing-small);
            box-shadow: var(--shadow-3-soft);
            backdrop-filter: blur(10px);
            transform: translateX(-100%);
            transition: transform 0.4s ease;
            pointer-events: auto;
            border-radius: var(--border-radius-normal);
            gap: var(--spacing-small);
        }

        .notification.show {
            transform: translateX(0);
        }

        .success {
            border: 1px solid var(--green-normal);
            background: color-mix(in srgb, var(--green-normal) 10%, white 80%);
            color: var(--green-normal);
            opacity: 0.95;
        }

        .error {
            border: 1px solid var(--delete-red);
            background: color-mix(in srgb, var(--delete-red) 10%, white 80%);
            color: var(--delete-red);
            opacity: 0.95;
        }

        .info {
            border: 1px solid var(--info-yellow);
            background: color-mix(in srgb, var(--info-yellow) 10%, white 80%);
            color: var(--info-yellow);
            opacity: 0.95;
        }

        .notification-icon {
            font-size: var(--font-size-normal);
            margin-top: 2px;
        }

        .notification-content {
            flex: 1;
        }

        .notification-header {
            font-weight: bold;
            font-size: var(--font-size-small);
            margin-bottom: 4px;
            text-transform: capitalize;
        }

        .notification-message {
            font-size: var(--font-size-x-small);
            line-height: 1.4;
        }

        .close-btn {
            background: none;
            border: none;
            color: currentColor;
            font-size: var(--font-size-x-small);
            cursor: pointer;
            padding: 0;
            margin-top: 2px;
        }
    `;

    constructor() {
        super();
        this.animatedMessages = new Set();
    }

    updated(changedProperties) {
        super.updated(changedProperties);
        if (messagesState.messages.length > 0) {
            this.showPopover();
            this.animateNewMessages();
        } else {
            this.hidePopover();
            this.animatedMessages.clear();
        }
    }

    animateNewMessages() {
        messagesState.messages.forEach(msg => {
            if (!this.animatedMessages.has(msg.id)) {
                this.animatedMessages.add(msg.id);
                setTimeout(() => {
                    const element = this.shadowRoot.querySelector(`[data-message-id="${msg.id}"]`);
                    if (element) {
                        element.classList.add('show');
                    }
                }, 50);
            }
        });
    }

    getIconForType(type) {
        switch (type) {
            case 'success':
                return html`<check-icon class="notification-icon"></check-icon>`;
            case 'error':
                return html`<x-icon class="notification-icon"></x-icon>`;
            case 'info':
                return html`<info-icon class="notification-icon"></info-icon>`;
            default:
                return html`<info-icon class="notification-icon"></info-icon>`;
        }
    }

    showPopover() {
        const container = this.shadowRoot.querySelector('.messages-container');
        if (container && !container.matches(':popover-open')) {
            try {
                container.showPopover();
            } catch (e) {
                console.warn('Popover API not supported, falling back to regular positioning');
            }
        }
    }

    hidePopover() {
        const container = this.shadowRoot.querySelector('.messages-container');
        if (container && container.matches(':popover-open')) {
            try {
                container.hidePopover();
            } catch (e) {
                // Ignore errors when hiding popover
            }
        }
    }

    render() {
        if (messagesState.messages.length === 0) {
            return html``;
        }

        return html`
            <div class="messages-container" popover="manual">
                ${messagesState.messages.map(
                    msg => html`
                        <div class="notification ${msg.type}" data-message-id="${msg.id}">
                            ${this.getIconForType(msg.type)}
                            <div class="notification-content">
                                <div class="notification-header">${msg.type}</div>
                                <div class="notification-message">${msg.message}</div>
                            </div>
                            <button class="close-btn" @click="${() => this.dismiss(msg.id)}">
                                <x-icon></x-icon>
                            </button>
                        </div>
                    `
                )}
            </div>
        `;
    }

    /**
     * Dismisses a message by its ID.
     * @param {number|string} id - The unique identifier of the message.
     */
    dismiss(id) {
        this.animatedMessages.delete(id);
        messagesState.removeMessage(id);
    }
}

customElements.define('messages-component', Messages);
