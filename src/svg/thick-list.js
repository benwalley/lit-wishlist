import {LitElement, css, html, svg} from 'lit';

export class ThickListIcon extends LitElement {
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
<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M100-180v-121.54h121.54V-180H100Zm216.92 0v-121.54H860V-180H316.92ZM100-419.23v-121.54h121.54v121.54H100Zm216.92 0v-121.54H860v121.54H316.92ZM100-658.46V-780h121.54v121.54H100Zm216.92 0V-780H860v121.54H316.92Z"/></svg>        `
    }
}

customElements.define('thick-list-icon', ThickListIcon);
