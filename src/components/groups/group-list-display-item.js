import { LitElement, html, css } from 'lit';
import '../pages/account/avatar.js';
import '../../svg/check.js';
import '../../svg/delete.js';
import '../../svg/chevron-left.js';
import {observeState} from "lit-element-state";
import {userState} from "../../state/userStore.js";
import {screenSizeState} from "../../state/screenSizeStore.js";

class GroupItemComponent extends observeState(LitElement) {
    static properties = {
        group: { type: Object },
        isSelected: { type: Boolean }
    };

    static styles = css`
        :host {
            display: block;
            color: var(--text-color-dark);
            --item-background: var(--background-dark);
        }
        
        .group-item-container {
            display: grid;
            grid-template-columns: auto 1fr auto;
            text-decoration: none;
            color: var(--text-color-dark);
            gap: var(--spacing-small);
            align-items: center;
            padding: var(--spacing-x-small);
            transition: var(--transition-200);
            background: var(--item-background);
            border: 1px solid var(--border-color);
            border-radius: 10px;
            
            &:hover {
                border-color: var(--primary-color);
                box-shadow: var(--shadow-1-soft);
            }
        }
        
        .arrow-icon {
            display: none;
            transform: rotate(180deg);
            font-size: var(--font-size-xx-large);
            color: var(--text-color-medium-dark);
        }

        .group-info {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        .group-name {
            font-size: var(--font-size-large);
            font-weight: bold;
            line-height: 1;
            color: var(--text-color-dark);
        }
        
        .group-header-row {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            gap: var(--spacing-small);
        }
        
        .group-members-row {
            padding-top: var(--spacing-x-small);
        }

        @media (min-width: 600px) {
            .arrow-icon {
                display: block;
            }
        }
        
        .badge {
            border-radius: 50px;
            color: white;
            font-weight: bold;
            line-height: 1;
            padding: 2px var(--spacing-x-small);
            margin: auto 0;
            margin-right: auto;
            font-size: var(--font-size-x-small);
        }
        
        @media only screen and (min-width: 600px) {
            .badge {
                font-size: var(--font-size-small);
                padding: var(--spacing-x-small) var(--spacing-small);
            }
        }
        
        .owner-badge {
            background: var(--purple-color, #8b5cf6);
        }
        
        .admin-badge {
            background: var(--blue-color, #3b82f6);
        }
    `;

    _isOwner() {
        return this.group?.ownerId === userState?.userData?.id;
    }

    _isAdmin() {
        for(const admin of this.group?.adminIds || []) {
            if(admin === userState?.userData?.id) return true;
        }
        return false;
    }

    _handleClick() {
        this.dispatchEvent(new CustomEvent('group-selected', {
            detail: { group: this.group },
            bubbles: true,
            composed: true
        }));
    }

    render() {
        return html`
            <a href="/group/${this.group.id}" class="group-item-container">
                <custom-avatar size="${screenSizeState.isSmallMobile() ? '40' : '60'}"
                    username="${this.group?.groupName}" 
                    borderradius="var(--border-radius-normal)"
                    imageId="${this.group?.groupImage}"
                ></custom-avatar>

                <div class="group-info">
                    <div class="group-header-row">
                        <span class="group-name">${this.group?.groupName}</span>
                        ${this._isOwner() ? html`<span class="badge owner-badge">Owner</span>` : 
                          this._isAdmin() ? html`<span class="badge admin-badge">Admin</span>` : ''}
                    </div>
                    <div class="group-members-row">
                        <span>${this.group?.members?.length || 1}</span>
                        <span>${this.group?.members?.length === 1 ? 'member' : 'members'}</span>
                    </div>
                </div>
                <chevron-left-icon class="arrow-icon"></chevron-left-icon>

            </a>
        `;
    }
}

customElements.define('group-list-display-item', GroupItemComponent);
