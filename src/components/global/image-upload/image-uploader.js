import {LitElement, html, css} from 'lit';
import {customFetch} from "../../../helpers/fetchHelpers.js";
import './image-selector.js';
import './image-preview.js';
import './image-cropper.js';
import '../custom-modal.js'

class ImageUploader extends LitElement {
    static properties = {
        /**
         * Use a Number if your IDs are numeric. If you also allow string IDs from your server,
         * change this to {type: String}.
         */
        imageId: { type: Number, reflect: true },
        isModalOpen: { type: Boolean },
        rawSelectedImage: { type: String },
        size: { type: Number },
    };

    static styles = css`
        .upload-container {
            text-align: center;
            width: 200px;
            height: 200px;
            position: relative;
            box-sizing: border-box;
        }
    `;

    constructor() {
        super();
        this.imageId = 0;
        this.isModalOpen = false;
        this.rawSelectedImage = null;
        this.size = 300; // default crop size
    }

    render() {
        return html`
            <div class="upload-container">
                ${this.imageId
                        ? html`
                            <image-preview
                                    .imageId=${this.imageId}
                                    @remove-image=${this._handleRemoveImage}
                            ></image-preview>
                        `
                        : html`
                            <image-selector
                                    @image-selected=${this._handleImageSelected}
                            ></image-selector>
                        `
                }
            </div>

            <!-- Cropping modal -->
            <custom-modal .isOpen=${this.isModalOpen}>
                <image-cropper
                        .imageSrc=${this.rawSelectedImage}
                        .size=${this.size}
                        @crop-confirmed=${this._handleCropConfirmed}
                        @crop-cancelled=${this._handleCropCancelled}
                ></image-cropper>
            </custom-modal>
        `;
    }

    /**
     * Child <image-selector> has just given us a raw DataURL.
     */
    _handleImageSelected(e) {
        this.rawSelectedImage = e.detail.rawImage;
        this.isModalOpen = true;
    }

    /**
     * Child <image-cropper> says user clicked "Choose" after cropping.
     */
    async _handleCropConfirmed(e) {
        const { croppedDataUrl } = e.detail;
        try {
            const response = await this._uploadImageToDB(croppedDataUrl);
            // Suppose response = { success: true, imageId: 42, publicUrl: "..." }
            this.imageId = response.imageId;
            // Dispatch event so parent can update its array
            this.dispatchEvent(new CustomEvent('image-updated', {
                detail: { imageId: this.imageId },
                bubbles: true,
                composed: true
            }));
        } catch (error) {
            console.error(error);
            alert('Failed to upload image.');
        } finally {
            this.isModalOpen = false;
            this.rawSelectedImage = null;
        }
    }

    /**
     * Child <image-cropper> says user clicked "Cancel."
     */
    _handleCropCancelled() {
        this.isModalOpen = false;
        this.rawSelectedImage = null;
    }

    /**
     * Child <image-preview> says user clicked "X" to remove.
     */
    _handleRemoveImage() {
        this.imageId = 0;
        // Also dispatch so parent knows this uploader is now "empty."
        this.dispatchEvent(new CustomEvent('image-updated', {
            detail: { imageId: this.imageId },
            bubbles: true,
            composed: true
        }));
    }

    async _uploadImageToDB(dataUrl) {
        const blob = this._dataURLToBlob(dataUrl);
        const formData = new FormData();
        formData.append('image', blob, 'my_uploaded_image.jpg');

        const res = await customFetch('/images/upload', {
            method: 'POST',
            body: formData
        });
        if (!res.success) {
            throw new Error(`Server responded with ${res.status}`);
        }
        // e.g. return { success: true, imageId: 42, publicUrl: "..." }
        return res;
    }

    _dataURLToBlob(dataUrl) {
        const [header, base64] = dataUrl.split(',');
        const binary = atob(base64);
        const len = binary.length;
        const buffer = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            buffer[i] = binary.charCodeAt(i);
        }
        const match = header.match(/data:(.*);base64/);
        const contentType = match ? match[1] : 'image/jpeg';
        return new Blob([buffer], { type: contentType });
    }
}

customElements.define('image-uploader', ImageUploader);
