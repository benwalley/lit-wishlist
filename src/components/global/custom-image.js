import {LitElement, html, css} from 'lit';
import {envVars} from '../../config.js';

export class MyElement extends LitElement {
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
            overflow: hidden;
            aspect-ratio: var(--aspect-ratio);
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
            <div
                    class="container"
                    style="--aspect-ratio: ${this.width}/${this.height}"
            >
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
                                    width="${this.width}"
                                    height="${this.height}"
                            />
                        `}
            </div>
        `;
    }
}

customElements.define('custom-image', MyElement);
