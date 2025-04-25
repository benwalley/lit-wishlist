import {LitElement, html, css} from 'lit';
import {
    autoUpdate,
    computePosition,
    offset,
    flip,
    shift
} from '@floating-ui/dom';
import '../../svg/chevron-down.js';
import '../../svg/chevron-up.js';
import buttonStyles from '../../css/buttons.js';

// Global registry to track open dropdowns
const DROPDOWN_REGISTRY = new Set();

export class ActionDropdown extends LitElement {
    static properties = {
        open: {type: Boolean, reflect: true},
        items: {type: Array},
        placement: {type: String}
    };

    static styles = [
        buttonStyles,
        css`
        :host {
            display: inline-block;
            position: relative;
        }

        .dropdown-toggle {
            background: none;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: var(--spacing-x-small);
            border-radius: var(--border-radius-small);
            transition: var(--transition-normal);
        }

        .dropdown-toggle:hover {
            background-color: var(--background-hover);
        }

        .dropdown-content {
            display: none;
            position: absolute;
            background: var(--background-color-light, white);
            min-width: 180px;
            border-radius: var(--border-radius-normal);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            z-index: 9999;
        }

        .dropdown-content.visible {
            display: block;
        }

        .menu-items {
            display: flex;
            flex-direction: column;
            padding: var(--spacing-small) 0;
        }

        .dropdown-item {
            display: flex;
            align-items: center;
            padding: var(--spacing-small) var(--spacing-normal);
            cursor: pointer;
            color: var(--text-color-dark);
            background: none;
            border: none;
            text-align: left;
            font-size: var(--font-size-small);
            gap: var(--spacing-small);
            transition: var(--transition-normal);
            width: 100%;
            border-radius: 0;
        }
        
        .dropdown-item .icon {
            font-size: 1.2em;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 20px;
        }

        .dropdown-item:hover {
            background-color: var(--background-hover);
        }
    `
    ];

    constructor() {
        super();
        this.open = false;
        this.items = [];
        this.placement = 'bottom-end';
        this._cleanup = null;
        
        // Binding methods
        this._handleOutsideClick = this._handleOutsideClick.bind(this);
        this._handleEscKey = this._handleEscKey.bind(this);
    }

    connectedCallback() {
        super.connectedCallback();
        document.addEventListener('keydown', this._handleEscKey);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener('click', this._handleOutsideClick);
        document.removeEventListener('keydown', this._handleEscKey);
        DROPDOWN_REGISTRY.delete(this);
        
        // Clean up positioning logic
        if (this._cleanup) {
            this._cleanup();
            this._cleanup = null;
        }
    }

    firstUpdated() {
        // Add click handler to the toggle button
        const slot = this.shadowRoot.querySelector('slot[name="toggle"]');
        slot.addEventListener('slotchange', () => {
            const toggleElements = slot.assignedElements();
            toggleElements.forEach(element => {
                element.addEventListener('click', (e) => this._handleToggleClick(e));
            });
        });
    }

    _handleToggleClick(e) {
        e.stopPropagation();
        
        if (this.open) {
            this.close();
        } else {
            // Close any other open dropdowns
            this._closeAllDropdowns();
            this.open = true;
            
            const menu = this.shadowRoot.querySelector('.dropdown-content');
            const toggleBtn = this.shadowRoot.querySelector('.dropdown-toggle');
            
            if (menu && toggleBtn) {
                // Show the menu first so it has dimensions
                menu.classList.add('visible');
                
                // Set up the floating UI positioning
                this._setupPositioning(toggleBtn, menu);
                
                // Register this dropdown as open
                DROPDOWN_REGISTRY.add(this);
                
                // Add click listener with a small delay to prevent immediate closing
                setTimeout(() => {
                    document.addEventListener('click', this._handleOutsideClick);
                }, 0);
            }
        }
    }

    _setupPositioning(referenceEl, menu) {
        // Clean up any existing positioning logic
        if (this._cleanup) {
            this._cleanup();
        }
        
        // Setup autoUpdate to reposition when needed
        this._cleanup = autoUpdate(referenceEl, menu, () => {
            // Determine the preferred placement
            const preferredPlacement = this.placement || 'bottom-end';
            
            computePosition(referenceEl, menu, {
                placement: preferredPlacement,
                middleware: [
                    offset(8), // Add some spacing
                    flip({
                        fallbackPlacements: ['top-end', 'bottom-end', 'top-start', 'bottom-start']
                    }),
                    shift({ padding: 8 }) // Keep within viewport
                ]
            }).then(({ x, y, placement, middlewareData }) => {
                // Apply the positioning
                Object.assign(menu.style, {
                    left: `${x}px`,
                    top: `${y}px`,
                    position: 'fixed' // Fixed positioning to avoid overflow issues
                });
            });
        });
    }

    _closeAllDropdowns() {
        for (const dropdown of DROPDOWN_REGISTRY) {
            if (dropdown !== this) {
                dropdown.close();
            }
        }
    }

    close() {
        this.open = false;
        
        const menu = this.shadowRoot.querySelector('.dropdown-content');
        if (menu) {
            menu.classList.remove('visible');
        }
        
        DROPDOWN_REGISTRY.delete(this);
        document.removeEventListener('click', this._handleOutsideClick);
        
        // Clean up floating UI when closed
        if (this._cleanup) {
            this._cleanup();
            this._cleanup = null;
        }
    }

    _handleOutsideClick(e) {
        // Check if clicked outside this dropdown
        if (!e.composedPath().includes(this)) {
            this.close();
        }
    }

    _handleEscKey(e) {
        if (e.key === 'Escape' && this.open) {
            this.close();
        }
    }

    _handleItemClick(item, e) {
        e.stopPropagation();
        
        // Execute the item's action if defined
        if (item.action) {
            item.action();
        }
        
        // Dispatch event for parent components
        this.dispatchEvent(new CustomEvent('action-selected', {
            detail: {
                id: item.id,
                label: item.label
            },
            bubbles: true,
            composed: true
        }));
        
        this.close();
    }

    updated(changedProps) {
        if (changedProps.has('open') && !this.open) {
            const menu = this.shadowRoot.querySelector('.dropdown-content');
            if (menu) {
                menu.classList.remove('visible');
            }
        }
    }

    render() {
        return html`
            <div class="dropdown-toggle">
                <slot name="toggle"></slot>
            </div>
            
            <div class="dropdown-content">
                <div class="menu-items">
                    ${this.items.map(item => {
                        // Start with the basic dropdown-item class
                        let classes = 'dropdown-item';
                        
                        // Add any additional classes specified in the item
                        if (item.classes) {
                            classes += ` ${item.classes}`;
                        }
                        
                        return html`
                            <button 
                                class="${classes}"
                                @click=${(e) => this._handleItemClick(item, e)}
                            >
                                ${item.icon ? html`<span class="icon">${item.icon}</span>` : ''}
                                <span class="label">${item.label}</span>
                            </button>
                        `;
                    })}
                </div>
            </div>
        `;
    }
}

customElements.define('action-dropdown', ActionDropdown);