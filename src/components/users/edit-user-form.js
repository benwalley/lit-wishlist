import {LitElement, html, css} from 'lit';
import buttonStyles from "../../css/buttons";
import modalSections from "../../css/modal-sections.js";
import '../../svg/x.js';
import '../../svg/info.js';
import '../../svg/world.js';
import '../../svg/lock.js';
import '../instructions/info-tooltip.js';
import '../instructions/publicity-details.js';
import '../global/custom-input.js';
import '../global/custom-modal.js';
import '../global/image-selector-with-nav.js';
import {observeState} from 'lit-element-state';
import {userState} from "../../state/userStore.js";
import {listenToCustomEvent} from "../../events/custom-events.js";
import {customFetch} from "../../helpers/fetchHelpers.js";
import {updateUserData} from "../../helpers/api/users.js";
import {messagesState} from "../../state/messagesStore.js";
import '../global/custom-toggle.js';
import {triggerUpdateUser} from "../../events/eventListeners.js";

export class CustomElement extends observeState(LitElement) {
    static properties = {
        value: {type: String},
        imageId: {type: Number},
        username: {type: String},
        description: {type: String},
        isPublic: {type: Boolean},
        errorMessage: {type: String} // New property to hold error messages
    };

    constructor() {
        super();
        this.imageId = 0;
        this.value = '';
        this.username = '';
        this.description = '';
        this.isPublic = false;
        this.errorMessage = '';
    }

    connectedCallback() {
        super.connectedCallback();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
    }

    _getModal() {
        return this.shadowRoot.querySelector('#edit-user-modal')
    }

    editCurrentUser() {
        this.setUserData()
        this._getModal().openModal();
    }

    setUserData = () => {
        if (userState?.userData) {
            this.imageId = userState.userData.image || 0;
            this.username = userState.userData.name || '';
            this.description = userState.userData.publicDescription || '';
            this.isPublic = userState.userData.isPublic || false;
        }
    }

    _onUsernameChanged(e) {
        this.username = e.detail.value;
        this.errorMessage = '';
    }

    _onDescriptionChanged(e) {
        this.description = e.detail.value;
        this.errorMessage = '';
    }

    _onImageChanged(e) {
        this.imageId = e.detail.imageId;
        this.errorMessage = '';
    }

    _onPublicToggleChanged(e) {
        this.isPublic = e.detail.checked;
        this.errorMessage = '';
    }

    _close(clear) {
        if (clear) {
            this.description = userState.userData.publicDescription || '';
            this.username = userState.userData.name || '';
            this.imageId = userState.userData?.imageId || 0;
            this.isPublic = userState.userData.isPublic || false;
        }
        this._getModal().closeModal();
    }

    async _handleSubmit(e) {
        e.preventDefault();
        if (!userState.userData.id) return;
        const data = {
            image: this.imageId,
            name: this.username,
            publicDescription: this.description,
            isPublic: this.isPublic,
            userId: userState.userData.id,
        };
        const response = await updateUserData(data);
        if (response.success) {
            messagesState.addMessage('User info successfully updated');
            this._close();
            triggerUpdateUser();
        } else {
            this._showError(
                response.message || 'There was an error saving your user. Please try again.'
            );
        }
    }

    _showError(message) {
        this.errorMessage = message;
    }


    static get styles() {
        return [
            buttonStyles,
            modalSections,
            css`
                :host {
                    /* host styles if needed */
                }


                .content {
                    align-items: center;
                    justify-content: center;
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-normal);
                }

                /* Error message styles */
                .error {
                    color: red;
                    font-size: 0.9em;
                    margin: 10px 0;
                    text-align: center;
                }

                .publicity-row {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-x-small);
                }
            `
        ];
    }

    render() {
        return html`
            <custom-modal id="edit-user-modal"
                          maxWidth="600px"
                          noPadding
                          @modal-changed="${this._handleModalChanged}">
                <div class="modal-container">
                    <div class="modal-header">
                        <h2>Edit Profile</h2>
                    </div>
                    <form @submit="${this._handleSubmit}">
                        <div class="modal-content">
                            <div class="content">

                        <image-selector-with-nav
                                imageId="${this.imageId}"
                                username="${this.username}"
                                size="120"
                                showAi
                                allowNavigation
                                @image-changed="${this._onImageChanged}">
                            <span style="text-align: center;">Click the camera or AI button to change your profile picture</span>
                        </image-selector-with-nav>

                        <!-- Listen for value-changed events to update properties -->
                        <custom-input
                                placeholder="Username"
                                showLabel
                                value="${this.username}"
                                @value-changed="${this._onUsernameChanged}"
                        ></custom-input>
                        <custom-input
                                placeholder="Description"
                                showLabel
                                value="${this.description}"
                                @value-changed="${this._onDescriptionChanged}"
                        ></custom-input>

                        <div class="publicity-row">
                            <custom-toggle
                                    label="${this.isPublic ? 'Public' : 'Not public'}"
                                    ?checked="${this.isPublic}"
                                    @change="${this._onPublicToggleChanged}"
                            ></custom-toggle>
                            ${this.isPublic ? html`
                                <info-tooltip tooltipText="This user is public. (Click for more details about publicity.)"
                                              buttonClasses="purple-text large">
                                    <world-icon slot="icon"></world-icon>
                                    <publicity-details slot="modal-content"></publicity-details>
                                </info-tooltip>
                            ` : html`
                                <info-tooltip tooltipText="This user is not public. (Click for more details about publicity.)"
                                              buttonClasses="large">
                                    <lock-icon slot="icon"></lock-icon>
                                    <publicity-details slot="modal-content"></publicity-details>
                                </info-tooltip>
                            `}

                        </div>

                            <!-- Error message -->
                            ${this.errorMessage ? html`
                                <div class="error">${this.errorMessage}</div>` : ''}
                            </div>
                        </div>
                    </form>
                    <div class="modal-footer">
                        <button type="button" class="secondary" @click="${() => this._close(true)}">
                            Cancel
                        </button>
                        <button type="submit" class="primary" @click="${this._handleSubmit}">
                            Save Changes
                        </button>
                    </div>
                </div>
            </custom-modal>
        `;
    }
}

customElements.define('edit-user-form', CustomElement);
