import { LitElement, html, css } from 'lit';
import { showConfirmation } from "../custom-confirm/confirm-helper.js";
import { deleteList } from "../../../helpers/api/lists.js";
import { messagesState } from "../../../state/messagesStore.js";
import {listenDeleteList, triggerUpdateList} from "../../../events/eventListeners.js";

/**
 * Global delete list component that listens for delete-list events
 * and handles the deletion confirmation and process
 */
export class DeleteList extends LitElement {
    static get properties() {
        return {};
    }

    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();
        listenDeleteList(this._handleDeleteListEvent.bind(this))
    }

    disconnectedCallback() {
        super.disconnectedCallback();
    }

    /**
     * Handle the delete-list event
     * @param {CustomEvent} event - Event with list data in detail
     */
    async _handleDeleteListEvent(event) {
        const listData = event.detail?.listData;

        if (!listData || !listData.id) {
            messagesState.addMessage('Cannot delete list: missing list data', 'error');
            return;
        }

        const confirmed = await this._confirmDeletion(listData);
        if (!confirmed) return;

        // Process the deletion
        await this._deleteList(listData);
    }

    /**
     * Show confirmation dialog for list deletion
     * @param {Object} listData - The list data
     * @returns {Promise<boolean>} - Whether user confirmed the deletion
     */
    async _confirmDeletion(listData) {
        let submessage = 'This action cannot be undone.';

        return await showConfirmation({
            message: `Are you sure you want to delete "${listData.listName || 'this list'}"?`,
            submessage,
            heading: 'Delete List?',
            confirmLabel: 'Delete',
            cancelLabel: 'Cancel'
        });
    }

    /**
     * Process the actual list deletion
     * @param {Object} listData - The list data
     */
    async _deleteList(listData) {
        try {
            const response = await deleteList(listData.id);

            if (response.success) {
                messagesState.addMessage(`List "${listData.listName || ''}" deleted successfully`, 'success');

                triggerUpdateList();
            } else {
                messagesState.addMessage('Failed to delete list', 'error');
            }
        } catch (error) {
            console.error('Error deleting list:', error);
            messagesState.addMessage(`Error deleting list: ${error.message}`, 'error');
        }
    }

    render() {
        return html``;
    }
}

customElements.define('delete-list', DeleteList);
