import {LitElement, css, html, svg} from 'lit';

export class ArrowLongLeftIcon extends LitElement {
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
        return svg`
<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/></svg>        `
    }
}

customElements.define('arrow-long-left-icon', ArrowLongLeftIcon);
