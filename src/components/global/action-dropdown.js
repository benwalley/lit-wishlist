import {LitElement, html, css} from 'lit';
import '../../svg/chevron-down.js';
import '../../svg/chevron-up.js';
import buttonStyles from '../../css/buttons.js';
import {computePosition, flip, shift, offset} from '@floating-ui/dom';

export class ActionDropdown extends LitElement {
    static properties = {
        open: {type: Boolean, reflect: true},
        items: {type: Array},
        info: {type: Boolean}
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
            background: var(--background-light, white);
            min-width: 180px;
            border-radius: var(--border-radius-normal);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            border: 1px solid var(--border-color);
            margin: 0;
            padding: 0;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1000;
        }
        
        .dropdown-content:popover-open {
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
            box-sizing: border-box;
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
        this.info = false;

        // Binding methods
        this._handlePopoverToggle = this._handlePopoverToggle.bind(this);
    }

    connectedCallback() {
        super.connectedCallback();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        // Cleanup will be handled automatically by the popover API
    }

    firstUpdated() {
        // Set up popover event listeners
        const popoverElement = this.shadowRoot.querySelector('.dropdown-content');
        if (popoverElement) {
            popoverElement.addEventListener('toggle', this._handlePopoverToggle);
        }

        // Set up click handlers for slotted toggle elements
        const slot = this.shadowRoot.querySelector('slot[name="toggle"]');
        slot.addEventListener('slotchange', () => {
            const toggleElements = slot.assignedElements();
            toggleElements.forEach(element => {
                element.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.toggle();
                });
            });
        });
    }

    async _updatePosition() {
        const referenceElement = this.shadowRoot.querySelector('.dropdown-toggle');
        const floatingElement = this.shadowRoot.querySelector('.dropdown-content');

        if (!referenceElement || !floatingElement) return;

        const {x, y} = await computePosition(referenceElement, floatingElement, {
            placement: 'bottom-end',
            middleware: [
                offset(4),
                flip(),
                shift({padding: 8})
            ]
        });

        Object.assign(floatingElement.style, {
            left: `${x}px`,
            top: `${y}px`,
        });
    }

    _handlePopoverToggle(e) {
        // Update the open state to match the popover state
        this.open = e.newState === 'open';

        // Update position when opening
        if (this.open) {
            this._updatePosition();
        }

        // Dispatch event for any components that need to know about state changes
        this.dispatchEvent(new CustomEvent('dropdown-toggle', {
            detail: { open: this.open },
            bubbles: true,
            composed: true
        }));
    }

    async show() {
        const popover = this.shadowRoot.querySelector('.dropdown-content');
        if (popover && popover.showPopover) {
            popover.showPopover();
            await this._updatePosition();
        }
    }

    hide() {
        const popover = this.shadowRoot.querySelector('.dropdown-content');
        if (popover && popover.hidePopover) {
            popover.hidePopover();
        }
    }

    toggle() {
        const popover = this.shadowRoot.querySelector('.dropdown-content');
        if (popover && popover.togglePopover) {
            popover.togglePopover();
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

        this.hide();
    }

    updated(changedProps) {
        // Sync external open state changes with popover
        if (changedProps.has('open')) {
            const popover = this.shadowRoot.querySelector('.dropdown-content');
            if (popover) {
                if (this.open && !popover.matches(':popover-open')) {
                    this.show();
                } else if (!this.open && popover.matches(':popover-open')) {
                    this.hide();
                }
            }
        }
    }

    render() {
        return html`
            <div class="dropdown-toggle">
                <slot name="toggle"></slot>
            </div>
            
            <div 
                class="dropdown-content" 
                popover="auto"
            >
                <div class="menu-items">
                    ${this.items.map(item => {
                        // Start with the basic dropdown-item class
                        let classes = 'dropdown-item';
                        
                        // Add any additional classes specified in the item
                        if (item.classes) {
                            classes += ` ${item.classes}`;
                        }
                        
                        return this.info ? html`
                            <div class="${classes}">
                                ${item.content}
                            </div>
                        ` : html`
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
