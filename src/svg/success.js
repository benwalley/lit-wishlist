import {LitElement, css, html, svg} from 'lit';

export class SuccessIcon extends LitElement {
    static styles = css`
        :host {
            /* Ensures the icon’s container is inline-block so it can be sized. */
            display: inline-block;

            /* Default width/height (fallback) */
            width: 1em;
            height: 1em;

            /* Default color (fallback) */
            color: currentColor;
        }

        /* The SVG takes the full size of the host, and fill uses currentColor. */

        svg {
            width: 100%;
            height: 100%;
            fill: currentColor;
            display: block; /* remove inline SVG extra spacing */
        }
    `;

    render() {
        return svg`
<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q65 0 123 19t107 53l-58 59q-38-24-81-37.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160q133 0 226.5-93.5T800-480q0-18-2-36t-6-35l65-65q11 32 17 66t6 70q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-56-216L254-466l56-56 114 114 400-401 56 56-456 457Z"/></svg>
    `;
    }
}

customElements.define('success-icon', SuccessIcon);
