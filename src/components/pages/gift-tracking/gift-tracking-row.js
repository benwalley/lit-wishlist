import {LitElement, html, css} from 'lit';
import {currencyHelper} from "../../../helpers.js";
import '../../../svg/arrow-long.js';
import '../../global/custom-image.js';

export class GiftTrackingRow extends LitElement {
    static properties = {
        item: {type: Object},
        compact: {type: Boolean, reflect: true},
    };

    static get styles() {
        return [
            css`
                :host {
                    display: contents;
                }
                
                .table-row {
                    display: grid;
                    grid-template-columns: 60px 2fr 1fr 1fr 1fr 60px;
                    gap: var(--spacing-small);
                    padding: var(--spacing-normal);
                    align-items: center;
                    transition: background-color 0.2s ease;
                    background-color: var(--color-background-secondary);
                }
                
                .table-row:hover {
                    background-color: var(--color-background-hover);
                }
                
                :host([compact]) .table-row {
                    grid-template-columns: 40px 2fr 80px 80px 40px;
                    padding: var(--spacing-small);
                    gap: var(--spacing-xs);
                }
                
                .item-image {
                    width: 60px;
                    height: 60px;
                    border-radius: var(--border-radius-normal);
                    object-fit: cover;
                }
                
                :host([compact]) .item-image {
                    width: 40px;
                    height: 40px;
                }
                
                .item-details {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-small);
                }
                
                :host([compact]) .item-details {
                    gap: var(--spacing-xs);
                }
                
                .item-name {
                    font-weight: bold;
                }
                
                :host([compact]) .item-name {
                    font-size: 0.9em;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                
                .list-name {
                    font-size: 0.9em;
                    color: var(--color-text-secondary);
                }
                
                :host([compact]) .list-name {
                    font-size: 0.8em;
                }
                
                .status-badge {
                    display: inline-block;
                    padding: 4px 8px;
                    border-radius: var(--border-radius-normal);
                    font-size: 0.8em;
                    font-weight: bold;
                    text-align: center;
                }
                
                :host([compact]) .status-badge {
                    padding: 2px 4px;
                    font-size: 0.7em;
                }
                
                .getting {
                    background-color: var(--color-success-light);
                    color: var(--color-success);
                }
                
                .contributing {
                    background-color: var(--color-primary-light);
                    color: var(--color-primary);
                }
                
                .status-badge:not(.contributing):not(.getting) {
                    background-color: var(--color-background-tertiary);
                    color: var(--color-text-secondary);
                }
                
                .view-link {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                
                .price-display {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                
                @media (max-width: 768px) {
                    .table-row {
                        grid-template-columns: 40px 3fr 1fr 40px;
                    }
                    
                    :host([compact]) .table-row {
                        grid-template-columns: 40px 3fr 70px 30px;
                    }
                    
                    .list-cell, 
                    .amount-cell {
                        display: none;
                    }
                }
            `
        ];
    }

    render() {
        if (!this.item) return html``;
        
        const contributor = this.item.contributors && this.item.contributors.length > 0 ? this.item.contributors[0] : {};
        const imageId = this.item.imageIds && this.item.imageIds.length > 0 ? this.item.imageIds[0] : null;
        const listId = this.item.lists && this.item.lists.length > 0 ? this.item.lists[0] : '';
        
        return html`
            <div class="table-row">
                <div>
                    <custom-image 
                        class="item-image" 
                        image-id="${imageId}" 
                        alt="${this.item.name}"
                    ></custom-image>
                </div>
                <div class="item-details">
                    <div class="item-name">${this.item.name}</div>
                    <div class="list-name">${listId ? `List #${listId}` : ''}</div>
                </div>
                <div class="list-cell">${listId ? `List #${listId}` : ''}</div>
                <div>
                    ${contributor.contributing ? html`
                        <span class="status-badge contributing">Contributing</span>
                    ` : contributor.getting ? html`
                        <span class="status-badge getting">Getting</span>
                    ` : html`
                        <span class="status-badge">${this.item.trackingType || 'Tracking'}</span>
                    `}
                </div>
                <div class="amount-cell price-display">
                    ${contributor.contributing && contributor.contributeAmount ? html`
                        ${currencyHelper(contributor.contributeAmount)}
                    ` : contributor.getting && contributor.numberGetting ? html`
                        Qty: ${contributor.numberGetting}
                    ` : ''}
                </div>
                <div class="view-link">
                    <a href="/list/${listId}/item/${this.item.id}" aria-label="View item details">
                        <svg-arrow-long></svg-arrow-long>
                    </a>
                </div>
            </div>
        `;
    }
}

customElements.define('gift-tracking-row', GiftTrackingRow);