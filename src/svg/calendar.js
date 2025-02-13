import { LitElement, css, html, svg } from 'lit';

export class CalendarIcon extends LitElement {
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
<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M580-240q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z"/></svg>
      `;
    }
}

customElements.define('calendar-icon', CalendarIcon);
