import { LitElement, html, css } from 'lit';
import { observeState } from 'lit-element-state';
import '../../global/custom-input.js';
import buttonStyles from '../../../css/buttons.js';
import { importAmazonWishlist } from '../../../helpers/api/import.js';
import { messagesState } from '../../../state/messagesStore.js';
import { navigate } from '../../../router/main-router.js';

class ImportWishlistContainer extends observeState(LitElement) {
    static get properties() {
        return {
            wishlistUrl: { type: String },
            isSubmitting: { type: Boolean },
            importResult: { type: Object }
        };
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    display: block;
                    padding: var(--spacing-normal);
                    max-width: 600px;
                    margin: 0 auto;
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
                    margin-bottom: 32px;
                }

                .import-form {
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                    background: var(--card-background);
                    padding: 32px;
                    border-radius: var(--border-radius-normal);
                    border: 1px solid var(--border-color);
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
                    justify-content: center;
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
            `
        ];
    }

    constructor() {
        super();
        this.wishlistUrl = '';
        this.isSubmitting = false;
        this.importResult = null;
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
                    `Successfully imported ${response.data.totalItems} items from "${response.data.wishlistTitle}"`,
                    'success'
                );
                
                // Navigate to lists page after a short delay to show success message
                setTimeout(() => {
                    navigate('/lists');
                }, 1500);
                
            } else {
                // Handle different error cases
                const errorMessage = this._getErrorMessage(response.error);
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

    _getErrorMessage(error) {
        // Handle different error types based on the API response
        if (error?.message) {
            const message = error.message;
            
            if (message.includes('required')) {
                return 'Please enter a valid Amazon wishlist URL.';
            } else if (message.includes('valid Amazon wishlist URL')) {
                return 'Please provide a valid Amazon wishlist URL.';
            } else if (message.includes('private')) {
                return 'This wishlist is private and cannot be accessed. Please make sure the wishlist is public.';
            } else if (message.includes('not found')) {
                return 'The requested wishlist could not be found. Please check the URL and try again.';
            } else if (message.includes('Unauthorized')) {
                return 'You are not authorized to perform this action. Please log in and try again.';
            }
            
            return message;
        }
        
        return 'Failed to import wishlist. Please try again.';
    }

    render() {
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
                        ${this.isSubmitting ? 'Importing...' : 'Import Wishlist'}
                    </button>
                </div>
            </form>

            ${this.importResult ? html`
                <div class="success-result">
                    <h3>Import Successful!</h3>
                    <p>Successfully imported ${this.importResult.totalItems} items from "${this.importResult.wishlistTitle}". You will be redirected to your lists shortly.</p>
                </div>
            ` : ''}
        `;
    }
}

customElements.define('import-wishlist-container', ImportWishlistContainer);
