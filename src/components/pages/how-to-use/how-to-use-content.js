import { LitElement, html, css } from 'lit';
import { observeState } from 'lit-element-state';
import { Router } from '@vaadin/router';
import { screenSizeState } from '../../../state/screenSizeStore.js';
import './help-sections/getting-started.js';
import './help-sections/adding-items.js';
import './help-sections/groups.js';
import './help-sections/events.js';
import './help-sections/gift-tracking.js';
import './help-sections/advanced-features.js';
import './help-sections/privacy-sharing.js';
import '../../../svg/user.js';
import '../../../svg/thick-list.js';
import '../../../svg/group.js';
import '../../../svg/calendar.js';
import '../../../svg/gift.js';
import '../../../svg/gear.js';
import '../../../svg/shield.js';
import '../../../svg/question-mark.js';

export class HowToUseContent extends observeState(LitElement) {
    static get properties() {
        return {
            activeSection: { type: String },
            initialSection: { type: String }
        };
    }

    constructor() {
        super();
        this.activeSection = 'getting-started';
        this.initialSection = 'getting-started';

        this.sections = [
            {
                id: 'getting-started',
                title: 'Getting Started',
                icon: html`<user-icon></user-icon>`,
                component: 'getting-started-help'
            },
            {
                id: 'adding-items',
                title: 'Adding Items to Your Lists',
                icon: html`<thick-list-icon></thick-list-icon>`,
                component: 'adding-items-help'
            },
            {
                id: 'groups',
                title: 'Groups',
                icon: html`<group-icon></group-icon>`,
                component: 'groups-help'
            },
            {
                id: 'events',
                title: 'Events',
                icon: html`<calendar-icon></calendar-icon>`,
                component: 'events-help'
            },
            {
                id: 'gift-tracking',
                title: 'Gift Tracking',
                icon: html`<gift-icon></gift-icon>`,
                component: 'gift-tracking-help'
            },
            {
                id: 'advanced-features',
                title: 'Advanced Features',
                icon: html`<gear-icon></gear-icon>`,
                component: 'advanced-features-help'
            },
            {
                id: 'privacy-sharing',
                title: 'Privacy & Sharing',
                icon: html`<shield-icon></shield-icon>`,
                component: 'privacy-sharing-help'
            },
        ];
    }

    updated(changedProperties) {
        super.updated(changedProperties);

        // Update activeSection when initialSection changes
        if (changedProperties.has('initialSection')) {
            this.activeSection = this._validateSection(this.initialSection);
        }
    }

    _validateSection(section) {
        // Check if section is valid, fallback to getting-started
        const validSections = this.sections.map(s => s.id);
        return validSections.includes(section) ? section : 'getting-started';
    }

    static get styles() {
        return css`
            :host {
                display: block;
                height: 100%;
            }

            /* Tab Layout for all screen sizes */
            .tab-layout {
                display: flex;
                flex-direction: column;
            }

            .tab-navigation {
                border-bottom: 1px solid var(--border-color);
                background: var(--background-medium);
                flex-shrink: 0;
            }

            .tab-buttons {
                display: flex;
                flex-wrap: wrap;
                padding: 0;
            }

            .tab-button {
                padding: var(--spacing-normal) var(--spacing-small);
                background: none;
                border: none;
                cursor: pointer;
                color: var(--text-color-medium-dark);
                font-size: var(--font-size-small);
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                gap: var(--spacing-x-small);
                border-bottom: 3px solid transparent;
                white-space: nowrap;
                flex-shrink: 0;
                min-width: fit-content;
            }

            .tab-button:hover {
                background: var(--option-select-background-hover);
                color: var(--text-color-dark);
            }

            .tab-button.active {
                background: var(--background-light);
                color: var(--primary-color);
                border-bottom-color: var(--primary-color);
                font-weight: 500;
            }

            .tab-button .icon {
                width: 16px;
                height: 16px;
                flex-shrink: 0;
            }

            .tab-content {
                flex: 1;
                padding: var(--spacing-normal);
                padding-bottom: 100px;
                overflow-y: auto;
                box-sizing: border-box;
                background: var(--background-light);
            }

            /* Mobile responsive adjustments */
            @media (max-width: 768px) {
                .tab-layout {
                    height: auto;
                }

                .tab-navigation {
                    padding: 0 var(--spacing-x-small);
                }

                .tab-button {
                    padding: var(--spacing-small) var(--spacing-normal);
                    font-size: var(--font-size-x-small);
                }

                .tab-button .icon {
                    width: 14px;
                    height: 14px;
                }

                .tab-content {
                    padding: var(--spacing-normal) var(--spacing-small);
                }
            }

            /* Hide button text on very small screens, show icons only */
            @media (max-width: 480px) {
            

                .tab-button {
                    padding: var(--spacing-small);
                    min-width: 44px;
                    justify-content: center;
                }
            }
        `;
    }

    _handleTabClick(sectionId) {
        // Navigate to the new route instead of just updating local state
        const route = sectionId === 'getting-started' ? '/how-to-use' : `/how-to-use/${sectionId}`;
        Router.go(route);
    }

    _renderSectionComponent(sectionId) {
        switch (sectionId) {
            case 'getting-started':
                return html`<getting-started-help></getting-started-help>`;
            case 'adding-items':
                return html`<adding-items-help></adding-items-help>`;
            case 'groups':
                return html`<groups-help></groups-help>`;
            case 'events':
                return html`<events-help></events-help>`;
            case 'gift-tracking':
                return html`<gift-tracking-help></gift-tracking-help>`;
            case 'advanced-features':
                return html`<advanced-features-help></advanced-features-help>`;
            case 'privacy-sharing':
                return html`<privacy-sharing-help></privacy-sharing-help>`;
            default:
                return html`<getting-started-help></getting-started-help>`;
        }
    }

    _renderActiveTabContent() {
        return this._renderSectionComponent(this.activeSection);
    }

    render() {
        return html`
            <div class="tab-layout">
                <div class="tab-navigation">
                    <div class="tab-buttons">
                        ${this.sections.map(section => html`
                            <button
                                class="tab-button ${this.activeSection === section.id ? 'active' : ''}"
                                @click=${() => this._handleTabClick(section.id)}
                            >
                                <span class="icon">${section.icon}</span>
                                <span class="tab-button-text">${section.title}</span>
                            </button>
                        `)}
                    </div>
                </div>
                <div class="tab-content">
                    ${this._renderActiveTabContent()}
                </div>
            </div>
        `;
    }
}

customElements.define('how-to-use-content', HowToUseContent);
