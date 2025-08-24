import { LitElement, html, css } from 'lit';
import buttonStyles from "../../css/buttons.js";
import formStyles from "../../css/forms.js";
import modalSections from "../../css/modal-sections.js";
import { createGroup } from '../../helpers/api/groups.js';
import { messagesState } from '../../state/messagesStore.js';
import '../global/custom-input.js';
import {triggerBulkAddToGroupModal, triggerGroupUpdated} from "../../events/eventListeners.js";
import '../global/image-selector-with-nav.js';

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
            modalSections,
            css`
                :host {
                    display: block;
                    width: 100%;
                }
                
                
                .form-description {
                    color: var(--text-color-medium);
                    margin: 0;
                    font-size: var(--font-size-small);
                }
                
                .form-fields {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-normal);
                }
                
                .image-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: var(--spacing-small);
                    margin-bottom: var(--spacing-normal);
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
            <div class="modal-container">
                <div class="modal-header">
                    <h2>Create a New Group</h2>
                    <p class="form-description">Create a group to share lists with friends, family, or co-workers.</p>
                </div>
                
                <div class="modal-content">
                    <div class="form-fields">
                    <div class="image-container">
                        <image-selector-with-nav
                                imageId="${this.groupImage}"
                                username="${this.groupName || 'New Group'}"
                                size="180"
                                showAi
                                allowNavigation
                                @image-changed="${this._onImageChanged}">
                            <span style="font-size: var(--font-size-small);">Click the camera or AI button to add a group image</span>
                        </image-selector-with-nav>
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
                    </div>
                </div>
                
                <div class="modal-footer">
                    <button 
                        type="button" 
                        class="secondary" 
                        @click="${this._handleCancel}"
                        ?disabled="${this.isCreatingGroup}"
                    >
                        Cancel
                    </button>
                    <button 
                        type="button" 
                        @click="${this._handleSubmit}" 
                        class="primary" 
                        ?disabled="${this.isCreatingGroup || !this.groupName.trim()}"
                    >
                        ${this.isCreatingGroup ? 'Creating...' : 'Create Group'}
                    </button>
                </div>
            </div>
        `;
    }
}

customElements.define('create-group-form', CreateGroupForm);
