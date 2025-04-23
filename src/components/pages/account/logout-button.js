import {LitElement, html, css} from 'lit';
import {observeState} from 'lit-element-state';
import {userState} from "../../../state/userStore.js";
import {logout} from "../../../helpers/api/users.js";
import {setJwt, setRefreshToken} from "../../../localStorage/tokens.js";
import {navigate} from "../../../router/main-router.js";
import {messagesState} from "../../../state/messagesStore.js";
import buttonStyles from "../../../css/buttons.js";

export class LogoutButton extends observeState(LitElement) {
    static properties = {

    };

    static get styles() {
        return [
            buttonStyles,
            css`
       
            `
        ];
    }

    constructor() {
        super();

    }

    async _handleClick(e) {
        e.preventDefault();
        const logoutResponse = await logout();
        if(logoutResponse.success) {
            this._handleSuccess();
            return;
        }
        this._handleFailure()
    }

    _handleSuccess() {
        this._frontendLogout()
    }

    _handleFailure(e) {
        this._frontendLogout()
    }

    _frontendLogout() {
        setJwt(undefined);
        setRefreshToken(undefined);
        userState.userData = undefined;
        messagesState.addMessage('Successfully logged out', 'success')
        navigate('/');
    }

    render() {
        return html`
            <button @click=${this._handleClick} class="button secondary">Log Out</button>
        `;
    }
}
customElements.define('logout-button', LogoutButton);
