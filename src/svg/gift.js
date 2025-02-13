import {LitElement, css, html, svg} from 'lit';

export class GiftIcon extends LitElement {
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
<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed"><path d="M168-96v-432H96v-216h184q-5-11-7.5-22.94Q270-778.87 270-792q0-50 35-85t85-35q26.29 0 49.14 11Q462-890 480-871q17-19 40.5-30t49.5-11q50 0 85 35t35 85q0 12-3.5 24t-6.5 24h184v216h-72v432H168Zm402-744q-20.4 0-34.2 13.8Q522-812.4 522-792q0 20.4 13.8 34.2Q549.6-744 570-744q20.4 0 34.2-13.8Q618-771.6 618-792q0-20.4-13.8-34.2Q590.4-840 570-840Zm-228 48q0 20.4 13.8 34.2Q369.6-744 390-744q20.4 0 34.2-13.8Q438-771.6 438-792q0-20.4-13.8-34.2Q410.4-840 390-840q-20.4 0-34.2 13.8Q342-812.4 342-792ZM168-672v72h276v-72H168Zm276 504v-360H240v360h204Zm72 0h204v-360H516v360Zm276-432v-72H516v72h276Z"/></svg>        `
    }
}

customElements.define('gift-icon', GiftIcon);
