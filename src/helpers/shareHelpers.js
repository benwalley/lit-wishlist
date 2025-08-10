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

export function copyTextToClipboard(text, successMessage = 'Text copied to clipboard!', errorMessage = 'Failed to copy text') {
    navigator.clipboard.writeText(text)
        .then(() => {
            messagesState.addMessage(successMessage);
        })
        .catch(err => {
            console.error('Could not copy text: ', err);
            messagesState.addMessage(errorMessage, 'error');
        });
}

export function copyUrlToClipboard(url, successMessage = 'Public URL copied to clipboard!', errorMessage = 'Failed to copy public URL') {
    const fullUrl = window.location.origin + url;
    navigator.clipboard.writeText(fullUrl)
        .then(() => {
            messagesState.addMessage(successMessage);
        })
        .catch(err => {
            console.error('Could not copy URL: ', err);
            messagesState.addMessage(errorMessage, 'error');
        });
}
