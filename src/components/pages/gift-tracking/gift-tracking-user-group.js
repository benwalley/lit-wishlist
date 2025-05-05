import {LitElement, html, css} from 'lit';
import './gift-tracking-row.js';

export class GiftTrackingUserGroup extends LitElement {
    static properties = {
        group: {type: Object},
        expanded: {type: Boolean, reflect: true},
    };

    constructor() {
        super();
        this.group = {
            userName: '',
            userId: '',
            items: []
        };
        this.expanded = true;
    }

    toggleExpand() {
        this.expanded = !this.expanded;
    }

    static get styles() {
        return [
            css`
                :host {
                    display: block;
                    margin-bottom: var(--spacing-small);
                }
                
                .user-group {
                    background-color: var(--color-background-secondary);
                    border-radius: var(--border-radius-normal);
                    overflow: hidden;
                }
                
                .group-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: var(--spacing-small) var(--spacing-normal);
                    background-color: var(--color-background-tertiary);
                    cursor: pointer;
                    user-select: none;
                }
                
                .user-name {
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-small);
                }
                
                .item-count {
                    font-size: 0.9em;
                    color: var(--color-text-secondary);
                    border-radius: 99px;
                    background-color: var(--color-background-secondary);
                    padding: 2px 8px;
                }
                
                .chevron {
                    transition: transform 0.2s ease;
                    width: 16px;
                    height: 16px;
                }
                
                .chevron.expanded {
                    transform: rotate(180deg);
                }
                
                .items-container {
                    overflow: hidden;
                    transition: max-height 0.3s ease;
                    max-height: 0;
                }
                
                .items-container.expanded {
                    max-height: 5000px; /* Large enough to fit all potential items */
                }
                
                .compact-rows-container {
                    display: grid;
                    gap: 1px;
                    background-color: var(--color-border);
                }
            `
        ];
    }

    render() {
        if (!this.group || !this.group.items || this.group.items.length === 0) {
            return html``;
        }
        
        return html`
            <div class="user-group">
                <div class="group-header" @click=${this.toggleExpand}>
                    <div class="user-name">
                        ${this.group.userName}
                        <span class="item-count">${this.group.items.length}</span>
                    </div>
                    <svg 
                        class="chevron ${this.expanded ? 'expanded' : ''}" 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24"
                    >
                        <path 
                            fill="currentColor" 
                            d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"
                        />
                    </svg>
                </div>
                <div class="items-container ${this.expanded ? 'expanded' : ''}">
                    <div class="compact-rows-container">
                        ${this.group.items.map(item => html`
                            <gift-tracking-row .item=${item} compact></gift-tracking-row>
                        `)}
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('gift-tracking-user-group', GiftTrackingUserGroup);