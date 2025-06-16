import { LitElement, html, css } from 'lit';
import { observeState } from 'lit-element-state';
import { state } from 'lit/decorators.js'; // Use decorator for internal state
import { userState } from '../../../state/userStore.js';
import { isGroupAdmin } from '../../../helpers/groupHelpers.js';
import '../../../svg/user.js';
import '../../../svg/plus.js';
import '../../../svg/delete.js';
import '../../users/user-list-display-item.js';
// Removed unused imports: getUsernameById, getUserImageIdByUserId, getEmailAddressByUserId
import { inviteUserToGroup, cancelGroupInvitation, getInvitedUsers } from '../../../helpers/api/groups.js';
import buttonStyles from '../../../css/buttons.js';
import '../../global/custom-input.js';
import { triggerGroupUpdated } from "../../../events/eventListeners.js";
import { messagesState } from "../../../state/messagesStore.js";

export class InvitesSection extends observeState(LitElement) {
    static properties = {
        groupData: { type: Object },
        _loading: { type: Boolean, state: true }, // Renamed to indicate internal state
        _inviteEmail: { type: String, state: true },
        _inviteProcessing: { type: Boolean, state: true },
        _inviteError: { type: String, state: true },
        _invitedUsers: { type: Array, state: true },
        _isInviteFormVisible: { type: Boolean, state: true }, // State for form visibility
    };

    constructor() {
        super();
        this.groupData = {};
        this._loading = false;
        this._inviteEmail = '';
        this._inviteProcessing = false;
        this._inviteError = '';
        this._invitedUsers = [];
        this._isInviteFormVisible = false; // Initialize form as hidden
    }

    static styles = [ // Use static styles property
        buttonStyles,
        css`
            :host {
                display: grid;
                gap: var(--spacing-normal);
            }

            .invite-list {
                display: grid;
                gap: var(--spacing-small);
            }

            .section-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            h2 {
                margin: 0;
                font-size: var(--font-size-medium);
                color: var(--text-color-dark);
            }

            .invite-button {
                display: flex;
                align-items: center;
                gap: var(--spacing-x-small);
                font-size: var(--font-size-small);
            }

            plus-icon {
                width: 16px;
                height: 16px;
            }

            .invite-form {
                display: flex; /* Use flex directly instead of relying on JS */
                flex-direction: column;
                gap: var(--spacing-small);
                padding: var(--spacing-small);
                border-radius: var(--border-radius-normal);
                background-color: var(--background-color);
                margin-top: var(--spacing-small);
                border: 1px solid var(--border-color);
            }

            .form-title {
                font-weight: bold;
                font-size: var(--font-size-small);
                margin: 0;
            }

            .form-actions {
                display: flex;
                justify-content: flex-end;
                gap: var(--spacing-small);
                margin-top: var(--spacing-small);
            }

            .empty-state {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: var(--spacing-normal);
                text-align: center;
                color: var(--text-color-medium-dark);
            }

            user-icon {
                width: 32px;
                height: 32px;
                margin-bottom: var(--spacing-small);
                color: var(--grayscale-300);
            }

            .invite-item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: var(--spacing-small);
                border-radius: var(--border-radius-normal);
                background-color: var(--background-color);
                border: 1px solid var(--border-color);
            }

            .invite-email {
                font-size: var(--font-size-normal);
                color: var(--text-color-dark);
                font-weight: bold;
                padding-left: var(--spacing-small);
                /* Ensure long emails wrap */
                overflow-wrap: break-word;
                word-break: break-all;
                min-width: 0; /* Needed for flexbox wrapping */
            }

            .icon-button x-icon { /* Target icon within button */
                width: 16px;
                height: 16px;
            }

            .error-message {
                color: var(--error-color);
                font-size: var(--font-size-small);
                margin: 0;
            }
        `
    ];

    connectedCallback() {
        super.connectedCallback();
        // Fetch immediately if groupData is already available
        if (this.groupData?.id) {
            this._fetchInvitedUsers();
        }
    }

    // Use willUpdate for reacting to property changes before rendering
    willUpdate(changedProperties) {
        if (changedProperties.has('groupData') && this.groupData?.id) {
            this._fetchInvitedUsers();
            // Reset form visibility if group changes
            this._isInviteFormVisible = false;
        }
    }

    async _fetchInvitedUsers() {
        if (!this.groupData.id) return;

        this._loading = true;
        try {
            const result = await getInvitedUsers(this.groupData.id);
            this._invitedUsers = result.success ? result.data : [];
            if (!result.success) {
                console.error('Failed to fetch invited users:', result.error);
                // Optionally show user message via messagesState
            }
        } catch (error) {
            console.error('Error fetching invited users:', error);
            this._invitedUsers = [];
            messagesState.addMessage('Could not load pending invites.', 'error');
        } finally {
            this._loading = false;
        }
    }

    _handleInviteEmailChange(e) {
        this._inviteEmail = e.detail.value;
        // Clear error on typing
        if (this._inviteError) {
            this._inviteError = '';
        }
    }

    async _submitInvite() {
        const emailInput = this.shadowRoot?.querySelector('custom-input');
        // Use optional chaining and nullish coalescing for safety
        if (!emailInput?.validate()) {
            this._inviteError = 'Please enter a valid email address.';
            return;
        };

        this._inviteProcessing = true;
        this._inviteError = '';

        try {
            const result = await inviteUserToGroup(this.groupData.id, this._inviteEmail);

            if (result.success) {
                await this._fetchInvitedUsers(); // Refresh list
                this._toggleInviteForm(false); // Hide form on success
                triggerGroupUpdated();
                console.log(result)
                messagesState.addMessage(result.message || 'Invitation sent successfully', 'success');
            } else {
                this._inviteError = result.message || 'Failed to send invite. Please try again.';
                // Don't show generic message if specific one exists
                if (!result.message) {
                    messagesState.addMessage('Invitation failed. Please try again.', 'error');
                }
            }
        } catch (error) {
            console.error('Error sending invite:', error);
            this._inviteError = 'An unexpected error occurred. Please try again.';
            messagesState.addMessage('Invitation failed due to an error.', 'error');
        } finally {
            this._inviteProcessing = false;
        }
    }

    async _cancelInvite(userId) {
        try {
            const result = await cancelGroupInvitation(this.groupData.id, userId);

            if (result.success) {
                await this._fetchInvitedUsers(); // Refresh list
                messagesState.addMessage('Invitation canceled successfully', 'success');
            } else {
                messagesState.addMessage(result.message || 'Failed to cancel invitation', 'error');
            }
        } catch (error) {
            console.error('Error canceling invite:', error);
            messagesState.addMessage('Failed to cancel invitation due to an error.', 'error');
        }
        // Remove loading state if added
    }

    // Method to toggle form visibility and handle side effects
    async _toggleInviteForm(show) {
        this._isInviteFormVisible = show;
        if (!show) {
            // Reset form state when hiding
            this._inviteEmail = '';
            this._inviteError = '';
            this._inviteProcessing = false; // Ensure processing is reset
        } else {
            // Wait for the next render cycle for the form to be in the DOM
            await this.updateComplete;
            const input = this.shadowRoot?.querySelector('.invite-form custom-input');
            input?.focus();
        }
    }

    // --- Render Helpers ---

    _renderInviteButton() {
        return html`
            <button
                class="primary invite-button"
                @click=${() => this._toggleInviteForm(true)}
                aria-label="Show invite user form"
                title="Invite a user to this group"
            >
                <plus-icon></plus-icon>
                Invite User
            </button>
        `;
    }

    _renderInviteForm() {
        return html`
            <div class="invite-form" role="region" aria-labelledby="invite-form-title">
                <h3 id="invite-form-title" class="form-title">Invite a user or users to this group</h3>
                <custom-input
                    label="User Email Address"
                    placeholder="user@test.com, usertwo@test.com"
                    .value=${this._inviteEmail}
                    @value-changed=${this._handleInviteEmailChange}
                    ?required=${true}
                    error-message=${this._inviteError}
                ></custom-input>
                ${this._inviteError ? html`<p class="error-message" role="alert">${this._inviteError}</p>` : ''}
                <div class="form-actions">
                    <button
                        class="secondary"
                        @click=${() => this._toggleInviteForm(false)}
                        ?disabled=${this._inviteProcessing}
                    >
                        Cancel
                    </button>
                    <button
                        class="primary"
                        @click=${this._submitInvite}
                        ?disabled=${this._inviteProcessing || !this._inviteEmail.trim()}
                    >
                        ${this._inviteProcessing ? 'Sending...' : 'Send Invite'}
                    </button>
                </div>
            </div>
        `;
    }

    _renderInviteList(invites, isAdmin) {
        if (invites.length === 0) {
            return html`
                <div class="empty-state">
                    <user-icon></user-icon>
                    <p>No pending invites.</p>
                </div>
            `;
        }

        return html`
            <div class="invite-list">
                ${invites.map(invite => html`
                    <div class="invite-item">
                        <span class="invite-email">${invite.email}</span>
                        ${isAdmin ? html`
                            <button
                                class="icon-button"
                                @click=${() => this._cancelInvite(invite.id)}
                                aria-label="Cancel invite for ${invite.email}"
                                title="Cancel invite"
                                style="--icon-color: var(--delete-red);
                                 --icon-color-hover: var(--delete-red-darker);
                                 --icon-hover-background: var(--delete-red-light);"
                            >
                                <delete-icon></delete-icon>
                            </button>
                        ` : ''}
                    </div>
                `)}
            </div>
        `;
    }

    render() {
        if (this._loading) {
            // Consider a more specific loading indicator (e.g., spinner)
            return html`<p>Loading invites...</p>`;
        }

        const isAdmin = isGroupAdmin(this.groupData, userState?.userData?.id);
        const invites = this._invitedUsers || []; // Ensure it's always an array

        return html`
            <div class="section-header">
                <h2>Pending Invites (${invites.length})</h2>
            </div>

            ${isAdmin ?
                    (this._isInviteFormVisible ? this._renderInviteForm() : this._renderInviteButton()) :
                    '' 
            }

            ${this._renderInviteList(invites, isAdmin)}
        `;
    }
}

customElements.define('invites-section', InvitesSection);
