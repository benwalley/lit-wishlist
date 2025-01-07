import {LitElement, html, css} from 'lit';

import './image-selector.js';
import './image-preview.js';
import './image-cropper.js';
import {customFetch} from "../../../helpers/fetchHelpers.js"; // We'll assume we have the updated version
// Also import './custom-modal.js' if needed.

class ImageUploader extends LitElement {
    static properties = {
        imageId: {type: String},
        isModalOpen: {type: Boolean},
        rawSelectedImage: {type: String},

        // Pass these in from outside, e.g. <image-uploader width="400" height="400"></image-uploader>
        size: {type: Number},
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
        this.imageId = '';
        this.isModalOpen = false;
        this.rawSelectedImage = null;
        // Default values for the crop size, if not provided in HTML
        this.size = 300;
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

            <!-- Our custom modal for cropping -->
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
     * Called when the user selects an image via file or URL in <image-selector>.
     */
    _handleImageSelected(e) {
        const {rawImage} = e.detail;
        this.rawSelectedImage = rawImage;
        this.isModalOpen = true;
    }

    /**
     * Called when the user clicks "Choose" in <image-cropper>.
     */
    async _handleCropConfirmed(e) {
        const { croppedDataUrl } = e.detail;
        // Attempt to upload the resulting cropped image
        try {
            const response = await this._uploadImageToDB(croppedDataUrl);
            // Suppose the server responds with an object: { id: ..., publicUrl: ... }
            this.imageId = response.imageId;
            // or, if you simply want to show the local DataURL, you could do:

        } catch (error) {
            console.error('Upload to DB failed:', error);
            alert('Failed to upload image.');
        } finally {
            this.isModalOpen = false;
            this.rawSelectedImage = null;
        }
    }

    _handleRemoveImage() {
        this.imageId = '';
        this.rawSelectedImage = null;
    }

    /**
     * Actually upload the cropped image to the server.
     * Replace '/api/images/upload' with your endpoint's URL.
     *
     * @param {string} dataUrl The cropped DataURL from the cropper
     */
    async _uploadImageToDB(dataUrl) {
        // Convert DataURL to Blob
        const blob = this._dataURLToBlob(dataUrl);

        // Build a FormData object to send via multipart/form-data
        const formData = new FormData();
        // The third parameter is the filename. Adjust as needed.
        formData.append('image', blob, 'my_uploaded_image.jpg');

        // POST to your server endpoint
        const res = await customFetch('/images/upload', {
            method: 'POST',
            body: formData
        });

        if (!res.success) {
            // If server returns an error code
            throw new Error(`Server responded with ${res.status}`);
        }
        // Suppose your server returns JSON like { id: "some-uuid", publicUrl: "https://..." }
        return res;
    }

    _dataURLToBlob(dataUrl) {
        // DataURL structure: "data:[<media type>];base64,<data>"
        const [header, base64] = dataUrl.split(',');
        const binary = atob(base64);
        const len = binary.length;
        const buffer = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            buffer[i] = binary.charCodeAt(i);
        }
        // Extract the content type from the header: data:image/jpeg;base64
        const match = header.match(/data:(.*);base64/);
        const contentType = match ? match[1] : 'image/jpeg';
        return new Blob([buffer], { type: contentType });
    }

    /**
     * Called when user clicks "Cancel" in <image-cropper>.
     */
    _handleCropCancelled() {
        this.isModalOpen = false;
        this.rawSelectedImage = null;
    }

    /**
     * Called when user clicks "X" in <image-preview>.
     */
    _handleRemoveImage() {
        this.imageId = '';
        this.rawSelectedImage = null;
    }

    /**
     * Mock function to simulate an async DB upload.
     */
    _mockUploadToDB(dataUrl) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const generatedId = `img_${Math.random().toString(36).substr(2, 9)}`;
                resolve({id: generatedId});
            }, 1500);
        });
    }
}

customElements.define('image-uploader', ImageUploader);
