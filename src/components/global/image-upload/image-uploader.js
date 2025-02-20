import {LitElement, html, css} from 'lit';
import {customFetch} from '../../../helpers/fetchHelpers.js';
import './image-selector.js';
import './image-preview.js';
import '../../../svg/cloud-upload.js';
// Note: image-cropper is now global and should be placed once in your app (e.g. in your app shell)
// import './image-cropper.js';
import {cropperState} from '../../../state/cropperStore.js';
import {uploadImageToDB} from "../../../helpers/imageHelpers.js";
import {listenImageCropConfirmed} from "../../../events/eventListeners.js";
import {getUniqueId} from "../../../helpers/generalHelpers.js";

class ImageUploader extends LitElement {
    static properties = {
        imageId: {type: Number, reflect: true},
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
        this.imageId = 0;
        this.size = 300; // default crop size
        this.uniqueId = getUniqueId();
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
                            <image-selector .uniqueId="${this.uniqueId}"></image-selector>
                        `}
            </div>
        `;
    }

    connectedCallback() {
        super.connectedCallback();
        listenImageCropConfirmed(this._handleCropConfirmed.bind(this))
    }

    _handleCropConfirmed(e) {
        const {imageId, uniqueId} = e.detail;
        if (uniqueId !== this.uniqueId) return;
        this.imageId = parseInt(imageId);
        this._dispatchImageUpdatedEvent(this.imageId);
    }

    _dispatchImageUpdatedEvent(imageId) {
        this.dispatchEvent(
            new CustomEvent('image-updated', {
                detail: {imageId: imageId},
                bubbles: true,
                composed: true,
            })
        );
    }

    /**
     * Called when the user clicks the "remove" button on the preview.
     */
    _handleRemoveImage() {
        this.imageId = 0;
        this._dispatchImageUpdatedEvent(this.imageId);
    }
}

customElements.define('image-uploader', ImageUploader);
