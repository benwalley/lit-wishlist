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
            grid-column: 2;
            grid-row: 2;
            flex-grow: 1;
            max-width: calc(100% - 20px);
            width: 100%;
            margin: 0 auto;
            display: grid;
        }
        
        @media (min-width: 450px) {
            :host {
                //max-width: calc(100% - 40px);
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
