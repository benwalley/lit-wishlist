import {messagesState} from '../state/messagesStore.js';

/**
 * Copies the current page URL to clipboard
 * @param {string} successMessage - Custom success message (optional)
 * @param {string} errorMessage - Custom error message (optional)
 */
export function copyCurrentPageUrl(successMessage = 'Link copied to clipboard!', errorMessage = 'Failed to copy link') {
    const url = window.location.href;
    navigator.clipboard.writeText(url)
        .then(() => {
            messagesState.addMessage(successMessage);
        })
        .catch(err => {
            console.error('Could not copy text: ', err);
            messagesState.addMessage(errorMessage, 'error');
        });
}