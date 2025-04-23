import { LitElement, html, css } from 'lit';
import '../pages/account/avatar.js';
import '../../svg/user.js';
import {getUserDescriptionById, getUserImageIdByUserId, getUsernameById} from "../../helpers/generalHelpers.js";
import {observeState} from "lit-element-state";

export class UserListDisplayItem extends observeState(LitElement) {
    static properties = {
        useId: { type: Number },
        showDescription: { type: Boolean },
        compact: { type: Boolean }
    };

    constructor() {
        super();
        this.showDescription = true;
        this.compact = false;
    }

    static styles = css`
        :host {
            display: block;
            color: var(--text-color-dark);
            border-radius: var(--border-radius-normal);
            transition: var(--transition-200);
        }

        .user-container {
            display: flex;
            align-items: center;
            cursor: pointer;
            padding: var(--spacing-small);
            gap: var(--spacing-small);
            border-radius: var(--border-radius-normal);
            background-color: var(--background-dark);
            transition: var(--transition-normal);
            border: 1px solid var(--border-color);
            text-decoration: none;
        }

        .user-container:hover {
            box-shadow: var(--shadow-1-soft);
            transform: translateY(-1px);
            border-color: var(--primary-color);
            
        }
        
        .compact .user-container {
            padding: var(--spacing-x-small);
            gap: var(--spacing-x-small);
        }
        
        user-icon {
            width: 50%;
            height: 50%;
        }

        .user-info {
            flex: 1;
            display: flex;
            flex-direction: column;
            min-width: 0;
        }

        .user-name {
            font-size: var(--font-size-small);
            font-weight: bold;
            color: var(--text-color-dark);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        
        .compact .user-name {
            font-size: var(--font-size-x-small);
        }

        .user-desc {
            font-size: var(--font-size-x-small);
            color: var(--text-color-medium-dark);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-top: 2px;
            line-height: 1;
        }
    `;

    render() {
        if (!this.userId) {
            return html`<div class="user-container">No user data</div>`;
        }

        return html`
            <a class="user-container ${this.compact ? 'compact' : ''}" href="/user/${this.userId}">
                <custom-avatar size="${this.compact ? '24' : '40'}" 
                    username="${getUsernameById(this.userId) || '-'}" 
                    imageId="${getUserImageIdByUserId(this.userId)}"
                ></custom-avatar> 
                

                <div class="user-info">
                    <div class="user-name">${getUsernameById(this.userId) || 'Unknown User'}</div>
                    ${this.showDescription && !this.compact
                        ? html`<div class="user-desc">${getUserDescriptionById(this.userId)}</div>`
                        : null
                    }
                </div>
            </a>
        `;
    }
}

customElements.define('user-list-display-item', UserListDisplayItem);
