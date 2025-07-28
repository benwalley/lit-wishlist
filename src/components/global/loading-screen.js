import {LitElement, html, css} from 'lit';
import '../../svg/logo.js';

export class LoadingScreen extends LitElement {
    static properties = {
        version: {},
        fullScreen: { type: Boolean },
        size: { type: String }, // 'small', 'medium', 'large'
    };

    static get styles() {
        return css`
            :host {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                font-family: var(--font-family);
                color: var(--text-color-dark);
                gap: var(--spacing-normal);
                min-height: 200px;
            }

            :host([size="small"]) {
                min-height: 80px;
                gap: var(--spacing-small);
            }

            :host([size="medium"]) {
                min-height: 120px;
                gap: var(--spacing-small);
            }

            :host([size="large"]) {
                min-height: 200px;
                gap: var(--spacing-normal);
            }

            :host([fullScreen]) {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: var(--background-color);
                z-index: 1000;
                min-height: 100vh;
            }

            .loading-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: var(--spacing-normal);
            }

            .logo-spinner {
                width: 96px;
                height: 96px;
                animation: spin 4s linear infinite;
            }

            :host([size="small"]) .logo-spinner {
                width: 32px;
                height: 32px;
            }

            :host([size="medium"]) .logo-spinner {
                width: 48px;
                height: 48px;
            }

            :host([size="large"]) .logo-spinner {
                width: 96px;
                height: 96px;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            .loading-text {
                font-size: var(--font-size-large);
                font-weight: 500;
                color: var(--text-color-dark);
                text-align: center;
            }

            :host([size="small"]) .loading-text {
                font-size: var(--font-size-small);
            }

            :host([size="medium"]) .loading-text {
                font-size: var(--font-size-normal);
            }

            :host([size="large"]) .loading-text {
                font-size: var(--font-size-large);
            }

            .loading-subtext {
                font-size: var(--font-size-small);
                color: var(--medium-text-color);
                text-align: center;
                margin-top: calc(-1 * var(--spacing-small));
            }

            .dots {
                display: inline-block;
                animation: dots 1.5s infinite;
            }

            @keyframes dots {
                0%, 16.66% {
                    content: '';
                }
                33.33% {
                    content: '.';
                }
                50% {
                    content: '..';
                }
                66.66% {
                    content: '...';
                }
                83.33% {
                    content: '..';
                }
                100% {
                    content: '.';
                }
            }

            .dots::after {
                content: '';
                animation: dots 1.5s infinite;
            }

            /* Respect reduced motion preferences */
            @media (prefers-reduced-motion: reduce) {
                .logo-spinner {
                    animation: none;
                }
                .dots::after {
                    animation: none;
                    content: '...';
                }
            }
        `;
    }

    constructor() {
        super();
        this.version = 'STARTING';
        this.fullScreen = false;
        this.size = 'large';
    }

    render() {
        return html`
            <div class="loading-container">
                <logo-icon class="logo-spinner"></logo-icon>
                <div class="loading-text">
                    Loading<span class="dots"></span>
                </div>
                ${this.version !== 'STARTING' ? html`
                    <div class="loading-subtext">
                        ${this.version}
                    </div>
                ` : ''}
            </div>
        `;
    }
}
customElements.define('loading-screen', LoadingScreen);
