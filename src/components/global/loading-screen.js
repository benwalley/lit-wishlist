import {LitElement, html, css} from 'lit';
import '../../svg/logo.js';

export class LoadingScreen extends LitElement {
    static properties = {
        version: {},
        fullScreen: { type: Boolean },
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
                0%, 20% {
                    content: '';
                }
                40% {
                    content: '.';
                }
                60% {
                    content: '..';
                }
                80%, 100% {
                    content: '...';
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
