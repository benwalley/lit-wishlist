import { LitElement, html, css } from 'lit';

class HeartIcon extends LitElement {
    static styles = css`
        :host {
            display: inline-block;
            width: 30px;
            height: 30px;
            cursor: pointer;
        }

        svg {
            width: 100%;
            height: 100%;
        }

        .full {
            fill: red;
        }

        .half {
            fill: url(#half-gradient);
        }

        .empty {
            fill: #ddd;
        }
    `;

    static properties = {
        state: { type: String }, // "empty", "half", "full"
    };

    constructor() {
        super();
        this.state = "empty";
    }

    toggleState() {
        if (this.state === "empty") {
            this.state = "half";
        } else if (this.state === "half") {
            this.state = "full";
        } else {
            this.state = "empty";
        }
        this.dispatchEvent(new CustomEvent('state-changed', { detail: this.state }));
    }

    render() {
        return html`
            <svg @click="${this.toggleState}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="half-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="50%" stop-color="red" />
                        <stop offset="50%" stop-color="#ddd" />
                    </linearGradient>
                </defs>
                <path class="${this.state}" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
        `;
    }
}

customElements.define('heart-icon', HeartIcon);
