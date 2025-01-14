import { LitElement, html, css } from 'lit';
import { generateTwoSimilarColorsFromString } from '../../../helpers.js';
// ^ adjust import path as necessary

export class Avatar extends LitElement {
    static properties = {
        username: { type: String },
        imageUrl: { type: String },
        size: { type: Number },
    };

    constructor() {
        super();
        this.username = '';
        this.imageUrl = '';
        this.size = 50; // default size in pixels
    }

    static styles = css`
        :host {
            display: inline-block;
        }
        .avatar {
            border-radius: 50%;
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
        if (this.imageUrl) {
            return html`
                <div
                        class="avatar"
                        style="
            width: ${this.size}px; 
            height: ${this.size}px; 
            font-size: ${this.size * 0.5}px;
          "
                >
                    <img src="${this.imageUrl}" alt="${this.username || 'avatar'}" />
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
          background: linear-gradient(to right, ${color1}, ${color2});
        "
      >
        ${initials}
      </div>
    `;
    }
}

customElements.define('custom-avatar', Avatar);
