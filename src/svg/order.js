import {html} from 'lit';

export const OrderIcon = html`
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect x="2" y="3" width="20" height="18" rx="2" ry="2"></rect>
  <line x1="8" y1="10" x2="16" y2="10"></line>
  <line x1="8" y1="14" x2="16" y2="14"></line>
  <line x1="8" y1="18" x2="12" y2="18"></line>
</svg>
`;

customElements.define('order-icon', class OrderIcon extends HTMLElement {
  constructor() {
    super();
  }
  
  connectedCallback() {
    this.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="2" y="3" width="20" height="18" rx="2" ry="2"></rect>
        <line x1="8" y1="10" x2="16" y2="10"></line>
        <line x1="8" y1="14" x2="16" y2="14"></line>
        <line x1="8" y1="18" x2="12" y2="18"></line>
      </svg>
    `;
  }
});