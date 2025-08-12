import { LitElement, html, css } from 'lit';
import { observeState } from 'lit-element-state';
import './sub-users-list.js';
import './create-subuser.js';
import './edit-subuser-modal.js';
import {isCurrentUserSubuser} from "../../../helpers/generalHelpers.js";

class SubusersPage extends observeState(LitElement) {
    static get properties() {
        return {
            editModal: { type: Object, state: true }
        };
    }

    static get styles() {
        return css`
            :host {
                display: block;
                padding: var(--spacing-normal-variable);
                padding-bottom: 100px;
            }

            .subusers-header {
                margin-bottom: 24px;
            }

            h1 {
                margin: 0;
                font-size: var(--font-size-x-large);
                color: var(--text-color-dark);
            }

            .page-description {
                background: var(--background-light);
                border-radius: var(--border-radius-large);
                padding: 24px;
                margin-bottom: 32px;
                border-left: 4px solid var(--primary-color);
            }

            .page-description-intro {
                color: var(--text-color-dark);
                font-size: var(--font-size-medium);
                margin-bottom: 16px;
                line-height: 1.6;
            }

            .page-description ol {
                margin: 0;
                padding-left: 20px;
                color: var(--text-color-medium-dark);
            }

            .page-description li {
                margin-bottom: 8px;
                line-height: 1.5;
            }

            .page-description li:last-child {
                margin-bottom: 0;
            }

            .content-grid {
                display: grid;
                gap: 32px;
                grid-template-columns: 1fr;
            }

            @media (min-width: 768px) {
                .content-grid {
                    grid-template-columns: 1fr 1fr;
                    align-items: start;
                }
            }
        `;
    }

    constructor() {
        super();
        this.editModal = null;
    }

    firstUpdated() {
        this.editModal = this.shadowRoot.querySelector('edit-subuser-modal');
    }

    render() {
        if(isCurrentUserSubuser()) return;
        return html`
            <div class="subusers-header">
                <h1>Subusers</h1>
            </div>
            
            <div class="page-description">
                <div class="page-description-intro">
                    Subusers are accounts that are created with your email address, but otherwise are mostly like any other user with a few exceptions:
                </div>
                <ol>
                    <li>You will control which groups a subuser is a part of</li>
                    <li>Subusers can't create their own subusers</li>
                    <li>Subusers can't see what is being gotten for the parent user</li>
                    <li>Parent users can add items to the subuser lists</li>
                </ol>
            </div>
            
            <div class="content-grid">
                <sub-users-list .editModal="${this.editModal}"></sub-users-list>
                <create-subuser></create-subuser>
            </div>
            
            <edit-subuser-modal></edit-subuser-modal>
        `;
    }
}

customElements.define('subusers-page', SubusersPage);
