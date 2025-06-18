import {LitElement, html, css} from 'lit';
import buttonStyles from "../../css/buttons.js";
import '../pages/account/avatar.js'
import '../global/custom-input.js'
import '../groups/your-groups-list.js'
import '../users/your-users-list.js'
import '../global/image-changer.js'
import '../../svg/user.js'
import '../../svg/group.js'
import '../../svg/camera.js'
import {messagesState} from "../../state/messagesStore.js";
import {triggerUpdateList} from "../../events/eventListeners.js";
import {updateList} from "../../helpers/api/lists.js";

export class EditListForm extends LitElement {
    static properties = {
        listData: {type: Object},
        listName: {type: String},
        description: {type: String},
        groups: {type: Array},
        users: {type: Array},
        imageId: {type: Number},
    };

    constructor() {
        super();
        this.listData = {};
        this.listName = '';
        this.description = '';
        this.groups = [];
        this.users = [];
        this.imageId = 0;
    }

    updated(changedProperties) {
        if (changedProperties.has('listData') && this.listData) {
            this._initializeForm();
        }
    }

    _initializeForm() {
        this.listName = this.listData.listName || '';
        this.description = this.listData.description || '';
        this.imageId = this.listData.imageId || 0;

        // Convert the visible groups and users to IDs if they're full objects
        this.groups = Array.isArray(this.listData.visibleToGroups)
            ? this.listData.visibleToGroups.map(group => typeof group === 'object' ? group.id : group)
            : [];

        this.users = Array.isArray(this.listData.visibleToUsers)
            ? this.listData.visibleToUsers.map(user => typeof user === 'object' ? user.id : user)
            : [];
    }

    async _handleSubmit(e) {
        e.preventDefault();
        const validationSuccess = this._validateForm();
        if (!validationSuccess) return;

        const formData = {
            id: this.listData.id,
            listName: this.listName,
            description: this.description,
            visibleToGroups: this.groups,
            visibleToUsers: this.users,
            imageId: this.imageId
        }

        const response = await updateList(formData);

        if (response.success) {
            messagesState.addMessage('List successfully updated');
            triggerUpdateList();
            this._closeModal();
        } else {
            messagesState.addMessage(response.message || 'Failed to update list', 'error');
        }
    }

    _closeModal(e) {
        if(e) {
            e.preventDefault();
        }
        // Reset form state
        this.listName = '';
        this.description = '';
        this.groups = [];
        this.users = [];
        this.imageId = 0;

        const modal = this.closest('custom-modal');
        if (modal && typeof modal.closeModal === 'function') {
            modal.closeModal();
        }
    }

    _validateForm() {
        const inputs = this.shadowRoot.querySelectorAll('custom-input');
        let allValid = true;

        inputs.forEach((input) => {
            if (!input.validate()) {
                allValid = false;
            }
        });

        if (!allValid) {
            messagesState.addMessage('Please complete all required fields', 'error');
            return false;
        }

        return true;
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                .container {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: var(--spacing-normal);
                    padding: var(--spacing-small);
                }
                
                h2 {
                    margin-top: 0;
                }
                
                .left-column {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-normal);
                    padding: var(--spacing-normal);
                    padding-top: 0;
                }
                
                .right-column {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-normal);
                }
                
                .image-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: var(--spacing-small);
                }
                
                .user-image {
                    position: relative;
                    display: flex;
                }
                
                .image-tip {
                    font-size: var(--font-size-small);
                    color: var(--text-color-medium-dark);
                    margin-top: var(--spacing-x-small);
                }
               
                
                .select-section {
                    box-sizing: border-box;
                    margin: 0 auto;
                    width: 100%;
                    background: var(--background-color);
                    border-radius: var(--border-radius-normal);
                    border: 1px solid var(--border-color);
                }

                .full-width {
                    grid-column: 1 / span 2;
                }

                .section-heading {
                    margin: 0;
                }

                .section-subheading h3 {
                    margin: 0;
                    display: flex;
                    flex-direction: row;
                    gap: 7px;
                    align-items: center;
                }
                
                .groups-section,
                .users-section {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-small);
                }

                .section-subheading-description {
                    margin: 0;
                    color: var(--text-color-medium-dark);
                    font-size: var(--font-size-x-small);
                    line-height: 1;
                }
                
                .button-container {
                    box-sizing: border-box;
                    width: 100%;
                    gap: var(--spacing-small);
                    justify-content: flex-end;
                    display: flex;
                    grid-column: 2;
                    padding-top: var(--spacing-normal);
                    
                    button {
                        width: auto;
                    }
                }
            `
        ];
    }

    render() {
        return html`
            <form class="container" @submit="${this._handleSubmit}">
                <h2 class="full-width">Edit List Details</h2>
                <div class="left-column">
                    <div class="image-container">
                        <div class="user-image">
                            <custom-avatar size="150" 
                                       .username="${this.listName}"
                                       .imageId="${this.imageId}"
                            ></custom-avatar>
                            <image-changer  
                                       .imageId="${this.imageId}"
                                       @image-updated="${this._onImageChanged}"></image-changer>
                        </div>
                        <span class="image-tip">Click the camera to change list image</span>
                    </div>
                    <custom-input placeholder="List Name" 
                                  required="true"
                                  .value="${this.listName}"
                                  @value-changed="${(e) => this.listName = e.detail.value}"
                    ></custom-input>
                    <custom-input class="full-width" 
                                  .value="${this.description}"
                                    placeholder="List Description (optional)"
                                  @value-changed="${(e) => this.description = e.detail.value}"
                    ></custom-input>
                </div>
                <div class="right-column">
                    <div class="groups-section">
                        <div class="full-width section-subheading">
                            <em class="full-width section-subheading-description">This list will be visible to anyone who is a part of the selected groups</em>
                        </div>

                        <div class="select-section">
                            <your-groups-list
                                    class="full-width"
                                    .selectedGroups="${this.groups}"
                                    @selection-changed="${this._handleGroupChange}"
                            ></your-groups-list>
                        </div>
                        
                    </div>
                    <div class="users-section">
                        <div class="full-width section-subheading">
                            <em class="full-width section-subheading-description">
                                In addition to users in the selected groups, any selected users will be able to see this list.
                            </em>
                        </div>
                        <div class="select-section">
                            <your-users-list
                                    class="full-width"
                                    apiEndpoint="/users/accessible"
                                    .selectedUsers="${this.users}"
                                    @selection-changed="${this._handleUserSelectionChanged}"
                            ></your-users-list>
                        </div>
                    </div>
                </div>
                

                <div class="button-container fullWidth">
                    <button type="button" @click="${this._closeModal}" class="secondary cancel-button">Cancel</button>
                    <button type="submit" class="primary save-button">
                        Save Changes
                    </button>
                </div>
            </form>
        `;
    }

    _handleGroupChange(e) {
        // Store group IDs rather than full group objects for API submission
        this.groups = e.detail.selectedGroups.map(group => group.id);
    }

    _onImageChanged(e) {
        this.imageId = e.detail.imageId;
    }

    _handleUserSelectionChanged(e) {
        // Store user IDs rather than full user objects for API submission
        this.users = e.detail.selectedUsers.map(user => user.id);
    }
}

customElements.define('edit-list-form', EditListForm);
