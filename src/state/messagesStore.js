// messagesStore.js
import { LitState } from 'lit-element-state';

class MessagesState extends LitState {
    static get stateVars() {
        return {
            messages: []
        };
    }

    /**
     * Adds a new message to the state.
     * @param {string} message - The message text.
     * @param {string} type - The type of message ('success', 'error', etc.).
     * @param {number} timeout - Duration in milliseconds before auto-dismissal.
     */
    addMessage(message, type = 'success', timeout = 3000) {
        console.log('adding')
        const id = Date.now() + Math.random(); // Ensure unique ID
        const newMessage = { id, message, type, timeout };
        this.messages = [...this.messages, newMessage];

        if (timeout > 0) {
            setTimeout(() => {
                this.removeMessage(id);
            }, timeout);
        }
    }

    /**
     * Removes a message from the state by its ID.
     * @param {number|string} id - The unique identifier of the message.
     */
    removeMessage(id) {
        this.messages = this.messages.filter(msg => msg.id !== id);
    }
}

export const messagesState = new MessagesState();
