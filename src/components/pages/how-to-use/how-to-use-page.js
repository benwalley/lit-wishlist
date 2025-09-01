import { LitElement, html, css } from 'lit';
import { observeState } from 'lit-element-state';
import buttonStyles from '../../../css/buttons.js';
import './how-to-use-content.js';

export class HowToUsePage extends observeState(LitElement) {
    static get properties() {
        return {
            loading: { type: Boolean }
        };
    }

    constructor() {
        super();
        this.loading = false;
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
                    box-sizing: border-box;
                }

                .page-header {
                    text-align: center;
                    border-bottom: 1px solid var(--border-color);
                    padding: var(--spacing-normal);
                }

                .page-title {
                    font-size: var(--font-size-x-large);
                    font-weight: 600;
                    color: var(--text-color-dark);
                    margin: 0;
                }

                .content-container {
                    background: var(--background-light);
                }

                @media (max-width: 768px) {
                    :host {
                        padding: var(--spacing-small);
                    }

                    .page-title {
                        font-size: var(--font-size-large);
                    }

                    .content-container {
                        border-radius: var(--border-radius-normal);
                        box-shadow: var(--shadow-1-soft);
                    }
                }
            `
        ];
    }

    render() {
        return html`
            <div class="page-header">
                <h1 class="page-title">How to Use</h1>
            </div>
            
            <div class="content-container">
                <how-to-use-content></how-to-use-content>
            </div>
        `;
    }
}

customElements.define('how-to-use-page', HowToUsePage);
