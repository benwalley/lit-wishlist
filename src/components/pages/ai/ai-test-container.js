import { LitElement, html, css } from 'lit';
import { observeState } from 'lit-element-state';
import '../../global/custom-input.js';
import buttonStyles from '../../../css/buttons.js';
import {customFetch} from "../../../helpers/fetchHelpers.js";

class AiTestContainer extends observeState(LitElement) {
    static get properties() {
        return {
            inputText: { type: String },
            isGenerating: { type: Boolean },
            response: { type: String },
            error: { type: String }
        };
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

                .ai-header {
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

                .ai-form {
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                    background: var(--card-background, #fff);
                    padding: 32px;
                    border-radius: var(--border-radius-normal);
                    border: 1px solid var(--border-color);
                    margin-bottom: 24px;
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

                .generate-button {
                    min-width: 150px;
                }

                .response-container {
                    background: var(--card-background, #fff);
                    border: 1px solid var(--border-color);
                    border-radius: var(--border-radius-normal);
                    padding: 24px;
                    margin-top: 24px;
                }

                .response-header {
                    font-weight: 600;
                    color: var(--text-color-dark);
                    margin-bottom: 16px;
                    font-size: var(--font-size-normal);
                }

                .response-content {
                    white-space: pre-wrap;
                    line-height: 1.6;
                    color: var(--text-color-medium-dark);
                    font-family: monospace;
                    background: var(--code-background, #f8f9fa);
                    padding: 16px;
                    border-radius: var(--border-radius-small);
                    border: 1px solid var(--border-color);
                    max-height: 400px;
                    overflow-y: auto;
                }

                .error-message {
                    background: var(--error-background, #f8d7da);
                    border: 1px solid var(--error-border, #f5c6cb);
                    color: var(--error-text, #721c24);
                    padding: 16px;
                    border-radius: var(--border-radius-small);
                    margin-top: 16px;
                }

                .loading-indicator {
                    text-align: center;
                    color: var(--text-color-medium-dark);
                    font-style: italic;
                    padding: 24px;
                }
            `
        ];
    }

    constructor() {
        super();
        this.inputText = '';
        this.isGenerating = false;
        this.response = '';
        this.error = '';
    }

    _handleInputChange(e) {
        this.inputText = e.detail.value;
    }

    async _handleSubmit(e) {
        e.preventDefault();

        if (!this.inputText.trim()) {
            return;
        }

        this.isGenerating = true;
        this.response = '';
        this.error = '';

        try {
            const response = await customFetch('/ai/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: this.inputText.trim()
                }),
            }, true);

            const data = await response.json();

            if (response.ok && data.success) {
                this.response = JSON.stringify(data, null, 2);
            } else {
                this.error = data.message || `Error: ${response.status} ${response.statusText}`;
            }

        } catch (error) {
            console.error('Error calling AI endpoint:', error);
            this.error = `Network error: ${error.message}`;
        } finally {
            this.isGenerating = false;
        }
    }

    render() {
        return html`
            <div class="ai-header">
                <h1>AI Endpoint Test</h1>
                <p class="page-description">
                    Test the AI generation endpoint by entering a prompt below.
                </p>
            </div>

            <form class="ai-form" @submit=${this._handleSubmit}>
                <div class="form-group">
                    <label for="ai-input">Enter your prompt:</label>
                    <custom-input
                        id="ai-input"
                        placeholder="Type your prompt here..."
                        .value=${this.inputText}
                        @value-changed=${this._handleInputChange}
                        required
                    ></custom-input>
                </div>

                <div class="form-actions">
                    <button 
                        type="submit" 
                        class="button primary generate-button"
                        ?disabled=${this.isGenerating || !this.inputText.trim()}
                    >
                        ${this.isGenerating ? 'Generating...' : 'Generate'}
                    </button>
                </div>
            </form>

            ${this.isGenerating ? html`
                <div class="loading-indicator">
                    Calling AI endpoint...
                </div>
            ` : ''}

            ${this.error ? html`
                <div class="error-message">
                    <strong>Error:</strong> ${this.error}
                </div>
            ` : ''}

            ${this.response ? html`
                <div class="response-container">
                    <div class="response-header">API Response:</div>
                    <div class="response-content">${this.response}</div>
                </div>
            ` : ''}
        `;
    }
}

customElements.define('ai-test-container', AiTestContainer);
