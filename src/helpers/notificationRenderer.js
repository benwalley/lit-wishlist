import { html } from 'lit';

/**
 * Truncates text to a maximum length and adds ellipsis if needed
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Truncated text with ellipsis if needed
 */
function truncateText(text, maxLength = 20) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

/**
 * Notification renderer helper that handles different notification types
 * Each notification type has its own render function
 */

const notificationRenderers = {
    someone_go_in_on: (metadata) => {
        const { itemName, newParticipantName, itemId } = metadata;
        return html`
            <strong>${newParticipantName}</strong> wants to go in on 
            <a href="/item/${itemId}">${truncateText(itemName)}</a>
        `;
    },

    proposal_created: (metadata) => {
        const { itemName, creatorName, itemId } = metadata;
        return html`
            <strong>${creatorName}</strong> invited you to go in on  
            <a href="/item/${itemId}">${truncateText(itemName)}</a>.
            <span>Go to <a href="/proposals">proposals</a> page to see it.</span>
        `;
    },

    proposal_accepted: (metadata) => {
        const { itemName, accepterName, itemId } = metadata;
        return html`
            All participants have accepted the proposal for 
            <a href="/item/${itemId}">${truncateText(itemName)}</a>.
            It is now marked as Gotten by all participants.
        `;
    },

    proposal_deleted: (metadata) => {
        const { itemName, itemId } = metadata;
        return html`
            A proposal for 
            <a href="/item/${itemId}">${truncateText(itemName)}</a>
            was deleted.
        `;
    },

    gotten_item_deleted: (metadata) => {
        const { itemId, itemName, giverId } = metadata;
        return html`
            <span>An item you marked as gotten, has been deleted:</span> 
            <strong>${truncateText(itemName)}</strong>
        `;
    },

    item_shared: (metadata) => {
        const { itemName, sharerName, itemId } = metadata;
        return html`
            <strong>${sharerName}</strong> shared 
            <a href="/item/${itemId}">${truncateText(itemName)}</a> with you
        `;
    },

    list_shared: (metadata) => {
        const { listName, sharerName, listId } = metadata;
        return html`
            <strong>${sharerName}</strong> shared 
            <a href="/list/${listId}">${listName}</a> with you
        `;
    },

    group_invite: (metadata) => {
        const { groupName, inviterName, groupId } = metadata;
        return html`
            <strong>${inviterName}</strong> invited you to join 
            <a href="/group/${groupId}">${groupName}</a>
        `;
    },


    question_asked: (metadata) => {
        const { askerName, questionText } = metadata;
        return html`
            <strong>${askerName}</strong> asked you a question
            <a href="/account">(see on dashboard)</a>
        `;
    },

    user_left_group: (metadata) => {
        const { groupName, userName } = metadata;
        return html`
            <strong>${userName}</strong> left the group 
            <strong>${groupName}</strong>
        `;
    },

    subuser_added: (metadata) => {
        const { subuserName, parentName } = metadata;
        return html`
            You were added as a subuser by 
            <strong>${parentName}</strong>
        `;
    },

    removed_from_group: (metadata) => {
        const { groupId, groupName, removerId, removerName } = metadata;
        return html`
            You were removed from the group
            <strong>${groupName}</strong>
        `;
    }
};

/**
 * Renders a notification based on its type and metadata
 * @param {Object} notification - The notification object
 * @param {string} notification.notificationType - The type of notification
 * @param {Object} notification.metadata - The metadata for the notification
 * @returns {TemplateResult} HTML template to render
 */
export function renderNotification(notification) {
    const { notificationType, metadata } = notification;

    // Get the appropriate renderer for this notification type
    const renderer = notificationRenderers[notificationType];

    if (!renderer) {
        console.warn(`No renderer found for notification type: ${notificationType}`);
        // Fallback to a generic message if no renderer exists
        return html`
            <span>You have a new notification</span>
        `;
    }

    try {
        return renderer(metadata);
    } catch (error) {
        console.error(`Error rendering notification type ${notificationType}:`, error);
        return html`
            <span>Notification error</span>
        `;
    }
}

/**
 * Adds a new notification renderer for a specific type
 * @param {string} notificationType - The notification type
 * @param {Function} renderer - The render function that takes metadata and returns HTML
 */
export function addNotificationRenderer(notificationType, renderer) {
    notificationRenderers[notificationType] = renderer;
}

/**
 * Gets all available notification types
 * @returns {string[]} Array of notification type names
 */
export function getAvailableNotificationTypes() {
    return Object.keys(notificationRenderers);
}
