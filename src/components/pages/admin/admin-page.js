import { LitElement, html, css } from 'lit';
import { observeState } from 'lit-element-state';
import { userState } from '../../../state/userStore.js';
import buttonStyles from '../../../css/buttons.js';
import './admin-users-tab.js';

class AdminPage extends observeState(LitElement) {
    static get properties() {
        return {
            activeTab: { type: String }
        };
    }

    constructor() {
        super();
        this.activeTab = 'users';
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    display: block;
                    padding: var(--spacing-normal-variable);
                    padding-bottom: 100px;
                    max-width: 1200px;
                }

                h1 {
                    margin: 0 0 var(--spacing-normal) 0;
                    color: var(--text-color-dark);
                }

                .tabs-container {
                    display: flex;
                    gap: var(--spacing-small);
                    margin-bottom: var(--spacing-normal);
                    border-bottom: 2px solid var(--border-color);
                }

                .tab {
                    padding: var(--spacing-normal);
                    border-radius: 0;
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: var(--font-size-normal);
                    color: var(--text-color-medium-dark);
                    border-bottom: 3px solid transparent;
                    margin-bottom: -2px;
                    transition: all 0.2s;
                }

                .tab:hover {
                    color: var(--purple-normal);
                }

                .tab.active {
                    color: var(--purple-normal);
                    border-bottom-color: var(--purple-normal);
                    font-weight: 600;
                }

                .tab-content {
                    padding: var(--spacing-normal) 0;
                }
            `
        ];
    }

    setActiveTab(tab) {
        this.activeTab = tab;
    }

    renderTabContent() {
        switch (this.activeTab) {
            case 'users':
                return html`<admin-users-tab></admin-users-tab>`;
            default:
                return html`<div>Select a tab</div>`;
        }
    }

    render() {
        if (!userState.userData?.isSuperAdmin) {
            return html`
                <div>
                    <h1>Access Denied</h1>
                    <p>You do not have permission to access this page.</p>
                </div>
            `;
        }

        return html`
            <div>
                <h1>Admin Dashboard</h1>

                <div class="tabs-container">
                    <button
                        class="tab ${this.activeTab === 'users' ? 'active' : ''}"
                        @click=${() => this.setActiveTab('users')}
                    >
                        Users
                    </button>
                </div>

                <div class="tab-content">
                    ${this.renderTabContent()}
                </div>
            </div>
        `;
    }
}

customElements.define('admin-page', AdminPage);
