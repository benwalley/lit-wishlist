import {LitElement, css, html, svg} from 'lit';

export class DashboardIcon extends LitElement {
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
<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M530-600v-220h290v220H530ZM140-460v-360h290v360H140Zm390 320v-360h290v360H530Zm-390 0v-220h290v220H140Zm60-380h170v-240H200v240Zm390 320h170v-240H590v240Zm0-460h170v-100H590v100ZM200-200h170v-100H200v100Zm170-320Zm220-140Zm0 220ZM370-300Z"/></svg>
        `
    }
}

customElements.define('dashboard-icon', DashboardIcon);
