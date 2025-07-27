// src/components/confirm-modal.js
import {LitElement, html, css, nothing} from 'lit';
import '../../global/custom-modal.js';
import buttonStyles from "../../../css/buttons.js";

export class ConfirmModal extends LitElement {
    static properties = {
        heading: {type: String},
        message: {type: String},
        submessage: {type: String},
        confirmLabel: {type: String},
        cancelLabel: {type: String},
        _isOpen: {type: Boolean, state: true},
    };

    constructor() {
        super();
        this.heading = 'Confirmation';
        this.message = 'Are you sure?';
        this.submessage = nothing;
        this.confirmLabel = 'Confirm';
        this.cancelLabel = 'Cancel';
        this._resolvePromise = undefined;
    }

    /**
     * Opens the modal.
     * Returns a Promise that resolves true if confirmed, false if cancelled.
     * @returns {Promise<boolean>}
     */
    open() {
        this._isOpen = true;
        return new Promise((resolve) => {
            this._resolvePromise = resolve;
            // We need to wait for the component to render before accessing the modal
            this.updateComplete.then(() => {
                const modal = this.shadowRoot.querySelector('custom-modal');
                if (modal) {
                    modal.openModal();
                }
            });
        });
    }

    /**
     * Closes the modal.
     */
    close() {
        this._isOpen = false;
        this.updateComplete.then(() => {
            const modal = this.shadowRoot.querySelector('custom-modal');
            if (modal) {
                modal.closeModal();
            }
        });
        if (this._resolvePromise) {
            this._resolvePromise(false);
            this._resolvePromise = undefined;
        }
    }

    _handleConfirm() {
        if (this._resolvePromise) {
            this._resolvePromise(true);
            this._resolvePromise = undefined;
        }
        this.close();
        this.dispatchEvent(new CustomEvent('confirm'));
    }

    _handleCancel() {
        if (this._resolvePromise) {
            this._resolvePromise(false);
            this._resolvePromise = undefined;
        }
        this.close();
        this.dispatchEvent(new CustomEvent('cancel'));
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    display: contents;
                }

                .modal-header {
                    font-size: var(--font-size-large);
                    font-weight: bold;
                    margin-bottom: var(--spacing-normal);
                    border-bottom: 1px solid var(--border-color);
                    padding-bottom: var(--spacing-small);
                }

                .modal-body {
                    margin-bottom: var(--spacing-normal);
                    line-height: 1.5;
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-small);
                }

                .modal-footer {
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-end;
                    gap: var(--spacing-small);
                    padding-top: var(--spacing-small);
                }
                
                p {
                    margin: 0;
                }
                
                .submessage {
                    color: var(--delete-red);
                    background: var(--delete-red-light);
                    border: 1px solid var(--delete-red);
                    padding: var(--spacing-x-small);
                    font-weight: 500;
                    font-size: var(--font-size-x-small);
                }
            `
        ];
    }

    render() {
        return html`
            <custom-modal maxWidth="400px">
                <div class="modal-header" id="modal-heading">${this.heading}</div>
                <div class="modal-body" id="modal-message">
                    <p>
                        ${this.message}
                    </p>
                    <p class="submessage">
                        ${this.submessage}
                    </p>
                    
                    
                </div>
                <div class="modal-footer">
                    <button class="cancel button secondary" @click=${this._handleCancel}>
                        ${this.cancelLabel}
                    </button>
                    <button class="confirm button primary" @click=${this._handleConfirm}>
                        ${this.confirmLabel}
                    </button>
                </div>
            </custom-modal>
        `;
    }
}

// Register the custom element
customElements.define('custom-confirm', ConfirmModal);
