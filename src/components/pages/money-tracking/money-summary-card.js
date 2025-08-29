import {LitElement, html, css} from 'lit';
import '../account/avatar.js';
import {getUserImageIdByUserId, getUsernameById} from "../../../helpers/generalHelpers.js";

export class MoneySummaryCard extends LitElement {
    static properties = {
        netAmount: {type: Object}
    };

    constructor() {
        super();
        this.netAmount = {};
    }

    static styles = css`
        :host {
            display: block;
        }

        .summary-item {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            background: var(--background-light);
            margin-bottom: 0.5rem;
            transition: background-color 0.2s ease;
        }

        .summary-item:hover {
            background: var(--green-light);
        }

        .from-user {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            min-width: 150px;
        }

        .owes-text {
            font-weight: 500;
            margin-left: auto;
        }

        .to-user {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            min-width: 150px;
        }

        .amount {
            font-size: 1.1rem;
            font-weight: 600;
            color: var(--primary-color);
            margin-left: auto;
        }

        .username {
            font-weight: 500;
            color: var(--text-color-dark);
        }
    `;

    formatAmount(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    owedFromImageId() {
        if(this.netAmount.owedFromId) {
            return getUserImageIdByUserId(this.netAmount.owedFromId);
        }
        return 0;
    }

    owedToImageId() {
        if(this.netAmount.owedToId) {
            return getUserImageIdByUserId(this.netAmount.owedToId);
        }
        return 0;
    }

    render() {
        if (!this.netAmount) {
            return html``;
        }

        return html`
            <div class="summary-item">
                <div class="from-user">
                    <custom-avatar 
                        size="32"
                        username="${this.netAmount.owedFromName}"
                        imageId="${this.owedFromImageId()}"
                    ></custom-avatar>
                    <span class="username">${this.netAmount.owedFromName}</span>
                </div>
                
                <div class="owes-text">owes</div>
                
                <div class="to-user">
                    <custom-avatar 
                        size="32"
                        username="${this.netAmount.owedToName}"
                        imageId="${this.owedToImageId()}"
                    ></custom-avatar>
                    <span class="username">${this.netAmount.owedToName}</span>
                </div>
                
                <div class="amount">${this.formatAmount(this.netAmount.netAmount)}</div>
            </div>
        `;
    }
}

customElements.define('money-summary-card', MoneySummaryCard);
