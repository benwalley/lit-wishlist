import {LitElement, html, css} from 'lit';

import './avatar.js';
import './account-username.js';
import './account-public-description.js';
import './account-qa.js';
import './account-notifications.js';
import './account-navigation.js';
import './account-private-notes.js';
import './account-comments.js';
import './account-lists.js';
import './account-secondary-lists.js';
import './logout-button.js'
import '../../global/image-upload/image-uploader.js'
import '../../global/custom-image.js'
import '../../lists/my-lists.js'
import '../../../svg/edit.js'
import buttonStyles from '../../../css/buttons.js'
import '../../users/edit-user-form.js';

// TODO: Add logout link
export class AccountContainer extends LitElement {
    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    
                }
                .account-container {
                    display: grid;
                    gap: var(--spacing-normal);
                    padding: var(--spacing-normal) 0;
                }

                @media (min-width: 768px) {
                    .account-container {
                        grid-template-columns: 400px 1fr;
                    }
                }

                .username-section {
                    display: flex;
                    flex-direction: column;
                    border: none;
                }

                section {
                    padding: 1rem;
                    box-shadow: var(--shadow-1-soft);
                    border-radius: var(--border-radius-large);
                    background: var(--background-light);
                    position: relative;
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
            <main class="account-container">
                <section class="username-section">
                    <custom-avatar size="150" username="Ben"></custom-avatar>
                    <account-username></account-username>
                    <account-public-description></account-public-description>
                    <button aria-label="edit-button" 
                            class="icon-button button username-edit-button"
                            @click="${this._handleEditUser}"
                    >
                        <edit-icon></edit-icon>
                    </button>
                    <custom-modal id="edit-user-modal" maxWidth="500px" noPadding>
                        <edit-user-form @close-edit-user-modal="${this._closeEditUserModal}"></edit-user-form>
                    </custom-modal>
                </section>
                
                <section>
                    <logout-button></logout-button>
                    <image-uploader size="200"></image-uploader>
                </section>

                <section>
                    <account-qa></account-qa>
                </section>

                <section>
                    <account-notifications></account-notifications>
                </section>

                <section>
                    <account-navigation></account-navigation>
                </section>

                <section>
                    <account-private-notes></account-private-notes>
                </section>

                <section>
                    <account-comments></account-comments>
                </section>

                <section>
                    <my-lists></my-lists>
                </section>

                <section>
                    <account-secondary-lists></account-secondary-lists>
                </section>
            </main>
        `;
    }
}

customElements.define('account-container', AccountContainer);

