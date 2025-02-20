import {LitElement, html, css} from 'lit';
import buttonStyles from "../../../css/buttons";
import {cachedFetch} from "../../../helpers/caching.js";
import {listenUpdateItem} from "../../../events/eventListeners.js";
import '../../../svg/success.js';
import '../../../svg/share.js';
import '../../../svg/dots.js';
import {currencyHelper} from "../../../helpers.js";

export class ContributorsTopBar extends LitElement {
    static properties = {
        itemData: {type: Object},
        contributors: {type: Array},
        listId: {type: String},
        itemId: {type: String},
        loading: {type: Boolean},
        amountPledged: {type: Number},
    };

    constructor() {
        super();
        this.itemData = {};
        this.contributors = [];
        this.listId = '';
        this.itemId = '';
        this.loading = true; // Initial loading state
        this.amountPledged = 0;
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    display: block;
                    padding: var(--spacing-small);
                    background: linear-gradient(
                            to right,
                            rgb(99 102 241 / 0.1),
                            rgb(168 85 247 / 0.1),
                            rgb(236 72 153 / 0.1)
                    );
                    border-bottom: 1px solid var(--border-color);
                    overflow: hidden;
                    height: min-content;
                }
                
                @media (min-width: 800px) {
                    :host {
                        padding: var(--spacing-normal);
                    }
                }

                .top-row {
                    display: grid;
                    grid-template-columns: auto auto;
                    align-items: center;
                    justify-content: space-between;
                    gap: var(--spacing-small);
                    transition: opacity 0.3s ease-in-out;
                }
                
                @media (min-width: 1000px) {
                    .top-row {
                        display: flex;
                    }
                }

                a.back-arrow.button {
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    gap: var(--spacing-x-small);
                    color: var(--primary-color);
                    text-decoration: none;
                    transition: transform 0.3s ease, color 0.3s ease;
                }

                a.back-arrow.button:hover,
                a.back-arrow.button:focus,
                a.back-arrow.button:active {
                    color: var(--blue-normal);
                    transform: scale(1.03);
                    background: none;
                }

                a.back-arrow.button:hover arrow-long-left-icon,
                a.back-arrow.button:focus arrow-long-left-icon,
                a.back-arrow.button:active arrow-long-left-icon {
                    animation: bounce 1s;
                }
                
                
                @media (max-width: 799px) {
                    .desktop-only {
                        display: none;
                    }
                }
                
                

                .contributor-details {
                    grid-row: 2;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    gap: var(--spacing-small);
                    margin-right: auto;
                }
                
                @media (min-width: 800px) {
                    .contributor-details {
                        flex-direction: row;
                    }
                    
                }

                .avatar-stack {
                    display: flex;
                    gap: 4px;
                }

                .avatar-stack img {
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    border: 2px solid white;
                    transition: opacity 0.3s ease;
                }

                .contributor-count {
                    white-space: nowrap;
                    font-weight: bold;
                    font-size: 0.9em;
                    transition: opacity 0.3s ease;
                }

                .amount-gotten {
                    grid-row: 2;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    font-weight: bold;
                    background: var(--green-light);
                    color: var(--green-normal);
                    font-size: var(--font-size-small);
                    padding: var(--spacing-x-small) var(--spacing-small);
                    border-radius: 50px;
                    transition: opacity 0.3s ease;
                    
                    &.none-gotten {
                        background: var(--text-color-light);
                        color: var(--text-color-dark);
                    }
                }

                success-icon {
                    font-size: 1.2em;
                }

                .contributors-right {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                    transition: opacity 0.3s ease;
                }

                .contributors-right .title {
                    font-weight: bold;
                    font-size: 0.9em;
                    line-height: 1;
                }

                .contributors-right .amount {
                    font-size: 0.8em;
                    line-height: 1;
                }
                
                .actions-container {
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-end;
                }

                .action-button {
                    font-size: 1.3em;
                    transition: transform 0.3s ease;
                }
                .action-button:hover {
                    transform: scale(1.1);
                }

                /* Bounce Animation for Back Arrow Icon */
                @keyframes bounce {
                    0% { transform: translateX(0); }
                    30% { transform: translateX(-5px); }
                    50% { transform: translateX(0); }
                    70% { transform: translateX(-2px); }
                    100% { transform: translateX(0); }
                }

                /* Fade In Transition */
                .fade-in {
                    animation: fadeIn 0.4s ease forwards;
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                /* Skeleton Loading Styles for general areas */
                .skeleton {
                    background: #e0e0e0;
                    border-radius: 4px;
                    position: relative;
                    overflow: hidden;
                }
                .skeleton::after {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: -150%;
                    height: 100%;
                    width: 150%;
                    background: linear-gradient(
                            90deg,
                            transparent,
                            rgba(255, 255, 255, 0.4),
                            transparent
                    );
                    animation: loading 1.5s infinite;
                }
                @keyframes loading {
                    0% { left: -150%; }
                    50% { left: 100%; }
                    100% { left: 100%; }
                }
                .skeleton-circle {
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                }
                .skeleton-text {
                    height: 14px;
                    border-radius: 4px;
                }

                /* Skeleton variant for green background sections */
                .skeleton--on-green {
                    background: rgba(255, 255, 255, 0.6);
                }
                .skeleton--on-green::after {
                    background: linear-gradient(
                            90deg,
                            transparent,
                            rgba(255, 255, 255, 0.8),
                            transparent
                    );
                }
            `
        ];
    }

    connectedCallback() {
        super.connectedCallback();
        if (!this.itemId?.length) {
            return;
        }
        this.fetchContributorData();
        listenUpdateItem(this.fetchContributorData.bind(this));
    }

    async fetchContributorData() {
        this.loading = true;
        this.requestUpdate();

        try {
            const response = await cachedFetch(`/contributors/item/${this.itemId}`, {}, true);
            if (response?.responseData?.error) {
                console.error('Error fetching contributors:', response.responseData.error);
                this.loading = false;
                return;
            }
            const contributors = response;
            this.contributors = contributors;
            this.amountPledged = 0;
            for (const user of contributors) {
                this.amountPledged += parseFloat(user.contributeAmount || 0);
            }
        } catch (error) {
            console.error('Error fetching contributors:', error);
        } finally {
            this.loading = false;
            this.requestUpdate();
        }
    }

    // Getter to sum the numberGetting from all contributors
    get totalNumberGotten() {
        return this.contributors.reduce(
            (total, contributor) => total + (contributor.numberGetting || 0),
            0
        );
    }

    render() {
        return html`
            <div class="top-row fade-in">
                <!-- Back Arrow with Bounce Transition on Hover -->
                <a
                        href="/list/${this.listId}"
                        class="back-arrow button link-button"
                        aria-label="Back to List"
                >
                    <arrow-long-left-icon aria-hidden="true"></arrow-long-left-icon>
                    <span class="desktop-only">Back To List</span>
                </a>

                <!-- Contributor Details -->
                <div class="contributor-details">
                    ${this.loading
                            ? html`
                                <div class="avatar-stack">
                                    <div class="skeleton skeleton-circle"></div>
                                    <div class="skeleton skeleton-circle" style="margin-left: -8px;"></div>
                                </div>
                                <div class="contributors-right">
                                    <div class="skeleton skeleton-text" style="width: 120px; margin-top: 5px;"></div>
                                    <div class="skeleton skeleton-text" style="width: 80px; margin-top: 5px;"></div>
                                </div>
                            `
                            : html`
                                <div class="avatar-stack fade-in">
                                    ${this.contributors.slice(0, 2).map(
                                            contributor => html`
                                                <img
                                                        src="${contributor.user.image || ''}"
                                                        alt="Avatar of ${contributor.user.name}"
                                                />
                                            `
                                    )}
                                </div>
                                <div class="contributors-right fade-in">
                  <span class="contributor-count title desktop-only">
                    ${this.contributors.length} people contributing
                  </span>
                                    ${this.amountPledged > 0
                                            ? html`
                                                <span class="amount">
                          ${currencyHelper(this.amountPledged)} pledged
                        </span>
                                            `
                                            : ''}
                                </div>
                            `}
                </div>

                <!-- Amount Gotten (with green skeletons if loading) -->
                <div class="amount-gotten fade-in ${this.totalNumberGotten === 0 ? 'none-gotten' : ''}">
                    ${this.loading
                            ? html`
                                <div class="skeleton skeleton--on-green skeleton-text" style="width: 40px; height: 20px;"></div>
                                <span>of</span>
                                <div class="skeleton skeleton--on-green skeleton-text" style="width: 40px; height: 20px;"></div>
                                <span>gotten</span>
                            `
                            : html`
                                <success-icon></success-icon>
                                <span>${this.totalNumberGotten}</span>
                                <span>of</span>
                                <span>
                  ${Math.max(
                          this.itemData?.amountWanted,
                          this.itemData?.maxAmountWanted
                  ) || 1}
                </span>
                                <span>gotten</span>
                            `}
                </div>

                <!-- Action Buttons -->
                <div class="actions-container">
                    <button
                            class="button icon-button action-button fade-in"
                            aria-label="share"
                    >
                        <share-icon></share-icon>
                    </button>
                    <button
                            class="button icon-button action-button fade-in"
                            aria-label="Actions"
                    >
                        <dots-icon></dots-icon>
                    </button>
                </div>
            </div>
        `;
    }
}

customElements.define('contributors-top-bar', ContributorsTopBar);
