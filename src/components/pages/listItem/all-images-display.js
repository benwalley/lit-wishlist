import {LitElement, html, css} from 'lit';
import buttonStyles from "../../../css/buttons";
import '../../global/custom-image.js';

export class CustomElement extends LitElement {
    static properties = {
        itemData: { type: Object },
        selectedImageIndex: { type: Number },
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
                
                .no-images {
                    width: 100%;
                    aspect-ratio: 1/1;
                    box-shadow: var(--shadow-1-soft);
                    padding: var(--spacing-normal);
                    box-sizing: border-box;
                    background: var(--background-light);
                    border-radius: var(--border-radius-large);
                    display: none;
                }

                @media only screen and (min-width: 1000px) {
                    .no-images {
                        display: block;
                    }
                }

                
                .gallery-container {
                    display: grid;
                    gap: 1rem;
                    container-type: inline-size;
                    container-name: gallery;
                    max-width: 400px;
                    padding-top: var(--spacing-normal);
                }

                @media only screen and (min-width: 1000px) {
                    .gallery-container {
                        max-width: none
                    }
                }

                /* Main image styling */
                .main-image {
                    border-radius: var(--border-radius-normal, 8px);
                    overflow: hidden;
                    box-shadow: var(--shadow-2-soft, 0 4px 8px rgba(0,0,0,0.1));
                    display: flex;
                }
                /* Main image hover effect */
                .main-image:hover custom-image {
                    transform: scale(1.03);
                }

                /* The <custom-image> itself gets a transition. */
                custom-image {
                    width: 100%;
                    transition: var(--transition-normal, 0.3s ease);
                }

                /* Thumbnails container: responsive grid. 
                 * repeat(auto-fill, minmax(70px, 1fr)) tries to fit 
                 * as many 70px columns as possible.
                 */
                .thumbnail-container {
                    display: grid;
                    gap: 0.5rem;
                    grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
                }

                /* Each thumbnail is a square box with a subtle shadow. */
                .thumbnail {
                    cursor: pointer;
                    border: 2px solid transparent;
                    transition:
                            border-color 0.2s ease,
                            transform 0.2s ease,
                            box-shadow 0.2s ease;
                    overflow: hidden;
                    aspect-ratio: 1; /* keep thumbnails square */
                    border-radius: var(--border-radius-normal, 8px);
                    box-shadow: var(--shadow-1-soft, 0 2px 4px rgba(0,0,0,0.1));
                }

                /* The thumbnail's <custom-image> also gets a transition. */
                .thumbnail custom-image {
                    border-radius: inherit;
                    transition: var(--transition-normal, 0.3s ease);
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                /* Hover effect: subtle scale + stronger shadow. */
                .thumbnail:hover {
                    border-color: var(--border-color, #ccc);
                    transform: scale(1.02);
                    box-shadow: var(--shadow-2-soft, 0 4px 8px rgba(0,0,0,0.1));
                }

                /* The selected thumbnail gets a highlight border and a slight scale. */
                .thumbnail.selected {
                    border-color: var(--primary-color, #0066cc);
                }
                .thumbnail.selected custom-image {
                    transform: scale(1.02);
                }
            `,
        ];
    }

    selectImage(index) {
        this.selectedImageIndex = index;
    }

    render() {
        const { imageIds = [], name = '' } = this.itemData;
        if (!imageIds.length) {
            return html`<p class="no-images">No images available</p>`;
        }

        const currentImageId = imageIds[this.selectedImageIndex];
        const hasMultipleImages = imageIds.length > 1;

        return html`
            <div class="gallery-container">
                <!-- Main image -->
                <div class="main-image">
                    <custom-image
                            .imageId="${currentImageId}"
                            alt="${name}"
                            width="500"
                            height="500"
                    ></custom-image>
                </div>

                <!-- Thumbnails (if multiple images) -->
                ${hasMultipleImages
                        ? html`
                            <div class="thumbnail-container">
                                ${imageIds.map((imageId, index) => html`
                                    <div
                                            class="thumbnail ${index === this.selectedImageIndex ? 'selected' : ''}"
                                            @click="${() => this.selectImage(index)}"
                                    >
                                        <custom-image
                                                .imageId="${imageId}"
                                                alt="${name} thumbnail ${index + 1}"
                                                width="70"
                                                height="70"
                                        ></custom-image>
                                    </div>
                                `)}
                            </div>
                        `
                        : ''}
            </div>
        `;
    }
}
customElements.define('all-images-display', CustomElement);
