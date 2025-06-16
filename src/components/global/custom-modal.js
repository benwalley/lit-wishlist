// custom-modal.js
import { LitElement, html, css } from 'lit';

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
        this._handleKeyDown = this._handleKeyDown.bind(this);
        this._onOverlayClick = this._onOverlayClick.bind(this);
    }

    static styles = css`
        /* Overlay with fade in/out transition */
        .overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            backdrop-filter: blur(4px);
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            /* Start hidden */
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
        }
        /* When open, make the overlay visible and interactive */
        .overlay.open {
            opacity: 1;
            pointer-events: auto;
        }

        /* Modal container with a pop-in effect */
        .modal {
            background: var(--modal-background-color, #fff);
            border-radius: var(--border-radius-large, 8px);
            width: 90%;
            max-width: var(--max-width, 1200px);
            box-shadow: var(--shadow-2-soft, 0 2px 10px rgba(0, 0, 0, 0.1));
            position: relative;
            outline: none;
            /* Initial state before transition */
            opacity: 0;
            transform: translateY(20px) scale(0.95);
            transition: opacity 0.3s ease, transform 0.3s ease;
            height: auto;
            max-height: 90vh;
            display: flex;
            flex-direction: column;
            overflow: hidden; /* Prevent double scrollbars */
        }
        /* When overlay is open, animate the modal into view */
        .overlay.open .modal {
            opacity: 1;
            transform: translateY(0) scale(1);
        }

        /* Scrollable content area */
        .modal-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            /* Custom scrollbar styling */
            scrollbar-width: thin;
            scrollbar-color: var(--grayscale-400) transparent;
            overflow: hidden;
        }
        
        /* The actual content that gets slotted will scroll */
        ::slotted(*) {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden; /* Let internal elements handle their own scrolling */
        }
        
        /* Webkit scrollbar styles */
        .modal-content::-webkit-scrollbar,
        ::slotted(*)::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        .modal-content::-webkit-scrollbar-track,
        ::slotted(*)::-webkit-scrollbar-track {
            background: transparent;
            border-radius: 4px;
        }
        .modal-content::-webkit-scrollbar-thumb,
        ::slotted(*)::-webkit-scrollbar-thumb {
            background-color: var(--grayscale-400);
            border-radius: 4px;
            border: 2px solid transparent;
            background-clip: content-box;
        }
        .modal-content::-webkit-scrollbar-thumb:hover,
        ::slotted(*)::-webkit-scrollbar-thumb:hover {
            background-color: var(--grayscale-500);
        }
        
        /* Apply padding if not explicitly disabled */
        .modal.padding .modal-content {
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
            color: var(--text-color-dark);
        }
        .close-button:focus {
            outline: 2px solid #000;
        }
    `;

    connectedCallback() {
        super.connectedCallback();
        window.addEventListener(this.triggerEvent, this.openModal);
        window.addEventListener('keydown', this._handleKeyDown);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener(this.triggerEvent, this.openModal);
        window.removeEventListener('keydown', this._handleKeyDown);
        // Ensure scrolling is enabled if the element is removed while open.
        document.body.style.overflow = '';
    }

    // Disable background scrolling when modal is open.
    updated(changedProperties) {
        if (changedProperties.has('isOpen')) {
            document.body.style.overflow = this.isOpen ? 'hidden' : '';
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
        this.updateComplete.then(() => {
            const modal = this.shadowRoot.querySelector('.modal');
            if (modal) {
                modal.focus();
            }
        });
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

    _handleKeyDown(e) {
        if (this.isOpen && e.key === 'Escape') {
            e.preventDefault();
            this.closeModal();
        }
    }

    _onOverlayClick(e) {
        if (e.target.classList.contains('overlay')) {
            this.closeModal();
        }
    }

    render() {
        return html`
            <div
                    class="overlay ${this.isOpen ? 'open' : ''}"
                    @click=${this._onOverlayClick}
                    ?inert=${!this.isOpen}
                    aria-hidden=${!this.isOpen}
                    style="z-index: ${this.level + 100};"
            >
                <div
                        class="modal ${this.noPadding ? '' : 'padding'}"
                        role="dialog"
                        aria-modal="true"
                        tabindex="-1"
                        style="--max-width: ${this.maxWidth};"
                >
                    <button
                            class="close-button"
                            @click=${this.closeModal}
                            aria-label="Close modal"
                    >
                        &times;
                    </button>
                    <!-- Scrollable content container -->
                    <div class="modal-content">
                        ${this.lazyLoad ? (this.isOpen ? html`<slot></slot>` : '') : html`<slot></slot>`}
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('custom-modal', CustomModal);
