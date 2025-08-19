import {LitElement, html, css} from 'lit';
import buttonStyles from "../../css/buttons";
import modalSections from "../../css/modal-sections.js";
import '../../svg/x.js';
import '../../svg/camera.js';
import '../../svg/info.js';
import '../../svg/world.js';
import '../../svg/lock.js';
import '../../svg/ai.js';
import '../../svg/abstract.js';
import '../../svg/dog.js';
import '../instructions/info-tooltip.js';
import '../instructions/publicity-details.js';
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
import '../global/custom-toggle.js';
import {triggerUpdateUser} from "../../events/eventListeners.js";
import {generateCustomImage, generateImage} from "../../helpers/api/ai.js";

export class CustomElement extends observeState(LitElement) {
    static properties = {
        value: {type: String},
        imageId: {type: Number},
        username: {type: String},
        description: {type: String},
        isPublic: {type: Boolean},
        errorMessage: {type: String}, // New property to hold error messages
        showAiInput: {type: Boolean},
        aiPrompt: {type: String},
        isGeneratingImage: {type: Boolean}
    };

    constructor() {
        super();
        this.imageId = 0;
        this.value = '';
        this.username = '';
        this.description = '';
        this.isPublic = false;
        this.errorMessage = '';
        this.showAiInput = false;
        this.aiPrompt = '';
        this.isGeneratingImage = false;
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
        // Reset AI state
        this.showAiInput = false;
        this.aiPrompt = '';
        this.isGeneratingImage = false;
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

    _toggleAiInput(e) {
        e.preventDefault();
        this.showAiInput = !this.showAiInput;
        this.errorMessage = '';
    }

    _onAiPromptChanged(e) {
        this.aiPrompt = e.detail.value;
        this.errorMessage = '';
    }

    async _generateAiImage(e) {
        e.preventDefault();
        const submitter = e.submitter;
        let type = submitter?.dataset?.imageType || 'custom';

        if (!this.aiPrompt.trim()) {
            type = Math.random() < 0.5 ? 'abstract' : 'animal';
        }

        this.isGeneratingImage = true;
        this.errorMessage = '';


        try {
            const result = await generateImage(type, this.aiPrompt.trim());

            if (result.success && result.imageId) {
                this.imageId = result.imageId;
                this.showAiInput = false;
                this.aiPrompt = '';
                messagesState.addMessage('AI image generated successfully');
            } else {
                this._showError(result.error || 'Failed to generate AI image');
            }
        } catch (error) {
            console.error('Error generating AI image:', error);
            this._showError('An unexpected error occurred while generating the image');
        } finally {
            this.isGeneratingImage = false;
        }
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

                .content .user-image {
                    position: relative;
                    display: flex;
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

                .ai-generate-button {
                    box-sizing: border-box;
                    font-size: var(--font-size-large);
                    position: absolute;
                    padding: var(--spacing-small);
                    bottom: -6px;
                    left: -6px;
                }

                .ai-input-container {
                    width: 100%;
                    margin-top: var(--spacing-normal);
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-small);
                }

                .ai-generate-row {
                    display: flex;
                    gap: var(--spacing-small);
                    align-items: flex-end;
                    flex-wrap: wrap;
                }

                .ai-generate-row custom-input {
                    flex: 1;
                    min-width: 200px;
                }

                .ai-generate-row button.icon {
                   font-size: var(--font-size-large);
                    padding: var(--spacing-small);
                }
                
                .submitGenerateButton {
                    font-size: var(--font-size-normal);
                    padding: var(--spacing-small);
                    line-height: var(--font-size-large);
                }

                .ai-notice {
                    margin: 0;
                    padding: var(--spacing-small);
                    background-color: var(--info-yellow-light);
                    border: 1px solid color-mix(in srgb, var(--info-yellow) 30%, transparent);
                    border-radius: var(--border-radius-small);
                    color: var(--info-yellow);
                    font-size: var(--font-size-small);
                    text-align: center;
                    line-height: 1.4;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: var(--spacing-x-small);
                }
            `
        ];
    }

    render() {
        return html`
            <custom-modal id="edit-user-modal"
                          maxWidth="500px"
                          noPadding
                          @modal-changed="${this._handleModalChanged}">
                <div class="modal-container">
                    <div class="modal-header">
                        <h2>Edit Profile</h2>
                    </div>
                    <form @submit="${this._handleSubmit}">
                        <div class="modal-content">
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
                            <button class="ai-generate-button primary shadow fancy" @click="${this._toggleAiInput}">
                                <ai-icon></ai-icon>
                            </button>
                        </div>
                        <span>Click the camera to change your profile picture</span>

                        <!-- AI Image Generation Input -->
                        ${this.showAiInput ? html`
                            <form @submit="${this._generateAiImage}" class="ai-input-container">
                                <div class="ai-generate-row">
                                    <custom-input
                                        placeholder="Describe an image..."
                                        value="${this.aiPrompt}"
                                        @value-changed="${this._onAiPromptChanged}"
                                        fullWidth>
                                    </custom-input>
                                    <button
                                        data-image-type="custom"
                                        type="submit"
                                        class="primary button fancy submitGenerateButton" 
                                        ?disabled="${this.isGeneratingImage}">
                                        ${this.isGeneratingImage ? 'Generating...' : 'Generate'}
                                    </button>
                                    <button
                                            data-image-type="abstract"
                                            type="submit"
                                            class="primary button fancy-alt icon"
                                            ?disabled="${this.isGeneratingImage}">
                                        <abstract-icon></abstract-icon>
                                    </button>
                                    <custom-tooltip>Generate a random abstract image</custom-tooltip>
                                    <button
                                            data-image-type="animal"
                                            type="submit"
                                            class="primary button icon"
                                            ?disabled="${this.isGeneratingImage}">
                                        <dog-icon></dog-icon>
                                    </button>
                                    <custom-tooltip>Generate image of a cartoon animal</custom-tooltip>
                                </div>
                                <p class="ai-notice"><info-icon></info-icon> Remember to save changes after generating</p>
                            </form>
                        ` : ''}

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
