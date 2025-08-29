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
import '../../svg/plus.js'
import {messagesState} from "../../state/messagesStore.js";
import {triggerBulkAddToListModal, triggerUpdateList} from "../../events/eventListeners.js";
import {createList} from "../../helpers/api/lists.js";


export class CreateListForm extends LitElement {
    static properties = {
        listName: {type: String},
        description: {type: String},
        groups: {type: Array},
        users: {type: Array},
        imageId: {type: Number},
        isPublic: {type: Boolean},
    };

    constructor() {
        super();
        this.listName = '';
        this.description = '';
        this.groups = [];
        this.users = [];
        this.imageId = 0;
        this.isPublic = false;
    }

    async _handleSubmit(e) {
        e.preventDefault();
        const validationSuccess = this._validateForm();
        if (!validationSuccess) return;
        const formData = {
            listName: this.listName,
            description: this.description,
            visibleToGroups: this.groups,
            visibleToUsers: this.users,
            imageId: this.imageId,
            public: this.isPublic
        }

        const response = await createList(formData);

        if (response.success) {
            messagesState.addMessage('List successfully created');
            triggerUpdateList();
            triggerBulkAddToListModal(response.data)
            this._closeModal();
        } else {
            messagesState.addMessage('Failed to create list', 'error');
        }

    }

    _closeModal(e) {
        if(e) {
            e.preventDefault();
        }
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
                    gap: var(--spacing-medium);
                }

                @media only screen and (min-width: 700px) {
                    .form-grid {
                        grid-template-columns: 1fr 1fr;
                    }
                }
                
                h2 {
                    margin: 0;
                }
                
                .left-column {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-normal);
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
               
                
                .select-section {
                    box-sizing: border-box;
                    margin: 0 auto;
                    width: 100%;
                    background: var(--background-color);
                    border-radius: var(--border-radius-normal);
                    border: 1px solid var(--border-color);
                }

                .full-width {
                    grid-column: 1 / -1;
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
                    <h2>Create New List</h2>
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
                    </div>
                    <custom-input placeholder="List Name" 
                                  required="true"
                                  .value="${this.listName}"
                                  @value-changed="${(e) => this.listName = e.detail.value}"
                    ></custom-input>
                    <custom-input class="full-width" 
                                  .value="${this.description}"
                                    placeholder="Group Description (optional)"
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
                        <plus-icon></plus-icon>
                        Create List
                    </button>
                </div>
            </div>
        `;
    }

    _handleGroupChange(e) {
        this.groups = e.detail.selectedGroups.map(group => group.id);
    }

    _onImageChanged(e) {
        this.imageId = e.detail.imageId;
    }

    _handleUserSelectionChanged(e) {
        this.users = e.detail.selectedUsers.map(user => user.id);
    }
}

customElements.define('create-list-form', CreateListForm);
