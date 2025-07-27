// custom-modal.js
import { LitElement, html, css } from 'lit';
import '../../svg/x.js';

class CustomModal extends LitElement {
    static properties = {
        triggerEvent: { type: String },
        isOpen: { type: Boolean },
        noPadding: { type: Boolean },
        maxWidth: { type: String },
        level: {type: Number},
        lazyLoad: { type: Boolean },
    };

    constructor() {
        super();
        this.triggerEvent = 'open-custom-modal';
        this.isOpen = false;
        this.triggerElement = null;
        this.noPadding = false;
        this.maxWidth = '1200px';
        this.level = 1;
        this.lazyLoad = false;

        // Bind methods
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this._handleDialogClose = this._handleDialogClose.bind(this);
        this._handleDialogClick = this._handleDialogClick.bind(this);
    }

    static styles = css`
        /* Native dialog element styling */
        .dialog {
            background: var(--modal-background-color, #fff);
            border-radius: var(--border-radius-large, 8px);
            border: none;
            width: calc(100% - var(--spacing-normal));
            color: var(--text-color-dark);
            max-width: var(--max-width, 1200px);
            box-shadow: var(--shadow-2-soft, 0 2px 10px rgba(0, 0, 0, 0.1));
            outline: none;
            /* Initial state before transition */
            opacity: 0;
            transform: translateY(20px) scale(0.95);
            transition: opacity 0.3s ease, transform 0.3s ease;
            max-height: 90vh;
            padding: 0;
            margin: auto;
            /* Hide when not open */
            pointer-events: none;
            /* Fit content height */
            height: fit-content;
        }
        
        x-icon {
            font-size: var(--font-size-small);
        }
        
        /* When not open, completely hide the dialog */
        .dialog:not([open]) {
            display: none;
        }
        
        /* Dialog backdrop styling */
        .dialog::backdrop {
            backdrop-filter: blur(4px);
            background: rgba(0, 0, 0, 0.5);
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        /* When dialog is open, animate it into view */
        .dialog[open] {
            opacity: 1;
            transform: translateY(0) scale(1);
            pointer-events: auto;
            display: flex;
        }
        
        .dialog[open]::backdrop {
            opacity: 1;
        }

        /* Scrollable content area */
        .modal-content {
            width: 100%;
            scrollbar-width: thin;
            scrollbar-color: var(--grayscale-400) transparent;
            overflow: auto;
        }
        
        /* Webkit scrollbar styles */
        .modal-content::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        .modal-content::-webkit-scrollbar-track {
            background: transparent;
            border-radius: 4px;
        }
        .modal-content::-webkit-scrollbar-thumb {
            background-color: var(--grayscale-400);
            border-radius: 4px;
            border: 2px solid transparent;
            background-clip: content-box;
        }
        .modal-content::-webkit-scrollbar-thumb:hover {
            background-color: var(--grayscale-500);
        }
        
        /* Apply padding if not explicitly disabled */
        .dialog.padding .modal-content {
            padding: var(--spacing-small, 1rem);
        }

        /* Close button styling */
        .close-button {
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            background: transparent;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            z-index: 200;
            color: var(--text-color-dark);
        }
    `;

    connectedCallback() {
        super.connectedCallback();
        window.addEventListener(this.triggerEvent, this.openModal);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener(this.triggerEvent, this.openModal);
    }

    // Handle dialog state changes
    updated(changedProperties) {
        if (changedProperties.has('isOpen')) {
            const dialog = this.shadowRoot.querySelector('.dialog');
            if (dialog) {
                if (this.isOpen && !dialog.open) {
                    dialog.showModal();
                } else if (!this.isOpen && dialog.open) {
                    dialog.close();
                }
            }
        }
    }

    openModal(event) {
        if (event instanceof CustomEvent && event.detail && event.detail.trigger) {
            this.triggerElement = event.detail.trigger;
        } else {
            this.triggerElement = null;
        }
        this.isOpen = true;
        this.dispatchEvent(new CustomEvent('modal-changed', {
            detail: {
                isOpen: true,
            },
            bubbles: true,
            composed: true
        }));
    }

    closeModal() {
        this.isOpen = false;
        this.dispatchEvent(new CustomEvent('modal-closed', {
            detail: {
                isOpen: false,
            },
            bubbles: true,
            composed: true
        }));
        if (this.triggerElement) {
            this.triggerElement.focus();
        }
    }

    _handleDialogClose(e) {
        // Handle native dialog close event
        if (this.isOpen) {
            this.closeModal();
        }
    }

    _handleDialogClick(e) {
        // Close modal when clicking on the dialog element itself (backdrop area)
        if (e.target === e.currentTarget) {
            this.closeModal();
        }
    }

    render() {
        return html`
            <dialog
                class="dialog ${this.noPadding ? '' : 'padding'}"
                style="--max-width: ${this.maxWidth}; z-index: ${this.level + 100};"
                @close=${this._handleDialogClose}
                @click=${this._handleDialogClick}
            >
                <button
                    class="close-button"
                    @click=${this.closeModal}
                    aria-label="Close modal"
                >
                    <x-icon></x-icon>
                </button>
                <div class="modal-content">
                    ${this.lazyLoad ? (this.isOpen ? html`<slot></slot>` : '') : html`<slot></slot>`}
                </div>
            </dialog>
        `;
    }
}

customElements.define('custom-modal', CustomModal);
