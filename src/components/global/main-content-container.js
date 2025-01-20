import {css, html, LitElement} from 'lit';
import {initRouter} from "../../router/main-router.js";
import {observeState} from 'lit-element-state';
import {userState} from "../../state/userStore.js";

export class MainContentContainer extends observeState(LitElement) {
    static properties = {

    };

    async firstUpdated() {
        console.log(userState)
        initRouter(this.renderRoot);
    }


    static styles = css`
        :host {
            flex-grow: 1;
            width: var(--max-content-width, 1400px);
            max-width: calc(100% - 20px);
            margin: 0 auto;
            display: grid;
        }
        
        @media (min-width: 450px) {
            :host {
                max-width: calc(100% - 40px);
            }
        }
    `;

    constructor() {
        super();
    }

    render() {
        return html``;
    }
}
customElements.define('main-content-container',MainContentContainer);
