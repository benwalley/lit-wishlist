import {LitElement, html, css} from 'lit';
import {searchItems} from '../../helpers/api/listItems.js';
import {getUsernameById} from "../../helpers/generalHelpers.js";

export class ItemSelector extends LitElement {
    static properties = {
        label: {type: String},
        value: {type: String},
        selectedItem: {type: Object},
        placeholder: {type: String},
        required: {type: Boolean},
        searchResults: {type: Array},
        showDropdown: {type: Boolean},
        loading: {type: Boolean},
        focused: {type: Boolean},
        debounceTimeout: {type: Number}
    };

    constructor() {
        super();
        this.label = '';
        this.value = '';
        this.selectedItem = null;
        this.placeholder = '';
        this.required = false;
        this.searchResults = [];
        this.showDropdown = false;
        this.loading = false;
        this.focused = false;
        this.debounceTimeout = null;
    }

    static styles = css`
        :host {
            display: block;
            position: relative;
            font-family: var(--font-family);
        }

        .input-container {
            position: relative;
            width: 100%;
        }

        .input-wrapper {
            display: flex;
            align-items: center;
            position: relative;
            width: 100%;
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius-small);
            background: var(--input-background-color);
            transition: border-color 0.2s ease;
        }

        .input-wrapper:focus-within {
            border-color: var(--focus-color);
            box-shadow: 0 0 2px 1px var(--focus-color);
        }

        .input-wrapper.has-selection {
            border-color: var(--purple-normal);
            background: var(--purple-light);
        }

        label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
            color: var(--text-color-dark);
            font-size: var(--font-size-small);
        }

        input {
            flex: 1;
            border: none;
            outline: none;
            padding: 0.75rem;
            font-size: var(--font-size-small);
            background: transparent;
            color: var(--text-color-dark);
        }

        input::placeholder {
            color: var(--text-color-light);
        }

        .clear-button {
            padding: 0.5rem;
            border: none;
            background: none;
            cursor: pointer;
            color: var(--text-color-medium);
            font-size: 1rem;
            margin-right: 0.25rem;
        }

        .clear-button:hover {
            color: var(--text-color-dark);
        }

        .loading-indicator {
            padding: 0.5rem;
            color: var(--text-color-medium);
            font-size: var(--font-size-small);
        }

        .dropdown {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            max-height: 300px;
            overflow-y: auto;
            background: white;
            border: 1px solid var(--border-color);
            border-top: none;
            border-radius: 0 0 var(--border-radius-small) var(--border-radius-small);
            box-shadow: var(--shadow-2-soft);
            z-index: 1000;
        }

        .dropdown-content {
            padding: 0.5rem 0;
        }

        .no-results {
            padding: 1rem;
            text-align: center;
            color: var(--text-color-medium);
            font-size: var(--font-size-small);
        }

        .item-option {
            padding: 0.75rem;
            cursor: pointer;
            border-bottom: 1px solid var(--border-color-light);
            transition: background-color 0.2s ease;
        }

        .item-option:hover {
            background: rgba(0, 0, 0, 0.05);
        }

        .item-option:last-child {
            border-bottom: none;
        }

        .item-name {
            font-weight: 500;
            color: var(--text-color-dark);
            margin-bottom: 0.25rem;
        }

        .item-details {
            display: flex;
            gap: 1rem;
            font-size: var(--font-size-x-small);
            color: var(--text-color-medium);
        }

        .item-price {
            font-weight: 500;
        }

        .selected-indicator {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem;
            background: var(--purple-light);
            color: var(--purple-normal);
            font-size: var(--font-size-x-small);
            font-weight: 500;
        }

        .highlight {
            background: var(--yellow-light, #fff3cd);
            color: var(--yellow-dark, #856404);
            font-weight: 600;
            padding: 0 2px;
            border-radius: 2px;
        }
    `;

    connectedCallback() {
        super.connectedCallback();
        document.addEventListener('click', this.handleClickOutside);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener('click', this.handleClickOutside);
        if (this.debounceTimeout) {
            clearTimeout(this.debounceTimeout);
        }
    }

    async searchForItems(query) {
        try {
            this.loading = true;
            const response = await searchItems(query);

            if (response.success) {
                this.searchResults = response.data || [];
            } else {
                console.error('Error searching items:', response.error);
                this.searchResults = [];
            }
        } catch (error) {
            console.error('Error searching items:', error);
            this.searchResults = [];
        } finally {
            this.loading = false;
        }
    }

    debouncedSearch() {
        if (this.debounceTimeout) {
            clearTimeout(this.debounceTimeout);
        }

        this.debounceTimeout = setTimeout(() => {
            if (this.value && this.value.length >= 1) {
                this.searchForItems(this.value);
            } else {
                this.searchResults = [];
                this.loading = false;
            }
        }, 300); // 300ms debounce
    }

    handleInputChange(e) {
        this.value = e.target.value;
        this.selectedItem = null; // Clear selection when typing
        this.debouncedSearch();
        this.showDropdown = this.focused && this.value.length > 0;

        this.dispatchEvent(new CustomEvent('value-changed', {
            detail: { value: this.value, selectedItem: null },
            bubbles: true,
            composed: true
        }));
    }

    handleFocus() {
        this.focused = true;
        if (this.value && this.value.length > 0) {
            this.showDropdown = true;
            // If we don't have results yet, trigger search
            if (this.searchResults.length === 0) {
                this.debouncedSearch();
            }
        }
    }

    handleBlur() {
        setTimeout(() => {
            this.focused = false;
            this.showDropdown = false;
        }, 150);
    }

    handleItemSelect(item) {
        this.selectedItem = item;
        this.value = item.name;
        this.showDropdown = false;
        this.focused = false;

        this.dispatchEvent(new CustomEvent('value-changed', {
            detail: { value: this.value, selectedItem: item },
            bubbles: true,
            composed: true
        }));

        this.dispatchEvent(new CustomEvent('item-selected', {
            detail: { item },
            bubbles: true,
            composed: true
        }));
    }

    handleClear() {
        this.value = '';
        this.selectedItem = null;
        this.searchResults = [];
        this.showDropdown = false;

        this.dispatchEvent(new CustomEvent('value-changed', {
            detail: { value: '', selectedItem: null },
            bubbles: true,
            composed: true
        }));

        // Focus the input after clearing
        setTimeout(() => {
            const input = this.shadowRoot.querySelector('input');
            if (input) input.focus();
        }, 0);
    }

    formatPrice(item) {
        if (item.singlePrice) {
            return `$${item.singlePrice}`;
        }
        if (item.minPrice && item.maxPrice) {
            return `$${item.minPrice} - $${item.maxPrice}`;
        }
        return '';
    }

    highlightText(text, searchTerm) {
        if (!searchTerm || !text) {
            return text;
        }

        // Escape special regex characters in search term
        const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        // Create regex with global and case-insensitive flags
        const regex = new RegExp(`(${escapedSearchTerm})`, 'gi');

        // Split text by matches and create template with highlights
        const parts = text.split(regex);

        return parts.map((part, index) => {
            // Check if this part matches the search term (case-insensitive)
            if (part.toLowerCase() === searchTerm.toLowerCase()) {
                return html`<span class="highlight">${part}</span>`;
            }
            return part;
        });
    }

    render() {
        const hasValue = this.value && this.value.length > 0;
        const hasSelection = this.selectedItem !== null;

        return html`
            <div class="input-container">
                ${this.label ? html`<label>${this.label}${this.required ? ' *' : ''}</label>` : ''}
                
                <div class="input-wrapper ${hasSelection ? 'has-selection' : ''}">
                    <input
                        type="text"
                        .value="${this.value}"
                        placeholder="${this.placeholder}"
                        @input="${this.handleInputChange}"
                        @focus="${this.handleFocus}"
                        @blur="${this.handleBlur}"
                        ?required="${this.required}"
                    />
                    ${this.loading ? html`
                        <div class="loading-indicator">⏳</div>
                    ` : ''}
                    ${hasValue && !this.loading ? html`
                        <button class="clear-button" @click="${this.handleClear}" type="button">
                            ×
                        </button>
                    ` : ''}
                </div>

                ${hasSelection ? html`
                    <div class="selected-indicator">
                        Selected item: ${this.selectedItem.name}
                    </div>
                ` : ''}

                ${this.showDropdown ? html`
                    <div class="dropdown">
                        <div class="dropdown-content">
                            ${this.loading ? html`
                                <div class="no-results">Searching...</div>
                            ` : ''}
                            
                            ${!this.loading && this.searchResults.length === 0 && this.value.length > 0 ? html`
                                <div class="no-results">No items found</div>
                            ` : ''}
                            
                            ${this.searchResults.map(item => html`
                                <div class="item-option" @click="${() => this.handleItemSelect(item)}">
                                    <div class="item-name">${this.highlightText(item.name, this.value)}</div>
                                    <div>${getUsernameById(item.ownerId)}</div>
                                </div>
                            `)}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }
}

customElements.define('item-selector', ItemSelector);
