import {LitElement, html, css} from 'lit';
import buttonStyles from "../../../css/buttons.js";
import formStyles from "../../../css/forms.js";
import '../../../svg/success.js';
import '../../../svg/contribute.js';
import '../../../svg/gift.js';
import '../../global/floating-box.js';
import './gift-tracking-getting.js';
import './gift-tracking-contributing.js';

export class GiftsTrackingPage extends LitElement {
    static properties = {
        activeTab: {type: String},
    };

    constructor() {
        super();
        this.activeTab = 'getting'; // Default tab
    }

    switchTab(tab) {
        this.activeTab = tab;
    }

    static get styles() {
        return [
            buttonStyles,
            formStyles,
            css`
                :host {
                    display: block;
                }
                
                .gift-tracking-container {
                    padding: var(--spacing-normal);
                    max-width: 100%;
                }
                
                .title-bar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: var(--spacing-normal);
                }
                
                .title {
                    margin: 0;
                    font-size: 1.5rem;
                }
                
                .sub-heading {
                    color: var(--medium-dark-text-color);
                    font-size: var(--font-size-small);
                    margin-top: var(--spacing-small);
                }
                
                .tabs-container {
                    margin-bottom: var(--spacing-normal);
                }
                
                .tabs {
                    display: flex;
                    border-bottom: 1px solid var(--border-color);
                }
                
                .tab {
                    padding: var(--spacing-small) var(--spacing-normal);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-x-small);
                    font-weight: 500;
                    color: var(--medium-dark-text-color);
                    border-bottom: 3px solid transparent;
                    transition: var(--transition-200);
                }
                
                .tab svg {
                    width: 18px;
                    height: 18px;
                }
                
                .tab.active {
                    color: var(--primary-color);
                    border-bottom-color: var(--primary-color);
                }
                
                .tab:hover:not(.active) {
                    background-color: var(--grayscale-150);
                    color: var(--dark-text-color);
                }
                
                .tab-content {
                    
                }
            `
        ];
    }

    render() {
        return html`
            <div class="gift-tracking-container">
                <div class="title-bar">
                    <div>
                        <h1 class="title">Gift Tracking</h1>
                    </div>
                </div>

                <div class="tabs-container">
                    <div class="tabs">
                        <div class="tab ${this.activeTab === 'getting' ? 'active' : ''}" 
                             @click=${() => this.switchTab('getting')}>
                            <gift-icon></gift-icon>
                            <span>Getting</span>
                        </div>
                        <div class="tab ${this.activeTab === 'contributing' ? 'active' : ''}" 
                             @click=${() => this.switchTab('contributing')}>
                            <contribute-icon></contribute-icon>
                            <span>Contributing</span>
                        </div>
                    </div>
                    
                    <div class="tab-content">
                        ${this.activeTab === 'getting' ? 
                            html`<gift-tracking-getting></gift-tracking-getting>` : 
                            html`<gift-tracking-contributing></gift-tracking-contributing>`
                        }
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('gifts-tracking-page', GiftsTrackingPage);
