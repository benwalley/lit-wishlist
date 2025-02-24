import {LitElement, html, css} from 'lit';
import '../global/custom-input.js'
import '../../svg/chevron-left.js'

export class MultiSelectDropdown extends LitElement {
    static properties = {
        items: {type: Array},
        itemKey: {type: String},
        labelField: {type: String},
        selectedKeys: {type: Object},
        open: {type: Boolean},
        searchTerm: {type: String},
        renderer: {type: Object},       // function
        filterFunction: {type: Object}, // function
    };

    static styles = css`
        :host {
            position: relative;
        }

        .dropdown-toggle {
            min-width: 200px;
            width: 100%;
            padding: 8px 12px;
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius-small);
            background-color: #fff;
            cursor: pointer;
            display: flex;
            color: var(--text-color-dark);
            align-items: center;
            font-size: var(--font-size-small);
            justify-content: space-between;
        }

        .dropdown-toggle:focus {
            outline: 2px solid #007BFF;
        }

        .selected-chips {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
            align-items: center;
        }

        .chip {
            background-color: var(--purple-light);
            padding: 4px 8px;
            border-radius: var(--border-radius-small);
            display: inline-flex;
            align-items: center;
            font-size: 0.9em;
            color: var(--purple-normal);
            font-weight: bold;
        }

        .dropdown-menu {
            position: absolute;
            top: calc(100% + 4px);
            left: 0;
            width: 100%;
            max-height: 300px;
            border: 1px solid #ccc;
            border-radius: var(--border-radius-normal);
            background-color: #fff;
            overflow-y: auto;
            z-index: 999;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
            padding: 8px 0;
        }

        .search-container {
            display: flex;
            align-items: center;
            padding: 0 8px 8px 8px;
            gap: 8px;
        }

        .search-container custom-input {
            flex: 1;
        }

        .clear-btn {
            background: none;
            border: none;
            color: var(--delete-red);
            cursor: pointer;
            font-size: var(--font-size-normal);
            transition: var(--transition-normal);
            padding: var(--spacing-small);
            width: 100%;
            
            &:hover {
                background: var(--delete-red-light);
            }
        }

        .no-results {
            padding: 0 8px;
            color: #666;
            font-size: 0.9em;
        }

        .dropdown-item {
            width: 100%;
            border: none;
            background: none;
            cursor: pointer;
            text-align: left;
            padding: 0;
        }

        .toggle-icon {
            transform: rotate(-90deg);
            transition: var(--transition-normal);
            transform-origin: center center;
            display: flex;
            font-size: var(--font-size-large);
            
            &.expanded {
                transform: rotate(90deg);
            }
        }
        
        .dropdown-item:hover {
            background-color: #f4f4f4;
        }

        .dropdown-item.selected {
            background-color: #eaf5ff;
        }
    `;

    constructor() {
        super();
        this.items = [];
        this.itemKey = 'id';
        this.labelField = 'label'; // or "name", etc.
        this.selectedKeys = new Set();
        this.open = false;
        this.searchTerm = '';
        this.renderer = null; // optional custom renderer function
        this.filterFunction = null; // optional custom filter function
    }

    // Helper to get the unique key from an item
    _getKey(item) {
        return item?.[this.itemKey];
    }

    // Helper to get a label for fallback rendering
    _getLabel(item) {
        return item?.[this.labelField] ?? '';
    }

    // Filtered items based on search
    get filteredItems() {
        if (!this.searchTerm) return this.items;
        const term = this.searchTerm.toLowerCase();
        if (this.filterFunction) {
            return this.items.filter((item) => this.filterFunction(item, term));
        }
        return this.items.filter((item) =>
            this._getLabel(item).toLowerCase().includes(term)
        );
    }

    toggleDropdown() {
        this.open = !this.open;
    }

    handleSearch(e) {
        this.searchTerm = e.detail.value;
    }

    clearAll() {
        this.selectedKeys.clear();
        this.requestUpdate();
        this.dispatchEvent(new CustomEvent('selection-changed', {
            detail: {selectedKeys: [...this.selectedKeys]}
        }));
    }

    toggleItemSelection(item) {
        const key = this._getKey(item);
        if (this.selectedKeys.has(key)) {
            this.selectedKeys.delete(key);
        } else {
            this.selectedKeys.add(key);
        }
        this.requestUpdate();
        this.dispatchEvent(new CustomEvent('selection-changed', {
            detail: {selectedKeys: [...this.selectedKeys]}
        }));
    }

    firstUpdated() {
        document.addEventListener('click', this._handleOutsideClick.bind(this));
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener('click', this._handleOutsideClick.bind(this));
    }

    _handleOutsideClick(e) {
        if (!e.composedPath().includes(this)) {
            this.open = false;
        }
    }

    updated(changedProperties) {
        if (changedProperties.has('open') && this.open) {
            setTimeout(() => {
                const searchInput = this.shadowRoot.querySelector('.search-container custom-input');

                console.log(searchInput)
                searchInput.focus()
            }, 0);
        }
    }

    render() {
        return html`
            <div class="dropdown">
                <button
                        class="dropdown-toggle"
                        @click=${this.toggleDropdown}
                        aria-haspopup="listbox"
                        aria-expanded="${this.open}"
                >
                    ${this.selectedKeys.size > 0
                            ? html`
                                <div class="selected-chips">
                                    ${[...this.selectedKeys].map(key => {
                                        const item = this.items.find(i => this._getKey(i) === key);
                                        return item ? html`<span class="chip">${this._getLabel(item)}</span>` : null;
                                    })}
                                </div>
                            `
                            : html`Select items`
                    }
                    <span aria-hidden="true" class="toggle-icon ${this.open ? 'expanded' : ''}">
                        <chevron-left-icon></chevron-left-icon>
                    </span>
                </button>

                ${this.open
                        ? html`
                            <div class="dropdown-menu" role="listbox">
                                <div class="search-container">
                                    <custom-input
                                            type="text"
                                            placeholder="Search..."
                                            .value=${this.searchTerm}
                                            @value-changed=${this.handleSearch}
                                            aria-label="Search"
                                    ></custom-input>
                                </div>
                                ${this.filteredItems.length === 0
                                        ? html`
                                            <div class="no-results">No results found.</div>`
                                        : this.filteredItems.map((item) => {   
                                            const key = this._getKey(item);
                                            const isSelected = this.selectedKeys.has(key);
                                            return html`
                                                <button
                                                        class="dropdown-item ${isSelected ? 'selected' : ''}"
                                                        role="option"
                                                        aria-selected=${String(isSelected)}
                                                        @click=${() => this.toggleItemSelection(item)}
                                                >
                                                    ${this.renderer
                                                            ? this.renderer(item, isSelected)
                                                            : html`${this._getLabel(item)}`
                                                    }
                                                </button>
                                            `;
                                        })
                                }
                                <button class="clear-btn" @click=${this.clearAll}>
                                    Clear all
                                </button>
                            </div>
                        `
                        : null
                }
            </div>
        `;
    }
}

customElements.define('multi-select-dropdown', MultiSelectDropdown);
