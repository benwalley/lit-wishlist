import {LitElement, html, css} from 'lit';
import buttonStyles from "../../css/buttons.js";
import modalSections from "../../css/modal-sections.js";
import '../global/custom-input.js'
import '../global/custom-toggle.js'
import '../groups/your-groups-list.js'
import '../users/your-users-list.js'
import '../global/image-selector-with-nav.js'
import '../../svg/user.js'
import '../../svg/group.js'
import {messagesState} from "../../state/messagesStore.js";
import {triggerUpdateList} from "../../events/eventListeners.js";
import {updateList} from "../../helpers/api/lists.js";
import {userState} from "../../state/userStore.js";
import {observeState} from "lit-element-state";

export class EditListForm extends observeState(LitElement) {
    static properties = {
        listData: {type: Object},
        listName: {type: String},
        description: {type: String},
        groups: {type: Array},
        users: {type: Array},
        imageId: {type: Number},
        isPublic: {type: Boolean},
    };

    constructor() {
        super();
        this.listData = {};
        this.listName = '';
        this.description = '';
        this.groups = [];
        this.users = [];
        this.imageId = 0;
        this.isPublic = false;
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
        this.isPublic = this.listData.public || false;

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
            imageId: this.imageId,
            public: this.isPublic
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
        this.isPublic = false;

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
            modalSections,
            css`
                .form-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: var(--spacing-normal);
                }
                
                @media screen and (min-width: 700px) {
                    .form-grid {
                        gap: calc(var(--spacing-normal) * 2);
                        grid-template-columns: 1fr 1fr;
                    }
                }
                
                h2 {
                    margin-top: 0;
                }
                
                .left-column {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-normal);
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
                
                .use-profile-image-btn {
                    background: none;
                    border: 1px solid var(--purple-normal);
                    color: var(--purple-normal);
                    padding: 6px 12px;
                    border-radius: var(--border-radius-small);
                    font-size: var(--font-size-x-small);
                    cursor: pointer;
                    transition: var(--transition-normal);
                }
                
                .use-profile-image-btn:hover {
                    background: var(--purple-light);
                    color: var(--purple-normal);
                }
               
                
                .select-section {
                    box-sizing: border-box;
                    margin: 0 auto;
                    width: 100%;
                    background: var(--background-color);
                    border-radius: var(--border-radius-normal);
                    border: 1px solid var(--border-color);
                }

                

                @media screen and (min-width: 700px) {
                    .full-width {
                        grid-column: 1 / span 2;
                    }
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
                
                
                .public-toggle-section {
                    margin-top: var(--spacing-normal);
                    padding: var(--spacing-small);
                    background-color: var(--background-dark);
                    border-radius: var(--border-radius-normal);
                    border: 1px solid var(--border-color);
                }
                
                .public-toggle-section h3 {
                    margin: 0 0 var(--spacing-small) 0;
                    font-size: var(--font-size-small);
                    font-weight: 600;
                    color: var(--text-color-dark);
                }
                
                .toggle-wrapper {
                    display: flex;
                    align-items: flex-start;
                    gap: var(--spacing-small);
                }
                
                .public-toggle-description {
                    font-size: var(--font-size-x-small);
                    color: var(--text-color-medium-dark);
                    line-height: 1.4;
                }
            `
        ];
    }

    render() {
        return html`
            <div class="modal-container">
                <div class="modal-header">
                    <h2>Edit List Details</h2>
                </div>
                
                <div class="modal-content">
                    <div class="form-grid">
                <div class="left-column">
                    <div class="image-container">
                        <image-selector-with-nav
                                imageId="${this.imageId}"
                                username="${this.listName}"
                                size="180"
                                showAi
                                allowNavigation
                                @image-changed="${this._onImageChanged}">
                            <span style="font-size: var(--font-size-small); color: var(--text-color-medium-dark);">Click the camera or AI button to change list image</span>
                        </image-selector-with-nav>
                        ${userState?.userData?.image ? html`
                            <button 
                                type="button" 
                                class="use-profile-image-btn"
                                @click="${this._useProfileImage}"
                            >
                                Use Profile Image
                            </button>
                        ` : ''}
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
                    
                    <div class="public-toggle-section">
                        <h3>Public Visibility</h3>
                        <div class="toggle-wrapper">
                            <custom-toggle
                                id="is-public-toggle"
                                @change="${(e) => this.isPublic = e.detail.checked}"
                                .checked="${this.isPublic}"
                            ></custom-toggle>
                            <label for="is-public-toggle" class="public-toggle-description">
                                If enabled, all users including non logged in users will be able to see this list. Individual items in the list can be marked as not public.
                            </label>
                        </div>
                    </div>
                </div>
${!this.isPublic ? html`
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
                                        requireCurrentUser
                                        @selection-changed="${this._handleUserSelectionChanged}"
                                ></your-users-list>
                            </div>
                        </div>
                    </div>
                ` : html`<div></div>`}
                    </div>
                </div>
                
                <div class="modal-footer">
                    <button type="button" @click="${this._closeModal}" class="secondary">Cancel</button>
                    <button type="button" @click="${this._handleSubmit}" class="primary">
                        Save Changes
                    </button>
                </div>
            </div>
        `;
    }

    _handleGroupChange(e) {
        // Store group IDs rather than full group objects for API submission
        this.groups = e.detail.selectedGroups.map(group => group.id);
    }

    _onImageChanged(e) {
        this.imageId = e.detail.imageId;
    }

    _useProfileImage() {
        if (userState?.userData?.image) {
            this.imageId = userState.userData.image;
        } else {
            messagesState.addMessage('No profile image found to use', 'error');
        }
    }

    _handleUserSelectionChanged(e) {
        // Store user IDs rather than full user objects for API submission
        this.users = e.detail.selectedUsers.map(user => user.id);
    }
}

customElements.define('edit-list-form', EditListForm);
