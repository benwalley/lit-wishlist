import { LitElement, css, html, svg } from 'lit';

export class HamburgerIcon extends LitElement {
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
<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M170-254.62q-12.75 0-21.37-8.63-8.63-8.62-8.63-21.38 0-12.75 8.63-21.37 8.62-8.61 21.37-8.61h620q12.75 0 21.37 8.62 8.63 8.63 8.63 21.39 0 12.75-8.63 21.37-8.62 8.61-21.37 8.61H170ZM170-450q-12.75 0-21.37-8.63-8.63-8.63-8.63-21.38 0-12.76 8.63-21.37Q157.25-510 170-510h620q12.75 0 21.37 8.63 8.63 8.63 8.63 21.38 0 12.76-8.63 21.37Q802.75-450 790-450H170Zm0-195.39q-12.75 0-21.37-8.62-8.63-8.63-8.63-21.39 0-12.75 8.63-21.37 8.62-8.61 21.37-8.61h620q12.75 0 21.37 8.63 8.63 8.62 8.63 21.38 0 12.75-8.63 21.37-8.62 8.61-21.37 8.61H170Z"/></svg>      `;
    }
}

customElements.define('hamburger-icon', HamburgerIcon);
