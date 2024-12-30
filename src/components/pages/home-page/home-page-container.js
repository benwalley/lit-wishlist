import {LitElement, html} from 'lit';
import {observeState} from 'lit-element-state';
import {userState} from "../../../state/userStore.js";

export class HomePageContainer extends observeState(LitElement) {
    render() {
        return html`
    
    `;
    }
}
customElements.define('home-page-container', HomePageContainer);
