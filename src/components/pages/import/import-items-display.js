import { LitElement, html, css } from 'lit';
import { observeState } from 'lit-element-state';
import buttonStyles from '../../../css/buttons.js';
import '../../add-to-list/priority-selector.js';
import '../../global/custom-image.js';

class ImportItemsDisplay extends observeState(LitElement) {
    static get properties() {
        return {
            importData: { type: Object },
            selectedItems: { type: Array },
            isLoading: { type: Boolean },
            itemPriorities: { type: Object },
            editedItemNames: { type: Object }
        };
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    display: block;
                    width: 100%;
                }

                .import-header {
                    border-radius: var(--border-radius-normal);
                    padding: var(--spacing-normal);
                    margin-bottom: var(--spacing-normal);
                }

                .import-header h2 {
                    margin: 0 0 var(--spacing-small) 0;
                    color: var(--text-color-dark);
                    font-size: var(--font-size-large);
                }

                .import-meta {
                    display: flex;
                    flex-wrap: wrap;
                    gap: var(--spacing-normal);
                    color: var(--text-color-medium);
                    font-size: var(--font-size-small);
                }

                .import-meta span {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-x-small);
                }

                .items-container {
                    padding: var(--spacing-normal);
                }

                .selection-controls {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: var(--spacing-normal);
                    flex-wrap: wrap;
                    gap: var(--spacing-small);
                }

                .selection-controls h3 {
                    margin: 0;
                    color: var(--text-color-dark);
                }

                .selection-actions {
                    display: flex;
                    gap: var(--spacing-small);
                }

                .selection-count {
                    color: var(--text-color-medium);
                    font-size: var(--font-size-small);
                }

                .items-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                    gap: var(--spacing-normal);
                    margin-top: var(--spacing-normal);
                }

                .item-card {
                    border: 1px solid var(--border-color);
                    border-radius: var(--border-radius-small);
                    padding: var(--spacing-small);
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-small);
                    transition: var(--transition-normal);
                    cursor: pointer;
                    user-select: none;
                }

                .item-card:hover {
                    box-shadow: var(--shadow-1-soft);
                    border-color: var(--primary-color);
                    transform: translateY(-2px);
                }

                .item-card.selected {
                    border-color: var(--primary-color);
                    background: var(--primary-color-light);
                    box-shadow: var(--shadow-1-soft);
                }

                custom-image {
                    width: 100%;
                    aspect-ratio: 1.25/1;
                    display: flex;
                    border-radius: var(--border-radius-small);
                    overflow: hidden;
                }

                .item-content {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-x-small);
                }

                .item-name {
                    font-weight: 600;
                    color: var(--text-color-dark);
                    font-size: var(--font-size-small);
                    line-height: 1.3;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .item-name-input {
                    width: 100%;
                    box-sizing: border-box;
                    border: 1px solid var(--border-color);
                    border-radius: var(--border-radius-small);
                    padding: var(--spacing-x-small);
                    font-weight: 600;
                    color: var(--text-color-dark);
                    font-size: var(--font-size-small);
                    line-height: 1.3;
                    background: var(--input-background-color);
                    resize: vertical;
                    min-height: 2.6em;
                    font-family: inherit;
                    transition: border-color 0.2s ease;
                }

                .item-name-input:focus {
                    outline: none;
                    border-color: var(--focus-color);
                    box-shadow: 0 0 2px 1px var(--focus-color);
                }

                .item-name-input::placeholder {
                    color: var(--placeholder-color, gray);
                    opacity: 0.7;
                }

                .item-price {
                    color: var(--primary-color);
                    font-weight: 600;
                    font-size: var(--font-size-small);
                }

                .item-selection-indicator {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-top: auto;
                    height: 24px;
                    font-size: var(--font-size-small);
                    color: var(--text-color-medium);
                }

                .item-card.selected .item-selection-indicator {
                    color: var(--primary-color);
                    font-weight: 600;
                }

                .no-items {
                    text-align: center;
                    padding: var(--spacing-large);
                    color: var(--text-color-medium);
                }

                @media (max-width: 768px) {
                    .items-grid {
                        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                        gap: var(--spacing-small);
                    }
                    
                    custom-image {
                        aspect-ratio: 1.25/1;
                    }
                }
            `
        ];
    }

    constructor() {
        super();
        this.importData = null;
        this.selectedItems = [];
        this.isLoading = false;
        this.itemPriorities = {};
        this.editedItemNames = {};
    }

    _handleItemClick(e, item) {
        e.preventDefault();
        e.stopPropagation();

        const isSelected = this._isItemSelected(item);
        const itemKey = this._getItemKey(item);

        if (isSelected) {
            // Remove from selection
            this.selectedItems = this.selectedItems.filter(selectedItem => {
                const selectedItemKey = this._getItemKey(selectedItem);
                return selectedItemKey !== itemKey;
            });
        } else {
            // Add to selection
            this.selectedItems = [...this.selectedItems, item];
        }

        this._updateSelectedItemsWithPriorities();
    }

    _isItemSelected(item) {
        const itemKey = this._getItemKey(item);
        return this.selectedItems.some(selectedItem => {
            const selectedItemKey = this._getItemKey(selectedItem);
            return selectedItemKey === itemKey;
        });
    }

    _handleSelectAll() {
        if (!this.importData?.items) return;

        this.selectedItems = [...this.importData.items];
        this.dispatchEvent(new CustomEvent('items-selection-changed', {
            detail: { selectedItems: this.selectedItems }
        }));
    }

    _handleSelectNone() {
        this.selectedItems = [];
        this.dispatchEvent(new CustomEvent('items-selection-changed', {
            detail: { selectedItems: this.selectedItems }
        }));
    }

    _getItemKey(item) {
        // Use original name if available, otherwise use current name
        const originalName = item.originalName || item.name;
        return `${originalName}-${item.linkUrl}`;
    }

    _handlePriorityChange(e, item) {
        const itemKey = this._getItemKey(item);
        const priority = e.detail.value;

        this.itemPriorities = {
            ...this.itemPriorities,
            [itemKey]: priority
        };

        // Update the selected items with the new priority data
        this._updateSelectedItemsWithPriorities();
    }

    _updateSelectedItemsWithPriorities() {
        const updatedSelectedItems = this.selectedItems.map(item => {
            const itemKey = this._getItemKey(item);
            const priority = this.itemPriorities[itemKey];
            const editedName = this.editedItemNames[itemKey];

            return {
                ...item,
                originalName: item.originalName || item.name, // Preserve original name
                name: editedName !== undefined ? editedName : item.name,
                priority: priority !== undefined ? priority : 3 // Default priority of 3
            };
        });

        this.dispatchEvent(new CustomEvent('items-selection-changed', {
            detail: { selectedItems: updatedSelectedItems }
        }));
    }

    _getItemPriority(item) {
        const itemKey = this._getItemKey(item);
        return this.itemPriorities[itemKey] !== undefined ? this.itemPriorities[itemKey] : 3;
    }

    _getItemName(item) {
        const itemKey = this._getItemKey(item);
        return this.editedItemNames[itemKey] !== undefined ? this.editedItemNames[itemKey] : item.name;
    }

    _handleNameChange(e, item) {
        const itemKey = this._getItemKey(item);
        const newName = e.target.value;

        this.editedItemNames = {
            ...this.editedItemNames,
            [itemKey]: newName
        };

        // Update the selected items with the new name data
        this._updateSelectedItemsWithPriorities();
    }

    render() {
        if (!this.importData) {
            return html`
                <div class="no-items">
                    <p>No import data available</p>
                </div>
            `;
        }

        const { wishlistTitle, totalItems, items, sourceUrl, processingMethod } = this.importData;

        return html`
            <div class="import-header">
                <h2>${wishlistTitle}</h2>
                <div class="import-meta">
                    <span>📦 ${totalItems} items</span>
                </div>
            </div>

            <div class="items-container">
                <div class="selection-controls">
                    <h3>Select Items to Import</h3>
                    <div class="selection-actions">
                        <span class="selection-count">${this.selectedItems.length} of ${items?.length || 0} selected</span>
                        <button 
                            class="button secondary small"
                            @click="${this._handleSelectAll}"
                            ?disabled="${this.selectedItems.length === (items?.length || 0)}"
                        >
                            Select All
                        </button>
                        <button 
                            class="button secondary small"
                            @click="${this._handleSelectNone}"
                            ?disabled="${this.selectedItems.length === 0}"
                        >
                            Select None
                        </button>
                    </div>
                </div>
                
                ${items && items.length > 0 ? html`
                    <div class="items-grid">
                        ${items.map(item => html`
                            <div 
                                class="item-card ${this._isItemSelected(item) ? 'selected' : ''}"
                                @click="${(e) => this._handleItemClick(e, item)}"
                            >
                                <custom-image imageId="${item.imageId}"></custom-image>
                                <div class="item-content">
                                    <textarea 
                                        class="item-name-input" 
                                        .value="${this._getItemName(item)}"
                                        @input="${(e) => this._handleNameChange(e, item)}"
                                        @click="${(e) => e.stopPropagation()}"
                                        placeholder="${item.name}"
                                        rows="2"
                                    ></textarea>
                                    ${item.price ? html`<div class="item-price">$${item.price}</div>` : ''}
                                </div>
                                
                                <priority-selector
                                    .value="${this._getItemPriority(item)}"
                                    size="small"
                                    @priority-changed="${(e) => this._handlePriorityChange(e, item)}"
                                    @click="${(e) => e.stopPropagation()}"
                                ></priority-selector>
                                
                                <div class="item-selection-indicator">
                                    ${this._isItemSelected(item) ? '✓ Selected' : 'Click to select'}
                                </div>
                            </div>
                        `)}
                    </div>
                ` : html`
                    <div class="no-items">
                        <p>No items found in the imported wishlist</p>
                    </div>
                `}
            </div>
        `;
    }
}

customElements.define('import-items-display', ImportItemsDisplay);
