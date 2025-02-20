import {LitElement, html, css} from 'lit';
import buttonStyles from '../../../css/buttons.js';
import '../../../svg/cloud-upload.js'
import {listenImageCropConfirmed, triggerImageSelected} from "../../../events/eventListeners.js";

export class ImageSelector extends LitElement {
    static properties = {
        uniqueId: {type: String},
    };

    constructor() {
        super();
        this.uniqueId = 0;
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    border: 2px dashed #ccc;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    gap: 10px;
                    padding: 8px;
                    box-sizing: border-box;
                    position: relative;
                }

                /* Hidden native file input */
                #fileInput {
                    display: none;
                }

                /* Drag-and-drop area */
                .drop-zone {
                    width: 100%;
                    flex: 1;
                    display: grid;
                    grid-template-columns: 40px 1fr;
                    gap: 10px;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    text-align: left;
                    box-sizing: border-box;
                }

                .drop-zone p {
                    margin: 0;
                    font-size: 0.95rem;
                    color: #666;
                }

                /* Give a visual highlight on drag over */
                .drop-zone.dragover {
                    border-color: #007bff;
                    background-color: #f0f8ff;
                }

                input[type='url'] {
                    display: block;
                    width: 100%;
                    box-sizing: border-box;
                    padding: 5px;
                }

                button {
                    margin: 5px 0;
                    cursor: pointer;
                }
            `,
        ];
    }

    /**
     * Temporary storage of the user-entered URL
     */
    _urlValue = '';

    render() {
        return html`
            <!-- Hidden file input (programmatically triggered) -->
            <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    @change=${this._handleFileChange}
            />

            <!-- Drag-and-drop zone (click anywhere to open the file picker) -->
            <div
                    class="drop-zone"
                    @click=${this._showFilePicker}
                    @dragover=${this._handleDragOver}
                    @dragleave=${this._handleDragLeave}
                    @drop=${this._handleDrop}
            >
                <cloud-upload-icon style="width: 100%; color: white;"></cloud-upload-icon>
                <p>Drag & Drop an image here or click to choose a file</p>
            </div>

            <!-- URL input & button -->
            <input
                    type="url"
                    placeholder="Enter image URL"
                    @input=${(e) => (this._urlValue = e.target.value.trim())}
            />
            <button
                    class="button primary small"
                    @click=${this._submitUrl}
            >
                Use URL
            </button>
        `;
    }

    /**
     * Programmatically open the file input dialog
     */
    _showFilePicker() {
        this.renderRoot.getElementById('fileInput').click();
    }

    /**
     * Handle user choosing a file from disk.
     */
    _handleFileChange(e) {
        const file = e.target.files[0];
        this._readFile(file);
    }

    /**
     * Drag events
     */
    _handleDragOver(e) {
        e.preventDefault(); // Required to allow drop
        const dropZone = e.currentTarget;
        dropZone.classList.add('dragover');
    }

    _handleDragLeave(e) {
        const dropZone = e.currentTarget;
        dropZone.classList.remove('dragover');
    }

    async _handleDrop(e) {
        e.preventDefault();
        const dropZone = e.currentTarget;
        dropZone.classList.remove('dragover');

        // If multiple files are dropped, take the first
        const file = e.dataTransfer?.files?.[0];
        this._readFile(file);
    }

    /**
     * Attempt to read the dropped or picked file
     */
    _readFile(file) {
        if (!file) return; // Nothing dropped or selected
        if (!file.type.startsWith('image/')) {
            alert('Please select a valid image file.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (ev) => {
            const rawImage = ev.target.result;
            triggerImageSelected({rawImage, uniqueId: this.uniqueId});
        };
        reader.readAsDataURL(file); // TODO: See if I can remove this
    }

    /**
     * Called when the "Use URL" button is clicked.
     */
    async _submitUrl() {
        const url = this._urlValue;
        if (!url) {
            alert('Please enter a URL before clicking "Use URL".');
            return;
        }

        // Validate URL
        if (!this._isValidUrl(url)) {
            alert('Please enter a valid URL.');
            return;
        }

        // Try fetching the image and converting to DataURL
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            if (!blob.type.startsWith('image/')) {
                alert('URL does not point to a valid image.');
                return;
            }
            const reader = new FileReader();
            reader.onload = (ev) => {
                const rawImage = ev.target.result;
                triggerImageSelected(rawImage)
            };
            reader.readAsDataURL(blob);
        } catch (error) {
            console.error(error);
            alert('Failed to fetch the image from the URL.');
        }
    }

    _isValidUrl(str) {
        try {
            new URL(str);
            return true;
        } catch {
            return false;
        }
    }
}

customElements.define('image-selector', ImageSelector);
