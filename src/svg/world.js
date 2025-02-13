import {LitElement, css, html, svg} from 'lit';

export class WorldIcon extends LitElement {
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
<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed"><path d="M480.34-116q-75.11 0-141.48-28.42-66.37-28.42-116.18-78.21-49.81-49.79-78.25-116.09Q116-405.01 116-480.39q0-75.38 28.42-141.25t78.21-115.68q49.79-49.81 116.09-78.25Q405.01-844 480.39-844q75.38 0 141.25 28.42t115.68 78.21q49.81 49.79 78.25 115.85Q844-555.45 844-480.34q0 75.11-28.42 141.48-28.42 66.37-78.21 116.18-49.79 49.81-115.85 78.25Q555.45-116 480.34-116ZM432-172v-68q-20 0-34-14.1T384-288v-48L175-545q-4 19-5.5 35t-1.5 30q0 115 74.5 203T432-172Zm288-109q36-42 54-92.96 18-50.95 18-106.18 0-94.85-51.81-173.24Q688.38-731.77 600-768.77V-744q0 29.7-21.15 50.85Q557.7-672 528-672h-96v48q0 20.4-13.8 34.2Q404.4-576 384-576h-48v96h240q20.4 0 34.2 13.8Q624-452.4 624-432v96h41q23 0 39 16t16 39Z"/></svg>
    `}
}

customElements.define('world-icon', WorldIcon);
