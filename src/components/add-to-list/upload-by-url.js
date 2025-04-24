import {LitElement, html, css} from 'lit';
import {uploadImageToDB} from "../../helpers/imageHelpers.js";
import buttonStyles from '../../css/buttons.js';
import '../global/custom-input.js';

export class UploadByUrl extends LitElement {
    static properties = {
        loading: { type: Boolean },
    };

    static styles = [
        buttonStyles,
        css`
            :host {
                display: block;
                margin-bottom: 20px;
            }
            
            .upload-url-container {
                display: flex;
                align-items: flex-end;
                gap: var(--spacing-small);
            }
            
            .input-wrapper {
                flex-grow: 1;
            }
            
            .error {
                color: var(--danger-color, red);
                font-size: 0.9rem;
                margin-top: 8px;
                padding-left: 16px;
            }
            
            @media (max-width: 768px) {
                .upload-url-container {
                    flex-direction: column;
                    align-items: stretch;
                }
                
                button {
                    margin-top: 8px;
                    align-self: flex-end;
                }
            }
        `
    ];

    constructor() {
        super();
        this.loading = false;
        this._urlValue = '';
        this._error = '';
    }

    render() {
        return html`
            <div class="upload-url-container">
                <div class="input-wrapper">
                    <custom-input
                        placeholder="Paste an image URL here"
                        type="url"
                        size="small"
                        @value-changed=${this._handleInput}
                        ?disabled=${this.loading}
                    ></custom-input>
                </div>
                <button 
                    class="button primary"
                    @click=${this._submitUrl} 
                    ?disabled=${!this._isValidInput() || this.loading}
                >
                    ${this.loading ? 'Uploading...' : 'Add Image'}
                </button>
            </div>
            ${this._error ? html`<div class="error">${this._error}</div>` : ''}
        `;
    }

    _handleInput(e) {
        this._urlValue = e.detail.value.trim();
        this._error = '';
        this.requestUpdate();
    }

    _isValidInput() {
        return this._urlValue && this._isValidUrl(this._urlValue);
    }

    _isValidUrl(str) {
        try {
            new URL(str);
            return true;
        } catch {
            return false;
        }
    }

    async _submitUrl() {
        if (!this._isValidInput()) {
            this._error = 'Please enter a valid URL';
            return;
        }

        this.loading = true;

        try {
            // Fetch the image from the URL
            const response = await fetch(this._urlValue);
            const blob = await response.blob();

            if (!blob.type.startsWith('image/')) {
                this._error = 'URL does not point to a valid image';
                this.loading = false;
                return;
            }

            // Convert blob to data URL
            const reader = new FileReader();
            reader.onloadend = async () => {
                const dataUrl = reader.result;

                try {
                    // Upload to server
                    const result = await uploadImageToDB(dataUrl);
                    if (!result.success) {
                        throw new Error('Upload failed');
                    }

                    // Dispatch event with the new image ID
                    this.dispatchEvent(new CustomEvent('image-added', {
                        detail: { imageId: parseInt(result.imageId) },
                        bubbles: true,
                        composed: true
                    }));

                    // Reset the input
                    this._urlValue = '';
                    this._error = '';
                    this.shadowRoot.querySelector('input').value = '';
                } catch (error) {
                    console.error('Error uploading image:', error);
                    this._error = 'Failed to upload image to server';
                } finally {
                    this.loading = false;
                }
            };

            reader.onerror = () => {
                this._error = 'Failed to process image';
                this.loading = false;
            };

            reader.readAsDataURL(blob);
        } catch (error) {
            console.error('Error fetching image:', error);
            this._error = 'Failed to fetch image from URL';
            this.loading = false;
        }
    }
}

customElements.define('upload-by-url', UploadByUrl);
