import {LitElement, html, css} from 'lit';
import buttonStyles from "../../../css/buttons";
import '../../global/custom-image.js'

export class CustomElement extends LitElement {
    static properties = {
        itemData: {type: Object},
        selectedImageIndex: {type: Number},
    };

    constructor() {
        super();
        this.itemData = {};
        this.selectedImageIndex = 0;
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    display: block;
                }

                custom-image {
                    width: 100%;
                }

                .gallery-container {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .thumbnail-container {
                    display: flex;
                    gap: 0.5rem;
                    flex-wrap: wrap;
                }

                .thumbnail {
                    cursor: pointer;
                    border: 2px solid transparent;
                    transition: border-color 0.2s ease;
                    width: 70px;
                    height: 70px;
                }

                .thumbnail:hover {
                    border-color: var(--border-color);
                }

                .thumbnail.selected {
                    border-color: var(--primary-color);
                }
            `
        ];
    }

    selectImage(index) {
        this.selectedImageIndex = index;
    }

    render() {
        if (!this.itemData?.imageIds?.length) {
            return html`<p>No images available</p>`;
        }

        const currentImageId = this.itemData.imageIds[this.selectedImageIndex];
        const hasMultipleImages = this.itemData.imageIds.length > 1;

        return html`
            <div class="gallery-container">
                <div class="main-image">
                    <custom-image
                            .imageId="${currentImageId}"
                            alt="${this.itemData.name}"
                            width="500"
                            height="500"
                    ></custom-image>
                </div>

                ${hasMultipleImages ? html`
                    <div class="thumbnail-container">
                        ${this.itemData.imageIds.map((imageId, index) => html`
                            <div
                                    class="thumbnail ${index === this.selectedImageIndex ? 'selected' : ''}"
                                    @click="${() => this.selectImage(index)}"
                            >
                                <custom-image
                                        .imageId="${imageId}"
                                        alt="${this.itemData.name} thumbnail ${index + 1}"
                                        width="70"
                                        height="70"
                                ></custom-image>
                            </div>
                        `)}
                    </div>
                ` : ''}
            </div>
        `;
    }
}
customElements.define('all-images-display', CustomElement);
