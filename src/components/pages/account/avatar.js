import {LitElement, html, css} from 'lit';
import {generateTwoSimilarColorsFromString} from '../../../helpers.js';
import '../../global/custom-image.js';

// ^ adjust import path as necessary

export class Avatar extends LitElement {
    static properties = {
        username: {type: String},
        imageId: {type: String},
        size: {type: Number},
        hasPopup: {type: Boolean},
        round: {type: Boolean},
        border: {type: Boolean},
        borderradius: {type: String},
        stackLeft: {type: Boolean},
        shadow: {type: Boolean}
    };

    constructor() {
        super();
        this.username = '';
        this.imageId = '';
        this.size = 50;
        this.stackLeft = false;
        this.hasPopup = false;
        this.round = false;
        this.border = false;
        this.borderradius = '25%';
        this.shadow = true;
    }

    static styles = css`
        :host {
            display: inline-block;
        }

        .avatar {
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff; /* for initials */
            overflow: hidden;
            font-weight: 600;

            &.round {
                border-radius: 50% !important;
            }

            &.border {
                border: 2px solid white;
            }
            
            &.stack-left {
                margin-left: -10px;
            }
            
            &.shadow {
                box-shadow: var(--shadow-1-soft);
            }
        }

        .avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }
    `;

    /**
     * Extract up to two initials from the username.
     * e.g., "Jane Doe" => "JD"
     */
    getInitials(username) {
        if (!username?.length) return '';
        return username
            .split(/\s+/)
            .map((part) => part.charAt(0).toUpperCase())
            .slice(0, 2)
            .join('');
    }


    render() {
        // If there's an image URL, show the image.
        if (this.imageId > 0) {
            return html`
                <div
                        class="avatar ${this.round ? 'round' : ''} ${this.shadow ? 'shadow' : ''} ${this.border ? 'border' : ''} ${this.stackLeft ? 'stack-left' : ''}"
                        style="
                            width: ${this.size}px; 
                            height: ${this.size}px; 
                            border-radius: ${this.borderradius};
                            font-size: ${this.size * 0.5}px;
                          "
                >
                    <custom-image
                            imageId="${this.imageId}"
                    ></custom-image>
                </div>
                ${this.hasPopup ? html`
                    <custom-tooltip>
                        <slot></slot>
                    </custom-tooltip>
                ` : ''}
            `;
        }

        // Otherwise, generate a 2-color gradient for the background,
        // and display initials if username is provided.
        const [color1, color2] = generateTwoSimilarColorsFromString(this.username || 'No Data');
        const initials = this.getInitials(this.username);
        return html`
            <div
                    class="avatar ${this.round ? 'round' : ''} ${this.border ? 'border' : ''} ${this.stackLeft ? 'stack-left' : ''}"
                    style="
          width: ${this.size}px; 
          height: ${this.size}px;
          border-radius: ${this.borderradius};
          font-size: ${this.size * 0.5}px;
          background: linear-gradient(135deg, ${color1}, ${color2});
        "
            >
                ${initials}
            </div>
            ${this.hasPopup ? html`
                <custom-tooltip>
                    <slot></slot>
                </custom-tooltip>
            ` : ''}
        `;
    }
}

customElements.define('custom-avatar', Avatar);
