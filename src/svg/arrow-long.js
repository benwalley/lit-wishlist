import {LitElement, css, html, svg} from 'lit';

export class ArrowLongIcon extends LitElement {
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
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m560-240-56-58 142-142H160v-80h486L504-662l56-58 240 240-240 240Z"/></svg>
        `
    }
}

customElements.define('arrow-long-icon', ArrowLongIcon);
