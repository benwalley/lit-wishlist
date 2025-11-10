import { LitElement, html, css } from 'lit';
import { observeState } from 'lit-element-state';
import '../../global/custom-input.js';
import '../../global/process-loading-ring.js';
import buttonStyles from '../../../css/buttons.js';
import { importAmazonWishlist, importAmazonWishlistAsync } from '../../../helpers/api/import.js';
import { importCsvWishlistAsync, validateCsvFile } from '../../../helpers/api/csv-import.js';
import { messagesState } from '../../../state/messagesStore.js';
import { navigate } from '../../../router/main-router.js';
import './import-container.js';

class ImportWishlistContainer extends observeState(LitElement) {
    static get properties() {
        return {
            wishlistUrl: { type: String },
            selectedFile: { type: Object },
            isSubmitting: { type: Boolean },
            importResult: { type: Object },
            showImportReview: { type: Boolean },
            csvRequirementsExpanded: { type: Boolean }
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
                    padding-bottom: 100px;
                }

                .import-header {
                    padding: var(--spacing-normal-variable);
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
                    padding: var(--spacing-normal-variable);
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
                    padding: var(--spacing-normal-variable);
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

                .separator {
                    display: flex;
                    align-items: center;
                    margin: var(--spacing-normal) 0;
                    color: var(--text-color-medium);
                    font-size: var(--font-size-small);
                }

                .separator::before,
                .separator::after {
                    content: '';
                    flex: 1;
                    height: 1px;
                    background: var(--border-color);
                }

                .separator::before {
                    margin-right: var(--spacing-normal);
                }

                .separator::after {
                    margin-left: var(--spacing-normal);
                }

                .csv-section {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-small);
                }

                .file-input-container {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-small);
                    flex-wrap: wrap;
                }

                .file-input {
                    display: none;
                }

                .file-button {
                    min-width: 140px;
                }

                .selected-file {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-x-small);
                    color: var(--text-color-dark);
                    font-size: var(--font-size-small);
                    background: var(--background-medium);
                    padding: var(--spacing-x-small) var(--spacing-small);
                    border-radius: var(--border-radius-small);
                    border: 1px solid var(--border-color);
                }

                .clear-file-button {
                    background: none;
                    border: none;
                    color: var(--text-color-medium);
                    cursor: pointer;
                    padding: 2px;
                    border-radius: var(--border-radius-small);
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                }

                .clear-file-button:hover {
                    background: var(--option-select-background-hover);
                    color: var(--delete-red);
                }

                .csv-instructions {
                    background: var(--info-background);
                    border: 1px solid var(--info-border);
                    border-radius: var(--border-radius-small);
                    padding: var(--spacing-small);
                    font-size: var(--font-size-small);
                    color: var(--text-color-medium-dark);
                }

                .csv-instructions-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    cursor: pointer;
                    margin: 0 0 8px 0;
                    padding: 2px;
                }

                .csv-instructions-header:hover {
                    background: var(--option-select-background-hover);
                    border-radius: var(--border-radius-small);
                }

                .csv-instructions h4 {
                    margin: 0;
                    color: var(--text-color-dark);
                    font-size: var(--font-size-small);
                }

                .expand-icon {
                    font-size: 12px;
                    color: var(--text-color-medium);
                    transition: transform 0.2s ease;
                    user-select: none;
                }

                .expand-icon.expanded {
                    transform: rotate(180deg);
                }

                .csv-requirements {
                    overflow: hidden;
                    transition: max-height 0.3s ease, opacity 0.3s ease;
                    max-height: 0;
                    opacity: 0;
                }

                .csv-requirements.expanded {
                    max-height: 300px;
                    opacity: 1;
                }

                .csv-instructions ul {
                    margin: 8px 0 0 0;
                    padding-left: 20px;
                }

                .csv-instructions li {
                    margin-bottom: 4px;
                }

            `
        ];
    }

    constructor() {
        super();
        this.wishlistUrl = '';
        this.selectedFile = null;
        this.isSubmitting = false;
        this.importResult = null;
        this.showImportReview = false;
        this.csvRequirementsExpanded = false;

        // Loading phases for process-loading-ring
        this.loadingPhases = [
            { icon: html`📋`, message: 'Fetching wishlist. This will take about two minutes', duration: 6000 },
            { icon: html`🔍`, message: 'Parsing HTML structure...', duration: 6000 },
            { icon: html`🧠`, message: 'Analyzing product data...', duration: 6000 },
            { icon: html`🎪`, message: 'Flibbertigibbeting...', duration: 6000 },
            { icon: html`🖼️`, message: 'Extracting images...', duration: 8000 },
            { icon: html`⏰`, message: 'Taking my time...', duration: 6000 },
            { icon: html`🚗`, message: 'Stuck in traffic...', duration: 6000 },
            { icon: html`🏛️`, message: 'Waiting in line at the bank...', duration: 6000 },
            { icon: html`🍽️`, message: 'Working up an appetite...', duration: 6000 },
            { icon: html`☕`, message: 'Getting another coffee...', duration: 6000 },
            { icon: html`🐕`, message: 'Walking the dog...', duration: 6000 },
            { icon: html`📱`, message: 'Checking social media...', duration: 6000 },
            { icon: html`🍕`, message: 'Ordering pizza...', duration: 6000 },
            { icon: html`🧦`, message: 'Looking for matching socks...', duration: 6000 },
            { icon: html`🐢`, message: 'Moving at turtle speed...', duration: 6000 },
            { icon: html`🎭`, message: 'Practicing dramatic pauses...', duration: 6000 },
            { icon: html`🧘`, message: 'Meditating on life choices...', duration: 6000 },
            { icon: html`🎪`, message: 'Joining the circus...', duration: 6000 },
            { icon: html`✅`, message: 'Running quality checks...', duration: 6000 },
            { icon: html`🎯`, message: 'Finalizing import...', duration: 4000 },
        ];
    }

    _handleUrlChange(e) {
        this.wishlistUrl = e.detail.value;
        // Clear file selection if URL is entered
        if (this.wishlistUrl.trim() && this.selectedFile) {
            this.selectedFile = null;
        }
    }

    _handleFileChange(e) {
        const file = e.target.files[0];
        if (file) {
            const validation = validateCsvFile(file);
            if (!validation.success) {
                messagesState.addMessage(validation.error, 'error');
                e.target.value = ''; // Clear the input
                return;
            }

            this.selectedFile = file;
            // Clear URL if file is selected
            if (this.wishlistUrl.trim()) {
                this.wishlistUrl = '';
            }
        } else {
            this.selectedFile = null;
        }
    }

    _clearFile() {
        this.selectedFile = null;
        // Clear the file input
        const fileInput = this.shadowRoot.querySelector('#csv-file');
        if (fileInput) {
            fileInput.value = '';
        }
    }

    _toggleCsvRequirements() {
        this.csvRequirementsExpanded = !this.csvRequirementsExpanded;
    }


    async _handleSubmit(e) {
        e.preventDefault();

        const hasUrl = this.wishlistUrl.trim();
        const hasFile = this.selectedFile;

        if (!hasUrl && !hasFile) {
            messagesState.addMessage('Please enter a wishlist URL or select a CSV file', 'error');
            return;
        }

        if (hasUrl && hasFile) {
            messagesState.addMessage('Please choose either a URL or CSV file, not both', 'error');
            return;
        }

        this.isSubmitting = true;
        this.importResult = null;

        try {
            let response;

            if (hasUrl) {
                // Handle URL import (existing functionality)
                response = await importAmazonWishlistAsync(this.wishlistUrl.trim());
            } else if (hasFile) {
                // Handle CSV import using async pattern
                response = await importCsvWishlistAsync(this.selectedFile);
            }

            if (response.success) {
                this.importResult = response.data;
                messagesState.addMessage(
                    `Successfully processed ${response.data.totalItems} items from "${response.data.wishlistTitle || 'CSV file'}"`,
                    'success'
                );

                // Show the import review interface
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
        this._clearFile();
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
                    ></custom-input>
                </div>

                <div class="separator">OR</div>

                <div class="csv-section">
                    <div class="form-group">
                        <label for="csv-file">Upload CSV File</label>
                        <div class="file-input-container">
                            <input
                                type="file"
                                id="csv-file"
                                class="file-input"
                                accept=".csv,text/csv,application/csv"
                                @change=${this._handleFileChange}
                            >
                            <button
                                type="button"
                                class="button secondary file-button"
                                @click=${() => this.shadowRoot.querySelector('#csv-file').click()}
                            >
                                Choose CSV File
                            </button>
                            ${this.selectedFile ? html`
                                <div class="selected-file">
                                    <span>${this.selectedFile.name}</span>
                                    <button
                                        type="button"
                                        class="clear-file-button"
                                        @click=${this._clearFile}
                                        title="Remove file"
                                    >
                                        ×
                                    </button>
                                </div>
                            ` : ''}
                        </div>
                    </div>

                    <div class="csv-instructions">
                        <div class="csv-instructions-header" @click=${this._toggleCsvRequirements}>
                            <h4>CSV Format Requirements:</h4>
                            <span class="expand-icon ${this.csvRequirementsExpanded ? 'expanded' : ''}">▼</span>
                        </div>
                        <div class="csv-requirements ${this.csvRequirementsExpanded ? 'expanded' : ''}">
                            <p>Your CSV should have these columns (only 'name' is required):</p>
                            <ul>
                                <li><strong>name</strong> - Item name (required)</li>
                                <li><strong>price</strong> - Price without currency symbol (e.g., 29.99)</li>
                                <li><strong>imageUrl</strong> - URL of image</li>
                                <li><strong>linkUrl</strong> - Link url</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="form-actions">
                    <button 
                        type="submit" 
                        class="button primary submit-button"
                        ?disabled=${this.isSubmitting || (!this.wishlistUrl.trim() && !this.selectedFile)}
                    >
                        ${this.isSubmitting ? 
                            (this.selectedFile ? 'Processing CSV...' : 'Fetching Items...') : 
                            (this.selectedFile ? 'Process CSV File' : 'Fetch Wishlist Items')
                        }
                    </button>
                </div>
            </form>

            ${this.isSubmitting ? html`
                <div class="loading-backdrop">
                    <process-loading-ring
                        ?show="${this.isSubmitting}"
                        .phases="${this.loadingPhases}"
                        duration="120000"
                    ></process-loading-ring>
                </div>
            ` : ''}
        `;
    }
}

customElements.define('import-wishlist-container', ImportWishlistContainer);
