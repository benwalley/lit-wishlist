import {LitElement, css, html, svg} from 'lit';

export class HashIcon extends LitElement {
    static styles = css`
    :host {
      display: inline-block;
      width: 1em;
      height: 1em;
      color: currentColor;
    }

    svg {
      width: 100%;
      height: 100%;
      fill: currentColor;
      display: block;
    }
  `;

    render() {
        // Trash can icon (Font Awesome 6)
        return svg`
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="9" y2="9"></line><line x1="4" x2="20" y1="15" y2="15"></line><line x1="10" x2="8" y1="3" y2="21"></line><line x1="16" x2="14" y1="3" y2="21"></line></svg>
    `}
}

customElements.define('hash-icon', HashIcon);
