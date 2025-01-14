import {LitElement, html, css} from 'lit';
import '../global/image-upload/image-uploader.js';
import {arrayConverter} from "../../helpers/arrayHelpers.js";

/**
 * Custom converter to serialize/deserialize an array of numbers to/from an attribute.
 */

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

    static styles = css`
    .images-container {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      align-items: flex-start;
    }
    .item {
      display: inline-block;
    }
    button.plus {
      border: 2px dashed #ccc;
      background: transparent;
      font-size: 1.5rem;
      width: 200px;
      height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    button.plus:hover {
      background-color: #f0f0f0;
    }
  `;

    render() {
        return html`
      <div class="images-container">
        ${this.images.map((id, idx) => html`
          <div class="item">
            <image-uploader
              .imageId=${id}
              @image-updated=${(e) => this._onImageUpdated(e, idx)}
            ></image-uploader>
          </div>
        `)}

        <button class="plus" @click=${this._addImage}>+</button>
      </div>
    `;
    }

    /**
     * Fired by each <image-uploader> whenever its .imageId changes.
     * We store the new ID in our `images` array at the correct index.
     */
    _onImageUpdated(e, idx) {
        const { imageId } = e.detail;
        this.images[idx] = imageId;

        // Force a re-render. Since we replaced the array element in-place,
        // Lit might not see it as a property change, so let's reassign:
        this.images = [...this.images];

        // Let the outside world know that the array changed.
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
            detail: { images: this.images },
            bubbles: true,
            composed: true,
        }));
    }
}

customElements.define('images-selector', ImagesSelector);
