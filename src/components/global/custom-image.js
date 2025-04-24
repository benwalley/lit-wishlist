import {LitElement, html, css} from 'lit';
import {envVars} from '../../config.js';

export class CustomImage extends LitElement {
    static properties = {
        imageId: { type: Number },
        alt: { type: String },
        width: { type: Number },
        height: { type: Number },
    };

    static styles = css`
        :host {
            display: inline-block;
        }
        .container {
            /* The container takes the dynamic aspect ratio and a 100% width */
            width: 100%;
            height: 100%;
            overflow: hidden;
        }
        .placeholder {
            background-color: #f3f3f3;
            width: 100%;
            height: 100%;
        }
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
            background: linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%);
        }
    `;

    constructor() {
        super();
        // Default values
        this.imageId = 0;
        this.alt = 'Image';
        this.width = 200;
        this.height = 200;
    }

    render() {
        return html`
            <div class="container">
                ${this.imageId === 0
                        ? html`
                            <!-- Placeholder box for imageId = 0 -->
                            <div class="placeholder"></div>
                        `
                        : html`
                            <!-- Actual image when imageId != 0 -->
                            <img
                                    src="${envVars.API_URL}/images/get/${this.imageId}"
                                    alt="${this.alt}"
                                    @error=${this._handleImageError}
                            />
                        `}
            </div>
        `;
    }
    
    _handleImageError(e) {
        console.error(`Failed to load image with ID: ${this.imageId}`);
        // Optionally show a fallback image or placeholder
        e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="%23ccc" d="M21.9 21.9l-8.49-8.49-9.82-9.82L2.1 2.1.69 3.51 3 5.83V19c0 1.1.9 2 2 2h13.17l2.31 2.31 1.42-1.41zM5 19V7.83l7.17 7.17H5zm11.9-8.49L15.17 9l-2.7-2.7L10.83 5H19c1.1 0 2 .9 2 2v8.17l-2.12-2.12-1.98-1.98z"/></svg>';
    }
}

customElements.define('custom-image', CustomImage);
