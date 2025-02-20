import {LitElement, html, css} from 'lit';
import buttonStyles from "../../css/buttons";
import '../../svg/x.js';
import '../../svg/camera.js';
import '../global/custom-input.js';
import {observeState} from 'lit-element-state';
import {userState} from "../../state/userStore.js";
import {listenToCustomEvent} from "../../events/custom-events.js";
import {customFetch} from "../../helpers/fetchHelpers.js";
import {updateUserData} from "../../helpers/api/users.js";
import {messagesState} from "../../state/messagesStore.js";
import '../global/image-changer.js';

export class CustomElement extends observeState(LitElement) {
    static properties = {
        value: { type: String },
        imageId: {type: Number},
        username: { type: String },
        description: { type: String },
        errorMessage: { type: String } // New property to hold error messages
    };

    constructor() {
        super();
        this.imageId = 0;
        this.value = '';
        this.username = '';
        this.description = '';
        this.errorMessage = '';
    }

    connectedCallback() {
        super.connectedCallback();
        this.setUserData();
        listenToCustomEvent('user-data-loaded', () => {
            this.setUserData();
        });
    }

    disconnectedCallback() {
        // Remove the listener when the element is removed
        userState.removeEventListener('state-changed', this._onUserStateChanged);
        super.disconnectedCallback();
    }

    setUserData() {
        // Update the properties when userState becomes available or changes
        if (userState && userState.userData) {
            this.imageId = userState.userData.image || 0;
            this.username = userState.userData.name;
            this.description = userState.userData.publicDescription;
        }
    }

    _onUsernameChanged(e) {
        this.username = e.detail.value;
        // Clear error message when the user starts typing
        this.errorMessage = '';
    }

    _onDescriptionChanged(e) {
        this.description = e.detail.value;
        // Clear error message when the user starts typing
        this.errorMessage = '';
    }

    _onImageChanged(e) {
        this.imageId = e.detail.imageId;
        console.log(e.detail.imageId);
        this.errorMessage = '';
    }

    _close(clear) {
        if (clear) {
            this.description = userState.userData.publicDescription;
            this.username = userState.userData.name;
            this.imageId = userState.userData?.image || 0;
        }
        this.dispatchEvent(new CustomEvent('close-edit-user-modal'));
    }

    async _handleSave() {
        if (!userState.userData.id) return;
        const data = {
            imageId: this.imageId,
            name: this.username,
            publicDescription: this.description,
            userId: userState.userData.id,
        };
        const response = await updateUserData(data);
        if (response.success) {
            messagesState.addMessage('User info successfully updated');
            this._close();
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
            <div class="header">
                <h2>Edit Profile</h2>
            </div>
            <div class="content">
                
                <div class="user-image">
                    <!-- Use the component's username property -->
                    <custom-avatar size="120" username="${this.username}" imageId="${this.imageId}"></custom-avatar>
                    <image-changer  
                                    imageId="${this.imageId}"
                                    @image-changed="${this._onImageChanged}"></image-changer>
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

customElements.define('edit-user-form', CustomElement);
