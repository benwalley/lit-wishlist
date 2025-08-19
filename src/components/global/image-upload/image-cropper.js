import { LitElement, html, css } from 'lit';
import Cropper from 'cropperjs';
import { listenImageSelected, triggerImageCropConfirmed } from '../../../events/eventListeners.js';
import { uploadImageToDB } from '../../../helpers/imageHelpers.js';
import {observeState} from 'lit-element-state';
import buttonStyles from '../../../css/buttons.js';

class ImageCropper extends observeState(LitElement) {
  static properties = {
    size: { type: Number },
    rawImage: { type: String },
    modalOpen: { type: Boolean },
    imageId: { type: Number },
    uniqueId: { type: String },
  };

  static styles = [
    buttonStyles,
    css`
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
        width: calc(100vw - (var(--spacing-normal) * 2));
        height: calc(100vw - (var(--spacing-normal) * 2));
        max-width: 600px;
        max-height: 600px;
        margin: 0 auto 1rem;
      }
  
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      cropper-canvas {
        height: 100% !important;
      }
      
      cropper-handle {
        background: none;
      }
      
      .controls {
        display: flex;
        justify-content: space-between;
        margin-top: 1rem;
        gap: 1rem;
      }
    `
  ];

  constructor() {
    super();
    this.size = 400; // Final cropped image will be 400x400 (1:1)
    this.rawImage = null;
    this.modalOpen = false;
    this.imageId = 0;
    this.cropper = null;
    this.uniqueId = null;
  }

  render() {
    return html`
      <custom-modal level="3" .isOpen="${this.modalOpen}">
        <div class="modal-content">
          <div class="modal-header">Crop Your Image</div>
          <div class="image-container">
            <img id="image" src="${this.rawImage || ''}" alt="Image to crop" />
          </div>
          <div class="controls">
            <button class="button ghost" @click="${this._handleCancel}">Cancel</button>
            <button class="button primary" @click="${this._handleChoose}">Confirm</button>
          </div>
        </div>
      </custom-modal>
    `;
  }

  firstUpdated() {
    // Listen for an image-selected event (expects an object with rawImage)
    listenImageSelected(this._handleImageSelected.bind(this));
  }

  _handleImageSelected(e) {
    const { rawImage, uniqueId } = e.detail;
    if (!rawImage) return;

    this.rawImage = rawImage;
    this.modalOpen = true;
    this.uniqueId = uniqueId;
  }

  updated(changedProps) {
    if (changedProps.has('rawImage') && this.rawImage) {
      const img = this.shadowRoot.getElementById('image');
      if (img) {
        // Clear any existing Cropper instance
        if (this.cropper) {
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
    // Clear any existing Cropper instance
    this.cropper = null;

    // Remove any existing cropper-canvas elements from the DOM
    const existingCanvases = this.shadowRoot.querySelectorAll('cropper-canvas');
    existingCanvases.forEach(canvas => canvas.remove());

    // CropperJS v2 simplified initialization
    this.cropper = new Cropper(img);

    // Set up fixed 1x1 selection that covers full container
    const selection = this.cropper.getCropperSelection();
    if (selection) {
      selection.aspectRatio = 1;
      selection.initialCoverage = 1;
      selection.movable = false;
      selection.resizable = false;
      selection.zoomable = false;
    }

    // Allow image to be moved within the fixed selection
    const cropperImage = this.cropper.getCropperImage();
    if (cropperImage) {
      cropperImage.movable = true;
      cropperImage.rotatable = false;
      cropperImage.scalable = true;
      cropperImage.zoomable = true;
    }
  }

  _handleCancel() {
    this.modalOpen = false;
    this.rawImage = null;
    this.cropper = null;
  }

  async _handleChoose() {
    if (!this.cropper) {
      alert('Please upload and crop an image first.');
      return;
    }

    // CropperJS v2 - get selection and create cropped canvas
    const selection = this.cropper.getCropperSelection();
    if (!selection) {
      alert('Please make a selection first.');
      return;
    }

    // CropperJS v2 - get canvas data directly
    let croppedDataUrl;
    try {
      const canvas = selection.$toCanvas({
        width: this.size,
        height: this.size,
      });
      
      // Check if it's a promise (async operation)
      if (canvas && typeof canvas.then === 'function') {
        const resolvedCanvas = await canvas;
        croppedDataUrl = resolvedCanvas.toDataURL('image/jpeg', 0.85);
      } else if (canvas && typeof canvas.toDataURL === 'function') {
        // Standard canvas element
        croppedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
      } else {
        // Fallback - try to get data URL from selection directly
        croppedDataUrl = selection.$toDataURL({
          width: this.size,
          height: this.size,
          type: 'image/jpeg',
          quality: 0.85
        });
      }
    } catch (canvasError) {
      console.error('Canvas generation failed:', canvasError);
      alert('Failed to process cropped image.');
      return;
    }
    
    try {
      const response = await uploadImageToDB(croppedDataUrl);
      if (!response.success) {
        throw new Error('Upload failed');
      }
      this.imageId = parseInt(response.imageId);
      triggerImageCropConfirmed({imageId: this.imageId, uniqueId: this.uniqueId});
    } catch (error) {
      console.error('Image upload failed:', error);
      alert('Failed to upload image.');
    } finally {
      this.modalOpen = false;
      this.rawImage = null;
      this.cropper = null;
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    // Clean up cropper instance
    this.cropper = null;
  }
}

customElements.define('image-cropper', ImageCropper);
