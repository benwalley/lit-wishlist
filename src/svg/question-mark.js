import { LitElement, css, html, svg } from 'lit';

export class QuestionMarkIcon extends LitElement {
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
<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M479-247q19.74 0 33.37-13.63Q526-274.26 526-294q0-19.74-13.63-33.37Q498.74-341 479-341q-19.74 0-33.37 13.63Q432-313.74 432-294q0 19.74 13.63 33.37Q459.26-247 479-247Zm-35-149h70q0-31.5 7.75-50T563-497q26-25 40-48.25T617-600q0-54.55-39.25-83.78Q538.5-713 484.17-713q-55.29 0-89.73 28.75Q360-655.5 346-615l63.21 24q4.79-18 22.04-38 17.26-20 52.75-20 32 0 48 17.5t16 38.5q0 20-11.75 37T507-524q-42.5 37.5-52.75 57.75T444-396Zm36 306q-80.91 0-152.07-30.76-71.15-30.77-123.79-83.5Q151.5-257 120.75-328.09 90-399.17 90-480q0-80.91 30.76-152.07 30.77-71.15 83.5-123.79Q257-808.5 328.09-839.25 399.17-870 480-870q80.91 0 152.07 30.76 71.15 30.77 123.79 83.5Q808.5-703 839.25-631.91 870-560.83 870-480q0 80.91-30.76 152.07-30.77 71.15-83.5 123.79Q703-151.5 631.91-120.75 560.83-90 480-90Zm0-75q131.5 0 223.25-91.75T795-480q0-131.5-91.75-223.25T480-795q-131.5 0-223.25 91.75T165-480q0 131.5 91.75 223.25T480-165Zm0-315Z"/></svg>
      `;
    }
}

customElements.define('question-mark-icon', QuestionMarkIcon);
