import {LitElement, html, css} from 'lit';
import './image-selector.js';
import './image-preview.js';
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
            width: 120px;
            height: 120px;
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
        this._cropConfirmedListener = listenImageCropConfirmed(this._handleCropConfirmed.bind(this));
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this._cropConfirmedListener) {
            this._cropConfirmedListener();
        }
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
