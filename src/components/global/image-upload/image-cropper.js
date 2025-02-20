import { LitElement, html, css } from 'lit';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.min.css';
import { listenImageSelected, triggerImageCropConfirmed } from '../../../events/eventListeners.js';
import { uploadImageToDB } from '../../../helpers/imageHelpers.js';
import {cropperState} from "../../../state/cropperStore.js";
import {observeState} from 'lit-element-state';


class ImageCropper extends observeState(LitElement) {
  static properties = {
    size: { type: Number },
    rawImage: { type: String },
    modalOpen: { type: Boolean },
    imageId: { type: String },
    uniqueId: {type: String},
  };

  static styles = css`
    :host {
      display: block;
      font-family: Arial, sans-serif;
    }
    
    .modal-header {
      text-align: center;
      font-size: 1.5rem;
      margin-bottom: 1rem;
      color: #333;
    }

    .image-container {
      max-width: 640px;
    }

    img {
      max-width: 100%;
    }
  `;

  constructor() {
    super();
    this.size = 400; // Final cropped image will be 400x400 (1:1)
    this.rawImage = null;
    this.modalOpen = false;
    this.imageId = null;
    this.cropper = null;
    this.uniqueId = null;
  }

  render() {
    return html`
      <custom-modal level="2" .isOpen="${this.modalOpen}">
        <div class="modal-content">
          <div class="modal-header">Crop Your Image</div>
          <div class="image-container">
            <img id="image" src="${this.rawImage || ''}" alt="Image to crop" />
          </div>
          <div class="controls">
            <button class="cancel" @click="${this._handleCancel}">Cancel</button>
            <button @click="${this._handleChoose}">Confirm</button>
          </div>
        </div>
      </custom-modal>
    `;
  }

  firstUpdated() {
    // If you're not already globally including cropper.min.css, you can append it here:
    const cropperStyles = document.createElement('link');
    cropperStyles.rel = 'stylesheet';
    cropperStyles.href = '/node_modules/cropperjs/dist/cropper.min.css';
    this.shadowRoot.appendChild(cropperStyles);

    // Listen for an image-selected event (expects an object with rawImage)
    listenImageSelected((e) => {
      const { rawImage, uniqueId } = e.detail;
      this.rawImage = rawImage;
      this.modalOpen = true;
      this.uniqueId = uniqueId
      this.requestUpdate();
    });
  }

  updated(changedProps) {
    if (changedProps.has('rawImage') && this.rawImage) {
      const img = this.shadowRoot.getElementById('image');
      if (img) {
        // Destroy any existing Cropper instance
        if (this.cropper) {
          this.cropper.destroy();
          this.cropper = null;
        }
        // Initialize Cropper when the image loads (or immediately if already loaded)
        if (!img.complete) {
          img.onload = () => {
            img.onload = null;
            this._initializeCropper(img);
          };
        } else {
          this._initializeCropper(img);
        }
      }
    }
  }

  _initializeCropper(img) {
    if (this.cropper) {
      this.cropper.destroy();
    }

    this.cropper = new Cropper(img, {
      aspectRatio: 1, // Enforce a square crop area
      viewMode: 3,
      dragMode: 'move',
      autoCropArea: 1,
      restore: false,
      modal: false,
      guides: false,
      highlight: false,
      cropBoxMovable: false,
      cropBoxResizable: false,
      toggleDragModeOnDblclick: false,
    });
  }

  _handleCancel() {
    this.modalOpen = false;
    this.rawImage = null;
    if (this.cropper) {
      this.cropper.destroy();
      this.cropper = null;
    }
  }

  _handleChoose() {
    if (!this.cropper) {
      alert('Please upload and crop an image first.');
      return;
    }
    const canvas = this.cropper.getCroppedCanvas({
      width: this.size,
      height: this.size,
      imageSmoothingQuality: 'high',
    });
    canvas.toBlob((blob) => {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const croppedDataUrl = reader.result;
        try {
          const response = await uploadImageToDB(croppedDataUrl);
          this.imageId = response.imageId;
          triggerImageCropConfirmed({imageId: this.imageId, uniqueId: this.uniqueId});
        } catch (error) {
          console.error('Image upload failed:', error);
          alert('Failed to upload image.');
        } finally {
          this.modalOpen = false;
          this.rawImage = null;
          if (this.cropper) {
            this.cropper.destroy();
            this.cropper = null;
          }
        }
      };
      reader.readAsDataURL(blob);
    }, 'image/jpeg', 0.7);
  }
}

customElements.define('image-cropper', ImageCropper);
