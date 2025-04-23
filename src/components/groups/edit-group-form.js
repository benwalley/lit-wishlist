import {LitElement, html, css} from 'lit';
import buttonStyles from "../../css/buttons";
import '../../svg/x.js';
import '../../svg/camera.js';
import '../global/custom-input.js';
import '../global/image-changer.js';
import {updateGroup} from "../../helpers/api/groups.js";
import {messagesState} from "../../state/messagesStore.js";
import {triggerGroupUpdated} from "../../events/eventListeners.js";
import '../pages/account/avatar.js';

export class EditGroupForm extends LitElement {
    static properties = {
        groupData: { type: Object },
        imageId: { type: Number },
        groupName: { type: String },
        groupDescription: { type: String },
        errorMessage: { type: String }
    };

    constructor() {
        super();
        this.groupData = {};
        this.imageId = 0;
        this.groupName = '';
        this.groupDescription = '';
        this.errorMessage = '';
    }

    connectedCallback() {
        super.connectedCallback();
        this.setGroupData();
    }

    setGroupData() {
        if (this.groupData) {
            this.imageId = this.groupData.groupImage || 0;
            this.groupName = this.groupData.groupName || '';
            this.groupDescription = this.groupData.groupDescription || '';
        }
    }

    _onGroupNameChanged(e) {
        this.groupName = e.detail.value;
        this.errorMessage = '';
    }

    _onDescriptionChanged(e) {
        this.groupDescription = e.detail.value;
        this.errorMessage = '';
    }

    _onImageChanged(e) {
        this.imageId = e.detail.imageId;
        this.errorMessage = '';
    }

    _close(clear) {
        if (clear) {
           this._clearForm();
        }
        this.dispatchEvent(new CustomEvent('close-edit-group-modal'));
    }

    _clearForm() {
        this.groupDescription = this.groupData.groupDescription || '';
        this.groupName = this.groupData.groupName || '';
        this.imageId = this.groupData.groupImage || 0;
    }

    async _handleSave() {
        if (!this.groupData.id) return;

        if (!this.groupName.trim()) {
            this._showError('Group name is required');
            return;
        }

        const data = {
            id: this.groupData.id,
            groupImage: this.imageId,
            groupName: this.groupName,
            groupDescription: this.groupDescription,
        };

        const response = await updateGroup(data);
        if (response.success) {
            messagesState.addMessage('Group successfully updated');
            triggerGroupUpdated();
            this._close();
        } else {
            messagesState.addMessage( response.error?.message || 'There was an error updating the group. Please try again.', 'error')
        }
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    display: block;
                }

                .header {
                    padding: var(--spacing-normal);
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    border-bottom: 1px solid var(--border-color);
                }
                
                .header h2 {
                    margin: 0;
                }

                .content {
                    align-items: center;
                    justify-content: center;
                    display: flex;
                    flex-direction: column;
                    padding: var(--spacing-normal);
                    gap: var(--spacing-normal);
                }
                
                .content .group-image {
                    position: relative;
                    display: flex;
                }

                .footer {
                    display: flex;
                    padding: var(--spacing-normal);
                    gap: var(--spacing-normal);
                    border-top: 1px solid var(--border-color);
                    background: var(--background-dark);
                    justify-content: flex-end;
                }

                .error {
                    color: var(--delete-red);
                    font-size: 0.9em;
                    margin: 10px 0;
                    text-align: center;
                }
            `
        ];
    }

    render() {
        return html`
            <div class="header">
                <h2>Edit Group</h2>
            </div>
            <div class="content">
                <div class="group-image">
                    <custom-avatar size="120" 
                                   shadow 
                                   username="${this.groupName}" 
                                   imageid="${this.imageId}">
                    </custom-avatar>
                    <image-changer imageId="${this.imageId}"
                                  @image-updated="${this._onImageChanged}"></image-changer>
                </div>
                <span>Click the camera to change your group picture</span>

                <custom-input
                        placeholder="Group Name"
                        showLabel
                        value="${this.groupName}"
                        @value-changed="${this._onGroupNameChanged}"
                ></custom-input>
                <custom-input
                        placeholder="Group Description"
                        showLabel
                        value="${this.groupDescription}"
                        @value-changed="${this._onDescriptionChanged}"
                ></custom-input>

                ${this.errorMessage ? html`<div class="error">${this.errorMessage}</div>` : ''}
            </div>
            <div class="footer">
                <button class="button ghost shadow" @click="${() => this._close(true)}">
                    Cancel
                </button>
                <button class="button primary shadow" @click="${this._handleSave}">
                    Save Changes
                </button>
            </div>
        `;
    }
}

customElements.define('edit-group-form', EditGroupForm);
