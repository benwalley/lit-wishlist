import { LitElement, html, css } from 'lit';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.min.css';

class ImageUpload extends LitElement {
    static properties = {
        width: { type: Number },
        height: { type: Number },
        imageId: { type: String }
    };

    static styles = css`
        :host {
            display: block;
            border: 2px dashed #ccc;
            padding: 20px;
            text-align: center;
            width: var(--component-width, 400px);
            position: relative;
            box-sizing: border-box;
        }
        input[type="file"],
        input[type="url"] {
            display: block;
            margin: 10px auto;
            width: 80%;
            padding: 8px;
        }
        button {
            padding: 8px 16px;
            margin: 10px;
            cursor: pointer;
        }
        #image-container {
            width: 100%;
            max-width: 400px; /* Set a max width for larger screens */
            margin: 0 auto;
            position: relative;
            aspect-ratio: 1 / 1; /* Ensure a square container */
        }

        #image-container img {
            width: 100%;
            height: auto;
        }
        
        .loading {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            display: none;
            background: rgba(255, 255, 255, 0.8);
            padding: 10px 20px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        }
    `;

    constructor() {
        super();
        this.width = 300;
        this.height = 300;
        this.imageId = '';
        this.imageData = null;
        this.cropper = null;
    }

    render() {
        return html`
            <div>
                <input type="file" accept="image/*" @change="${this.handleFileUpload}" />
                <input type="url" placeholder="Enter image URL" @change="${this.handleUrlUpload}" />
                <button @click="${this.uploadImage}">Upload Image</button>
                <div id="image-container">
                    <img id="image" alt="Image Preview" />
                </div>
                <div class="loading" id="loading">Uploading...</div>
            </div>
        `;
    }

    firstUpdated() {
        const cropperStyles = document.createElement('link');
        cropperStyles.rel = 'stylesheet';
        cropperStyles.href = '/node_modules/cropperjs/dist/cropper.min.css';
        this.shadowRoot.appendChild(cropperStyles);
        // Event listener for image load
        const img = this.shadowRoot.getElementById('image');
        img.addEventListener('load', () => {
            this.initializeCropper();
        });
    }

    handleFileUpload(event) {
        const file = event.target.files[0];
        if (file && this.isImage(file)) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.clearPreviousImage(); // Clear previous image and cropper
                this.displayImage(e.target.result);
                this.imageData = e.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            alert('Please select a valid image file.');
        }
    }

    handleUrlUpload(event) {
        const url = event.target.value;
        if (this.isValidUrl(url)) {
            fetch(url)
                .then(response => response.blob())
                .then(blob => {
                    if (this.isImage(blob)) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            this.clearPreviousImage(); // Clear previous image and cropper
                            this.displayImage(e.target.result);
                            this.imageData = e.target.result;
                        };
                        reader.readAsDataURL(blob);
                    } else {
                        alert('URL does not point to a valid image.');
                    }
                })
                .catch(() => alert('Failed to fetch the image from the URL.'));
        } else {
            alert('Please enter a valid URL.');
        }
    }

    isImage(file) {
        return file.type.startsWith('image/');
    }

    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    displayImage(src) {
        const img = this.shadowRoot.getElementById('image');
        img.src = src;
        img.style.display = 'block';
    }

    clearPreviousImage() {
        // Destroy previous Cropper instance if it exists
        if (this.cropper) {
            this.cropper.destroy();
            this.cropper = null;
        }

        // Clear the image preview
        const img = this.shadowRoot.getElementById('image');
        img.src = '';
        img.style.display = 'none';
    }

    initializeCropper() {
        const img = this.shadowRoot.getElementById('image');

        if (this.cropper) {
            this.cropper.destroy(); // Destroy previous instance
        }

        this.cropper = new Cropper(img, {
            aspectRatio: 1 / 1, // Always enforce a 1:1 aspect ratio
            viewMode: 0, // Restrict the image from going outside the canvas
            autoCropArea: 1, // Ensure the crop box fills the canvas initially
            responsive: true, // Adapt the cropper to different screen sizes
            background: true, // Show the area outside the crop box
            movable: true, // Allow moving the image
            zoomable: true, // Allow zooming the image
            zoomOnTouch: true, // Enable zooming with touch gestures
            zoomOnWheel: true, // Enable zooming with the mouse wheel
            scalable: false, // Disable scaling (image resizing based on aspect ratio)
            cropBoxResizable: false, // Disable crop box resizing (fixed to canvas size)
            cropBoxMovable: false, // Disable moving the crop box
            toggleDragModeOnDblclick: false, // Disable double-tap to switch drag modes
            checkOrientation: true, // Automatically adjust for image orientation
            guides: false, // Remove guides for simplicity
            center: true, // Keep the crop box centered
            dragMode: 'move', // Allow moving the image within the crop box
            ready: function () {
                // Force the crop box to fill the canvas (useful for mobile scenarios)
                this.cropper.setCropBoxData({
                    width: this.cropper.getContainerData().width,
                    height: this.cropper.getContainerData().height,
                    left: 0,
                    top: 0
                });
            }
        });
    }

    canvasToBlob(canvas, type = 'image/jpeg', quality = 0.9) {
        return new Promise((resolve, reject) => {
            canvas.toBlob(
                (blob) => {
                    if (blob) resolve(blob);
                    else reject(new Error('Canvas to Blob conversion failed.'));
                },
                type,
                quality
            );
        });
    }



    uploadImage() {
        if (!this.cropper) {
            alert('Please upload and crop an image first.');
            return;
        }

        this.showLoading(true);

        const croppedCanvas = this.cropper.getCroppedCanvas({
            width: this.width,
            height: this.height,
            imageSmoothingQuality: 'high'
        });

        croppedCanvas.toBlob((blob) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const resizedDataUrl = reader.result;
                this.mockUploadToDB(resizedDataUrl)
                    .then((response) => {
                        this.imageId = response.id;
                        this.dispatchEvent(
                            new CustomEvent('image-uploaded', {
                                detail: { id: this.imageId }
                            })
                        );
                        alert(`Image uploaded successfully! ID: ${this.imageId}`);
                    })
                    .catch((err) => {
                        console.error(err);
                        alert('Failed to upload image.');
                    })
                    .finally(() => {
                        this.showLoading(false);
                    });
            };
            reader.readAsDataURL(blob);
        }, 'image/jpeg', 0.7);
    }

    mockUploadToDB(dataUrl) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const generatedId = `img_${Math.random().toString(36).substr(2, 9)}`;
                resolve({ id: generatedId });
            }, 2000);
        });
    }

    showLoading(show) {
        const loading = this.shadowRoot.getElementById('loading');
        loading.style.display = show ? 'block' : 'none';
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.cropper) {
            this.cropper.destroy();
        }
    }
}

customElements.define('image-upload', ImageUpload);
