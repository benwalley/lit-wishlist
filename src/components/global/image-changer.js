import { LitElement, html, css } from 'lit';
import buttonStyles from '../../css/buttons.js';
import { customFetch } from '../../helpers/fetchHelpers.js';
import { cropperState } from '../../state/cropperStore.js';
import {uploadImageToDB} from "../../helpers/imageHelpers.js";
import {listenImageCropConfirmed, triggerImageSelected} from "../../events/eventListeners.js";
import {getUniqueId} from "../../helpers/generalHelpers.js";

class ImageChanger extends LitElement {
    static properties = {
        imageId: { type: Number, reflect: true },
        size: { type: Number },
    };

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    display: inline-block;
                }
                button.change-picture-icon {
                    border-radius: 50px;
                    padding: var(--spacing-small);
                    box-sizing: border-box;
                    font-size: var(--font-size-large);
                    position: absolute;
                    bottom: -6px;
                    right: -6px;
                }
                /* Hidden file input */
                #fileInput {
                    display: none;
                }
            `
        ];
    }

    constructor() {
        super();
        this.imageId = 0;
        this.size = 300; // default crop size
        this.uniqueId = getUniqueId();
    }

    render() {
        return html`
      <button
        class="change-picture-icon primary button shadow"
        @click=${this._triggerFileInput}
      >
        <camera-icon></camera-icon>
      </button>
      <input
        type="file"
        id="fileInput"
        accept="image/*"
        @change=${this._handleFileChange}
      />
    `;
    }

    _triggerFileInput() {
        this.shadowRoot.getElementById('fileInput').click();
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

    _handleFileChange(e) {
        const file = e.target.files[0];
        if (!file) return;
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

    _handleCropCancelled() {
        this._resetFileInput();
    }

    _resetFileInput() {
        const fileInput = this.shadowRoot.getElementById('fileInput');
        if (fileInput) fileInput.value = '';
    }
}

customElements.define('image-changer', ImageChanger);
