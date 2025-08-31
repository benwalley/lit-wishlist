import {LitElement, html, css} from 'lit';
import {ADD_MODAL_EVENT, listenAddModalEvent} from "../../events/custom-events.js";
import '../global/custom-modal.js'
import '../forms/item-form.js'
import modalSections from "../../css/modal-sections.js";
import buttonStyles from "../../css/buttons.js";

export class AddToListModal extends LitElement {
    static properties = {};

    constructor() {
        super();
    }

    static get styles() {
        return [
            modalSections,
            buttonStyles,
            css`
                .modal-header {
                    position: sticky;
                    top: 0;
                    z-index: 10;
                }

                .modal-footer {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    z-index: 1000;
                    background-color: var(--modal-background-color);
                    padding: var(--spacing-normal);
                    border-top: 1px solid var(--border-color);
                    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
                }

                button.save-button {
                    width: 100%;
                }
                
                .modal-contents {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    max-height: 90vh;
                    border-radius: var(--border-radius-large);
                }

                .scrolling-contents {
                    padding: var(--spacing-normal);
                    padding-bottom: calc(var(--spacing-normal) * 2 + 60px);
                    overflow-y: auto;
                    overflow-x: hidden;
                    flex: 1;
                    width: 100%;
                    box-sizing: border-box;
                }
            `
        ];
    }

    connectedCallback() {
        super.connectedCallback();
        this.removeEventListener = listenAddModalEvent(() => {
            this.openModal();
        });
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.removeEventListener) {
            this.removeEventListener();
        }
    }

    openModal() {
        const modal = this.shadowRoot.querySelector('custom-modal');
        if (modal && typeof modal.openModal === 'function') {
            modal.openModal();
        }
    }

    // Public method to open modal with URL for AI fetch
    openModalWithUrl(url) {
        this.openModal();
        // Wait for the form to be rendered, then trigger the fetch
        setTimeout(() => {
            const form = this.shadowRoot.querySelector('item-form');
            if (form && typeof form.fetchItemFromUrl === 'function') {
                form.fetchItemFromUrl(url);
            }
        }, 100);
    }

    closeModal() {
        const modal = this.shadowRoot.querySelector('custom-modal');
        if (modal && typeof modal.closeModal === 'function') {
            modal.closeModal();
        }
    }

    async _handleSubmit() {
        const form = this.shadowRoot.querySelector('item-form');
        if (form && typeof form.submitForm === 'function') {
            const success = await form.submitForm();
            if (success) {
                this.closeModal();
            }
        }
    }

    _handleItemSaved(e) {
        this.closeModal();
    }

    _getFormLoadingState() {
        const form = this.shadowRoot.querySelector('item-form');
        return form?.isFetching || false;
    }

    render() {
        return html`
            <custom-modal noPadding="true">
                <div class="modal-contents">
                    <div class="modal-header">
                        <h2>Add To List</h2>
                    </div>
                    <div class="scrolling-contents">
                        <item-form 
                            mode="add"
                            @item-saved="${this._handleItemSaved}"
                        ></item-form>
                    </div>
                    <div class="modal-footer">
                        <button 
                            class="button primary save-button" 
                            @click="${this._handleSubmit}"
                        >
                            Save Item
                        </button>
                    </div>
                </div>
            </custom-modal>
        `;
    }
}

customElements.define('add-to-list-modal', AddToListModal);
