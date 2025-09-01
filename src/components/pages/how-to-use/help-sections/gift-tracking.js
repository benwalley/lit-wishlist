import { LitElement, html, css } from 'lit';

export class GiftTrackingHelp extends LitElement {
    static get styles() {
        return css`
            :host {
                display: block;
            }

            .help-section {
                margin-bottom: var(--spacing-large);
            }

            .help-section:last-child {
                margin-bottom: 0;
            }

            .section-title {
                font-size: var(--font-size-medium);
                font-weight: 600;
                color: var(--text-color-dark);
                margin: 0 0 var(--spacing-normal) 0;
                border-bottom: 2px solid var(--purple-light);
                padding-bottom: var(--spacing-small);
            }

            .help-content {
                line-height: 1.6;
                color: var(--text-color-medium-dark);
            }

            .help-content p {
                margin: 0 0 var(--spacing-normal) 0;
            }

            .help-content p:last-child {
                margin-bottom: 0;
            }

            .help-list {
                list-style: none;
                padding: 0;
                margin: var(--spacing-normal) 0;
            }

            .help-list li {
                padding: var(--spacing-x-small) 0;
                padding-left: var(--spacing-normal);
                position: relative;
            }

            .help-list li::before {
                content: "•";
                color: var(--primary-color);
                font-weight: bold;
                position: absolute;
                left: 0;
            }

            .help-link {
                color: var(--primary-color);
                text-decoration: none;
                font-weight: 500;
            }

            .help-link:hover {
                text-decoration: underline;
            }

            .tip-box {
                background: var(--blue-light);
                border: 1px solid var(--blue-normal);
                border-radius: var(--border-radius-normal);
                padding: var(--spacing-normal);
                margin: var(--spacing-normal) 0;
            }

            .tip-box .tip-title {
                font-weight: 600;
                color: var(--blue-darker);
                margin: 0 0 var(--spacing-small) 0;
                display: flex;
                align-items: center;
                gap: var(--spacing-x-small);
            }

            .tip-box p {
                margin: 0;
                color: var(--text-color-dark);
            }

            .warning-box {
                background: var(--delete-red-light);
                border: 1px solid var(--delete-red);
                border-radius: var(--border-radius-normal);
                padding: var(--spacing-normal);
                margin: var(--spacing-normal) 0;
            }

            .warning-box .warning-title {
                font-weight: 600;
                color: var(--delete-red-darker);
                margin: 0 0 var(--spacing-small) 0;
                display: flex;
                align-items: center;
                gap: var(--spacing-x-small);
            }

            .warning-box p {
                margin: 0;
                color: var(--text-color-dark);
            }
        `;
    }

    render() {
        return html`
            <div class="help-section">
                <h2 class="section-title">What is Gift Tracking?</h2>
                <div class="help-content">
                    <p>Gift tracking helps coordinate group gift-giving to avoid duplicates and enable collaborative purchasing. It's perfect for:</p>
                    <ul class="help-list">
                        <li>Making sure expensive items get fully funded</li>
                        <li>Avoiding duplicate gifts for popular items</li>
                        <li>Organizing group contributions for big purchases</li>
                        <li>Tracking who's responsible for what</li>
                        <li>Managing gift-giving within families and friend groups</li>
                    </ul>
                </div>
            </div>

            <div class="help-section">
                <h2 class="section-title">The Proposal System</h2>
                <div class="help-content">
                    <p>When someone wants to get an item from a wishlist, they create a "proposal":</p>
                    <ul class="help-list">
                        <li>Find an item you want to help purchase</li>
                        <li>Click "Propose to Get This" or similar button</li>
                        <li>Specify how much you're willing to contribute</li>
                        <li>Add a note about your contribution (optional)</li>
                        <li>Submit the proposal</li>
                    </ul>
                    
                    <p>This creates a tracking entry that others can see and join.</p>
                </div>
            </div>

            <div class="tip-box">
                <div class="tip-title">💡 Coordination Tip</div>
                <p>Be the first to propose expensive items you want to help fund! This shows others your commitment and often encourages more people to join in.</p>
            </div>

            <div class="help-section">
                <h2 class="section-title">Joining Existing Proposals</h2>
                <div class="help-content">
                    <p>When you see a proposal that needs more funding:</p>
                    <ul class="help-list">
                        <li>Go to <a href="/proposals" class="help-link">Proposals</a> to see all active proposals</li>
                        <li>Find items that need additional contributors</li>
                        <li>Click "Join This Proposal" or "Contribute"</li>
                        <li>Specify your contribution amount</li>
                        <li>Add any coordination notes</li>
                    </ul>
                    
                    <p>The system tracks total contributions and shows when items are fully funded.</p>
                </div>
            </div>

            <div class="help-section">
                <h2 class="section-title">Proposal Status Tracking</h2>
                <div class="help-content">
                    <p>Proposals go through several stages:</p>
                    <ul class="help-list">
                        <li><strong>Active:</strong> Still accepting contributions</li>
                        <li><strong>Fully Funded:</strong> Enough money has been pledged</li>
                        <li><strong>Purchased:</strong> Someone has bought the item</li>
                        <li><strong>Delivered:</strong> The gift has been given</li>
                        <li><strong>Cancelled:</strong> The proposal was withdrawn</li>
                    </ul>
                </div>
            </div>

            <div class="help-section">
                <h2 class="section-title">Money Tracking</h2>
                <div class="help-content">
                    <p>The platform helps track financial contributions:</p>
                    <ul class="help-list">
                        <li>See how much each person has committed</li>
                        <li>Track who has paid and who still owes</li>
                        <li>Get reminders about pending contributions</li>
                        <li>Coordinate reimbursement for the purchaser</li>
                        <li>Keep records for tax or expense purposes</li>
                    </ul>
                    
                    <p>Visit <a href="/money-tracking" class="help-link">Money Tracking</a> to manage your financial commitments.</p>
                </div>
            </div>

            <div class="warning-box">
                <div class="warning-title">💰 Payment Note</div>
                <p>The platform tracks commitments and coordination, but doesn't process actual payments. You'll need to handle money transfers through your preferred payment method (Venmo, PayPal, cash, etc.).</p>
            </div>

            <div class="help-section">
                <h2 class="section-title">Best Practices for Group Gifts</h2>
                <div class="help-content">
                    <p>Make group gift-giving smooth and successful:</p>
                    <ul class="help-list">
                        <li><strong>Communicate early:</strong> Propose expensive items well before the event</li>
                        <li><strong>Be realistic:</strong> Don't over-commit on contributions</li>
                        <li><strong>Designate a purchaser:</strong> One person should handle the actual buying</li>
                        <li><strong>Track payments:</strong> Keep records of who has paid</li>
                        <li><strong>Plan delivery:</strong> Coordinate who will give the gift</li>
                        <li><strong>Send thank you notes:</strong> Acknowledge all contributors</li>
                    </ul>
                </div>
            </div>

            <div class="help-section">
                <h2 class="section-title">Managing Your Contributions</h2>
                <div class="help-content">
                    <p>Keep track of your gift-giving commitments:</p>
                    <ul class="help-list">
                        <li>Review your active proposals regularly</li>
                        <li>Update payment status when you've contributed</li>
                        <li>Communicate with other contributors about coordination</li>
                        <li>Mark items as delivered once gifts are given</li>
                        <li>Keep records of your annual gift spending</li>
                    </ul>
                </div>
            </div>

            <div class="tip-box">
                <div class="tip-title">🤝 Collaboration Success</div>
                <p>The best group gifts happen when everyone communicates openly. Don't be shy about discussing budgets, timing, and responsibilities - clear coordination leads to better gifts and happier experiences!</p>
            </div>

            <div class="help-section">
                <h2 class="section-title">Troubleshooting Common Issues</h2>
                <div class="help-content">
                    <p>If you encounter problems with gift tracking:</p>
                    <ul class="help-list">
                        <li><strong>Duplicate proposals:</strong> Coordinate with other proposers to merge efforts</li>
                        <li><strong>Changed minds:</strong> Contact the list owner if items are no longer wanted</li>
                        <li><strong>Payment issues:</strong> Work directly with contributors to resolve money matters</li>
                        <li><strong>Coordination problems:</strong> Use the proposal comments to communicate</li>
                    </ul>
                </div>
            </div>
        `;
    }
}

customElements.define('gift-tracking-help', GiftTrackingHelp);