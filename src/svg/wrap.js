import {html} from 'lit';

export const WrapIcon = html`
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M21 10v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V10"/>
  <polyline points="17 10 12 15 7 10"/>
  <path d="M12 15v6"/>
  <path d="M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4H3V6z"/>
</svg>
`;

customElements.define('wrap-icon', class WrapIcon extends HTMLElement {
  constructor() {
    super();
  }
  
  connectedCallback() {
    this.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 10v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V10"/>
        <polyline points="17 10 12 15 7 10"/>
        <path d="M12 15v6"/>
        <path d="M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4H3V6z"/>
      </svg>
    `;
  }
});