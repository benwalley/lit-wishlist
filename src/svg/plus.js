import {LitElement, css, html, svg} from 'lit';

export class PlusIcon extends LitElement {
    static styles = css`
        :host {
            /* Ensures the icon’s container is inline-block so it can be sized. */
            display: inline-block;

            /* Default width/height (fallback) */
            width: 24px;
            height: 24px;

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
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/></svg>
    `;
    }
}

customElements.define('plus-icon', PlusIcon);
