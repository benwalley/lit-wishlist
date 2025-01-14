// custom-modal.js
import {LitElement, html, css} from 'lit';

class CustomModal extends LitElement {
    static properties = {
        triggerEvent: { type: String },
        isOpen: { type: Boolean, state: true },
        noPadding: { type: Boolean },
    };

    constructor() {
        super();
        this.triggerEvent = 'open-custom-modal';
        this.isOpen = false;
        this.triggerElement = null;
        this.noPadding = false;

        // Bind methods
        this._openModal = this._openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this._handleKeyDown = this._handleKeyDown.bind(this);
        this._onOverlayClick = this._onOverlayClick.bind(this);
    }

    static styles = css`
        /* Overlay */
        .overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            transition: opacity 0.3s ease;
        }

        .overlay[hidden] {
            display: none;
        }

        /* Modal (outer container) */
        .modal {
            background: var(--modal-background-color);
            border-radius: 8px;
            max-width: 1200px;
            width: 90%;
            box-shadow: var(--large-box-shadow);
            position: relative;
            outline: none;
            /* IMPORTANT: Hide overflow here so the scrollbar doesn't bleed outside the radius */
            overflow: hidden;
        }

        /* The scrollable content area inside the modal */
        .modal-content {
            max-height: 80vh;
            overflow-y: auto;
        }

        /* Handle padding on the content area */
        .modal.padding .modal-content {
            padding: 1.5rem;
        }

        /* Close button */
        .close-button {
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            background: transparent;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
        }
        .close-button:focus {
            outline: 2px solid #000;
        }
    `;

    connectedCallback() {
        super.connectedCallback();
        window.addEventListener(this.triggerEvent, this._openModal);
        window.addEventListener('keydown', this._handleKeyDown);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener(this.triggerEvent, this._openModal);
        window.removeEventListener('keydown', this._handleKeyDown);
    }

    _openModal(event) {
        if (event instanceof CustomEvent && event.detail && event.detail.trigger) {
            this.triggerElement = event.detail.trigger;
        } else {
            this.triggerElement = null;
        }
        this.isOpen = true;
        this.updateComplete.then(() => {
            const modal = this.shadowRoot.querySelector('.modal');
            if (modal) {
                modal.focus();
            }
        });
    }

    closeModal() {
        this.isOpen = false;
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
                    class="overlay"
                    ?hidden=${!this.isOpen}
                    @click=${this._onOverlayClick}
                    aria-hidden=${!this.isOpen}
            >
                <div
                        class="modal ${this.noPadding ? '' : 'padding'}"
                        role="dialog"
                        aria-modal="true"
                        tabindex="-1"
                >
                    <button
                            class="close-button"
                            @click=${this.closeModal}
                            aria-label="Close modal"
                    >
                        &times;
                    </button>
                    <!-- Scrollable content goes in a dedicated container -->
                    <div class="modal-content">
                        <slot></slot>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('custom-modal', CustomModal);
