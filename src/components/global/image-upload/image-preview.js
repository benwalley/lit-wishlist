import {LitElement, html, css} from 'lit';
import '../custom-image.js'
import '../../../svg/delete.js'
import '../../../svg/x.js'

export class ImagePreview extends LitElement {
    static properties = {
        imageId: {type: Number},
    };

    static styles = css`
        :host {
            display: block;
            position: relative;
            width: 100%;
            height: 100%;
            text-align: center;
            padding: 0;
        }

        .preview-container {
            position: relative;
            width: 100%;
            margin: 0 auto;
            padding: 0;
            box-sizing: border-box;
            border: 2px solid #ccc;
        }

        custom-image {
            width: 100%;
            height: auto;
            display: block;
        }

        .remove-btn {
            position: absolute;
            top: 5px;
            right: 5px;
            background: rgba(255, 0, 0, 0.7);
            color: #fff;
            border: none;
            cursor: pointer;
            font-weight: bold;
            font-size: 1rem;
            display: flex;
            width: 25px;
            height: 25px;
            align-items: center;
            justify-content: center;
            border-radius: 20px;
        }
    `;

    constructor() {
        super();
        this.imageId = 0;
    }

    render() {
        return html`
            <div class="preview-container">
                <custom-image imageId="${this.imageId}"></custom-image>
                <button class="remove-btn" @click=${this._handleRemove}>
                    <x-icon style="width:15px; height:15px;"></x-icon>
                </button>
            </div>
        `;
    }

    _handleRemove() {
        this.dispatchEvent(new CustomEvent('remove-image', {
            bubbles: true,
            composed: true
        }));
    }
}

customElements.define('image-preview', ImagePreview);
