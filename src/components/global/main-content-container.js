import {css, html, LitElement} from 'lit';
import {initRouter} from "../../router/main-router.js";
import {observeState} from 'lit-element-state';
import {userState} from "../../state/userStore.js";
import '../global/image-upload/image-cropper.js'

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
        return html`
            
                <image-cropper
                        .imageSrc=${this.rawSelectedImage}
                        .size=${this.size}
                ></image-cropper>`;
    }
}
customElements.define('main-content-container',MainContentContainer);
