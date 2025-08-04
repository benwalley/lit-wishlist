import {LitElement, html, css} from 'lit';
import buttonStyles from "../../css/buttons";
import '../../svg/x.js';
import '../../svg/camera.js';
import '../global/custom-input.js';
import '../global/custom-modal.js';
import '../pages/account/avatar.js';
import {observeState} from 'lit-element-state';
import {userState} from "../../state/userStore.js";
import {listenToCustomEvent} from "../../events/custom-events.js";
import {customFetch} from "../../helpers/fetchHelpers.js";
import {updateUserData} from "../../helpers/api/users.js";
import {messagesState} from "../../state/messagesStore.js";
import '../global/image-changer.js';
import {listenUserUpdated, triggerUpdateUser} from "../../events/eventListeners.js";

export class CustomElement extends observeState(LitElement) {
    static properties = {
        value: { type: String },
        imageId: {type: Number},
        username: { type: String },
        description: { type: String },
        errorMessage: { type: String }, // New property to hold error messages
        isModalOpen: { type: Boolean }
    };

    constructor() {
        super();
        this.imageId = 0;
        this.value = '';
        this.username = '';
        this.description = '';
        this.errorMessage = '';
        this.isModalOpen = false;
    }

    connectedCallback() {
        super.connectedCallback();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
    }

    editCurrentUser() {
        this.setUserData()
        this.isModalOpen = true;
    }

    setUserData = () => {
        if (userState?.userData) {
            this.imageId = userState.userData.image || 0;
            this.username = userState.userData.name || '';
            this.description = userState.userData.publicDescription || '';
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

    _close(clear) {
        if (clear) {
            this.description = userState.userData.publicDescription || '';
            this.username = userState.userData.name || '';
            this.imageId = userState.userData?.imageId || 0;
        }
        this.isModalOpen = false;
    }

    async _handleSubmit(e) {
        e.preventDefault();
        if (!userState.userData.id) return;
        const data = {
            image: this.imageId,
            name: this.username,
            publicDescription: this.description,
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
            css`
                :host {
                    /* host styles if needed */
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
                .content .user-image {
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

                /* Error message styles */
                .error {
                    color: red;
                    font-size: 0.9em;
                    margin: 10px 0;
                    text-align: center;
                }
            `
        ];
    }

    render() {
        return html`
            <custom-modal id="edit-user-modal" maxWidth="500px" noPadding .isOpen="${this.isModalOpen}">
                <div class="header">
                    <h2>Edit Profile</h2>
                </div>
                <form @submit="${this._handleSubmit}">
                    <div class="content">
                        
                        <div class="user-image">
                            <!-- Use the component's username property -->
                            <custom-avatar size="120" 
                                           shadow 
                                           username="${this.username}" 
                                           imageId="${this.imageId}">
                            </custom-avatar>
                            <image-changer  
                                            imageId="${this.imageId}"
                                            @image-updated="${this._onImageChanged}"></image-changer>
                        </div>
                        <span>Click the camera to change your profile picture</span>

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

                        <!-- Error message -->
                        ${this.errorMessage ? html`<div class="error">${this.errorMessage}</div>` : ''}
                    </div>
                    <div class="footer">
                        <button type="button" class="button ghost shadow" @click="${() => this._close(true)}">
                            Cancel
                        </button>
                        <button type="submit" class="button primary shadow">
                            Save Changes
                        </button>
                    </div>
                </form>
            </custom-modal>
        `;
    }
}

customElements.define('edit-user-form', CustomElement);
