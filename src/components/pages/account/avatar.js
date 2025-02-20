import { LitElement, html, css } from 'lit';
import { generateTwoSimilarColorsFromString } from '../../../helpers.js';
import '../../global/custom-image.js';
// ^ adjust import path as necessary

export class Avatar extends LitElement {
    static properties = {
        username: { type: String },
        imageId: { type: String },
        size: { type: Number },
    };

    constructor() {
        super();
        this.username = '';
        this.imageId = '';
        this.size = 50;
    }

    static styles = css`
        :host {
            display: inline-block;
        }
        .avatar {
            border-radius: 25%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff; /* for initials */
            overflow: hidden;
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
        if (!username) return '';
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
                        class="avatar"
                        style="
            width: ${this.size}px; 
            height: ${this.size}px; 
            font-size: ${this.size * 0.5}px;
          "
                >
                    <custom-image
                        imageId="${this.imageId}"
                    ></custom-image>
                </div>
            `;
        }

        // Otherwise, generate a 2-color gradient for the background,
        // and display initials if username is provided.
        const [color1, color2] = generateTwoSimilarColorsFromString(this.username || 'No Data');
        const initials = this.getInitials(this.username);
        return html`
      <div 
        class="avatar"
        style="
          width: ${this.size}px; 
          height: ${this.size}px;
          font-size: ${this.size * 0.5}px;
          background: linear-gradient(135deg, ${color1}, ${color2});
        "
      >
        ${initials}
      </div>
    `;
    }
}

customElements.define('custom-avatar', Avatar);
