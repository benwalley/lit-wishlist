import './custom-confirm.js';
import {messagesState} from "../../../state/messagesStore.js";

let modalInstance = null;

function getModalInstance() {
    if (!modalInstance || !modalInstance.isConnected) {
        modalInstance = document.createElement('custom-confirm');
        document.body.appendChild(modalInstance);
    }
    return modalInstance;
}


export async function showConfirmation(options) {
    if (!options || !options.message) {
        messagesState.addMessage('Confirmation message is required.', 'error');
        return Promise.reject(new Error('Confirmation message is required.'));
    }

    const modal = getModalInstance();

    modal.message = options.message;
    modal.submessage = options.submessage;
    modal.heading = options.heading ?? 'Confirmation';
    modal.confirmLabel = options.confirmLabel ?? 'Confirm';
    modal.cancelLabel = options.cancelLabel ?? 'Cancel';
    return modal.open();
}
