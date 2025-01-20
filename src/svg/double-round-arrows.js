import {LitElement, css, html, svg} from 'lit';

export class DoubleRoundArrowsIcon extends LitElement {
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
<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M482-160q-134 0-228-93t-94-227v-7l-64 64-56-56 160-160 160 160-56 56-64-64v7q0 100 70.5 170T482-240q26 0 51-6t49-18l60 60q-38 22-78 33t-82 11Zm278-161L600-481l56-56 64 64v-7q0-100-70.5-170T478-720q-26 0-51 6t-49 18l-60-60q38-22 78-33t82-11q134 0 228 93t94 227v7l64-64 56 56-160 160Z"/></svg>    `;
    }
}

customElements.define('double-round-arrows-icon', DoubleRoundArrowsIcon);
