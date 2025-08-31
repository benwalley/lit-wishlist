import {LitElement, html, css} from 'lit';
import {Router} from '@vaadin/router';
import '../../forms/item-form.js';
import buttonStyles from "../../../css/buttons.js";

export class AddItemPage extends LitElement {
    static properties = {
        sharedUrl: {type: String},
    };

    constructor() {
        super();
        this.sharedUrl = '';
    }

    static get styles() {
        return [
            buttonStyles,
            css`
            :host {
                display: block;
                width: 100%;
                max-width: 1200px;
                margin: 0 auto;
                padding: var(--spacing-normal-variable);
                box-sizing: border-box;
            }

            .page-header {
                margin-bottom: var(--spacing-large);
                text-align: center;
            }

            .page-title {
                font-size: var(--font-size-x-large);
                font-weight: 600;
                color: var(--text-color-dark);
                margin: 0 0 var(--spacing-small) 0;
            }

            .page-description {
                font-size: var(--font-size-medium);
                color: var(--text-color-medium-dark);
                margin: 0;
            }

            @media (max-width: 768px) {
                :host {
                    padding: var(--spacing-small);
                }
==

                .page-title {
                    font-size: var(--font-size-large);
                }
            }

            .form-actions {
                display: flex;
                gap: var(--spacing-normal);
                justify-content: flex-end;
                margin-top: var(--spacing-large);
                padding-top: var(--spacing-normal);
                border-top: 1px solid var(--border-color-extra-light);
            }

            .form-actions button {
                min-width: 120px;
            }
                
            button.save-button {
                width: 100%;
            }
        `];
    }

    connectedCallback() {
        super.connectedCallback();

        // Extract URL parameter for Web Share Target
        const urlParams = new URLSearchParams(window.location.search);
        const sharedUrl = urlParams.get('url');
        alert(window.location);
        if (sharedUrl) {
            this.sharedUrl = decodeURIComponent(sharedUrl);
            // Wait for the form to render, then trigger the fetch
            setTimeout(() => {
                this._triggerAutoFetch();
            }, 100);
        }
    }

    _triggerAutoFetch() {
        const form = this.shadowRoot.querySelector('item-form');
        if (form && this.sharedUrl && typeof form.fetchItemFromUrl === 'function') {
            form.fetchItemFromUrl(this.sharedUrl);
        }
    }

    async _handleSubmit() {
        const form = this.shadowRoot.querySelector('item-form');
        if (form && typeof form.submitForm === 'function') {
            const success = await form.submitForm();
            if (success) {
                // Redirect to dashboard after successful save
                Router.go('/account');
            }
        }
    }

    _handleCancel() {
        // Navigate back to previous page or dashboard
        Router.go('/account');
    }

    _handleItemSaved(e) {
        // Redirect to dashboard or lists page after successful save
        Router.go('/account');
    }

    _handleFormCancelled(e) {
        // Navigate back to previous page or dashboard
        Router.go('/account');
    }

    render() {
        return html`
            <div class="page-header">
                <h1 class="page-title">Add New Item</h1>
                <p class="page-description">
                    ${this.sharedUrl 
                        ? 'Adding item from shared link...' 
                        : 'Create a new item for your wishlist'
                    }
                </p>
            </div>
            
            <div class="form-container">
                <item-form 
                    mode="add"
                    @item-saved="${this._handleItemSaved}"
                    @form-cancelled="${this._handleFormCancelled}"
                ></item-form>
                
                <div class="form-actions">
                    <button 
                        class="button primary save-button" 
                        @click="${this._handleSubmit}"
                    >
                        Save Item
                    </button>
                </div>
            </div>
        `;
    }
}

customElements.define('add-item-page', AddItemPage);
