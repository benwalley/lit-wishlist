import { LitElement, css, html, svg } from 'lit';

export class ShieldIcon extends LitElement {
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
<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-80q-139-35-229.5-159.5T160-516v-244l320-120 320 120v244q0 152-90.5 276.5T480-80Zm0-84q97-30 162-118.5T718-480H480v-315l-240 90v207q0 7 2 18h238v316Z"/></svg>
      `;
    }
}

customElements.define('shield-icon', ShieldIcon);
