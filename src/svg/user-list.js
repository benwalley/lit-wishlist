import {LitElement, css, html, svg} from 'lit';

export class UserListIcon extends LitElement {
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
<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M567.31-685.39v-59.99h300v59.99h-300Zm0 155.39v-60h300v60h-300Zm0 155.38v-59.99h300v59.99h-300ZM317.4-407.69q-43.55 0-74.13-30.49t-30.58-74.04q0-43.55 30.49-74.12 30.49-30.58 74.04-30.58 43.55 0 74.13 30.48 30.57 30.49 30.57 74.04 0 43.55-30.48 74.13-30.49 30.58-74.04 30.58ZM92.69-183.08v-60.61q0-17.03 8.27-32.44 8.27-15.41 22.81-24.48 43.46-25.47 91.73-38.58 48.28-13.12 101.81-13.12t101.8 13.12q48.27 13.11 91.74 38.58 14.53 9.07 22.8 24.48 8.27 15.41 8.27 32.44v60.61H92.69Zm63.69-66.15v6.15h321.85v-6.15q-37.31-21.16-78.04-32.12-40.73-10.96-82.88-10.96-42.16 0-82.89 10.96-40.73 10.96-78.04 32.12Zm160.93-218.46q18.54 0 31.57-13.04 13.04-13.04 13.04-31.58t-13.04-31.57q-13.03-13.04-31.57-13.04t-31.58 13.04q-13.04 13.03-13.04 31.57t13.04 31.58q13.04 13.04 31.58 13.04Zm0-44.62Zm0 269.23Z"/></svg>
        `
    }
}

customElements.define('user-list-icon', UserListIcon);
