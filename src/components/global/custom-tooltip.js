import {LitElement, html, css} from 'lit';
import {
    autoUpdate,
    computePosition,
    offset,
    flip,
    shift,
    arrow
} from '@floating-ui/dom';

export class CustomTooltip extends LitElement {
    static properties = {
        visible: { type: Boolean, reflect: true }
    };

    static styles = css`
        :host {
            position: absolute;
            display: none;
            background-color: var(--tooltip-background-color);
            color: var(--tooltip-text-color);
            padding: 8px 12px;
            border-radius: 4px;
            box-shadow: var(--shadow-1-crisp);
            z-index: 9999;
            transition: opacity 0.2s ease-in-out;
            opacity: 0;
        }

        :host([visible]) {
            display: block;
            opacity: 1;
        }

        /* Arrow element (larger for clarity) */
        .arrow {
            position: absolute;
            width: 10px;
            height: 10px;
            background-color: inherit;
            transform: rotate(45deg);
        }
    `;

    constructor() {
        super();
        this.visible = false;
        this._referenceEl = null;
        this._cleanup = null;
    }

    render() {
        return html`
            <slot></slot>
            <div class="arrow"></div>
        `;
    }

    firstUpdated() {
        // The tooltip’s reference element is the previous sibling
        const referenceEl = this.previousElementSibling;

        if (!referenceEl) {
            console.warn(
                'No reference element found for <custom-tooltip>. ' +
                'Make sure <custom-tooltip> is placed immediately after the element you want to attach the tooltip to.'
            );
            return;
        }
        this._referenceEl = referenceEl;

        // Show/hide logic: customize these events as needed
        this._attachTriggerEvents();

        // Set up autoUpdate & computePosition from Floating UI
        const arrowEl = this.shadowRoot.querySelector('.arrow');

        this._cleanup = autoUpdate(referenceEl, this, async () => {
            if (!this.visible) {
                // If invisible, no need to compute position
                return;
            }

            const { x, y, placement, middlewareData } = await computePosition(
                referenceEl,
                this,
                {
                    placement: 'bottom',
                    middleware: [
                        offset(8), // Distance between tooltip and reference
                        flip(),
                        shift({ padding: 8 }),
                        arrow({ element: arrowEl })
                    ]
                }
            );

            // Apply tooltip styles (position)
            Object.assign(this.style, {
                left: `${x}px`,
                top: `${y}px`
            });

            if (middlewareData.arrow) {
                const side = placement.split("-")[0];

                const staticSide = {
                    top: "bottom",
                    right: "left",
                    bottom: "top",
                    left: "right"
                }[side];

                const {x, y} = middlewareData.arrow;

                Object.assign(arrowEl.style, {
                    left: x != null ? `${x}px` : '',
                    top: y != null ? `${y}px` : '',
                    [staticSide]: `${-arrowEl.offsetWidth/2}px`
                });
            }
        });
    }

    _attachTriggerEvents() {
        if (!this._referenceEl) return;

        // Show on mouseenter/focus
        this._referenceEl.addEventListener('mouseenter', () => {
            this.visible = true;
        });
        this._referenceEl.addEventListener(
            'focus',
            () => {
                this.visible = true;
            },
            true
        );

        // Hide on mouseleave/blur
        this._referenceEl.addEventListener('mouseleave', () => {
            this.visible = false;
        });
        this._referenceEl.addEventListener(
            'blur',
            () => {
                this.visible = false;
            },
            true
        );
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        // Clean up autoUpdate
        if (this._cleanup) {
            this._cleanup();
            this._cleanup = null;
        }
    }
}

customElements.define('custom-tooltip', CustomTooltip);
