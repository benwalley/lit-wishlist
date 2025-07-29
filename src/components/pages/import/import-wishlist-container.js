import { LitElement, html, css } from 'lit';
import { observeState } from 'lit-element-state';
import '../../global/custom-input.js';
import '../../global/process-loading-ring.js';
import buttonStyles from '../../../css/buttons.js';
import { importAmazonWishlist } from '../../../helpers/api/import.js';
import { messagesState } from '../../../state/messagesStore.js';
import { navigate } from '../../../router/main-router.js';
import './import-container.js';

class ImportWishlistContainer extends observeState(LitElement) {
    static get properties() {
        return {
            wishlistUrl: { type: String },
            isSubmitting: { type: Boolean },
            importResult: { type: Object },
            showImportReview: { type: Boolean }
        };
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    display: block;
                    margin: 0 auto;
                    width: 100%;
                }

                .import-header {
                    padding: var(--spacing-normal);
                }

                h1 {
                    margin: 0 0 16px 0;
                    font-size: var(--font-size-x-large);
                    color: var(--text-color-dark);
                }

                .page-description {
                    color: var(--medium-text-color);
                    line-height: 1.5;
                    margin-bottom: var(--spacing-normal);
                }

                .import-form {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-normal);
                    padding: var(--spacing-normal);
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .form-group label {
                    font-weight: 600;
                    color: var(--text-color-dark);
                    font-size: var(--font-size-small);
                }

                .form-actions {
                    display: flex;
                    justify-content: flex-end;
                    margin-top: 16px;
                }

                .submit-button {
                    min-width: 150px;
                }

                .instructions {
                    background: var(--info-background);
                    border: 1px solid var(--info-border);
                    border-radius: var(--border-radius-small);
                    padding: 16px;
                    margin-bottom: 24px;
                }

                .instructions h3 {
                    margin: 0 0 12px 0;
                    color: var(--text-color-dark);
                    font-size: var(--font-size-normal);
                }

                .instructions ol {
                    margin: 0;
                    padding-left: 20px;
                    color: var(--text-color-medium-dark);
                }

                .instructions li {
                    margin-bottom: 8px;
                    line-height: 1.4;
                }

                .success-result {
                    background: var(--success-background, #d4edda);
                    border: 1px solid var(--success-border, #c3e6cb);
                    border-radius: var(--border-radius-small);
                    padding: 16px;
                    margin-top: 24px;
                    color: var(--success-text, #155724);
                }

                .success-result h3 {
                    margin: 0 0 12px 0;
                    color: var(--success-text, #155724);
                    font-size: var(--font-size-normal);
                }

                .success-result p {
                    margin: 0;
                    line-height: 1.4;
                }

                .loading-backdrop {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.2);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    backdrop-filter: blur(2px);
                }

                .loading-backdrop.dark-mode {
                    background-color: rgba(0, 0, 0, 0.3);
                }

            `
        ];
    }

    constructor() {
        super();
        this.wishlistUrl = '';
        this.isSubmitting = false;
        this.importResult = null;
        this.showImportReview = false;

        // Loading phases for process-loading-ring
        this.loadingPhases = [
            { icon: html`🔗`, message: 'Connecting to Amazon...', duration: 4000 },
            { icon: html`📦`, message: 'Fetching wishlist content...', duration: 4000 },
            { icon: html`🔍`, message: 'Parsing HTML structure...', duration: 4000 },
            { icon: html`🧠`, message: 'Analyzing product data...', duration: 4000 },
            { icon: html`🎪`, message: 'Flibbertigibbeting...', duration: 4000 },
            { icon: html`🖼️`, message: 'Extracting images...', duration: 4000 },
            { icon: html`💰`, message: 'Processing prices...', duration: 4000 },
            { icon: html`🔗`, message: 'Validating product links...', duration: 4000 },
            { icon: html`📋`, message: 'Organizing items...', duration: 4000 },
            { icon: html`✅`, message: 'Running quality checks...', duration: 4000 },
            { icon: html`⏰`, message: 'Taking my time...', duration: 4000 },
            { icon: html`🚗`, message: 'Stuck in traffic...', duration: 4000 },
            { icon: html`🏛️`, message: 'Waiting in line at the bank...', duration: 4000 },
            { icon: html`🍽️`, message: 'Working up an appetite...', duration: 4000 },
            { icon: html`☕`, message: 'Getting another coffee...', duration: 4000 },
            { icon: html`🐕`, message: 'Walking the dog...', duration: 4000 },
            { icon: html`📱`, message: 'Checking social media...', duration: 4000 },
            { icon: html`🍕`, message: 'Ordering pizza...', duration: 4000 },
            { icon: html`🧦`, message: 'Looking for matching socks...', duration: 4000 },
            { icon: html`🐢`, message: 'Moving at turtle speed...', duration: 4000 },
            { icon: html`🎭`, message: 'Practicing dramatic pauses...', duration: 4000 },
            { icon: html`🧘`, message: 'Meditating on life choices...', duration: 4000 },
            { icon: html`🎪`, message: 'Joining the circus...', duration: 4000 },
            { icon: html`🎯`, message: 'Finalizing import...', duration: 4000 },
        ];
    }

    _handleUrlChange(e) {
        this.wishlistUrl = e.detail.value;
    }


    async _handleSubmit(e) {
        e.preventDefault();

        if (!this.wishlistUrl.trim()) {
            return;
        }

        this.isSubmitting = true;
        this.importResult = null;

        try {
            const response = await importAmazonWishlist(this.wishlistUrl.trim());

            if (response.success) {
                this.importResult = response.data;
                messagesState.addMessage(
                    `Successfully fetched ${response.data.totalItems} items from "${response.data.wishlistTitle}"`,
                    'success'
                );

                // Show the import review interface instead of auto-importing
                this._showImportReview();

            } else {
                // Handle different error cases
                const errorMessage = this._getErrorMessage(response);
                messagesState.addMessage(errorMessage, 'error');
                console.error('Import failed:', response.error);
            }

        } catch (error) {
            console.error('Error importing wishlist:', error);
            messagesState.addMessage('An unexpected error occurred. Please try again.', 'error');
        } finally {
            this.isSubmitting = false;
        }
    }

    _getErrorMessage(response) {
        return response.publicMessage || 'Failed to import wishlist. Please try again.';
    }

    _showImportReview() {
        this.showImportReview = true;
    }

    _backToForm() {
        this.showImportReview = false;
        this.importResult = null;
        this.wishlistUrl = '';
    }

    render() {
        if (this.showImportReview && this.importResult) {
            return html`
                <import-container
                    .importData="${this.importResult}"
                    .onBackToForm="${this._backToForm.bind(this)}"
                ></import-container>
            `;
        }

        return html`
            <div class="import-header">
                <h1>Import Wishlist</h1>
                <p class="page-description">
                    Import items from an Amazon (or other site) wishlist. This wishlist import was created specifically for Amazon wishlists, 
                    but it should also work with other sites as long as the wishlist URL is accessible by anyone.
                </p>
            </div>

            <div class="instructions">
                <h3>How to get your Amazon wishlist URL:</h3>
                <ol>
                    <li>Go to your Amazon account and navigate to your wishlist</li>
                    <li>Click "Share" or "Send list to others"</li>
                    <li>Copy the public wishlist URL</li>
                    <li>Paste the URL below and click "Import Wishlist"</li>
                </ol>
            </div>

            <form class="import-form" @submit=${this._handleSubmit}>
                <div class="form-group">
                    <label for="wishlist-url">Wishlist URL</label>
                    <custom-input
                        id="wishlist-url"
                        placeholder="https://www.amazon.com/hz/wishlist/ls/..."
                        .value=${this.wishlistUrl}
                        @value-changed=${this._handleUrlChange}
                        required
                    ></custom-input>
                </div>

                <div class="form-actions">
                    <button 
                        type="submit" 
                        class="button primary submit-button"
                        ?disabled=${this.isSubmitting || !this.wishlistUrl.trim()}
                    >
                        ${this.isSubmitting ? 'Fetching Items...' : 'Fetch Wishlist Items'}
                    </button>
                </div>
            </form>

            ${this.isSubmitting ? html`
                <div class="loading-backdrop">
                    <process-loading-ring
                        ?show="${this.isSubmitting}"
                        .phases="${this.loadingPhases}"
                        duration="60000"
                    ></process-loading-ring>
                </div>
            ` : ''}
        `;
    }
}

customElements.define('import-wishlist-container', ImportWishlistContainer);
