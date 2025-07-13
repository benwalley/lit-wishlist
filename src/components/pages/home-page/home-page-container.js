import {LitElement, html, css} from 'lit';
import {observeState} from 'lit-element-state';
import {userState} from "../../../state/userStore.js";
import '../../global/custom-input.js';
import buttonStyles from "../../../css/buttons.js";
import {customFetch} from "../../../helpers/fetchHelpers.js";
import {messagesState} from "../../../state/messagesStore.js";

export class HomePageContainer extends observeState(LitElement) {
    static properties = {
        testUrl: { type: String },
        isLoading: { type: Boolean },
        response: { type: Object }
    };

    constructor() {
        super();
        this.testUrl = '';
        this.isLoading = false;
        this.response = null;
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    display: block;
                    padding: var(--spacing-normal);
                    max-width: 800px;
                    margin: 0 auto;
                }

                .test-section {
                    border: 1px solid var(--border-color);
                    border-radius: var(--border-radius-normal);
                    padding: var(--spacing-normal);
                    margin-bottom: var(--spacing-normal);
                    background: var(--background-light);
                }

                .test-section h2 {
                    margin-top: 0;
                    color: var(--text-color-dark);
                }

                .form-row {
                    display: flex;
                    gap: var(--spacing-small);
                    align-items: end;
                    margin-bottom: var(--spacing-normal);
                }

                .form-row custom-input {
                    flex: 1;
                }

                .response-section {
                    margin-top: var(--spacing-normal);
                }

                .response-content {
                    background: var(--background-color);
                    border: 1px solid var(--border-color);
                    border-radius: var(--border-radius-small);
                    padding: var(--spacing-small);
                    font-family: monospace;
                    font-size: var(--font-size-small);
                    white-space: pre-wrap;
                    max-height: 400px;
                    overflow-y: auto;
                }

                .loading {
                    opacity: 0.6;
                    pointer-events: none;
                }
            `
        ];
    }

    async _handleFetchItem() {
        if (!this.testUrl) {
            messagesState.addMessage('Please enter a URL', 'error');
            return;
        }

        this.isLoading = true;
        this.response = null;

        try {
            const response = await customFetch('/api/itemFetch/fetch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    url: this.testUrl
                })
            });

            this.response = response;
            
            if (response.success) {
                messagesState.addMessage('Item fetch successful!', 'success');
            } else {
                messagesState.addMessage('Item fetch failed', 'error');
            }
        } catch (error) {
            console.error('Error fetching item:', error);
            this.response = { error: error.message };
            messagesState.addMessage('Error fetching item', 'error');
        } finally {
            this.isLoading = false;
        }
    }

    _handleUrlChange(e) {
        this.testUrl = e.detail.value;
    }

    render() {
        return html`
            <div class="test-section ${this.isLoading ? 'loading' : ''}">
                <h2>Item Fetch Test</h2>
                <p>Enter a product URL to test the item fetching API:</p>
                
                <div class="form-row">
                    <custom-input
                        label="Product URL"
                        placeholder="https://example.com/product-page"
                        .value="${this.testUrl}"
                        @value-changed="${this._handleUrlChange}"
                        type="url"
                    ></custom-input>
                    <button 
                        class="button primary"
                        @click="${this._handleFetchItem}"
                        ?disabled="${this.isLoading || !this.testUrl}"
                    >
                        ${this.isLoading ? 'Fetching...' : 'Fetch Item'}
                    </button>
                </div>

                ${this.response ? html`
                    <div class="response-section">
                        <h3>Response:</h3>
                        <div class="response-content">
${JSON.stringify(this.response, null, 2)}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }
}
customElements.define('home-page-container', HomePageContainer);
