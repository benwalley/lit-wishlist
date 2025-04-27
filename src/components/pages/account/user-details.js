import {LitElement, html, css} from 'lit';
import {observeState} from 'lit-element-state';
import {userState} from "../../../state/userStore.js";
import './account-username.js';
import './avatar.js';
import '../../../svg/edit.js';
import './logout-button.js'
import '../../../svg/edit.js'
import buttonStyles from '../../../css/buttons.js'
import '../../users/edit-user-form.js';

export class UserDetails extends observeState(LitElement) {
    static properties = {
        showEditButton: {type: Boolean},
        isUser: {type: Boolean},
        userData: {type: Object},
    };

    constructor() {
        super();
        this.showEditButton = true;
        this.isUser = true;
        this.userData = {};
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    display: flex;
                    flex-direction: column;
                }
                
                .username-section {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: var(--spacing-normal);
                    padding: var(--spacing-normal);
                    border-radius: var(--border-radius-large);
                    background: var(--background-light);
                    position: relative;
                    box-shadow: var(--shadow-1-soft);
                }

                .username {
                    font-weight: bold;
                    font-size: var(--font-size-x-large);
                    margin-top: var(--spacing-small);
                }

                .public-description {
                    text-align: center;
                    margin-top: var(--spacing-small);
                }

                .username-edit-button.icon-button {
                    position: absolute;
                    top: var(--spacing-small);
                    right: var(--spacing-small);
                    font-size: var(--font-size-large);
                    transition: var(--transition-normal);
                    border-radius: 50%;
                    --icon-color: var(--blue-normal);
                    --icon-color-hover: var(--blue-normal);
                    --icon-hover-background: var(--purple-light);

                    &:hover {
                        transform: rotate(-45deg) scale(1.1);
                    }
                }
            `
        ];
    }

    _getUsername() {
        if(this.isUser) {
            return userState?.userData?.name;
        }
        return this.userData?.name || '';
    }

    _getEmail() {
        if(this.isUser) {
            return userState?.userData?.email;
        }
        return this.userData?.email || '';
    }

    _getImageId() {
        if(this.isUser) {
            return userState?.userData?.image;
        }
        return this.userData?.image || '';
    }

    _getPublicDescription() {
        if(this.isUser) {
            return userState?.userData?.publicDescription;
        }
        return this.userData?.publicDescription || '';
    }

    _showLogoutButton() {
        return this.isUser;
    }

    _showEditButton() {
        return this.isUser && this.showEditButton;
    }

    _handleEditUser() {
        const editModal = this.shadowRoot.querySelector('#edit-user-modal');
        editModal.openModal();
    }

    _closeEditUserModal() {
        const editModal = this.shadowRoot.querySelector('#edit-user-modal');
        editModal.closeModal();
    }

    render() {
        return html`
            <custom-avatar size="150"
                           username="${this._getUsername()}"
                           imageid="${this._getImageId()}"
                           shadow="true"
            ></custom-avatar>
            <account-username .username="${this._getUsername()}"></account-username>
            <em>${this._getEmail()}</em>
            <p>${this._getPublicDescription()}</p>
            ${this._showEditButton() ? html`
                <button aria-label="edit-button"
                        class="icon-button button username-edit-button"
                        @click="${this._handleEditUser}"
                >
                    <edit-icon></edit-icon>
                </button>
            ` : ''}
            ${this._showLogoutButton() ? html`<logout-button></logout-button>` : ''}
            <custom-modal id="edit-user-modal" maxWidth="500px" noPadding>
                <edit-user-form @close-edit-user-modal="${this._closeEditUserModal}"></edit-user-form>
            </custom-modal>
        `;
    }
}

customElements.define('user-details', UserDetails);
