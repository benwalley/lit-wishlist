import {LitElement, html, css} from 'lit';
import './custom-modal.js';
import './custom-input.js';
import './custom-image.js';
import '../users/your-users-list.js';
import '../global/single-select-dropdown.js';
import '../pages/account/avatar.js';
import {messagesState} from '../../state/messagesStore.js';
import {createProposal, updateProposal} from '../../helpers/api/proposals.js';
import {
    listenProposalModal,
    triggerProposalCreated,
    triggerUpdateItem, listenUpdateUser
} from '../../events/eventListeners.js';
import {observeState} from 'lit-element-state';
import {userState} from '../../state/userStore.js';
import buttonStyles from '../../css/buttons.js';
import formStyles from '../../css/forms.js';

export class AddProposalModal extends observeState(LitElement) {
    static properties = {
        isOpen: {type: Boolean},
        itemData: {type: Object, state: true},
        proposalId: {type: Number, state: true},
        customItemName: {type: String, state: true},
        loading: {type: Boolean, state: true},
        selectedUserIds: {type: Array, state: true},
        selectedUsers: {type: Array, state: true},
        userPrices: {type: Object, state: true},
        selectedBuyer: {type: Object, state: true},
        availableUsers: {type: Array, state: true},
        currentUser: {type: Object, state: true},
        isEditMode: {type: Boolean, state: true}
    };

    constructor() {
        super();
        this.isOpen = false;
        this.itemData = null;
        this.proposalId = null;
        this.customItemName = '';
        this.loading = true; // Start in loading state
        this.selectedUserIds = [];
        this.selectedUsers = [];
        this.userPrices = {};
        this.selectedBuyer = null;
        this.availableUsers = [];
        this.currentUser = null;
        this.isEditMode = false;
    }

    static get styles() {
        return [
            buttonStyles,
            formStyles,
            css`
                .modal-content {
                    display: flex;
                    flex-direction: column;
                    gap: 0;
                    max-height: 85vh;
                    overflow: hidden;
                }

                .form-columns {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: var(--spacing-large);
                    flex: 1;
                    overflow: hidden;
                    min-height: 0;
                    padding: var(--spacing-normal);
                }

                @media (min-width: 768px) {
                    .form-columns {
                        grid-template-columns: 1fr 1fr;
                    }
                    
                }

                .modal-header {
                    text-align: left;
                    border-bottom: 1px solid var(--border-color);
                    padding: var(--spacing-normal);
                }

                .modal-title {
                    font-size: 1.3em;
                    font-weight: bold;
                    color: var(--text-color-dark);
                    margin: 0;
                }

                .form-section {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-small);
                    min-height: 0;
                    overflow: hidden;
                }

                .form-section.scrollable {
                    overflow-y: auto;
                }

                .form-section label {
                    font-weight: bold;
                    color: var(--text-color-dark);
                }

                .form-section-description {
                    font-size: 0.9em;
                    color: var(--medium-text-color);
                    margin-bottom: var(--spacing-small);
                }

                .user-selector-container {
                    border-radius: var(--border-radius-normal);
                    border: 1px solid var(--border-color);
                    background: var(--background-dark);
                    max-height: 300px;
                    overflow-y: auto;
                }

                .price-input-container {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-small);
                }

                .price-input {
                    flex: 1;
                }

                .currency-symbol {
                    font-weight: bold;
                    color: var(--text-color-dark);
                }

                .modal-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: var(--spacing-small);
                    padding: var(--spacing-normal);
                    border-top: 1px solid var(--border-color);
                }

                .user-price-container {
                    border: 1px solid var(--border-color);
                    border-radius: var(--border-radius-normal);
                    overflow: hidden;
                    max-height: 300px;
                    display: flex;
                    flex-direction: column;
                }

                .price-grid-header {
                    display: grid;
                    grid-template-columns: 1fr 120px 50px;
                    gap: var(--spacing-small);
                    padding: var(--spacing-small);
                    background: var(--background-dark);
                    border-bottom: 1px solid var(--border-color);
                    font-weight: bold;
                    color: var(--text-color-dark);
                    position: sticky;
                    top: 0;
                    z-index: 1;
                }

                .price-grid-header > div {
                    display: flex;
                    align-items: center;
                }

                .price-grid-header .header-price {
                    justify-content: center;
                }

                .price-grid-header .header-buyer {
                    justify-content: center;
                }

                .user-price-list {
                    flex: 1;
                    overflow-y: auto;
                }

                .user-price-row {
                    display: grid;
                    grid-template-columns: 1fr 120px 50px;
                    gap: var(--spacing-small);
                    align-items: center;
                    padding: var(--spacing-x-small) var(--spacing-small);
                    border-bottom: 1px solid var(--border-color);
                    background: var(--background-color);
                }

                .user-price-row:last-child {
                    border-bottom: none;
                }

                .user-avatar-name {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-small);
                }

                .price-input-cell {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: var(--spacing-small);
                }

                .user-price-input {
                    width: 80px;
                }

                .buyer-checkbox-cell {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .buyer-checkbox {
                    font-size: 1rem;
                }


                .total-display {
                    font-weight: bold;
                    color: var(--green-normal);
                    text-align: right;
                    margin-top: var(--spacing-small);
                    padding: var(--spacing-small);
                    background: var(--green-light);
                    border-radius: var(--border-radius-normal);
                }

                .item-details {
                    padding: var(--spacing-normal);
                    align-items: center;
                }

                .item-content {
                    display: flex;
                    gap: var(--spacing-normal);
                    align-items: center;
                }

                .item-image {
                    width: 60px;
                    height: 60px;
                    border-radius: var(--border-radius-small);
                    object-fit: cover;
                    flex-shrink: 0;
                    overflow: hidden;
                    box-shadow: var(--shadow-1-soft);
                    
                }

                .item-text {
                    flex: 1;
                    min-width: 0;
                }

                .item-name {
                    font-size: var(--font-size-large);
                    font-weight: bold;
                    color: var(--purple-normal);
                }

                .item-description {
                    color: var(--medium-text-color);
                    font-size: 0.9em;
                }
            `
        ];
    }

    connectedCallback() {
        super.connectedCallback();
        this._unsubscribeProposalModal = listenProposalModal(this._handleOpenModal.bind(this));
        this._unsubscribeUserUpdated = listenUpdateUser(this._handleUserUpdated.bind(this));
        this._initializeIfUserReady();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this._unsubscribeProposalModal) {
            this._unsubscribeProposalModal();
        }
        if (this._unsubscribeUserUpdated) {
            this._unsubscribeUserUpdated();
        }
    }

    _handleOpenModal(event) {
        if (event.detail) {
            this.isEditMode = event.detail.isEditMode || false;
            this.isOpen = true;

            if (this.isEditMode && event.detail.proposalData) {
                this._populateEditData(event.detail.proposalData);
            } else {
                this.itemData = event.detail.itemData || null;
                this._resetForm();
            }
        }
    }

    _handleModalChanged(event) {
        this.isOpen = event.detail.isOpen;
        if (!this.isOpen) {
            this._resetForm();
        }
    }

    _handleUserUpdated() {
        // When user data is updated, initialize the form if we were loading
        this._initializeIfUserReady();
    }

    _initializeIfUserReady() {
        if (userState?.userData?.id && this.loading) {
            // Set current user as selected and as default buyer
            this.selectedUserIds = [userState.userData.id];
            this.selectedUsers = [userState.userData];
            this.selectedBuyer = userState.userData;
            this.loading = false;
        }
    }

    _resetForm() {
        // Always include current user
        if (userState?.userData?.id) {
            this.selectedUserIds = [userState.userData.id];
            this.selectedUsers = [userState.userData];
            this.selectedBuyer = userState.userData; // Set as default buyer
            this.loading = false;
        } else {
            this.selectedUserIds = [];
            this.selectedUsers = [];
            this.selectedBuyer = null;
            this.loading = true; // Keep loading if no user
        }

        this.userPrices = {};
        this.customItemName = '';
        this.isEditMode = false;
    }

    _populateEditData(proposalData) {
        // Set loading to false since we have data to populate
        this.loading = false;

        this.itemData = proposalData?.itemData || {}
        this.proposalId = proposalData?.id;

        // Populate participants from proposal data
        if (proposalData.proposalParticipants && Array.isArray(proposalData.proposalParticipants)) {
            // Extract user objects and IDs from participants
            this.selectedUsers = proposalData.proposalParticipants.map(participant => participant.user);
            this.selectedUserIds = this.selectedUsers.map(user => user.id);

            // Populate user prices from participants
            const userPrices = {};
            proposalData.proposalParticipants.forEach(participant => {
                userPrices[participant.user.id] = participant.amountRequested;
            });
            this.userPrices = userPrices;

            // Find and set the buyer
            const buyerParticipant = proposalData.proposalParticipants.find(p => p.isBuying);
            if (buyerParticipant) {
                this.selectedBuyer = buyerParticipant.user;
            }
        }
    }

    _handleCustomItemNameChanged(event) {
        this.customItemName = event.detail.value;
    }

    _handleUsersSelectionChanged(event) {
        // Store full user objects for display
        let selectedUsers = event.detail.selectedUsers || [];
        const originallySelectedUserIds = selectedUsers.map(user => user.id);

        // Ensure current user is always included
        if (userState?.userData?.id && !selectedUsers.find(u => u.id === userState.userData.id)) {
            selectedUsers = [...selectedUsers, userState.userData];
        }

        // Reorder users: current user first, then newly selected users, then existing ones
        const currentUser = userState?.userData;
        const existingUsers = this.selectedUsers || [];
        const newUsers = selectedUsers.filter(user =>
            !existingUsers.find(existing => existing.id === user.id)
        );
        const retainedUsers = selectedUsers.filter(user =>
            existingUsers.find(existing => existing.id === user.id) &&
            (!currentUser || user.id !== currentUser.id)
        );

        // Order: current user first, new users next, then retained users
        const orderedUsers = [
            ...(currentUser && selectedUsers.find(u => u.id === currentUser.id) ? [currentUser] : []),
            ...newUsers.filter(user => !currentUser || user.id !== currentUser.id),
            ...retainedUsers
        ];

        this.selectedUsers = orderedUsers;
        this.selectedUserIds = this.selectedUsers.map(user => user.id);
        if (this.selectedBuyer && !orderedUsers.find(u => u.id === this.selectedBuyer.id)) {
            this.selectedBuyer = null;
        }
        // Clean up prices for removed users - only remove if user ID is not in the new selection
        const newUserPrices = {...this.userPrices};
        const selectedUserIds = selectedUsers.map(u => u.id);
        Object.keys(newUserPrices).forEach(userId => {
            if (!selectedUserIds.includes(userId)) {
                delete newUserPrices[userId];
            }
        });
        this.userPrices = newUserPrices;
    }

    _handleUserPriceChanged(userId, event) {
        this.userPrices = {
            ...this.userPrices,
            [userId]: event.detail.value
        };
    }

    _handleBuyerCheckboxChanged(user, event) {
        if (event.target.checked) {
            this.selectedBuyer = user;
        } else {
            event.target.checked = true;
        }
    }

    _validateForm() {
        const errors = [];

        // Check if we have item data (required for API)
        if (!this.itemData?.id) {
            errors.push('Item data is required to create a proposal');
        }

        if (this.selectedUsers.length === 0) {
            errors.push('Please select at least one user');
        }

        // Check that all selected users have valid prices
        for (const user of this.selectedUsers) {
            const price = this.userPrices[user.id];
            const numPrice = parseFloat(price);
            if (!price || isNaN(numPrice) || numPrice < 0) {
                errors.push(`Please enter a valid amount for ${user.username || user.name}`);
                break;
            }
            if (numPrice === 0) {
                errors.push(`Amount for ${user.username || user.name} must be greater than zero`);
                break;
            }
        }

        return errors;
    }

    async _handleSubmit() {
        const errors = this._validateForm();
        if (errors.length > 0) {
            messagesState.addMessage(errors[0], 'error');
            return;
        }

        this.loading = true;

        try {
            const participants = this.selectedUsers.map(user => ({
                userId: user.id,
                amountRequested: parseFloat(this.userPrices[user.id]),
                isBuying: this.selectedBuyer?.id === user.id
            }));

            const proposalData = {
                proposalId: this.proposalId,
                itemId: this.itemData?.id,
                participants: participants
            };

            let response;
            if(this.isEditMode) {
                response = await updateProposal(proposalData);
            } else {
                response = await createProposal(proposalData);
            }

            if (response.success) {
                messagesState.addMessage('Proposal sent successfully!');
                this.isOpen = false;
                triggerProposalCreated(response.data);
            } else {
                if(response.publicMessage) {
                    messagesState.addMessage(response.publicMessage, 'error');
                } else {
                    messagesState.addMessage('Failed to save proposal', 'error');
                }
            }
        } catch (error) {
            messagesState.addMessage('Failed to save proposal', 'error');
        } finally {
            this.loading = false;
            triggerUpdateItem();
        }
    }

    _handleCancel() {
        this.isOpen = false;
    }

    _calculateTotal() {
        return this.selectedUsers.reduce((total, user) => {
            const price = parseFloat(this.userPrices[user.id]) || 0;
            return total + price;
        }, 0);
    }

    render() {
        return html`
            <custom-modal 
                ?isOpen=${this.isOpen}
                @modal-changed=${this._handleModalChanged}
                maxWidth="1000px"
                noPadding
            >
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 class="modal-title">${this.isEditMode ? 'Edit Group Purchase Proposal' : 'Create Group Purchase Proposal'}</h2>
                    </div>

                    <!-- Item Details Section -->
                    <div class="item-details">
                        ${this.itemData ? html`
                            <div class="item-content">
                                ${this.itemData.imageIds?.length > 0 ? html`
                                    <custom-image
                                        class="item-image"
                                        imageId="${this.itemData?.imageIds?.[0]}"
                                        alt="${this.itemData.name}"
                                    ></custom-image>
                                ` : ''}
                                <div class="item-text">
                                    <div class="item-name">${this.itemData.name}</div>
                                    ${this.itemData.description ? html`
                                        <div class="item-description">${this.itemData.description}</div>
                                    ` : ''}
                                </div>
                            </div>
                        ` : html`
                            <label>Item Name</label>
                            <custom-input
                                placeholder="Enter item name"
                                .value=${this.customItemName}
                                @value-changed=${this._handleCustomItemNameChanged}
                                required
                            ></custom-input>
                        `}
                    </div>

                    <div class="form-columns">
                        <div class="form-section">
                            <label>Select Participants</label>
                            <div class="form-section-description">
                                Choose who should participate in this group purchase
                            </div>
                            <div class="user-selector-container">
                                <your-users-list
                                    class="full-width"
                                    apiEndpoint="/users/accessible"
                                    .selectedUserIds=${this.selectedUserIds}
                                    @selection-changed=${this._handleUsersSelectionChanged}
                                    requireCurrentUser
                                    multiSelect="true"
                                ></your-users-list>
                            </div>
                        </div>

                        ${this.selectedUsers.length > 0 ? html`
                            <div class="form-section">
                                <label>Individual Prices & Buyer Selection</label>
                                <div class="form-section-description">
                                    Set how much each person should pay and check who will buy the item
                                </div>
                                <div class="user-price-container">
                                    <div class="price-grid-header">
                                        <div class="header-participant">Participant</div>
                                        <div class="header-price">Price</div>
                                        <div class="header-buyer">Buyer</div>
                                    </div>
                                    <div class="user-price-list">
                                        ${this.selectedUsers.map(user => html`
                                            <div class="user-price-row">
                                                <div class="user-avatar-name">
                                                    <custom-avatar
                                                        size="30"
                                                        username="${user.name}"
                                                        imageId="${user.image || ''}"
                                                    ></custom-avatar>
                                                    <span>${user.name}</span>
                                                </div>
                                                <div class="price-input-cell">
                                                    <span class="currency-symbol">$</span>
                                                    <custom-input
                                                        class="user-price-input"
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        placeholder="0.00"
                                                        .value=${this.userPrices[user.id] || ''}
                                                        @value-changed=${(e) => this._handleUserPriceChanged(user.id, e)}
                                                        required
                                                    ></custom-input>
                                                </div>
                                                <div class="buyer-checkbox-cell">
                                                    <input
                                                        type="checkbox"
                                                        class="buyer-checkbox"
                                                        aria-label="Select Buyer"
                                                        .checked=${this.selectedBuyer?.id === user.id}
                                                        @change=${(e) => this._handleBuyerCheckboxChanged(user, e)}
                                                        name="buyer"
                                                    />
                                                </div>
                                            </div>
                                        `)}
                                    </div>
                                </div>
                                <div class="total-display">
                                    Total: $${this._calculateTotal().toFixed(2)}
                                </div>
                            </div>
                        ` : ''}
                    </div>

                    <div class="modal-actions">
                        <button
                            class="secondary"
                            @click=${this._handleCancel}
                            ?disabled=${this.loading}
                        >
                            Cancel
                        </button>
                        <button
                            class="primary"
                            @click=${this._handleSubmit}
                            ?disabled=${this.loading}
                        >
                            ${this.loading ? (this.isEditMode ? 'Updating...' : 'Sending...') : (this.isEditMode ? 'Update Proposal' : 'Send Proposal')}
                        </button>
                    </div>
                </div>
            </custom-modal>
        `;
    }
}

customElements.define('add-proposal-modal', AddProposalModal);
