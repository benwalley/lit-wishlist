import {LitElement, html, css} from 'lit';
import {observeState} from 'lit-element-state';
import {userState} from "../../../state/userStore.js";
import '../account/avatar.js';
import '../../../svg/edit.js';
import '../../../svg/delete.js';
import '../../../svg/leave.js';
import '../../../svg/plus.js';
import buttonStyles from '../../../css/buttons.js'
import '../../groups/edit-group-form.js';
import {isGroupAdmin, isGroupOwner} from "../../../helpers/groupHelpers.js";
import {deleteGroup, leaveGroup} from "../../../helpers/api/groups.js";
import {showConfirmation} from "../../global/custom-confirm/confirm-helper.js";
import {messagesState} from "../../../state/messagesStore.js";
import {triggerGroupUpdated, triggerBulkAddToGroupModal} from "../../../events/eventListeners.js";

/**
 * Group details component that displays group information and admin actions
 * @element group-details
 */
export class GroupDetails extends observeState(LitElement) {
    static properties = {
        groupData: {type: Object},
    };

    constructor() {
        super();
        this.groupData = {};
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    display: flex;
                    flex-direction: column;
                }
                
                .username-section {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: var(--spacing-normal);
                    padding: var(--spacing-normal);
                    border-radius: var(--border-radius-large);
                    background: var(--background-light);
                    position: relative;
                    box-shadow: var(--shadow-1-soft);
                }

                .username {
                    font-weight: bold;
                    font-size: var(--font-size-x-large);
                    margin-top: var(--spacing-small);
                }

                .public-description {
                    text-align: center;
                    margin-top: var(--spacing-small);
                }

                .button-container {
                    display: flex;
                    flex-direction: row;
                    gap: var(--spacing-normal);
                    margin-top: var(--spacing-normal);
                    justify-content: center;
                }

                .delete-button {
                    --button-bg-color: var(--red-normal);
                    --button-hover-bg-color: var(--red-dark);
                }

                .action-buttons {
                    position: absolute;
                    top: var(--spacing-small);
                    right: var(--spacing-small);
                    display: flex;
                    gap: var(--spacing-small);
                }
                
                .icon-button {
                    font-size: var(--font-size-large);
                    transition: var(--transition-normal);
                    border-radius: 50%;
                    --icon-hover-background: var(--purple-light);
                }
                
                .group-description {
                    margin: 0;
                    color: var(--text-color-medium-dark);
                }

                .group-title {
                    margin: var(--spacing-normal) 0 0 0;
                }
                
                .username-edit-button.icon-button {
                    --icon-color: var(--blue-normal);
                    --icon-color-hover: var(--blue-normal);
                    
                    &:hover {
                        transform: rotate(-45deg) scale(1.1);
                        border-radius: 50px;
                    }
                }

                .delete-button.icon-button {
                    --icon-color: var(--delete-red);
                    --icon-color-hover: var(--delete-red-darker);
                    --icon-hover-background: var(--delete-red-light);
                }
                
                .leave-button.icon-button {
                    --icon-color: var(--blue-normal);
                    --icon-color-hover: var(--blue-darker);
                    --icon-hover-background: var(--blue-light);
                    
                    &:hover {
                        transform: translateX(3px);
                    }
                }
                
                .add-button.icon-button {
                    --icon-color: var(--green-normal);
                    --icon-color-hover: var(--green-darker);
                    --icon-hover-background: var(--green-light);
                    
                    &:hover {
                        transform: scale(1.1);
                    }
                }
            `
        ];
    }

    /**
     * Opens the edit group modal
     * @private
     */
    _handleEditGroup() {
        const editModal = this.shadowRoot.querySelector('#edit-group-modal');
        editModal.openModal();
    }

    /**
     * Closes the edit group modal
     * @private
     */
    _closeEditGroupModal() {
        const editModal = this.shadowRoot.querySelector('#edit-group-modal');
        editModal.closeModal();
    }

    /**
     * Handles group deletion with confirmation
     * @private
     */
    async _handleDeleteGroup() {
        try {
            const confirmed = await showConfirmation({
                heading: 'Delete Group',
                message: `Are you sure you want to delete the group "${this.groupData?.groupName}"?`,
                submessage: 'This action cannot be undone.',
                confirmLabel: 'Delete Group',
                cancelLabel: 'Cancel'
            });

            if (confirmed) {
                const result = await deleteGroup(this.groupData.id);
                if (result.success) {
                    messagesState.addMessage('Group successfully deleted.');
                    triggerGroupUpdated();
                    // Navigate back to groups list or another appropriate page
                    window.history.back();
                } else {
                    messagesState.addMessage('Failed to delete group: ' + result.error?.message, 'error');
                }
            }
        } catch (error) {
            console.error('Error deleting group:', error);
            messagesState.addMessage('An error occurred while deleting the group.', 'error');
        }
    }

    /**
     * Handles leaving group with confirmation
     * @private
     */
    async _handleLeaveGroup() {
        try {
            const confirmed = await showConfirmation({
                heading: 'Leave Group',
                message: `Are you sure you want to leave the group "${this.groupData?.groupName}"?`,
                confirmLabel: 'Leave Group',
                cancelLabel: 'Cancel'
            });

            if (confirmed) {
                const result = await leaveGroup(this.groupData.id);
                if (result.success === true) {
                    messagesState.addMessage('You have left the group.');
                    triggerGroupUpdated();
                    // Navigate back to groups list or another appropriate page
                    window.history.back();
                } else {
                    messagesState.addMessage(result.error, 'error');
                }
            }
        } catch (error) {
            console.error('Error leaving group:', error);
            messagesState.addMessage('An error occurred while leaving the group.', 'error');
        }
    }

    /**
     * Opens the bulk add to group modal
     * @private
     */
    _handleAddItems() {
        triggerBulkAddToGroupModal(this.groupData);
    }

    render() {
        const isOwner = isGroupOwner(this.groupData, userState?.userData?.id);
        const isAdmin = isGroupAdmin(this.groupData, userState?.userData?.id);

        return html`
            <custom-avatar size="150"
                           username="${this.groupData?.groupName}"
                           imageid="${this.groupData?.groupImage}"
                           shadow="true"
            ></custom-avatar>
            <h1 class="group-title">${this.groupData?.groupName}</h1>
            <p class="group-description">${this.groupData?.groupDescription}</p>
            
            <div class="action-buttons">
                <button aria-label="add-items-to-group"
                        class="icon-button button add-button"
                        @click="${this._handleAddItems}"
                        title="Add Items to Group"
                >
                    <plus-icon></plus-icon>
                </button>
                
                ${isAdmin ? html`
                    <button aria-label="edit-group"
                            class="icon-button button username-edit-button"
                            @click="${this._handleEditGroup}"
                            title="Edit Group"
                    >
                        <edit-icon></edit-icon>
                    </button>
                ` : ''}
                
                <button aria-label="leave-group"
                        class="icon-button button leave-button"
                        @click="${this._handleLeaveGroup}"
                        title="Leave Group"
                >
                    <leave-icon></leave-icon>
                </button>
                
                ${isOwner ? html`
                    <button aria-label="delete-group"
                            class="icon-button button delete-button"
                            @click="${this._handleDeleteGroup}"
                            title="Delete Group"
                    >
                        <delete-icon></delete-icon>
                    </button>
                ` : ''}
            </div>
            
            <custom-modal id="edit-group-modal" maxWidth="500px" noPadding>
                <edit-group-form 
                    .groupData="${this.groupData}"
                    @close-edit-group-modal="${this._closeEditGroupModal}">
                </edit-group-form>
            </custom-modal>
        `;
    }
}

customElements.define('group-details', GroupDetails);
