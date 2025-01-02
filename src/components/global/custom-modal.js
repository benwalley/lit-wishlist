// custom-modal.js
import {LitElement, html, css} from 'lit';

class CustomModal extends LitElement {
    static properties = {
        triggerEvent: {type: String},
        isOpen: {type: Boolean, state: true},
    };

    constructor() {
        super();
        this.triggerEvent = 'open-custom-modal';
        this.isOpen = false;
        this.triggerElement = null;

        // Bind methods
        this._openModal = this._openModal.bind(this);
        this._closeModal = this._closeModal.bind(this);
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

        /* Hidden by default */

        .overlay[hidden] {
            display: none;
        }

        /* Modal content */

        .modal {
            background: white;
            padding: 1.5rem;
            border-radius: 8px;
            max-width: 1200px;
            width: 90%;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            position: relative;
            outline: none;
            max-height: 80vh;
            overflow: auto;
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

        /* Focus outline for accessibility */

        .close-button:focus {
            outline: 2px solid #000;
        }
    `;

    connectedCallback() {
        console.log('asdf')
        super.connectedCallback();
        // Listen for the specified event
        window.addEventListener(this.triggerEvent, this._openModal);
        // Listen for keydown events for accessibility (e.g., Escape key)
        window.addEventListener('keydown', this._handleKeyDown);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener(this.triggerEvent, this._openModal);
        window.removeEventListener('keydown', this._handleKeyDown);
    }

    _openModal(event) {
        console.log('sdfsdfsdfsdfsd')
        // If the event has a target, store it to return focus later
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

    _closeModal() {
        this.isOpen = false;
        // Return focus to the trigger element if available
        if (this.triggerElement) {
            this.triggerElement.focus();
        }
    }

    _handleKeyDown(e) {
        if (this.isOpen && e.key === 'Escape') {
            e.preventDefault();
            this._closeModal();
        }
    }

    _onOverlayClick(e) {
        if (e.target.classList.contains('overlay')) {
            this._closeModal();
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
                        class="modal"
                        role="dialog"
                        aria-modal="true"
                        tabindex="-1"
                >
                    <button
                            class="close-button"
                            @click=${this._closeModal}
                            aria-label="Close modal"
                    >
                        &times;
                    </button>
                    <slot></slot>
                </div>
            </div>
        `;
    }
}

// Define the custom element
customElements.define('custom-modal', CustomModal);
