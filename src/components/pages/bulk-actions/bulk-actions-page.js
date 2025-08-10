import { LitElement, html, css } from 'lit';
import { observeState } from 'lit-element-state';
import buttonStyles from '../../../css/buttons.js';
import { fetchMyItems, bulkUpdatePublicityAndPriority } from '../../../helpers/api/listItems.js';
import {listenUpdateItem, triggerUpdateItem} from "../../../events/eventListeners.js";
import '../../../svg/check.js';
import '../../../svg/link.js';
import '../../add-to-list/priority-selector.js';
import '../account/avatar.js';
import '../../../components/global/custom-image.js';
import '../../global/process-loading-ring.js';
import '../../global/custom-modal.js';
import '../../add-to-list/visibility-selector/visibility-selector-container.js';
import "../../lists/user-lists.js";
import '../../global/custom-toggle.js';
import {messagesState} from "../../../state/messagesStore.js";
import {showConfirmation} from "../../global/custom-confirm/confirm-helper.js";
import {bulkDeleteItems, bulkUpdateVisibility, bulkUpdateLists} from "../../../helpers/api/bulkActions.js";
import {invalidateCache} from "../../../helpers/caching.js";
import {customFetch} from "../../../helpers/fetchHelpers.js";

class BulkActionsPage extends observeState(LitElement) {
    static get properties() {
        return {
            myItems: { type: Array },
            loading: { type: Boolean },
            selectedItems: { type: Set },
            isVisibilityModalOpen: { type: Boolean },
            visibilitySaving: { type: Boolean },
            isAssignToListsModalOpen: { type: Boolean },
            assignToListsSaving: { type: Boolean },
            currentSelectedLists: { type: Array },
            modifiedItems: { type: Map },
            originalValues: { type: Array },
            isSavingChanges: { type: Boolean },
        };
    }

    constructor() {
        super();
        this.myItems = [];
        this.loading = false;
        this.selectedItems = new Set();
        this.isVisibilityModalOpen = false;
        this.visibilitySaving = false;
        this.isAssignToListsModalOpen = false;
        this.assignToListsSaving = false;
        this.currentSelectedLists = [];
        this.modifiedItems = new Map();
        this.originalValues = [];
        this.isSavingChanges = false;
    }

    async connectedCallback() {
        super.connectedCallback();
        await this.loadMyItems();
        listenUpdateItem(() => this.loadMyItems());
    }

    async loadMyItems() {
        this.loading = true;
        try {
            const result = await fetchMyItems();
            if (result.success) {
                this.myItems = result.data;
                this.originalValues = result.data;
            } else {
                console.error('Failed to load items:', result.error);
            }
        } catch (error) {
            console.error('Error loading items:', error);
        } finally {
            this.loading = false;
        }
    }

    toggleItemSelection(itemId) {
        if (this.selectedItems.has(itemId)) {
            this.selectedItems.delete(itemId);
        } else {
            this.selectedItems.add(itemId);
        }
        this.requestUpdate();
    }

    toggleAllItems() {
        if (this.selectedItems.size === this.myItems.length) {
            this.selectedItems.clear();
        } else {
            this.selectedItems = new Set(this.myItems.map(item => item.id));
        }
        this.requestUpdate();
    }

    toggleItemPublic(item, e) {
        const modifiedItem = this.modifiedItems.get(item.id) || {};
        modifiedItem.public = e.detail.checked;
        this.modifiedItems.set(item.id, modifiedItem);
        this.requestUpdate();
    }

    updateItemPriority(item, priorityValue) {
        const modifiedItem = this.modifiedItems.get(item.id) || {};
        modifiedItem.priority = priorityValue;
        this.modifiedItems.set(item.id, modifiedItem);
        this.requestUpdate();
    }

    isPublicityChanged(item) {
        const originalData = this.originalValues.find(original => original.id === item.id);
        const newValue = this.modifiedItems.get(item.id);
        if(!newValue) return false;

        if(newValue?.public === undefined) return false;
        return originalData.isPublic !== newValue.public;
    }

    isPriorityChanged(item) {
        const originalData = this.originalValues.find(original => original.id === item.id);
        const newValue = this.modifiedItems.get(item.id);
        if(!newValue) return false;

        if(newValue?.priority === undefined) return false;
        return parseFloat(originalData.priority) !== parseFloat(newValue.priority);
    }

    _haveItemsChanged() {
        for(const item of this.myItems) {
            const priorityChanged = this.isPriorityChanged(item);
            const publicityChanged = this.isPublicityChanged(item);
            if(priorityChanged || publicityChanged) return true;
        }
        return false;
    }

    async savePublicAndPriorityChanges() {
        if(!this._haveItemsChanged()) {
            messagesState.addMessage('No changes to save', 'info');
            return;
        }

        this.isSavingChanges = true;

        try {
            const itemsToUpdate = [];

            this.modifiedItems.forEach((modifiedItem, itemId) => {
                const originalItem = this.originalValues.find(item => item.id === itemId);
                let modified = false;

                const updateData = {
                    id: itemId
                };

                if (modifiedItem.public !== undefined && modifiedItem.public !== originalItem?.isPublic) {
                    updateData.isPublic = modifiedItem.public;
                    modified = true;
                }
                if (parseFloat(modifiedItem.priority) !== parseFloat(originalItem.priority)) {
                    updateData.priority = modifiedItem.priority;
                    modified = true;
                }
                if(modified) {
                    itemsToUpdate.push(updateData);
                }
            })

            if (itemsToUpdate.length === 0) {
                messagesState.addMessage('No changes to save', 'info');
                return;
            }

            const response = await bulkUpdatePublicityAndPriority(itemsToUpdate);

            if (!response.success) {
                throw new Error(response.message || 'Failed to update items');
            }

            // Clear modified items
            this.modifiedItems.clear();

            // Refresh the items list
            await this.loadMyItems();

            messagesState.addMessage(`Successfully updated ${itemsToUpdate.length} item${itemsToUpdate.length !== 1 ? 's' : ''}`, 'success');

            // Trigger update events
            triggerUpdateItem();
            invalidateCache();

        } catch (error) {
            console.error('Error saving changes:', error);
            messagesState.addMessage('Error saving changes. Please try again.', 'error');
        } finally {
            this.isSavingChanges = false;
        }
    }

    // Selection handlers
    selectAll() {
        this.selectedItems = new Set(this.myItems.map(item => item.id));
        this.requestUpdate();
    }

    deselectAll() {
        this.selectedItems = new Set();
        this.requestUpdate();
    }

    // Bulk action handlers
    async handleDeleteSelected() {
        if (this.selectedItems.size === 0) {
            messagesState.addMessage('No items selected for deletion', 'error');
            return;
        }
        const itemIds = Array.from(this.selectedItems);
        const confirmed = await showConfirmation({
            heading: 'Delete selected items?',
            message: `Are you sure you want to delete all of the selected items? This action cannot be undone.`,
            confirmLabel: 'Delete Items',
            cancelLabel: 'Cancel'
        });

        if (!confirmed) return;

        this.loading = true;
        try {
            const result = await bulkDeleteItems(itemIds);
            if (result.success) {
                messagesState.addMessage(result.message || 'Items deleted successfully', 'success');
                this.selectedItems = new Set();
                triggerUpdateItem()
            } else {
                messagesState.addMessage(result.message || 'Failed to delete items', 'error');
            }
        } catch (error) {
            console.error('Error deleting items:', error);
            messagesState.addMessage('Failed to delete items', 'error');
        } finally {
            this.loading = false;
        }
    }

    handleSetLists() {
        this.currentSelectedLists = [];
        this.shadowRoot.querySelector('select-my-lists').reset();
        this.isAssignToListsModalOpen = true;
    }

    _handleCloseAssignToListsModal() {
        this.isAssignToListsModalOpen = false;
        this.currentSelectedLists = [];
    }

    _handleListSelectionChanged(event) {
        const { selectedLists } = event.detail;
        console.log('List selection changed:', { selectedLists });
        // Store the current list selection
        this.currentSelectedLists = selectedLists || [];
    }

    async _handleSaveAssignToLists() {
        const itemIds = Array.from(this.selectedItems);
        const listIds = this.currentSelectedLists.map(list => list.id);

        this.assignToListsSaving = true;
        try {
            const result = await bulkUpdateLists(itemIds, listIds);
            if (result.success) {
                messagesState.addMessage(result.message || 'Items assigned to lists successfully');
                this._handleCloseAssignToListsModal();
                // Refresh items to show updated data
                await this.loadMyItems();
            } else {
                messagesState.addMessage(result.error || 'Failed to assign items to lists', 'error');
            }
        } catch (error) {
            console.error('Error assigning to lists:', error);
            messagesState.addMessage('Failed to assign items to lists', 'error');
        } finally {
            this.assignToListsSaving = false;
        }
    }

    handleSetVisibility() {
        if (this.selectedItems.size === 0) return;
        this.shadowRoot.querySelector('visibility-selector-container').reset();
        this.isVisibilityModalOpen = true;
    }

    _handleCloseVisibilityModal() {
        this.isVisibilityModalOpen = false;
        this.currentVisibilitySettings = null;
    }

    _handleVisibilityChanged(event) {
        const { selectedGroups, selectedUsers } = event.detail;
        const visibleToGroups = selectedGroups || [];
        const visibleToUsers = selectedUsers || [];
        this.currentVisibilitySettings = { visibleToGroups, visibleToUsers };
    }

    async _handleSaveVisibility() {
        if (!this.currentVisibilitySettings) {
            messagesState.addMessage('Please configure visibility settings', 'error');
            return;
        }

        const itemIds = Array.from(this.selectedItems);
        const { visibleToGroups, visibleToUsers } = this.currentVisibilitySettings;

        this.visibilitySaving = true;
        try {
            const result = await bulkUpdateVisibility(itemIds, visibleToGroups, visibleToUsers);
            if (result.success) {
                messagesState.addMessage(result.message || 'Visibility settings updated successfully');
                this._handleCloseVisibilityModal();
                // Refresh items to show updated data
                await this.loadMyItems();
            } else {
                messagesState.addMessage(result.error || 'Failed to update visibility settings', 'error');
            }
        } catch (error) {
            console.error('Error updating visibility:', error);
            messagesState.addMessage('Failed to update visibility settings', 'error');
        } finally {
            this.visibilitySaving = false;
        }
    }


    canSaveChanges() {
        if(this._haveItemsChanged() && !this.isSavingChanges) return true;
        return false;
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    display: block;
                    padding: var(--spacing-normal);
                    padding-bottom: 100px;
                }

                .loading {
                    text-align: center;
                    padding: var(--spacing-normal);
                }

                .items-container {
                    margin-top: var(--spacing-normal);
                }

                .items-grid {
                    display: grid;
                    grid-template-columns: 40px 40px 1fr 100px 182px 40px;
                    gap: 0;
                    background: var(--background-medium);
                    border: 2px solid var(--border-color);
                    border-radius: var(--border-radius-normal);
                    overflow: hidden;
                }
                
                .first-button {
                    margin-left: auto;
                }
                
                .grid-row {
                    display: contents;
                }
                
                .grid-row:hover .grid-cell {
                    background-color: var(--background-light);
                }
                
                .grid-row.selected .grid-cell {
                    background-color: var(--background-light);
                }

                .grid-header {
                    background-color: var(--background-light);
                    padding: 10px 8px;
                    font-weight: bold;
                    line-height: 1;
                    border-right: 1px solid var(--border-color);
                    border-bottom: 2px solid var(--border-color);
                }

                .grid-header:last-child {
                    border-right: none;
                }

                .grid-cell {
                    padding: 0;
                    border-right: 1px solid var(--border-color);
                    border-bottom: 1px solid var(--border-color);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    transition: var(--transition-200);
                    background: transparent;
                    outline: 1.5px solid transparent;
                    outline-offset: -1px;


                    &.changed {
                        background: var(--green-light) !important;
                        outline: 1.5px solid #a7dba9;
                    }
                    
                    &.align-left {
                        justify-content: flex-start;
                        padding-left: var(--spacing-small);
                    }
                    
                    &.clickable {
                        cursor: pointer;
                    }
                }

                .grid-cell:last-child {
                    border-right: none;
                }
                
                .image-cell {
                    width: 39px;
                    height: 39px;
                    background: var(--background-dark);
                    cursor: pointer;
                }

                .checkbox {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 16px;
                    height: 16px;
                    border-radius: 4px;
                    border: 2px solid var(--grayscale-300);
                    transition: var(--transition-normal);
                    cursor: pointer;
                }
                
                .checkbox-cell {
                    cursor: pointer;
                }
                
                .checkbox.selected {
                    border-color: var(--blue-normal);
                    background-color: var(--blue-normal);
                    color: white;
                }
                
                check-icon {
                    width: 16px;
                    height: 16px;
                    color: white;
                }

                .item-image {
                    width: 39px;
                    height: 39px;
                    border-radius: 4px;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }


                .priority-select {
                    width: 100%;
                    padding: 4px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    background-color: white;
                }

                .item-name {
                    font-weight: 500;
                    white-space: nowrap;
                    overflow: hidden;
                    max-width: 600px;
                    text-overflow: ellipsis;
                }

                .bulk-actions-bar {
                    display: flex;
                    gap: var(--spacing-small);
                    padding: var(--spacing-normal) 0;
                    align-items: center;
                    flex-wrap: wrap;
                }

                .selected-count {
                    font-weight: 500;
                    color: var(--text-color-medium-dark);
                    margin-right: var(--spacing-small);
                }


                .selection-controls {
                    display: flex;
                    gap: var(--spacing-x-small);
                    margin-right: var(--spacing-small);
                    padding-right: var(--spacing-small);
                    border-right: 1px solid var(--border-color);
                }

                .selection-controls button {
                    border: none;
                    background: none;
                    padding: var(--spacing-x-small) var(--spacing-small);
                    border-radius: var(--border-radius-small);
                    font-size: var(--font-size-x-small);
                    cursor: pointer;
                    transition: var(--transition-normal);
                }

                .selection-controls .select-all {
                    color: var(--primary-color);
                }

                .selection-controls .select-all:hover {
                    background-color: var(--purple-light);
                }

                .selection-controls .clear {
                    color: var(--text-color-medium-dark);
                }

                .selection-controls .clear:hover {
                    background-color: var(--grayscale-150);
                }

                .selection-controls button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .selection-controls button:disabled:hover {
                    background-color: transparent;
                }

                .loader-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(255, 255, 255, 0.8);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 9999;
                }

                .loader-content {
                    background-color: white;
                    padding: var(--spacing-large);
                    border-radius: var(--border-radius-normal);
                    box-shadow: var(--shadow-2);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: var(--spacing-small);
                }

                .loader-text {
                    color: var(--text-color-medium-dark);
                    font-size: var(--font-size-normal);
                    margin-top: var(--spacing-small);
                }
                
                .save-button {
                    margin-top: var(--spacing-normal);
                }

            `
        ];
    }

    render() {
        return html`
            <div class="bulk-actions-header">
                <h1>Bulk Actions</h1>
            </div>
            
            ${this.loading ? html`
                <div class="loading">Loading your items...</div>
            ` : html`
                <div class="items-container">
                    
                    <div class="bulk-actions-bar">
                        <div class="selection-controls">
                            <button 
                                class="select-all" 
                                @click=${this.selectAll}
                                ?disabled=${this.myItems.length === 0 || this.selectedItems.size === this.myItems.length}
                            >
                                Select All
                            </button>
                            <button 
                                class="clear" 
                                @click=${this.deselectAll}
                                ?disabled=${this.selectedItems.size === 0}
                            >
                                Clear
                            </button>
                        </div>
                        <span class="selected-count">${this.selectedItems.size}/${this.myItems.length} item${this.selectedItems.size !== 1 ? 's' : ''} selected</span>
                        <button 
                            class="button ghost first-button" 
                            @click=${this.handleSetLists}
                            ?disabled=${this.selectedItems.size === 0}
                        >
                            Assign to Lists
                        </button>
                        <button 
                            class="button ghost" 
                            @click=${this.handleSetVisibility}
                            ?disabled=${this.selectedItems.size === 0}
                        >
                            Set Visibility
                        </button>
                        <button
                                class="button ghost delete-button danger-text"
                                @click=${this.handleDeleteSelected}
                                ?disabled=${this.selectedItems.size === 0}
                        >
                            Delete Selected
                        </button>
                    </div>
                    
                    ${this.myItems.length > 0 ? html`
                        <div class="items-grid">
                            <!-- Header Row -->
                            <div class="grid-header"></div>
                            <div class="grid-header"></div>
                            <div class="grid-header">Name</div>
                            <div class="grid-header">Public</div>
                            <div class="grid-header">Priority</div>
                            <div class="grid-header"></div>
                            
                            <!-- Data Rows -->
                            ${this.myItems.map(item => html`
                                <div class="grid-row ${this.selectedItems.has(item.id) ? 'selected' : ''}">
                                    <div class="grid-cell checkbox-cell" @click=${() => this.toggleItemSelection(item.id)}>
                                        <div 
                                            class="checkbox ${this.selectedItems.has(item.id) ? 'selected' : ''}"
                                        >
                                            ${this.selectedItems.has(item.id) ? html`<check-icon></check-icon>` : null}
                                        </div>
                                    </div>
                                    <div class="grid-cell image-cell" @click=${() => this.toggleItemSelection(item.id)}>
                                        <custom-image 
                                                imageId="${item.imageIds[0] || 0}"
                                                width="39"
                                                height="39"
                                        ></custom-image>
                                    </div>
                                    <div class="grid-cell align-left clickable" @click=${() => this.toggleItemSelection(item.id)}>
                                        <span class="item-name">${item.name}</span>
                                    </div>
                                    <div class="grid-cell publicity ${this.isPublicityChanged(item) ? 'changed' : ''}">
                                        <custom-toggle
                                            .checked=${item.isPublic}
                                            @change=${(e) => this.toggleItemPublic(item, e)}
                                        ></custom-toggle>
                                    </div>
                                    <div class="grid-cell priority ${this.isPriorityChanged(item) ? 'changed' : ''}">
                                        <priority-selector 
                                            size="small"
                                            hideLabel
                                            .value=${item.priority || 0}
                                            @priority-changed=${(e) => this.updateItemPriority(item, e.detail.value)}
                                        ></priority-selector>
                                    </div>
                                    <div class="grid-cell">
                                        <a href="/items/${item.id}" class="button icon-button blue-text" target="_blank" title="View item">
                                            <link-icon></link-icon>
                                        </a>
                                    </div>
                                </div>
                            `)}
                        </div>
                    ` : html`
                        <p>No items found.</p>
                    `}
                </div>
            `}
            
            
            <!-- Visibility Settings Modal -->
            <custom-modal
                ?isOpen="${this.isVisibilityModalOpen}"
                maxWidth="1200px"
                @modal-changed="${(e) => this.isVisibilityModalOpen = e.detail.isOpen}"
                @modal-closed="${this._handleCloseVisibilityModal}"
            >
                <div style="padding: var(--spacing-normal);">
                    <h3 style="margin: 0 0 var(--spacing-normal) 0;">Set Visibility</h3>
                    <p style="margin: 0 0 var(--spacing-normal) 0; color: var(--text-color-medium-dark);">
                        Choose who can see these ${this.selectedItems.size} item${this.selectedItems.size !== 1 ? 's' : ''}.
                    </p>
                    <visibility-selector-container
                        @visibility-changed="${this._handleVisibilityChanged}"
                    ></visibility-selector-container>
                    
                    <div style="display: flex; gap: var(--spacing-small); justify-content: flex-end; margin-top: var(--spacing-normal); padding-top: var(--spacing-normal); border-top: 1px solid var(--border-color);">
                        <button 
                            class="button ghost"
                            @click="${this._handleCloseVisibilityModal}"
                        >
                            Cancel
                        </button>
                        <button 
                            class="button primary"
                            @click="${this._handleSaveVisibility}"
                            ?disabled="${this.visibilitySaving}"
                        >
                            ${this.visibilitySaving ? 'Saving...' : 'Save Visibility Settings'}
                        </button>
                    </div>
                </div>
            </custom-modal>
            
            <!-- Assign to Lists Modal -->
            <custom-modal
                ?isOpen="${this.isAssignToListsModalOpen}"
                maxWidth="600px"
                @modal-changed="${(e) => this.isAssignToListsModalOpen = e.detail.isOpen}"
                @modal-closed="${this._handleCloseAssignToListsModal}"
            >
                <div style="padding: var(--spacing-normal);">
                    <h3 style="margin: 0 0 var(--spacing-normal) 0;">Assign to Lists</h3>
                    <p style="margin: 0 0 var(--spacing-normal) 0; color: var(--text-color-medium-dark);">
                        Select which lists to assign these ${this.selectedItems.size} item${this.selectedItems.size !== 1 ? 's' : ''} to.
                        These items will only be assigned to the selected lists, and unassign to any unselected lists.
                    </p>
                    <select-my-lists
                        @change="${this._handleListSelectionChanged}"
                    ></select-my-lists>
                    
                    <div style="display: flex; gap: var(--spacing-small); justify-content: flex-end; margin-top: var(--spacing-normal); padding-top: var(--spacing-normal); border-top: 1px solid var(--border-color);">
                        <button 
                            class="button ghost"
                            @click="${this._handleCloseAssignToListsModal}"
                        >
                            Cancel
                        </button>
                        <button 
                            class="button primary"
                            @click="${this._handleSaveAssignToLists}"
                            ?disabled="${this.assignToListsSaving}"
                        >
                            ${this.assignToListsSaving ? 'Assigning...' : 'Assign to Lists'}
                        </button>
                    </div>
                </div>
            </custom-modal>
        
            <div class="save-button">
                <button 
                    class="button primary" 
                    style="margin: 0 auto; display: block;"
                    @click="${this.savePublicAndPriorityChanges}"
                    ?disabled="${!this.canSaveChanges()}"
                >
                    ${this.isSavingChanges ? 'Saving...' : `Save Public and Priority changes`}
                </button>
            </div>
        `;
    }
}

customElements.define('bulk-actions-page', BulkActionsPage);
