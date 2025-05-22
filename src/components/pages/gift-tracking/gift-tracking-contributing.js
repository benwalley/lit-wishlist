import {LitElement, html, css} from 'lit';
import buttonStyles from "../../../css/buttons.js";
import '../../../svg/success.js';
import '../../../svg/contribute.js';
import '../../loading/skeleton-loader.js';
import './gift-tracking-loader.js';
import {messagesState} from "../../../state/messagesStore.js";

export class GiftTrackingContributing extends LitElement {
    static properties = {
        contributionsData: {type: Array},
        loading: {type: Boolean},
        error: {type: String}
    };

    constructor() {
        super();
        this.contributionsData = [];
        this.loading = true;
        this.error = '';
    }

    connectedCallback() {
        super.connectedCallback();
        // We'll use a placeholder for now, the actual implementation will be similar to getting
        this.loading = false;
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    display: block;
                }
                
                .empty-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: var(--spacing-large);
                    text-align: center;
                    gap: var(--spacing-small);
                    background-color: var(--background-light);
                    border-radius: var(--border-radius-normal);
                }
                
                .error-message {
                    color: var(--delete-red);
                    padding: var(--spacing-normal);
                    text-align: center;
                    background-color: var(--delete-red-light);
                    border-radius: var(--border-radius-normal);
                }
                
                .coming-soon {
                    font-size: var(--font-size-medium);
                    font-weight: bold;
                    text-align: center;
                    margin: var(--spacing-large) 0;
                    padding: var(--spacing-large);
                    background-color: var(--background-light);
                    border-radius: var(--border-radius-normal);
                    box-shadow: var(--shadow-1-soft);
                }
            `
        ];
    }

    render() {
        return html`
            ${this.loading ? html`
                <gift-tracking-loader></gift-tracking-loader>
            ` : html`
                <div class="coming-soon">
                    <p>The "Contributing" tab view is coming soon!</p>
                    <p>This feature will show all items you're contributing to organized by recipient.</p>
                </div>
            `}
        `;
    }
}

customElements.define('gift-tracking-contributing', GiftTrackingContributing);
