import { LitElement, html, css } from 'lit';
import '../../../svg/user.js';
import '../../../svg/plus.js';
import '../../users/user-list-display-item.js';
import { observeState } from 'lit-element-state';
import { userState } from '../../../state/userStore.js';
import { isGroupAdmin } from '../../../helpers/groupHelpers.js';

export class GroupUsersList extends observeState(LitElement) {
    static properties = {
        groupData: { type: Object },
        users: { type: Array },
        loading: { type: Boolean }
    };

    constructor() {
        super();
        this.groupData = {};
        this.loading = false;
    }

    static get styles() {
        return css`
            :host {
                display: block;
            }
            
            .users-container {
                display: flex;
                flex-direction: column;
                gap: var(--spacing-small);
                margin-top: var(--spacing-small);
                /* Added to fix tooltip visibility */
                position: relative;
                overflow: visible;
            }
            
            .section-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: var(--spacing-small);
            }
            
            h2 {
                margin: 0;
                font-size: var(--font-size-medium);
            }
            
            .empty-state {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: var(--spacing-normal);
                text-align: center;
                color: var(--text-color-medium);
            }
            
            user-icon {
                width: 32px;
                height: 32px;
                margin-bottom: var(--spacing-small);
                color: var(--grayscale-300);
            }
        `;
    }

    render() {
        if (this.loading) {
            return html`<p>Loading users...</p>`;
        }

        const isAdmin = isGroupAdmin(this.groupData, userState?.userData?.id);

        return html`
            <div class="section-header">
                <h2>Group Members (${this.groupData?.members?.length || 0})</h2>
            </div>
            
            <div class="users-container">
                ${this.groupData?.members?.length ?
                        this.groupData?.members?.map(user => html`
                        <user-list-display-item 
                            .userId="${user}"
                            .groupData="${this.groupData}"
                            ?compact="${this.groupData?.members?.length > 4}"
                        ></user-list-display-item>
                    `) : 
                    html`
                        <div class="empty-state">
                            <user-icon></user-icon>
                            <p>No users in this group yet.</p>
                        </div>
                    `
                }
            </div>
        `;
    }
}

customElements.define('group-users-list', GroupUsersList);
