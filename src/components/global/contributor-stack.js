import {LitElement, html, css} from 'lit';
import {currencyHelper} from "../../helpers.js";
import '../pages/account/avatar.js';
import '../global/custom-modal.js';
import '../../svg/success.js';
import '../../svg/dollar.js';
import '../../svg/info.js';
import {getUserImageIdByUserId, getUsernameById} from "../../helpers/generalHelpers.js";
import {observeState} from "lit-element-state";

export class ContributorStack extends observeState(LitElement) {
    static properties = {
        contributors: {type: Array},
        maxDisplayed: {type: Number},
        modalOpen: {type: Boolean, state: true},
        simple: {type: Boolean, reflect: true}
    };

    constructor() {
        super();
        this.contributors = [];
        this.maxDisplayed = 5; // Default max avatars to display
        this.modalOpen = false;
        this.simple = false;
    }

    openModal() {
        this.modalOpen = true;
    }

    closeModal() {
        this.modalOpen = false;
    }

    static get styles() {
        return css`
            :host {
                display: inline-block;
            }
            
            .contributor-stack {
                display: flex;
                align-items: center;
            }
            
            .simple-view {
                display: inline-flex;
                align-items: center;
                font-size: 0.8em;
                color: var(--text-color-dark);
                padding: 4px 10px;
                border-radius: 50px;
                cursor: pointer;
                transition: var(--transition-200);
                font-weight: bold;
                line-height: 1;
            }
            
            .simple-view:hover {
                background: #a7a7a736;
            }
            
            .more-indicator {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: var(--color-background-tertiary);
                color: var(--color-text-secondary);
                font-size: 0.8em;
                font-weight: bold;
                border: 2px solid white;
                margin-left: -10px;
            }
            
            .info-icon-container {
                margin-left: var(--spacing-small);
                cursor: pointer;
                color: var(--color-primary);
                transition: transform 0.2s ease, color 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .info-icon-container:hover {
                transform: scale(1.1);
                color: var(--blue-normal);
            }
            
            .popup-contents {
                max-width: 200px;
                display: flex;
                flex-direction: column;
                gap: var(--spacing-small);
                padding: var(--spacing-small);
            }
            
            .popup-username {
                border-bottom: 1px solid var(--border-color);
                font-weight: bold;
            }
            
            .amount-contributed {
                font-size: var(--font-size-small);
                align-items: center;
                display: flex;
                background: var(--green-light);
                border-radius: var(--border-radius-normal);
                color: var(--green-normal);
                padding: 5px;
                gap: 4px;
                font-weight: bold;
            }
            
            .qty {
                display: flex;
                align-items: center;
                gap: 4px;
                font-weight: bold;
                background: var(--blue-light);
                color: var(--blue-normal);
                font-size: var(--font-size-small);
                padding: var(--spacing-x-small) var(--spacing-small);
                border-radius: 50px;
            }
            
            .all-contributors {
                display: flex;
                flex-direction: column;
                gap: var(--spacing-normal);
                max-height: 60vh;
                overflow-y: auto;
                padding: var(--spacing-normal);
            }
            
            .contributor-row {
                display: flex;
                align-items: center;
                gap: var(--spacing-small);
                border-bottom: 1px solid var(--border-color-light);
                padding-bottom: var(--spacing-small);
                margin-bottom: var(--spacing-small);
            }
            
            .contributor-info {
                display: flex;
                flex-direction: column;
                gap: 4px;
                flex: 1;
            }
            
            .popup-title {
                font-weight: bold;
                margin-bottom: var(--spacing-small);
            }
            
            .modal-title {
                font-size: 1.2em;
                font-weight: bold;
                margin-bottom: var(--spacing-normal);
                text-align: center;
                border-bottom: 1px solid var(--border-color);
                padding-bottom: var(--spacing-small);
            }
            
        `;
    }

    renderContributorInfo(contributor) {
        return html`
            <div class="popup-username">${getUsernameById(contributor.userId)}</div>
            ${contributor.getting ? html`
                <div class="qty">
                    <success-icon></success-icon>
                    Getting ${contributor.numberGetting}
                </div>
            ` : ''}
            ${contributor.contributing ? html`
                <div class="amount-contributed">
                    <dollar-icon></dollar-icon>
                    Contributing
                    ${parseInt(contributor.contributeAmount) ? currencyHelper(contributor.contributeAmount) : ''}
                </div>
            ` : ''}
        `;
    }

    render() {
        if (!this.contributors || this.contributors.length === 0) {
            return html`<div class="contributor-stack"></div>`;
        }

        const displayedContributors = this.contributors.slice(0, this.maxDisplayed);
        const remainingCount = Math.max(0, this.contributors.length - this.maxDisplayed);

        return html`
            ${this.simple ? html`
                <div class="simple-view" @click="${this.openModal}" title="View all contributors">
                    ${this.contributors.length} contributor${this.contributors.length !== 1 ? 's' : ''}
                </div>
            ` : html`
                <div class="contributor-stack">
                    ${displayedContributors.map((contributor, index) => html`
                        <custom-avatar
                            size="24"
                            username="${getUsernameById(contributor.userId)}"
                            imageId="${getUserImageIdByUserId(contributor.userId)}"
                            round="true"
                            border="true"
                            hasPopup="true"
                            stackLeft="${index > 0}"
                        >
                            <div class="popup-contents">
                                ${this.renderContributorInfo(contributor)}
                            </div>
                        </custom-avatar>
                    `)}
                    
                    ${remainingCount > 0 ? html`
                        <div class="more-indicator" title="${remainingCount} more contributors">
                            +${remainingCount}
                        </div>
                    ` : ''}
                    
                    ${this.contributors.length > 0 ? html`
                        <div class="info-icon-container" @click="${this.openModal}" title="View all contributors">
                            <info-icon></info-icon>
                        </div>
                    ` : ''}
                </div>
            `}
            
            <custom-modal 
                ?isOpen=${this.modalOpen} 
                @modal-closed=${this.closeModal}
                hideCloseBtn="false"
                maxWidth="400px"
            >
                <div class="modal-content">
                    <div class="modal-title">
                        ${this.contributors.length} Contributors
                    </div>
                    <div class="all-contributors">
                        ${this.contributors.map(contributor => html`
                            <div class="contributor-row">
                                <custom-avatar
                                    size="36"
                                    username="${getUsernameById(contributor.userId)}"
                                    imageId="${getUserImageIdByUserId(contributor.userId)}"
                                    round="true"
                                ></custom-avatar>
                                <div class="contributor-info">
                                    ${this.renderContributorInfo(contributor)}
                                </div>
                            </div>
                        `)}
                    </div>
                </div>
            </custom-modal>
        `;
    }
}

customElements.define('contributor-stack', ContributorStack);
