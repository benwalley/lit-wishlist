import {LitElement, html, css} from 'lit';
import buttonStyles from "../../css/buttons.js";
import modalSections from "../../css/modal-sections.js";
import '../../svg/camera.js';
import '../../svg/ai.js';
import '../../svg/abstract.js';
import '../../svg/dog.js';
import '../../svg/info.js';
import '../../svg/arrow-long.js';
import '../../svg/arrow-long-left.js';
import '../pages/account/avatar.js';
import './image-changer.js';
import './custom-input.js';
import './custom-tooltip.js';
import {generateImage} from "../../helpers/api/ai.js";
import {messagesState} from "../../state/messagesStore.js";

export class ImageSelectorWithNav extends LitElement {
    static properties = {
        imageId: {type: Number},
        username: {type: String},
        size: {type: Number},
        showAi: {type: Boolean},
        allowNavigation: {type: Boolean},
        imageHistory: {type: Array},
        currentImageIndex: {type: Number},
        showAiInput: {type: Boolean},
        aiPrompt: {type: String},
        isGeneratingImage: {type: Boolean},
        errorMessage: {type: String}
    };

    constructor() {
        super();
        this.imageId = 0;
        this.username = '';
        this.size = 200;
        this.showAi = true;
        this.allowNavigation = true;
        this.imageHistory = [];
        this.currentImageIndex = -1;
        this.showAiInput = false;
        this.aiPrompt = '';
        this.isGeneratingImage = false;
        this.errorMessage = '';
    }

    connectedCallback() {
        super.connectedCallback();
        // Initialize image history with current imageId if it exists
        this._initializeImageHistory();
    }

    updated(changedProperties) {
        super.updated(changedProperties);
        // If imageId changed from parent, ensure it's in the history
        if (changedProperties.has('imageId') && this.imageId > 0) {
            this._initializeImageHistory();
        }
    }

    /**
     * Initialize image history with current imageId to ensure navigation works
     */
    _initializeImageHistory() {
        if (this.imageId > 0) {
            // Check if current imageId is already in history
            const existingIndex = this.imageHistory.indexOf(this.imageId);
            if (existingIndex === -1) {
                // Current image not in history, add it as the first item
                this.imageHistory = [this.imageId, ...this.imageHistory];
                this.currentImageIndex = 0;
            } else {
                // Current image is in history, set it as current
                this.currentImageIndex = existingIndex;
            }
        }
    }

    /**
     * Handle image change from image-changer component
     */
    _onImageChanged(e) {
        const newImageId = e.detail.imageId;
        this._addImageToHistory(newImageId);
        this._dispatchImageChangedEvent();
    }

    /**
     * Navigate between images in the history
     * @param {string} direction - 'prev' or 'next'
     */
    _navigateImage(direction) {
        if (this.imageHistory.length <= 1) return;

        let newIndex = this.currentImageIndex;

        if (direction === 'prev') {
            newIndex = Math.max(0, this.currentImageIndex - 1);
        } else if (direction === 'next') {
            newIndex = Math.min(this.imageHistory.length - 1, this.currentImageIndex + 1);
        }

        if (newIndex !== this.currentImageIndex) {
            this.currentImageIndex = newIndex;
            this.imageId = this.imageHistory[newIndex];
            this._dispatchImageChangedEvent();
        }
    }

    /**
     * Add a new image to the history and set it as current
     * @param {number} imageId - The ID of the image to add
     */
    _addImageToHistory(imageId) {
        if (imageId && imageId > 0) {
            // Avoid duplicates by checking if image already exists
            const existingIndex = this.imageHistory.indexOf(imageId);
            if (existingIndex !== -1) {
                // If image already exists, just navigate to it
                this.currentImageIndex = existingIndex;
                this.imageId = imageId;
            } else {
                // Add new image to history and set as current
                this.imageHistory = [...this.imageHistory, imageId];
                this.currentImageIndex = this.imageHistory.length - 1;
                this.imageId = imageId;
            }
        } else {
            // Handle image removal (imageId = 0)
            this.imageId = 0;
            // Keep the history but reset current index
            this.currentImageIndex = -1;
        }
    }

    /**
     * Dispatch image-changed event to parent components
     */
    _dispatchImageChangedEvent() {
        this.dispatchEvent(
            new CustomEvent('image-changed', {
                detail: { imageId: this.imageId },
                bubbles: true,
                composed: true,
            })
        );
    }

    /**
     * Toggle AI input visibility
     */
    _toggleAiInput(e) {
        e.preventDefault();
        this.showAiInput = !this.showAiInput;
        this.errorMessage = '';
    }

    /**
     * Handle AI prompt input changes
     */
    _onAiPromptChanged(e) {
        this.aiPrompt = e.detail.value;
        this.errorMessage = '';
    }

    /**
     * Show error message
     */
    _showError(message) {
        this.errorMessage = message;
    }

    /**
     * Generate AI image
     */
    async _generateAiImage(e) {
        e.preventDefault();
        const submitter = e.submitter;
        let type = submitter?.dataset?.imageType || 'custom';

        if (type === 'custom' && !this.aiPrompt.trim()) {
            type = Math.random() < 0.5 ? 'abstract' : 'animal';
        }

        this.isGeneratingImage = true;
        this.errorMessage = '';

        try {
            const result = await generateImage(type, this.aiPrompt.trim());

            if (result.success && result.imageId) {
                this._addImageToHistory(result.imageId);
                this._dispatchImageChangedEvent();
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
                    display: block;
                }

                .image-selector-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: var(--spacing-normal);
                }

                .user-image {
                    position: relative;
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-small);
                }
                
                .image-nav-button {
                    background: var(--background-dark-gradient);
                    border: 2px solid var(--border-color-light);
                    border-radius: 50%;
                    padding: var(--spacing-small);
                    font-size: var(--font-size-large);
                    color: var(--text-color-light);
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-width: 40px;
                    min-height: 40px;
                }
                
                .image-nav-button:hover {
                    background: var(--background-light);
                    border-color: var(--primary-color);
                    color: var(--primary-color);
                }
                
                .image-nav-button:disabled {
                    opacity: 0.3;
                    cursor: not-allowed;
                }
                
                .avatar-container {
                    position: relative;
                    display: flex;
                    flex-direction: column;
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
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-small);
                    max-width: 600px;
                    padding-top: var(--spacing-normal);
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
                    border: 1px solid var(--info-yellow);
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
                
                .image-counter {
                    font-size: var(--font-size-small);
                    color: var(--text-color-light);
                    text-align: center;
                    margin-top: var(--spacing-x-small);
                }

                .error {
                    color: red;
                    font-size: 0.9em;
                    margin: 10px 0;
                    text-align: center;
                }

                .ai-instructions {
                    background: var(--blue-light);
                    border: 1px solid var(--blue-normal);
                    border-radius: var(--border-radius-normal);
                    padding: var(--spacing-small);
                    margin-top: var(--spacing-small);
                    text-align: left;
                    font-size: var(--font-size-small);
                    line-height: 1.4;
                    max-width: 600px;
                }

                .ai-instructions p {
                    margin: 0;
                    color: var(--text-color-dark);
                }
                
                .ai-button-group {
                    display: flex;
                    gap: var(--spacing-x-small);
                    align-items: center;
                }
            `
        ];
    }

    render() {
        return html`
            <div class="image-selector-container">
                <div class="user-image">
                    <!-- Left arrow navigation -->
                    ${this.allowNavigation && this.imageHistory.length > 1 ? html`
                        <button class="image-nav-button" 
                                @click="${() => this._navigateImage('prev')}"
                                ?disabled="${this.currentImageIndex <= 0}">
                            <arrow-long-left-icon></arrow-long-left-icon>
                        </button>
                    ` : ''}
                    
                    <!-- Avatar and image controls -->
                    <div class="avatar-container">
                        <div style="position: relative;">
                            <custom-avatar size="${this.size}"
                                           shadow
                                           username="${this.username}"
                                           imageId="${this.imageId}">
                            </custom-avatar>
                            <image-changer
                                    imageId="${this.imageId}"
                                    @image-updated="${this._onImageChanged}"></image-changer>
                            ${this.showAi ? html`
                                <button class="ai-generate-button primary shadow fancy" @click="${this._toggleAiInput}">
                                    <ai-icon></ai-icon>
                                </button>
                            ` : ''}
                        </div>
                        
                        <!-- Image counter -->
                        ${this.allowNavigation && this.imageHistory.length > 1 ? html`
                            <div class="image-counter">
                                ${this.currentImageIndex + 1} of ${this.imageHistory.length}
                            </div>
                        ` : ''}
                    </div>
                    
                    <!-- Right arrow navigation -->
                    ${this.allowNavigation && this.imageHistory.length > 1 ? html`
                        <button class="image-nav-button"
                                @click="${() => this._navigateImage('next')}"
                                ?disabled="${this.currentImageIndex >= this.imageHistory.length - 1}">
                            <arrow-long-icon></arrow-long-icon>
                        </button>
                    ` : ''}
                </div>

                <!-- AI Image Generation Input -->
                ${this.showAi && this.showAiInput ? html`
                    <form @submit="${this._generateAiImage}" class="ai-input-container">
                        <div class="ai-generate-row">
                            <custom-input
                                placeholder="Describe an image..."
                                value="${this.aiPrompt}"
                                @value-changed="${this._onAiPromptChanged}"
                                fullWidth>
                            </custom-input>
                            <div class="ai-button-group">
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
                                <custom-tooltip>Generate an random abstract image</custom-tooltip>
                                <button
                                        data-image-type="animal"
                                        type="submit"
                                        class="primary button icon"
                                        ?disabled="${this.isGeneratingImage}">
                                    <dog-icon></dog-icon>
                                </button>
                                <custom-tooltip>Generate an image of a cute cartoon animal</custom-tooltip>
                            </div>
                        </div>
                        
                        <div class="ai-instructions">
                            <p><strong>Quick start:</strong> Click Abstract or Animal buttons for random images. Or type a description and click Generate for exact results, Abstract for artistic style, or Animal for cute cartoon version.</p>
                        </div>
                    </form>
                ` : ''}

                <!-- Error message -->
                ${this.errorMessage ? html`
                    <div class="error">${this.errorMessage}</div>` : ''}

                <slot></slot>
            </div>
        `;
    }
}

customElements.define('image-selector-with-nav', ImageSelectorWithNav);
