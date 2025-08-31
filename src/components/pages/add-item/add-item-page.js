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
                margin: 0 auto;
                box-sizing: border-box;
            }
                
                //@media (min-width: 1400px) {
                //    :host {
                //        padding: var(--spacing-normal);
                //    }
                //}
                
            item-form {
                box-sizing: border-box;
                max-width: 1200px;
                margin: 0 auto;
                padding: var(--spacing-normal-variable);
                background: var(--background-light);
            }

                @media (min-width: 1475px) {
                    item-form {
                        border-radius: var(--border-radius-large);
                        box-shadow: var(--shadow-3-soft);
                        margin-bottom: var(--spacing-normal);
                    }
                }

            .page-header {
                padding: var(--spacing-normal) 0 0 0;
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
                border-bottom: 1px solid var(--border-color);
                padding-bottom: var(--spacing-normal);
            }

                @media (min-width: 1475px) {
                    .page-description {
                        border-bottom: none;
                    }
                }

            @media (max-width: 768px) {
==

                .page-title {
                    font-size: var(--font-size-large);
                }
            }

            .form-actions {
                display: flex;
                gap: var(--spacing-normal);
                justify-content: flex-end;
                border-top: 1px solid var(--border-color-extra-light);
                position: sticky;
                bottom: 0;
                padding: var(--spacing-normal-variable);
                background: var(--background-dark);
                box-shadow: var(--shadow-2-soft);
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

        // Extract URL parameters for Web Share Target
        const urlParams = new URLSearchParams(window.location.search);

        // First check if URL parameter exists and is valid
        let sharedUrl = urlParams.get('url');
        if (sharedUrl) {
            sharedUrl = decodeURIComponent(sharedUrl);
            if (this._isValidUrl(sharedUrl)) {
                this.sharedUrl = sharedUrl;
            } else {
                sharedUrl = null;
            }
        }

        // If no valid URL parameter, parse title and text for URLs
        if (!sharedUrl) {
            const title = urlParams.get('title');
            const text = urlParams.get('text');

            sharedUrl = this._extractUrlFromText(title) || this._extractUrlFromText(text);
            if (sharedUrl) {
                this.sharedUrl = sharedUrl;
            }
        }

        // If we found a URL, trigger the auto-fetch
        if (this.sharedUrl) {
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

    _isValidUrl(string) {
        try {
            const url = new URL(string);
            return url.protocol === 'http:' || url.protocol === 'https:';
        } catch (_) {
            return false;
        }
    }

    _extractUrlFromText(text) {
        if (!text) return null;

        const decodedText = decodeURIComponent(text);

        // Look for URLs in the text using regex
        const urlRegex = /(https?:\/\/[^\s]+)/gi;
        const matches = decodedText.match(urlRegex);

        if (matches && matches.length > 0) {
            // Return the first valid URL found
            for (const match of matches) {
                if (this._isValidUrl(match)) {
                    return match;
                }
            }
        }

        return null;
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
