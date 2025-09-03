import {LitElement, html, css} from 'lit';
import {computePosition, flip, shift, offset} from '@floating-ui/dom';

export class CustomTooltip extends LitElement {
    static properties = {
        placement: { type: String }
    };

    static styles = css`
        :host {
            background-color: var(--tooltip-background-color);
            color: var(--tooltip-text-color);
            padding: 8px 12px;
            border-radius: 4px;
            box-shadow: var(--shadow-1-soft);
            border: none;
            font-size: var(--font-size-small);
            white-space: nowrap;
            max-width: 250px;
            word-wrap: break-word;
            white-space: normal;
            z-index: 9999;
        }

        /* Popover positioning */
        :host([popover]) {
            margin: 0;
            position: fixed;
        }

        /* Smooth transitions */
        :host {
            transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out;
        }

        /* Entry/exit animations */
        @starting-style {
            :host([popover]:popover-open) {
                opacity: 0;
                transform: scale(0.9);
            }
        }

        :host([popover]:popover-open) {
            opacity: 1;
            transform: scale(1);
        }
    `;

    constructor() {
        super();
        this.placement = 'bottom';
        this._referenceEl = null;
        this._tooltipId = `tooltip-${Math.random().toString(36).substr(2, 9)}`;
    }

    connectedCallback() {
        super.connectedCallback();

        // Set up popover attributes
        this.setAttribute('popover', 'hint');
        this.id = this._tooltipId;

        // Find reference element (previous sibling)
        this._referenceEl = this.previousElementSibling;

        if (!this._referenceEl) {
            console.warn(
                'No reference element found for <custom-tooltip>. ' +
                'Make sure <custom-tooltip> is placed immediately after the element you want to attach the tooltip to.'
            );
            return;
        }

        // Set up popover target relationship
        this._referenceEl.setAttribute('popovertarget', this._tooltipId);

        // Set up event handlers
        this._setupEventHandlers();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this._removeEventHandlers();

        // Clean up reference element attributes
        if (this._referenceEl) {
            this._referenceEl.removeAttribute('popovertarget');
        }
    }

    _setupEventHandlers() {
        if (!this._referenceEl) return;

        // Attach event listeners
        this._referenceEl.addEventListener('mouseenter', () => this._showTooltip());
        this._referenceEl.addEventListener('mouseleave', () => this._hideTooltip());
        this._referenceEl.addEventListener('focus', () => this._showTooltip(), true);
        this._referenceEl.addEventListener('blur', () => this._hideTooltip(), true);
        window.addEventListener('modalOpened', () => this._handleModalEvent());
        window.addEventListener('routeChanged', () => this._hideTooltip());
    }

    _handleModalEvent() {
        setTimeout(() => {
            this._hideTooltip();
        }, 1)
    }

    _removeEventHandlers() {
        if (!this._referenceEl) return;

        this._referenceEl.removeEventListener('mouseenter', () => this._showTooltip());
        this._referenceEl.removeEventListener('mouseleave', () => this._hideTooltip());
        this._referenceEl.removeEventListener('focus', () => this._showTooltip(), true);
        this._referenceEl.removeEventListener('blur', () => this._hideTooltip(), true);
    }

    async _showTooltip() {
        try {
            // Check if popover API is supported
            if (typeof this.showPopover === 'function') {
                this.showPopover();
                // Position the tooltip after it's shown
                await this._positionTooltip();
            }
        } catch (error) {
            // Popover might already be open or other error
            console.debug('Tooltip show error:', error);
        }
    }

    async _positionTooltip() {
        if (!this._referenceEl) return;

        const {x, y} = await computePosition(this._referenceEl, this, {
            placement: this.placement || 'bottom',
            middleware: [
                offset(8),
                flip(),
                shift({padding: 8})
            ]
        });

        // Apply position
        Object.assign(this.style, {
            position: 'fixed',
            left: `${x}px`,
            top: `${y}px`,
        });
    }

    _hideTooltip() {
        try {
            // Check if popover API is supported
            if (typeof this.hidePopover === 'function') {
                this.hidePopover();
            }
        } catch (error) {
            // Popover might already be closed or other error
            console.debug('Tooltip hide error:', error);
        }
    }

    render() {
        return html`<slot></slot>`;
    }
}

customElements.define('custom-tooltip', CustomTooltip);
