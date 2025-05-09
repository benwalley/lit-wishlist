import { LitElement, html, css } from 'lit';
import buttonStyles from "../../css/buttons.js";
import formStyles from "../../css/forms.js";
import { createGroup } from '../../helpers/api/groups.js';
import { messagesState } from '../../state/messagesStore.js';
import '../global/custom-input.js';
import {triggerBulkAddToGroupModal, triggerGroupUpdated} from "../../events/eventListeners.js";
import '../pages/account/avatar.js';
import '../global/image-changer.js';
import '../../svg/camera.js';

export class CreateGroupForm extends LitElement {
    static properties = {
        groupName: { type: String },
        groupDescription: { type: String },
        isCreatingGroup: { type: Boolean },
        createError: { type: String },
        groupImage: { type: Number },
    };

    constructor() {
        super();
        this.groupName = '';
        this.groupDescription = '';
        this.isCreatingGroup = false;
        this.createError = '';
        this.groupImage = 0;
    }

    static get styles() {
        return [
            buttonStyles,
            formStyles,
            css`
                :host {
                    display: block;
                    width: 100%;
                }
                
                .form-container {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-normal);
                    padding: var(--spacing-normal);
                }
                
                .form-title {
                    font-size: var(--font-size-large);
                    font-weight: bold;
                    margin: 0;
                    color: var(--text-color-dark);
                }
                
                .form-description {
                    color: var(--text-color-medium);
                    margin: 0 0 var(--spacing-normal) 0;
                    font-size: var(--font-size-small);
                }
                
                .form-fields {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-normal);
                }
                
                .user-image {
                    position: relative;
                    margin: 0 auto;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }
                
                .image-container {
                    position: relative;
                    margin-bottom: var(--spacing-normal);
                    display: flex;
                    flex-direction: column;
                }
                
                .actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: var(--spacing-small);
                    margin-top: var(--spacing-normal);
                }
                
                .error-message {
                    color: var(--error-color);
                    font-size: var(--font-size-small);
                }
            `
        ];
    }

    _handleNameChange(e) {
        this.groupName = e.detail.value;
        if (this.createError) this.createError = '';
    }

    _handleDescriptionChange(e) {
        this.groupDescription = e.detail.value;
    }

    _onImageChanged(e) {
        this.groupImage = e.detail.imageId;
        if (this.createError) this.createError = '';
    }

    async _handleSubmit(e) {
        e.preventDefault();

        this.isCreatingGroup = true;
        this.createError = '';

        try {
            const groupData = {
                groupName: this.groupName.trim(),
                groupDescription: this.groupDescription.trim(),
                groupImage: this.groupImage || 0
            };

            const result = await createGroup(groupData);

            if (result.success) {
                // Notify parent that group was created
                this.dispatchEvent(new CustomEvent('group-created', {
                    detail: { group: result.data },
                    bubbles: true,
                    composed: true
                }));

                // Show success message
                messagesState.addMessage('Group created successfully', 'success');

                this._resetForm();

                // Close modal (handled by parent)
                this.dispatchEvent(new CustomEvent('close-modal', {
                    bubbles: true,
                    composed: true
                }));
                triggerGroupUpdated()
                // Pass the newly created group data to the bulk add modal
                triggerBulkAddToGroupModal(result.data)
            } else {
                this.createError = result.error?.message || 'Failed to create group. Please try again.';
                messagesState.addMessage('Failed to create group', 'error');
            }
        } catch (error) {
            console.error('Error creating group:', error);
            this.createError = 'An unexpected error occurred. Please try again.';
            messagesState.addMessage('Failed to create group', 'error');
        } finally {
            this.isCreatingGroup = false;
        }
    }

    _resetForm() {
        this.groupName = '';
        this.groupDescription = '';
        this.groupImage = 0;
    }

    _handleCancel() {
        this.dispatchEvent(new CustomEvent('close-modal', {
            bubbles: true,
            composed: true
        }));
    }

    render() {
        return html`
            <div class="form-container">
            <div class="modal-header">
                <h2 class="form-title">Create a New Group</h2>
                <p class="form-description">Create a group to share lists with friends, family, or co-workers.</p>
            </div>
               
                
                <form class="form-fields" @submit="${this._handleSubmit}">
                    <div class="image-container">
                        <div class="user-image">
                            <custom-avatar size="120"
                                          shadow
                                          username="${this.groupName || 'New Group'}"
                                          imageId="${this.groupImage}">
                            </custom-avatar>
                            <image-changer
                                    imageId="${this.groupImage}"
                                    @image-updated="${this._onImageChanged}"></image-changer>
                        </div>
                        <p style="text-align: center; margin-top: var(--spacing-small); font-size: var(--font-size-small);">Click the camera to add a group image</p>
                    </div>
                    
                    <custom-input
                        id="group-name"
                        label="Group Name"
                        placeholder="Enter group name"
                        .value="${this.groupName}"
                        @value-changed="${this._handleNameChange}"
                        ?required="${true}"
                    ></custom-input>
                    
                    <custom-input
                        id="group-description"
                        label="Description (Optional)"
                        placeholder="Enter group description"
                        .value="${this.groupDescription}"
                        @value-changed="${this._handleDescriptionChange}"
                    ></custom-input>
                    
                    ${this.createError ? html`<p class="error-message">${this.createError}</p>` : ''}
                    
                    <div class="actions">
                        <button 
                            type="button" 
                            class="secondary" 
                            @click="${this._handleCancel}"
                            ?disabled="${this.isCreatingGroup}"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            class="primary" 
                            ?disabled="${this.isCreatingGroup || !this.groupName.trim()}"
                        >
                            ${this.isCreatingGroup ? 'Creating...' : 'Create Group'}
                        </button>
                    </div>
                </form>
            </div>
        `;
    }
}

customElements.define('create-group-form', CreateGroupForm);
