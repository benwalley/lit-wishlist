import { LitElement, html, css } from 'lit';
import { observeState } from 'lit-element-state';
import { userState } from '../../../state/userStore.js';
import '../../../components/loading/skeleton-loader.js';
import './sub-user-display-item.js';
import '../../../svg/user.js';

class SubUsersList extends observeState(LitElement) {
    static get properties() {
        return {
            editModal: { type: Object }
        };
    }

    static get styles() {
        return css`
            :host {
                display: block;
            }

            .subusers-container {
                display: flex;
                flex-direction: column;
                gap: var(--spacing-x-small);
                width: 100%;
            }

            .no-subusers {
                text-align: center;
                padding: 64px 24px;
                width: 100%;
                box-sizing: border-box;
                background: var(--background-light);
                border-radius: var(--border-radius-large);
                border: 2px dashed var(--border-color-light);
            }

            .no-subusers-icon {
                width: 64px;
                height: 64px;
                margin: 0 auto 24px;
                opacity: 0.4;
                color: var(--text-color-medium);
            }

            .no-subusers-title {
                font-size: var(--font-size-large);
                font-weight: 600;
                color: var(--text-color-dark);
                margin-bottom: 12px;
            }

            .no-subusers-description {
                color: var(--text-color-medium-dark);
                line-height: 1.5;
                max-width: 400px;
                margin: 0 auto;
            }
        `;
    }

    constructor() {
        super();
        this.editModal = null;
    }

    renderSkeletons() {
        return Array(6).fill(0).map(() => html`
            <skeleton-loader type="user-item" height="87px"></skeleton-loader>
        `);
    }

    renderSubusers() {
        if (userState.subusers.length === 0) {
            return html`<div class="no-subusers">
                <user-icon class="no-subusers-icon"></user-icon>
                <div class="no-subusers-title">No subusers yet</div>
                <div class="no-subusers-description">
                    You haven't created any subusers yet. Subusers are additional accounts that you can manage and control access for.
                </div>
            </div>`;
        }

        return userState.subusers.map(subuser => html`
            <sub-user-display-item .userData=${subuser} .editModal=${this.editModal}></sub-user-display-item>
        `);
    }

    render() {
        return html`
            <div class="subusers-container">
                ${userState.loadingUser ? this.renderSkeletons() : this.renderSubusers()}
            </div>
        `;
    }
}

customElements.define('sub-users-list', SubUsersList);
