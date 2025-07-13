import { LitElement, html, css } from 'lit';
import { observeState } from 'lit-element-state';
import { userState } from '../../state/userStore.js';
import { isCurrentUserSubuser } from '../../helpers/generalHelpers.js';
import { switchToSubuser } from '../../helpers/api/users.js';
import { messagesState } from '../../state/messagesStore.js';
import { setJwt, setRefreshToken } from '../../localStorage/tokens.js';
import { triggerUpdateUser } from '../../events/eventListeners.js';
import '../../svg/switch-user.js';
import '../global/custom-tooltip.js';
import '../global/custom-modal.js';
import './subuser-login-item.js';
import buttonStyles from '../../css/buttons.js';

class SwitchUserElement extends observeState(LitElement) {
    static get properties() {
        return {
            isModalOpen: { type: Boolean }
        };
    }

    constructor() {
        super();
        this.isModalOpen = false;
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    display: block;
                }
                
                .icon-button {
                    font-size: var(--font-size-large);
                }

                .modal-header {
                    font-weight: 600;
                    color: var(--text-color-dark);
                    margin-bottom: 0;
                    font-size: var(--font-size-large);
                    text-align: center;
                    padding: var(--spacing-normal);
                    border-bottom: 1px solid var(--border-color);
                }

                .modal-body {
                    padding: var(--spacing-normal);
                    color: var(--text-color-medium-dark);
                    font-size: var(--font-size-medium);
                    line-height: 1.5;
                    text-align: center;
                }

                .modal-body p {
                    margin: 0 0 var(--spacing-small) 0;
                }

                .modal-body p:last-child {
                    margin-bottom: 0;
                }

                .users-list {
                    padding: var(--spacing-normal);
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-x-small);
                }

                .no-subusers {
                    text-align: center;
                    padding: var(--spacing-large);
                    color: var(--text-color-medium-dark);
                    font-style: italic;
                }
            `
        ];
    }

    _handleSwitchUserClick() {
        this.isModalOpen = true;
    }

    _handleModalChange(event) {
        this.isModalOpen = event.detail.isOpen;
    }

    _handleModalClosed(event) {
        this.isModalOpen = false;
    }

    async _handleUserSelected(event) {
        const { userData } = event.detail;
        
        if (!userData?.id) {
            messagesState.addMessage('Invalid user data', 'error');
            return;
        }

        this.isModalOpen = false;

        try {
            const response = await switchToSubuser(userData.id);
            
            if (response.success && response.user && response.tokens) {
                // Update user state
                userState.userData = response.user;
                userState.loadingUser = false;
                
                // Update tokens
                setJwt(response.tokens.jwtToken);
                setRefreshToken(response.tokens.refreshToken);
                
                // Trigger user update to refresh all components
                triggerUpdateUser();
                
                messagesState.addMessage(`Switched to ${userData.name}`, 'success');
            } else {
                messagesState.addMessage(response.error || 'Failed to switch user', 'error');
            }
        } catch (error) {
            console.error('Error switching user:', error);
            messagesState.addMessage('An error occurred while switching users', 'error');
        }
    }

    render() {
        if (isCurrentUserSubuser()) {
            return html``;
        }

        return html`
            <button 
                class="icon-button green-text" 
                @click="${this._handleSwitchUserClick}"
                aria-label="Switch user"
            >
                <switch-user-icon></switch-user-icon>
            </button>
            <custom-tooltip>Switch User</custom-tooltip>

            <custom-modal 
                ?isOpen="${this.isModalOpen}"
                @modal-changed="${this._handleModalChange}"
                @modal-closed="${this._handleModalClosed}"
                maxWidth="500px"
                noPadding
            >
                <div class="modal-header">Switch User</div>
                <div class="users-list" @user-selected="${this._handleUserSelected}">
                    <!-- Current user -->
                    <subuser-login-item 
                        .userData="${userState.userData}"
                        .isCurrent="${true}"
                    ></subuser-login-item>
                    
                    <!-- Subusers -->
                    ${userState.subusers && userState.subusers.length > 0 
                        ? userState.subusers.map(subuser => html`
                            <subuser-login-item 
                                .userData="${subuser}"
                                .isCurrent="${false}"
                            ></subuser-login-item>
                        `)
                        : html`<div class="no-subusers">No subusers available</div>`
                    }
                </div>
            </custom-modal>
        `;
    }
}

customElements.define('switch-user-element', SwitchUserElement);
