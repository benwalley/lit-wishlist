import { LitElement, css, html, svg } from 'lit';

export class UserIcon extends LitElement {
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
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z"/></svg>
    `;
    }
}

customElements.define('user-icon', UserIcon);
