import {LitElement, html, css} from 'lit';
import buttonStyles from '../../../css/buttons.js';
import '../../../svg/cloud-upload.js'
import {triggerImageSelected} from "../../../events/eventListeners.js";

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
                    padding: 8px;
                    box-sizing: border-box;
                    position: relative;
                    border-radius: var(--border-radius-normal);
                    transition: var(--transition-200);
                }
                
                :host(:hover) {
                    border-color: var(--primary-color);
                    background-color: var(--background-dark);
                }

                /* Hidden native file input */
                #fileInput {
                    display: none;
                }

                /* Drag-and-drop area */
                .drop-zone {
                    width: 100%;
                    height: 100%;
                    display: grid;
                    gap: 4px;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    text-align: left;
                    box-sizing: border-box;
                    margin-top: auto;
                    margin-bottom: auto;
                    
                    cloud-upload-icon {
                        margin-top: auto;
                    }
                }

                .drop-zone p {
                    margin: 0;
                    font-size: 0.95rem;
                    color: #666;
                    margin-bottom: auto;
                }

                /* Give a visual highlight on drag over */
                .drop-zone.dragover {
                    border-color: #007bff;
                    background-color: #f0f8ff;
                }
            `,
        ];
    }

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
                <cloud-upload-icon style="width: 100%;"></cloud-upload-icon>
                <p>Upload</p>
            </div>
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
        reader.readAsDataURL(file);
    }

}

customElements.define('image-selector', ImageSelector);
