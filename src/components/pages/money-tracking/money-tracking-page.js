import {LitElement, html, css} from 'lit';
import buttonStyles from "../../../css/buttons.js";
import {messagesState} from "../../../state/messagesStore.js";
import {createMoneyOwed, getMoneyOwedRecords, updateMoneyOwed, deleteMoneyOwed} from "../../../helpers/api/money.js";
import {listenUpdateMoney} from "../../../events/eventListeners.js";
import {showConfirmation} from "../../global/custom-confirm/confirm-helper.js";
import '../../loading/skeleton-loader.js';
import '../../../svg/dollar.js';
import '../../../svg/plus.js';
import '../../global/custom-modal.js';
import '../../global/custom-input.js';
import '../../global/user-chooser.js';
import '../../global/item-selector.js';
import '../account/avatar.js';
import './money-card.js';
import './money-summary-card.js';

export class MoneyTrackingPage extends LitElement {
    static properties = {
        loading: {type: Boolean},
        showModal: {type: Boolean},
        owedFrom: {type: String},
        owedTo: {type: String},
        owedFromUser: {type: Object},
        owedToUser: {type: Object},
        amount: {type: String},
        note: {type: String},
        item: {type: String},
        selectedItem: {type: Object},
        submitting: {type: Boolean},
        moneyRecords: {type: Array},
        editingRecord: {type: Object},
        isEditMode: {type: Boolean},
        netAmounts: {type: Array},
        selectedRecords: {type: Set},
    };

    constructor() {
        super();
        this.loading = true;
        this.showModal = false;
        this.owedFrom = '';
        this.owedTo = '';
        this.owedFromUser = null;
        this.owedToUser = null;
        this.amount = '';
        this.note = '';
        this.item = '';
        this.selectedItem = null;
        this.submitting = false;
        this.moneyRecords = [];
        this.editingRecord = null;
        this.isEditMode = false;
        this.netAmounts = [];
        this.selectedRecords = new Set();
    }

    connectedCallback() {
        super.connectedCallback();
        this.fetchMoneyData();
        listenUpdateMoney(() => this.fetchMoneyData());
        this.addEventListener('edit-money', this.handleEditMoney.bind(this));
        this.addEventListener('delete-money', this.handleDeleteMoney.bind(this));
        this.addEventListener('checkbox-changed', this.handleCheckboxChanged.bind(this));
    }

    async fetchMoneyData() {
        this.loading = true;

        try {
            const result = await getMoneyOwedRecords();

            if (result.success) {
                this.moneyRecords = result.data;
                // Select all records by default
                this.selectedRecords = new Set(this.moneyRecords.map(record => record.id));
                this.calculateNetAmounts();
            } else {
                console.error('Error fetching money records:', result.error);
                messagesState.addMessage('Failed to load money records', 'error');
                this.moneyRecords = [];
                this.netAmounts = [];
                this.selectedRecords = new Set();
            }
        } catch (error) {
            console.error('Error fetching money records:', error);
            messagesState.addMessage('An error occurred while loading money records', 'error');
            this.moneyRecords = [];
            this.netAmounts = [];
            this.selectedRecords = new Set();
        } finally {
            this.loading = false;
        }
    }

    calculateNetAmounts() {
        if (!this.moneyRecords || this.moneyRecords.length === 0) {
            this.netAmounts = [];
            return;
        }

        // Filter to only include selected records
        const selectedMoneyRecords = this.moneyRecords.filter(record => 
            this.selectedRecords.has(record.id)
        );

        if (selectedMoneyRecords.length === 0) {
            this.netAmounts = [];
            return;
        }

        // Create a map to track debts between users
        const debtMap = new Map();

        // Process each selected money record
        selectedMoneyRecords.forEach(record => {
            const fromName = record.owedFromName;
            const toName = record.owedToName;
            const amount = parseFloat(record.amount) || 0;

            // Create a unique key for this user pair (consistent order, case-insensitive)
            const key = fromName.toLowerCase() < toName.toLowerCase() ? 
                `${fromName.toLowerCase()}:${toName.toLowerCase()}` : 
                `${toName.toLowerCase()}:${fromName.toLowerCase()}`;
            
            if (!debtMap.has(key)) {
                debtMap.set(key, {
                    user1: fromName.toLowerCase() < toName.toLowerCase() ? fromName : toName,
                    user2: fromName.toLowerCase() < toName.toLowerCase() ? toName : fromName,
                    user1OwesUser2: 0,
                    user2OwesUser1: 0,
                    user1Id: fromName.toLowerCase() < toName.toLowerCase() ? record.owedFromId : record.owedToId,
                    user2Id: fromName.toLowerCase() < toName.toLowerCase() ? record.owedToId : record.owedFromId
                });
            }

            const debt = debtMap.get(key);
            
            // Add the amount to the appropriate direction (case-insensitive comparison)
            if (fromName.toLowerCase() === debt.user1.toLowerCase()) {
                debt.user1OwesUser2 += amount;
            } else {
                debt.user2OwesUser1 += amount;
            }
        });

        // Calculate net amounts and create result array
        const netAmounts = [];
        
        debtMap.forEach(debt => {
            const netAmount = debt.user1OwesUser2 - debt.user2OwesUser1;
            
            if (Math.abs(netAmount) > 0.01) { // Only include if net amount is significant
                if (netAmount > 0) {
                    // user1 owes user2
                    netAmounts.push({
                        owedFromName: debt.user1,
                        owedToName: debt.user2,
                        owedFromId: debt.user1Id,
                        owedToId: debt.user2Id,
                        netAmount: netAmount
                    });
                } else {
                    // user2 owes user1
                    netAmounts.push({
                        owedFromName: debt.user2,
                        owedToName: debt.user1,
                        owedFromId: debt.user2Id,
                        owedToId: debt.user1Id,
                        netAmount: Math.abs(netAmount)
                    });
                }
            }
        });

        this.netAmounts = netAmounts;
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    display: block;
                    padding: 1rem;
                }

                .money-tracking-container {
                    max-width: 800px;
                    margin: 0 auto;
                }

                .page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                }

                .page-header h1 {
                    margin: 0;
                    font-size: 2rem;
                }

                .button {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .modal-header {
                    padding: 1rem;
                    border-bottom: 1px solid var(--border-color);
                    margin-bottom: 1rem;
                }

                .modal-header h2 {
                    margin: 0;
                    font-size: 1.5rem;
                }

                .money-form {
                    padding: 0 1rem 1rem;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: var(--spacing-normal);
                }

                .form-group {
                    margin-bottom: 1rem;
                    
                    &.full-width {
                        grid-column: 1 / -1;
                    }
                }

                .form-actions {
                    grid-column: 1 / -1;
                    display: flex;
                    gap: 1rem;
                    justify-content: flex-end;
                    margin-top: 2rem;
                    padding-top: 1rem;
                    border-top: 1px solid var(--border-color);
                }

                .money-list {
                    display: flex;
                    flex-direction: column;
                    margin-top: 2rem;
                }

                .summary-section {
                    margin-top: 3rem;
                    padding-top: 2rem;
                    border-top: 1px solid var(--border-color);
                }

                .summary-section h2 {
                    margin: 0 0 1.5rem 0;
                    font-size: 1.5rem;
                    color: var(--text-color-dark);
                }

                .summary-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .summary-empty-state {
                    text-align: center;
                    padding: 2rem 1rem;
                    color: var(--text-color-medium);
                    font-style: italic;
                }

                .empty-state {
                    text-align: center;
                    padding: 3rem 1rem;
                    color: var(--text-color-medium);
                }

                .empty-state h3 {
                    margin: 0 0 0.5rem 0;
                    color: var(--text-color-dark);
                }
            `
        ];
    }

    handleTrackMoneyOwed() {
        this.showModal = true;
    }

    closeModal() {
        this.showModal = false;
        this.resetForm();
    }

    resetForm() {
        this.owedFrom = '';
        this.owedTo = '';
        this.owedFromUser = null;
        this.owedToUser = null;
        this.amount = '';
        this.note = '';
        this.item = '';
        this.selectedItem = null;
        this.submitting = false;
        this.editingRecord = null;
        this.isEditMode = false;
    }

    async handleSubmit(e) {
        e.preventDefault();

        if (!this.owedFrom || !this.owedTo || !this.amount) {
            messagesState.addMessage('Please fill in required fields: Owed From, Owed To, and Amount');
            return;
        }

        this.submitting = true;

        try {
            // Prepare the data for the API
            const moneyData = {
                amount: parseFloat(this.amount),
                owedFromId: this.owedFromUser ? this.owedFromUser.id : null,
                owedFromName: this.owedFrom,
                owedToId: this.owedToUser ? this.owedToUser.id : null,
                owedToName: this.owedTo,
                note: this.note,
                itemId: this.selectedItem ? this.selectedItem.id : null
            };

            let result;
            if (this.isEditMode) {
                // Update existing record
                result = await updateMoneyOwed(this.editingRecord.id, moneyData);
                if (result.success) {
                    messagesState.addMessage('Money owed record updated successfully');
                    this.closeModal();
                } else {
                    messagesState.addMessage(result.error || 'Failed to update money owed record', 'error');
                }
            } else {
                // Create new record
                result = await createMoneyOwed(moneyData);
                if (result.success) {
                    messagesState.addMessage('Money owed record created successfully');
                    this.closeModal();
                } else {
                    messagesState.addMessage(result.error || 'Failed to create money owed record', 'error');
                }
            }
        } catch (error) {
            console.error('Error saving money owed record:', error);
            messagesState.addMessage('An error occurred while saving the record', 'error');
        } finally {
            this.submitting = false;
        }
    }

    handleInputChange(field, value) {
        this[field] = value;
    }

    handleUserChooserChange(field, event) {
        const { value, selectedUser } = event.detail;
        this[field] = value;
        this[field + 'User'] = selectedUser;
    }

    handleItemSelectorChange(event) {
        const { value, selectedItem } = event.detail;
        this.item = value;
        this.selectedItem = selectedItem;
    }

    handleEditMoney(event) {
        const { record } = event.detail;
        this.editingRecord = record;
        this.isEditMode = true;
        
        // Pre-populate form with record data
        this.owedFrom = record.owedFromName || '';
        this.owedTo = record.owedToName || '';
        this.amount = record.amount ? record.amount.toString() : '';
        this.note = record.note || '';
        this.item = record.item?.name || '';
        this.selectedItem = record.item || null;
        
        // Set user objects if available
        this.owedFromUser = record.owedFromId ? { id: record.owedFromId, name: record.owedFromName } : null;
        this.owedToUser = record.owedToId ? { id: record.owedToId, name: record.owedToName } : null;
        
        this.showModal = true;
    }

    async handleDeleteMoney(event) {
        const { record } = event.detail;
        
        try {
            const confirmed = await showConfirmation({
                heading: 'Delete Money Record',
                message: 'Are you sure you want to delete this money record?',
                confirmLabel: 'Delete',
                cancelLabel: 'Cancel'
            });

            if (confirmed) {
                const result = await deleteMoneyOwed(record.id);
                if (result.success) {
                    messagesState.addMessage('Money record deleted successfully');
                } else {
                    messagesState.addMessage(result.error || 'Failed to delete money record', 'error');
                }
            }
        } catch (error) {
            console.error('Error deleting money record:', error);
            messagesState.addMessage('An error occurred while deleting the record', 'error');
        }
    }

    handleCheckboxChanged(event) {
        const { checked, record } = event.detail;
        
        if (checked) {
            this.selectedRecords.add(record.id);
        } else {
            this.selectedRecords.delete(record.id);
        }
        
        // Trigger reactivity
        this.selectedRecords = new Set(this.selectedRecords);
        
        // Recalculate net amounts based on new selection
        this.calculateNetAmounts();
    }

    render() {
        return html`
            <div class="money-tracking-container">
                <header class="page-header">
                    <h1>Track Money</h1>
                    <button class="button primary" @click="${this.handleTrackMoneyOwed}">
                        <dollar-icon></dollar-icon>
                        Track Money Owed
                    </button>
                </header>

                ${this.loading ? html`
                    <skeleton-loader></skeleton-loader>
                ` : ''}

                ${!this.loading && this.moneyRecords.length === 0 ? html`
                    <div class="empty-state">
                        <h3>No Money Records</h3>
                        <p>Click "Track Money Owed" to create your first record.</p>
                    </div>
                ` : ''}

                ${!this.loading && this.moneyRecords.length > 0 ? html`
                    <div class="money-list">
                        ${this.moneyRecords.map(record => html`
                            <money-card 
                                .record="${record}"
                                .checked="${this.selectedRecords.has(record.id)}"
                            ></money-card>
                        `)}
                    </div>
                    
                    <div class="summary-section">
                        <h2>Net Amounts Owed</h2>
                        <p style="margin: 0 0 1rem 0; color: var(--text-color-medium-dark); font-size: var(--font-size-small);">
                            Based on ${this.selectedRecords.size} of ${this.moneyRecords.length} selected records. Click checkboxes above to include/exclude records.
                        </p>
                        ${this.netAmounts.length > 0 ? html`
                            <div class="summary-list">
                                ${this.netAmounts.map(netAmount => html`
                                    <money-summary-card .netAmount="${netAmount}"></money-summary-card>
                                `)}
                            </div>
                        ` : html`
                            <div class="summary-empty-state">
                                All debts are settled! No net amounts owed.
                            </div>
                        `}
                    </div>
                ` : ''}
            </div>

            <custom-modal .isOpen="${this.showModal}" @modal-closed="${this.closeModal}">
                <div class="modal-header">
                    <h2>${this.isEditMode ? 'Edit Money Record' : 'Track Money Owed'}</h2>
                </div>
                <form @submit="${this.handleSubmit}" class="money-form">
                    <div class="form-group">
                        <user-chooser
                            label="Owed From"
                            .value="${this.owedFrom}"
                            .selectedUser="${this.owedFromUser}"
                            placeholder="Enter name or select user"
                            @value-changed="${(e) => this.handleUserChooserChange('owedFrom', e)}"
                            required
                        ></user-chooser>
                    </div>
                    
                    <div class="form-group">
                        <user-chooser
                            label="Owed To"
                            .value="${this.owedTo}"
                            .selectedUser="${this.owedToUser}"
                            placeholder="Enter name or select user"
                            @value-changed="${(e) => this.handleUserChooserChange('owedTo', e)}"
                            required
                        ></user-chooser>
                    </div>
                    
                    <div class="form-group">
                        <custom-input
                            label="Amount"
                            type="number"
                            .value="${this.amount}"
                            @input="${(e) => this.handleInputChange('amount', e.target.value)}"
                            dollarIcon
                            required
                        ></custom-input>
                    </div>

                    <div class="form-group">
                        <item-selector
                            label="Item"
                            .value="${this.item}"
                            .selectedItem="${this.selectedItem}"
                            placeholder="Enter item name or select from your items"
                            @value-changed="${this.handleItemSelectorChange}"
                        ></item-selector>
                    </div>
                    
                    <div class="form-group full-width">
                        <custom-input
                            label="Note"
                            .value="${this.note}"
                            @input="${(e) => this.handleInputChange('note', e.target.value)}"
                        ></custom-input>
                    </div>
                    
                    
                    <div class="form-actions">
                        <button type="button" class="button secondary" @click="${this.closeModal}" ?disabled="${this.submitting}">
                            Cancel
                        </button>
                        <button type="submit" class="button primary" ?disabled="${this.submitting}">
                            ${this.submitting ? 'Saving...' : (this.isEditMode ? 'Update' : 'Save')}
                        </button>
                    </div>
                </form>
            </custom-modal>
        `;
    }
}

customElements.define('money-tracking-page', MoneyTrackingPage);
