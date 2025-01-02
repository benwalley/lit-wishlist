import { LitElement, css, svg } from 'lit';

export class MinusIcon extends LitElement {
    static styles = css`
        :host {
            display: inline-block;
            width: 24px;
            height: 24px;
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
        return svg`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
        <path d="M416 224H32c-17.67 0-32 14.33-32 32s14.33 32 32 32h384c17.67 0 32-14.33 32-32s-14.33-32-32-32z"/>
      </svg>
    `;
    }
}

customElements.define('minus-icon', MinusIcon);
