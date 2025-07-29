import {LitElement, html, css} from 'lit';
import {observeState} from 'lit-element-state';
import {userState} from "../../state/userStore.js";
import {messagesState} from "../../state/messagesStore.js";
import {getParentUserName, getParentUserId, getUserImageIdByUserId} from "../../helpers/generalHelpers.js";
import {changePassword} from "../../helpers/api/users.js";
import '../global/custom-input.js';
import '../global/custom-toggle.js';
import '../pages/account/avatar.js';
import buttonStyles from '../../css/buttons.js';
import '../../svg/user.js';
import '../../svg/gear.js';
import '../../svg/moon.js';
import '../../svg/bell.js';
import '../../svg/shield.js';

export class SettingsContent extends observeState(LitElement) {
    static get properties() {
        return {
            activeTab: { type: String },
            selectedTheme: { type: String },
            currentPassword: { type: String },
            newPassword: { type: String },
            confirmPassword: { type: String },
            isChangingPassword: { type: Boolean }
        };
    }

    constructor() {
        super();
        this.activeTab = 'general';
        this.selectedTheme = 'regular';
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
        this.isChangingPassword = false;

        this.themes = [
            {
                id: 'regular',
                name: 'Regular',
                description: 'Light theme with clean design',
                colors: ['var(--purple-normal)', 'var(--blue-normal)', 'var(--background-light)', 'var(--background-dark)']
            },
            {
                id: 'dark',
                name: 'Dark',
                description: 'Dark theme that\'s easy on the eyes',
                colors: ['var(--purple-normal)', 'var(--blue-normal)', 'var(--background-dark-dark)', '#6b7280']
            }
        ];
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    display: block;
                    width: 100%;
                    height: 600px;
                    max-height: 80vh;
                }

                .settings-container {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    overflow: hidden;
                }

                .settings-header {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-small);
                    padding: var(--spacing-normal);
                    border-bottom: 1px solid var(--border-color);
                    background: var(--header-background);
                }

                .settings-title {
                    font-size: var(--font-size-large);
                    font-weight: 600;
                    margin: 0;
                }

                .settings-body {
                    display: flex;
                    flex: 1;
                    overflow: hidden;
                }

                .tab-sidebar {
                    width: 160px;
                    border-right: 1px solid var(--border-color);
                    padding: var(--spacing-small);
                }

                .tab-button {
                    width: 100%;
                    padding: var(--spacing-small) var(--spacing-normal);
                    background: none;
                    border: none;
                    text-align: left;
                    cursor: pointer;
                    color: var(--text-color-medium-dark);
                    font-size: var(--font-size-normal);
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-small);
                }

                .tab-button:hover {
                    background: var(--option-select-background-hover);
                    color: var(--text-color-dark);
                }

                .tab-button.active {
                    background: var(--primary-color);
                    color: white;
                    font-weight: 500;
                }

                .tab-content {
                    flex: 1;
                    padding: var(--spacing-normal);
                    overflow-y: auto;
                }

                .settings-section {
                    margin-bottom: var(--spacing-large);
                }

                .settings-section:last-child {
                    margin-bottom: 0;
                }

                .section-title {
                    font-size: var(--font-size-normal);
                    font-weight: 600;
                    margin: 0 0 var(--spacing-normal) 0;
                    color: var(--text-color-dark);
                }

                .setting-item {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: var(--spacing-normal) 0;
                    border-bottom: 1px solid var(--border-color-light);
                }

                .setting-item:last-child {
                    border-bottom: none;
                }

                .setting-info {
                    flex: 1;
                }

                .setting-label {
                    font-weight: 500;
                    color: var(--text-color-dark);
                    margin-bottom: var(--spacing-x-small);
                }

                .setting-description {
                    font-size: var(--font-size-small);
                    color: var(--text-color-medium-dark);
                    line-height: 1.4;
                }

                .setting-control {
                    margin-left: var(--spacing-normal);
                }

                .user-info {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    padding: var(--spacing-normal);
                    gap: var(--spacing-normal);
                    border: 1px solid var(--border-color);
                    border-radius: var(--border-radius-normal);
                    margin-bottom: var(--spacing-large);
                }

                .user-section {
                    display: flex;
                    align-items: flex-start;
                    gap: var(--spacing-normal);
                    width: 100%;
                }

                .avatar-section {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: var(--spacing-small);
                }

                .parent-info {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-small);
                    width: 100%;
                }

                .parent-label {
                    font-size: var(--font-size-small);
                    color: var(--text-color-dark);
                    letter-spacing: 0.5px;
                    font-weight: bold;
                    padding-right: var(--spacing-small);
                    border-right: 1px solid var(--border-color);
                }

                .parent-name {
                    font-size: var(--font-size-x-small);
                    color: var(--text-color-dark);
                    font-weight: 500;
                }


                .user-details {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }

                .user-details h3 {
                    margin: 0 0 var(--spacing-x-small) 0;
                    font-size: var(--font-size-large);
                    font-weight: 600;
                    line-height: 1;
                    color: var(--text-color-dark);
                }

                .user-details p {
                    margin: 0;
                    font-size: var(--font-size-normal);
                    color: var(--text-color-medium-dark);
                }

                .danger-zone {
                    border: 1px solid var(--delete-red);
                    border-radius: var(--border-radius-small);
                    padding: var(--spacing-normal);
                    background: rgba(220, 53, 69, 0.05);
                }

                .danger-zone .section-title {
                    color: var(--delete-red);
                }

                .danger-button {
                    background: var(--delete-red);
                    color: white;
                    border: none;
                    padding: var(--spacing-small) var(--spacing-normal);
                    border-radius: var(--border-radius-small);
                    cursor: pointer;
                    font-weight: 500;
                    transition: background 0.2s ease;
                }

                .danger-button:hover {
                    background: var(--delete-red-hover, #c82333);
                }

                .theme-options {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: var(--spacing-normal);
                    margin-top: var(--spacing-normal);
                }

                .theme-option {
                    border: 2px solid var(--border-color);
                    border-radius: var(--border-radius-small);
                    padding: var(--spacing-normal);
                    cursor: pointer;
                    transition: all 0.2s ease;
                    background: var(--background-color);
                }

                .theme-option:hover {
                    border-color: var(--primary-color);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }

                .theme-option.selected {
                    border-color: var(--primary-color);
                    background: rgba(var(--primary-color-rgb, 59, 130, 246), 0.05);
                }

                .theme-preview {
                    height: 60px;
                    border-radius: var(--border-radius-small);
                    margin-bottom: var(--spacing-small);
                    position: relative;
                    overflow: hidden;
                }

                .theme-preview-colors {
                    display: flex;
                    height: 100%;
                }

                .theme-color {
                    flex: 1;
                }

                .theme-option-name {
                    font-weight: 600;
                    color: var(--text-color-dark);
                    margin-bottom: var(--spacing-x-small);
                }

                .theme-option-description {
                    font-size: var(--font-size-small);
                    color: var(--text-color-medium-dark);
                }

                .form-section {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-normal);
                }

                .form-section custom-input {
                    margin-bottom: var(--spacing-small);
                }

                .password-requirements {
                    font-size: var(--font-size-small);
                    color: var(--text-color-medium-dark);
                    margin-top: var(--spacing-x-small);
                }

                @media (max-width: 600px) {
                    .settings-body {
                        flex-direction: column;
                    }
                    
                    .tab-sidebar {
                        width: 100%;
                        display: flex;
                        overflow-x: auto;
                        padding: var(--spacing-small);
                        gap: var(--spacing-x-small);
                    }
                    
                    .tab-button {
                        white-space: nowrap;
                        width: auto;
                        padding: var(--spacing-x-small) var(--spacing-small);
                        border-radius: var(--border-radius-small);
                    }
                }
            `
        ];
    }

    _setActiveTab(tab) {
        this.activeTab = tab;
    }

    _handleLogout() {
        this.dispatchEvent(new CustomEvent('logout', {
            bubbles: true,
            composed: true
        }));
    }

    _handleDeleteAccount() {
        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            this.dispatchEvent(new CustomEvent('delete-account', {
                bubbles: true,
                composed: true
            }));
        }
    }

    _selectTheme(themeId) {
        this.selectedTheme = themeId;
        this.dispatchEvent(new CustomEvent('theme-changed', {
            detail: { themeId },
            bubbles: true,
            composed: true
        }));
    }

    _handlePasswordInput(field, event) {
        this[field] = event.target.value;
    }

    async _handleChangePassword() {
        if (this.isChangingPassword) return;

        // Validate passwords
        if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
            messagesState.addMessage('Please fill in all password fields', 'error');
            return;
        }

        if (this.newPassword !== this.confirmPassword) {
            messagesState.addMessage('New passwords do not match', 'error');
            return;
        }

        this.isChangingPassword = true;

        try {
            const response = await changePassword(this.currentPassword, this.newPassword);

            if (response.success) {
                messagesState.addMessage('Password changed successfully');
                this.currentPassword = '';
                this.newPassword = '';
                this.confirmPassword = '';
            } else {
                messagesState.addMessage(response.error || response.message || 'Failed to change password', 'error');
            }
        } catch (error) {
            messagesState.addMessage('An error occurred while changing password', 'error');
        } finally {
            this.isChangingPassword = false;
        }
    }

    _renderGeneralTab() {
        return html`
            <div class="settings-section">
                <h3 class="section-title">Account Information</h3>
                <div class="user-info">
                    <div class="user-section">
                        <div class="avatar-section">
                            <custom-avatar
                                    .username=${userState.userData?.name || 'User'}
                                    .imageId="${userState.userData?.image || 0}"
                                    size="48"
                                    shadow>
                            </custom-avatar>
                        </div>
                        <div class="user-details">
                            <h3>${userState.userData?.name || 'User'}</h3>
                            <p>${userState.userData?.email}</p>
                        </div>
                    </div>
                    
                    ${userState.userData?.parentId ? html`
                            <div class="parent-info">
                                <div class="parent-label">Parent</div>
                                    <custom-avatar 
                                        .username=${getParentUserName(userState.userData?.id)}
                                        .imageId="${getUserImageIdByUserId(getParentUserId(userState.userData?.id))}"
                                        size="16">
                                    </custom-avatar>
                                    <div class="parent-name">${getParentUserName(userState.userData?.id)}</div>
                            </div>
                        ` : ''}
                </div>
            </div>
        `;
    }

    _renderAccountTab() {
        return html`
            <div class="settings-section">
                <h3 class="section-title">Change Password</h3>
                <div class="form-section">
                    <custom-input 
                        type="password" 
                        label="Current Password" 
                        placeholder="Enter current password"
                        .value="${this.currentPassword}"
                        @input="${(e) => this._handlePasswordInput('currentPassword', e)}">
                    </custom-input>
                    <custom-input 
                        type="password" 
                        label="New Password" 
                        placeholder="Enter new password"
                        .value="${this.newPassword}"
                        @input="${(e) => this._handlePasswordInput('newPassword', e)}">
                    </custom-input>
                    <custom-input 
                        type="password" 
                        label="Confirm New Password" 
                        placeholder="Confirm new password"
                        .value="${this.confirmPassword}"
                        @input="${(e) => this._handlePasswordInput('confirmPassword', e)}">
                    </custom-input>
                    <div class="password-requirements">
                        Password must be at least 6 characters long
                    </div>
                    <button 
                        type="button" 
                        class="button secondary" 
                        @click="${this._handleChangePassword}"
                        ?disabled="${this.isChangingPassword}">
                        ${this.isChangingPassword ? 'Updating...' : 'Update Password'}
                    </button>
                </div>
            </div>

            <div class="settings-section danger-zone">
                <h3 class="section-title">Danger Zone</h3>
                <div class="setting-item">
                    <div class="setting-info">
                        <div class="setting-label">Delete Account</div>
                        <div class="setting-description">Permanently delete your account and all data. This cannot be undone.</div>
                    </div>
                    <div class="setting-control">
                        <button class="danger-button" @click=${this._handleDeleteAccount}>Delete Account</button>
                    </div>
                </div>
            </div>
        `;
    }

    _renderPrivacyTab() {
        return html`
            <div class="settings-section">
                <h3 class="section-title">Privacy Settings</h3>
                <div class="setting-item">
                    <div class="setting-info">
                        <div class="setting-label">Profile Visibility</div>
                        <div class="setting-description">Control who can see your profile and lists</div>
                    </div>
                    <div class="setting-control">
                        <select class="form-control">
                            <option value="public">Public</option>
                            <option value="friends">Friends Only</option>
                            <option value="private">Private</option>
                        </select>
                    </div>
                </div>
            </div>
        `;
    }

    _renderNotificationsTab() {
        return html`
            <div class="settings-section">
                <h3 class="section-title">Email Notifications</h3>
                <div class="setting-item">
                    <div class="setting-info">
                        <div class="setting-label">New Group Invitations</div>
                        <div class="setting-description">Get notified when someone invites you to a group</div>
                    </div>
                    <div class="setting-control">
                        <custom-toggle .checked=${true}></custom-toggle>
                    </div>
                </div>
                <div class="setting-item">
                    <div class="setting-info">
                        <div class="setting-label">List Updates</div>
                        <div class="setting-description">Get notified when items are added to your lists</div>
                    </div>
                    <div class="setting-control">
                        <custom-toggle .checked=${true}></custom-toggle>
                    </div>
                </div>
                <div class="setting-item">
                    <div class="setting-info">
                        <div class="setting-label">Weekly Summary</div>
                        <div class="setting-description">Receive a weekly digest of your activity</div>
                    </div>
                    <div class="setting-control">
                        <custom-toggle .checked=${false}></custom-toggle>
                    </div>
                </div>
            </div>
        `;
    }

    _renderThemeTab() {
        return html`
            <div class="settings-section">
                <h3 class="section-title">Color Schemes</h3>
                <p class="setting-description" style="margin-bottom: var(--spacing-normal);">
                    Choose a color scheme that matches your style and preference.
                </p>
                <div class="theme-options">
                    ${this.themes.map(theme => html`
                        <div 
                            class="theme-option ${this.selectedTheme === theme.id ? 'selected' : ''}"
                            @click=${() => this._selectTheme(theme.id)}
                        >
                            <div class="theme-preview">
                                <div class="theme-preview-colors">
                                    ${theme.colors.map(color => html`
                                        <div class="theme-color" style="background-color: ${color};"></div>
                                    `)}
                                </div>
                            </div>
                            <div class="theme-option-name">${theme.name}</div>
                            <div class="theme-option-description">${theme.description}</div>
                        </div>
                    `)}
                </div>
            </div>
        `;
    }

    _renderTabContent() {
        switch (this.activeTab) {
            case 'general':
                return this._renderGeneralTab();
            case 'account':
                return this._renderAccountTab();
            case 'privacy':
                return this._renderPrivacyTab();
            case 'notifications':
                return this._renderNotificationsTab();
            case 'theme':
                return this._renderThemeTab();
            default:
                return this._renderGeneralTab();
        }
    }

    render() {
        return html`
            <div class="settings-container">
                <div class="settings-header">
                    <gear-icon style="width: 20px; height: 20px;"></gear-icon>
                    <h2 class="settings-title">Settings</h2>
                </div>
                
                <div class="settings-body">
                    <div class="tab-sidebar">
                        <button 
                            class="tab-button ${this.activeTab === 'general' ? 'active' : ''}"
                            @click=${() => this._setActiveTab('general')}>
                            <gear-icon style="width: 16px; height: 16px;"></gear-icon>
                            General
                        </button>
                        <button 
                            class="tab-button ${this.activeTab === 'account' ? 'active' : ''}"
                            @click=${() => this._setActiveTab('account')}>
                            <user-icon style="width: 16px; height: 16px;"></user-icon>
                            Account
                        </button>
                        <button 
                            class="tab-button ${this.activeTab === 'privacy' ? 'active' : ''}"
                            @click=${() => this._setActiveTab('privacy')}>
                            <shield-icon style="width: 16px; height: 16px;"></shield-icon>
                            Privacy
                        </button>
                        <button 
                            class="tab-button ${this.activeTab === 'notifications' ? 'active' : ''}"
                            @click=${() => this._setActiveTab('notifications')}>
                            <bell-icon style="width: 16px; height: 16px;"></bell-icon>
                            Notifications
                        </button>
                        <button 
                            class="tab-button ${this.activeTab === 'theme' ? 'active' : ''}"
                            @click=${() => this._setActiveTab('theme')}>
                            <moon-icon style="width: 16px; height: 16px;"></moon-icon>
                            Theme
                        </button>
                    </div>
                    
                    <div class="tab-content">
                        ${this._renderTabContent()}
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('settings-content', SettingsContent);
