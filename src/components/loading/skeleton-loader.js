import { LitElement, html, css } from 'lit';

class SkeletonLoader extends LitElement {
    static properties = {
        // Use "circle" for a circular skeleton; any other value (or absence) will be rectangular.
        variant: { type: String },
        // Optional width and height attributes. Defaults: full width & 1em height.
        width: { type: String },
        height: { type: String },
    };

    static styles = css`
        :host {
            display: inline-block;
            width: 100%;
        }

        .skeleton {
            background-color: var(--skeleton-bg, #dfdfdf42);
            position: relative;
            overflow: hidden;
        }

        .skeleton::after {
            content: "";
            position: absolute;
            top: 0;
            left: -200%;
            width: 200%;
            height: 100%;
            background: linear-gradient(
                    90deg,
                    transparent,
                    var(--skeleton-shimmer, rgba(255, 255, 255, 0.8)),
                    transparent
            );
            animation: shimmer 2s infinite;
        }

        @keyframes shimmer {
            0% {
                transform: translateX(-50%);
            }
            50% {
                transform: translateX(50%);
            }
            100% {
                transform: translateX(150%);
            }
        }

        /* Rectangle (default) style */
        :host(:not([variant="circle"])) .skeleton {
            border-radius: 6px;
        }

        /* Circle variant */
        :host([variant="circle"]) .skeleton {
            border-radius: 50%;
        }
    `;

    render() {
        // Use provided width and height or fallback to defaults.
        const style = `
      width: ${this.width || '100%'};
      height: ${this.height || '1em'};
    `;
        return html`<div class="skeleton" style="${style}"></div>`;
    }
}

customElements.define('skeleton-loader', SkeletonLoader);
