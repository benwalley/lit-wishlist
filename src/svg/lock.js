import {LitElement, css, html, svg} from 'lit';

export class LockIcon extends LitElement {
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
<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed"><path d="M276.03-116q-26.64 0-45.34-18.84Q212-153.69 212-180.31v-359.38q0-26.62 18.84-45.47Q249.69-604 276.31-604H308v-96q0-71.6 50.27-121.8Q408.53-872 480.23-872q71.69 0 121.73 50.2Q652-771.6 652-700v96h31.69q26.62 0 45.47 18.84Q748-566.31 748-539.69v359.38q0 26.62-18.86 45.47Q710.29-116 683.65-116H276.03Zm.28-52h407.38q5.39 0 8.85-3.46t3.46-8.85v-359.38q0-5.39-3.46-8.85t-8.85-3.46H276.31q-5.39 0-8.85 3.46t-3.46 8.85v359.38q0 5.39 3.46 8.85t8.85 3.46Zm203.9-130q25.94 0 43.87-18.14Q542-334.27 542-360.21t-18.14-43.87Q505.73-422 479.79-422t-43.87 18.14Q418-385.73 418-359.79t18.14 43.87Q454.27-298 480.21-298ZM360-604h240v-96q0-50-35-85t-85-35q-50 0-85 35t-35 85v96Zm-96 436v-384 384Z"/></svg>
    `}
}

customElements.define('lock-icon', LockIcon);
