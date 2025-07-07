import { LitElement, html, css } from 'lit';
import { observeState } from 'lit-element-state';
import '../../global/custom-input.js';
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
            showImportReview: { type: Boolean },
            currentLoadingState: { type: Number },
            loadingStateText: { type: String },
            loadingStateIcon: { type: String },
            isTransitioning: { type: Boolean }
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
                    text-align: center;
                    margin-bottom: 32px;
                }

                h1 {
                    margin: 0 0 16px 0;
                    font-size: var(--font-size-x-large);
                    color: var(--text-color-dark);
                }

                .page-description {
                    color: var(--text-color-medium-dark);
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

                .loading-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: var(--spacing-normal);
                    padding: var(--spacing-large);
                    text-align: center;
                    margin-top: var(--spacing-normal);
                }

                .loading-icon {
                    font-size: 3rem;
                    animation: pulse 2s infinite;
                    transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
                    opacity: 1;
                }

                .loading-icon.transitioning {
                    opacity: 0;
                    transform: scale(0.8);
                }

                .loading-text {
                    font-size: var(--font-size-normal);
                    color: var(--text-color-medium-dark);
                    margin: 0;
                    transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
                    opacity: 1;
                    transform: translateY(0);
                }

                .loading-text.transitioning {
                    opacity: 0;
                    transform: translateY(-10px);
                }

                .loading-progress {
                    width: 100%;
                    max-width: 300px;
                    height: 8px;
                    background: var(--background-color-light);
                    border-radius: 4px;
                    overflow: hidden;
                    position: relative;
                }

                .loading-progress-bar {
                    height: 100%;
                    background: linear-gradient(90deg, var(--primary-color), var(--primary-color-light));
                    border-radius: 4px;
                    transition: width 0.8s ease;
                }

                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); }
                }

                @keyframes slideInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes slideInScale {
                    from {
                        opacity: 0;
                        transform: scale(0.5);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                .loading-state-enter {
                    animation: slideInUp 0.5s ease-out;
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
        this.currentLoadingState = 0;
        this.loadingStateText = '';
        this.loadingStateIcon = '';
        this.loadingInterval = null;
        this.isTransitioning = false;

        // Fun loading states - each lasts 3 seconds
        this.loadingStates = [
            { text: 'Connecting to Amazon...', icon: '🔗' },
            { text: 'Fetching wishlist content...', icon: '📦' },
            { text: 'Parsing HTML structure...', icon: '🔍' },
            { text: 'Analyzing product data...', icon: '🧠' },
            { text: 'Extracting images...', icon: '🖼️' },
            { text: 'Processing prices...', icon: '💰' },
            { text: 'Validating product links...', icon: '🔗' },
            { text: 'Organizing items...', icon: '📋' },
            { text: 'Running quality checks...', icon: '✅' },
            { text: 'Finalizing import...', icon: '🎯' }
        ];
    }

    _handleUrlChange(e) {
        this.wishlistUrl = e.detail.value;
    }

    _startLoadingStates() {
        this.currentLoadingState = 0;
        // Set initial state without transition
        const initialState = this.loadingStates[0];
        this.loadingStateText = initialState.text;
        this.loadingStateIcon = initialState.icon;
        this.isTransitioning = false;

        this.loadingInterval = setInterval(() => {
            this.currentLoadingState++;
            if (this.currentLoadingState < this.loadingStates.length) {
                this._updateLoadingState();
            } else {
                // Cycle back to earlier states if still loading
                this.currentLoadingState = this.loadingStates.length - 3;
                this._updateLoadingState();
            }
        }, 4000); // 3 seconds per state
    }

    _updateLoadingState() {
        // Start transition out
        this.isTransitioning = true;

        // After fade out completes, update content and fade in
        setTimeout(() => {
            const state = this.loadingStates[this.currentLoadingState];
            this.loadingStateText = state.text;
            this.loadingStateIcon = state.icon;

            // Small delay before fading in
            setTimeout(() => {
                this.isTransitioning = false;
            }, 50);
        }, 300); // Match the CSS transition duration
    }

    _stopLoadingStates() {
        if (this.loadingInterval) {
            clearInterval(this.loadingInterval);
            this.loadingInterval = null;
        }
    }

    async _handleSubmit(e) {
        e.preventDefault();

        if (!this.wishlistUrl.trim()) {
            return;
        }

        this.isSubmitting = true;
        this.importResult = null;
        this._startLoadingStates();

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
            this._stopLoadingStates();
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
                <h1>Import Amazon Wishlist</h1>
                <p class="page-description">
                    Import items from your Amazon wishlist to create a new list in your account.
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
                    <label for="wishlist-url">Amazon Wishlist URL</label>
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
                <div class="loading-state loading-state-enter">
                    <div class="loading-icon ${this.isTransitioning ? 'transitioning' : ''}">${this.loadingStateIcon}</div>
                    <p class="loading-text ${this.isTransitioning ? 'transitioning' : ''}">${this.loadingStateText}</p>
                    <div class="loading-progress">
                        <div class="loading-progress-bar" style="width: ${((this.currentLoadingState + 1) / this.loadingStates.length) * 100}%"></div>
                    </div>
                </div>
            ` : ''}
        `;
    }
}

customElements.define('import-wishlist-container', ImportWishlistContainer);
