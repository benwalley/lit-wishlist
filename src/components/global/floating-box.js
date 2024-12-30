import { LitElement, html, css } from 'lit';

class FloatingBox extends LitElement {
    static properties = {
        floatAmount: { type: Number },
    };

    static styles = css`
    :host {
      display: block;
    }

    .box {
      background: white;
      border-radius: var(--border-radius-normal);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      box-shadow: 0px var(--shadow-offset, 4px) var(--shadow-blur, 8px) rgba(0, 0, 0, 0.2);
      transform: translateY(var(--float-offset, -4px));
    }
  `;

    constructor() {
        super();
        this.floatAmount = 4; // Default float amount
    }

    updated(changedProperties) {
        if (changedProperties.has('floatAmount')) {
            const shadowOffset = this.floatAmount;
            const shadowBlur = this.floatAmount * 2;
            const floatOffset = -this.floatAmount;

            this.style.setProperty('--shadow-offset', `${shadowOffset}px`);
            this.style.setProperty('--shadow-blur', `${shadowBlur}px`);
            this.style.setProperty('--float-offset', `${floatOffset}px`);
        }
    }

    render() {
        return html`<div class="box"><slot></slot></div>`;
    }
}

customElements.define('floating-box', FloatingBox);
