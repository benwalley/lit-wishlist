import {LitElement, html, css} from 'lit';
import '../global/image-upload/image-uploader.js';
import './upload-by-url.js';
import {arrayConverter} from "../../helpers/arrayHelpers.js";
import buttonStyles from '../../css/buttons.js';

export class ImagesSelector extends LitElement {
    static properties = {
        /**
         * Array of numeric IDs, e.g., [1, 42, 1337].
         * We'll reflect it to a string attribute using our custom converter.
         */
        images: {
            type: Array,
            reflect: true,
            converter: arrayConverter,
        },
    };

    constructor() {
        super();
        this.images = []; // Start empty; we’ll populate below.
    }

    connectedCallback() {
        super.connectedCallback();
        // If no images were set by an attribute or property, at least create one slot:
        if (!this.images || !this.images.length) {
            this.images = [0];
        }
    }

    static styles = [
        buttonStyles,
        css`
            :host {
                display: block;
                padding: var(--spacing-small);
                border: 1px solid var(--border-color);
                border-radius: var(--border-radius-normal);
            }

            .section-wrapper {
                margin-bottom: 30px;
            }

            .images-section {
            }

            .images-container {
                display: flex;
                flex-wrap: wrap;
                gap: 16px;
                align-items: flex-start;
                margin-top: 16px;
            }

            .item {
                display: inline-block;
            }

            .add-button {
                width: 120px;
                height: 120px;
                border: 2px dashed var(--border-color, #ccc);
                background: transparent;
                font-size: 1.5rem;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
                color: var(--secondary-color, #666);
            }

            .add-button:hover {
                background-color: rgba(0, 0, 0, 0.03);
                border-color: var(--primary-button-background, #4CAF50);
                color: var(--primary-button-background, #4CAF50);
            }

            .section-title {
                font-size: var(--font-size-normal);
                font-weight: 600;
                color: var(--text-color-dark, #333);
            }

            .section-description {
                font-size: var(--font-size-x-small);
                color: var(--text-color-medium-dark);

            }
        `
    ];

    render() {
        return html`
            <div class="section-wrapper">
                <div class="section-title">Add Images</div>

                <div class="section-description">
                    Add an image by URL or upload an image from your device. Supported formats: JPG, PNG, GIF.
                </div>
                <upload-by-url @image-added=${this._handleImageAdded}></upload-by-url>

                <div class="images-section">
                    <div class="images-container">
                        ${this.images.map((id, idx) => html`
                            <div class="item">
                                <image-uploader
                                        .imageId=${id}
                                        @image-updated=${(e) => this._onImageUpdated(e, idx)}
                                ></image-uploader>
                            </div>
                        `)}

                        <button class="add-button" @click=${this._addImage}>+</button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Fired by each <image-uploader> whenever its .imageId changes.
     * We store the new ID in our `images` array at the correct index.
     */
    _onImageUpdated(e, idx) {
        const {imageId} = e.detail;
        this.images[idx] = parseInt(imageId);
        this.images = [...this.images];
        this._emitImagesChanged();
    }

    /**
     * Add a new uploader with a default imageId=0.
     */
    _addImage() {
        this.images = [...this.images, 0];
        this._emitImagesChanged();
    }

    /**
     * Dispatch a custom event if a parent needs to know this array changed.
     */
    _emitImagesChanged() {
        this.dispatchEvent(new CustomEvent('images-changed', {
            detail: {images: this.images},
            bubbles: true,
            composed: true,
        }));
    }

    /**
     * Handle image-added event from upload-by-url component
     */
    _handleImageAdded(e) {
        const {imageId} = e.detail;

        // If the first image is placeholder (0), replace it
        if (this.images.length === 1 && this.images[0] === 0) {
            this.images = [imageId];
        } else {
            // Otherwise add it to the end
            this.images = [...this.images, imageId];
        }

        this._emitImagesChanged();
    }
}

customElements.define('images-selector', ImagesSelector);
