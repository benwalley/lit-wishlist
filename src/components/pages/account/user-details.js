import {LitElement, html, css} from 'lit';
import {observeState} from 'lit-element-state';
import {userState} from "../../../state/userStore.js";
import './account-username.js';
import './avatar.js';
import '../../../svg/edit.js';
import '../../../svg/share.js';
import '../../../svg/world.js';
import '../../../svg/lock.js';
import '../../../svg/email.js';
import './logout-button.js'
import '../../../svg/edit.js'
import buttonStyles from '../../../css/buttons.js'
import '../../users/edit-user-form.js';
import '../../global/custom-modal.js';
import '../../instructions/publicity-details.js';
import {copyCurrentPageUrl, copyTextToClipboard, copyUrlToClipboard} from '../../../helpers/shareHelpers.js';
import {generateTwoSimilarColorsFromString} from '../../../helpers.js';

export class UserDetails extends observeState(LitElement) {
    static properties = {
        showEditButton: {type: Boolean},
        isUser: {type: Boolean},
        userData: {type: Object},
        isPublicityModalOpen: {type: Boolean}
    };

    constructor() {
        super();
        this.showEditButton = true;
        this.isUser = true;
        this.userData = {};
        this.isPublicityModalOpen = false;
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-small);
                    align-items: center;
                    width: 100%;
                    height: 100%;
                }
                
                account-username {
                    padding: var(--spacing-small) var(--spacing-normal-variable) 0;
                }
                
                p {
                    margin: 0;
                }
                
                .top-container {
                    padding: var(--spacing-medium-variable);
                    background: var(--transparent-fancy-purple-gradient);
                    background: var(--fancy-gradient-two);
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-sizing: border-box;
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

                .actions-container {
                    position: absolute;
                    top: var(--spacing-small);
                    right: var(--spacing-small);
                    display: flex;
                    gap: var(--spacing-x-small);
                    font-size: var(--font-size-large);

                    .icon-button {
                        font-size: inherit;
                    }
                }
                
                .publicity-indicator {
                    padding: var(--spacing-x-small) var(--spacing-small);
                    background: var(--background-dark);
                    border: 1px solid var(--border-color);
                    border-radius: var(--border-radius-large);
                    margin: var(--spacing-small) var(--spacing-normal-variable);
                }

                .public-indicator {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-x-small);
                    color: var(--primary-color);
                    font-size: var(--font-size-small);
                    font-weight: 500;
                }

                .private-indicator {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-x-small);
                    color: var(--text-color-dark);
                    font-size: var(--font-size-small);
                    font-weight: 500;
                }

                .email-container {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-x-small);
                    color: var(--text-color-medium-dark);
                    font-size: var(--font-size-small);
                    padding: 0 var(--spacing-normal-variable);
                }
                
                logout-button {
                    margin-top: auto;
                    padding: var(--spacing-normal);
                    box-sizing: border-box;
                    width: 100%;
                    padding-top: 0;
                }
                
                .description {
                    padding: 0 var(--spacing-small);
                    text-align: center;
                }
            `
        ];
    }

    _getUsername() {
        if (this.isUser) {
            return userState?.userData?.name;
        }
        return this.userData?.name || '';
    }

    _getEmail() {
        if (this.isUser) {
            return userState?.userData?.email;
        }
        return this.userData?.email || '';
    }

    _getImageId() {
        if (this.isUser) {
            return userState?.userData?.image;
        }
        return this.userData?.image || '';
    }

    _getPublicDescription() {
        if (this.isUser) {
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

    _isPublic() {
        if (this.isUser) {
            return userState?.userData?.isPublic;
        }
        return this.userData?.isPublic || false;
    }

    _handleEditUser() {
        const editForm = this.shadowRoot.querySelector('edit-user-form');
        editForm.editCurrentUser();
    }

    _handleShareUser() {
        copyUrlToClipboard(`/public/user/${userState.userData?.id}`,
            'Public url copied to clipboard',
            'Failed to copy public url');
    }

    _handlePublicityClick() {
        this.isPublicityModalOpen = true;
    }

    _handlePublicityModalClose() {
        this.isPublicityModalOpen = false;
    }

    render() {


        return html`
            <div class="top-container">
                <custom-avatar size="150"
                               username="${this._getUsername()}"
                               imageid="${this._getImageId()}"
                               shadow="true"
                ></custom-avatar>
            </div>
            <div class="actions-container">
                ${this._isPublic() ? html`
                    <button aria-label="share-button"
                            class="icon-button white-text"
                            @click="${this._handleShareUser}"
                    >
                        <share-icon></share-icon>
                    </button>
                    <custom-tooltip>Copy a link to this user's public profile</custom-tooltip>
                ` : ''}
                ${this._showEditButton() ? html`
                    <button aria-label="edit-button"
                            class="icon-button white-text"
                            @click="${this._handleEditUser}"
                    >
                        <edit-icon></edit-icon>
                    </button>
                ` : ''}
            </div>
            <account-username .username="${this._getUsername()}"></account-username>
            <div class="email-container">
                <email-icon></email-icon>
                <em>${this._getEmail()}</em>
            </div>
            ${this._getPublicDescription() ? html`<p class="description">${this._getPublicDescription()}</p>` : ''}
            
            ${this._isPublic() ? html`
                <button class="public-indicator publicity-indicator" @click=${this._handlePublicityClick}>
                    <world-icon></world-icon>
                    <span>Public Profile</span>
                </button>
                <custom-tooltip>This user's public details are visible to non-logged in users</custom-tooltip>
            ` : html`
                <button class="private-indicator publicity-indicator" @click=${this._handlePublicityClick}>
                    <lock-icon></lock-icon>
                    <span>Private Profile</span>
                    <custom-tooltip>This user's public details are <em>not</em> visible to non-logged in users</custom-tooltip>
                </button>
            `}
            <edit-user-form></edit-user-form>

            ${this._showLogoutButton() ? html`
                <logout-button></logout-button>` : ''}
                
            <custom-modal 
                ?isOpen=${this.isPublicityModalOpen}
                @modal-closed=${this._handlePublicityModalClose}
                maxWidth="600px"
                noPadding
            >
                <publicity-details></publicity-details>
            </custom-modal>
        `;
    }
}

customElements.define('user-details', UserDetails);
