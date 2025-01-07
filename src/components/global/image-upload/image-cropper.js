import { LitElement, html, css } from 'lit';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.min.css';

class ImageCropper extends LitElement {
  static properties = {
    imageSrc: { type: String }, // the raw data (DataURL) from the selector
    size:    { type: Number }, // final crop width
  };

  static styles = css`
    :host {
      display: block;
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      text-align: center;
    }
    #image-container {
      width: 100%;
      aspect-ratio: 1 / 1;
      position: relative;
      margin: 1rem auto;
    }
    #image-container img {
      max-width: 100%;
      display: block;
    }
    .controls {
      margin-top: 1rem;
    }
    button {
      margin: 0 10px;
      padding: 8px 16px;
      cursor: pointer;
    }
  `;

  constructor() {
    super();
    this.imageSrc = '';
    this.size = 400;  // default
    this.cropper = null;
  }

  render() {
    return html`
      <div>
        <h2>Crop Your Image</h2>
        <div id="image-container">
          <img id="image" src="${this.imageSrc || ''}" alt="Image to crop" />
        </div>
        <div class="controls">
          <button @click=${this._handleCancel}>Cancel</button>
          <button @click=${this._handleChoose}>Choose</button>
        </div>
      </div>
    `;
  }

  firstUpdated() {
    const img = this.shadowRoot.getElementById('image');

    // If you're not already globally including cropper.min.css, you can append it here:
    const cropperStyles = document.createElement('link');
    cropperStyles.rel = 'stylesheet';
    cropperStyles.href = '/node_modules/cropperjs/dist/cropper.min.css';
    this.shadowRoot.appendChild(cropperStyles);

    if (img && this.imageSrc) {
      this._initializeCropper(img);
    }
  }

  updated(changedProps) {
    // If imageSrc changes, re-init
    if (changedProps.has('imageSrc') && this.imageSrc) {
      const img = this.shadowRoot.getElementById('image');
      this._initializeCropper(img);
    }
  }

  _initializeCropper(img) {
    // destroy existing Cropper if any
    if (this.cropper) {
      this.cropper.destroy();
      this.cropper = null;
    }

    this.cropper = new Cropper(img, {
      aspectRatio: 1 / 1,
      viewMode: 0,
      autoCropArea: 1,
      responsive: true,
      background: true,
      movable: true,
      zoomable: true,
      zoomOnTouch: true,
      zoomOnWheel: true,
      scalable: false,
      cropBoxResizable: false,
      cropBoxMovable: false,
      toggleDragModeOnDblclick: false,
      checkOrientation: true,
      guides: false,
      center: true,
      dragMode: 'move',
    });
  }

  _handleCancel() {
    this.dispatchEvent(new CustomEvent('crop-cancelled', {
      bubbles: true,
      composed: true
    }));
  }

  _handleChoose() {
    if (!this.cropper) {
      alert('Please upload and crop an image first.');
      return;
    }

    const croppedCanvas = this.cropper.getCroppedCanvas({
      width: this.size,
      height: this.size,
      imageSmoothingQuality: 'high'
    });

    croppedCanvas.toBlob((blob) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const croppedDataUrl = reader.result;
        this.dispatchEvent(new CustomEvent('crop-confirmed', {
          detail: { croppedDataUrl },
          bubbles: true,
          composed: true
        }));
      };
      reader.readAsDataURL(blob);
    }, 'image/jpeg', 0.7);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.cropper) {
      this.cropper.destroy();
    }
  }
}

customElements.define('image-cropper', ImageCropper);
