import {LitElement, html, css} from 'lit';

export class ProposalDetails extends LitElement {
    static properties = {};

    static styles = css`
        :host {
            display: block;
        }
        
        .modal-header {
            position: sticky;
            top: 0;
            z-index: 10;
            background-color: var(--background-dark);
            border-bottom: 1px solid var(--border-color);
        }
        
        .modal-title {
            padding: var(--spacing-normal);
            margin: 0;
            text-align: center;
            font-size: var(--font-size-large);
            color: var(--primary-color);
        }
        
        .content {
            padding: var(--spacing-normal);
        }
        
        .content p {
            margin: 0 0 var(--spacing-normal) 0;
            line-height: 1.6;
        }
        
        .content ul {
            margin: 0 0 var(--spacing-normal) 0;
            padding-left: var(--spacing-normal);
        }
        
        .content li {
            margin-bottom: var(--spacing-small);
            line-height: 1.6;
        }
        
        .section {
            margin-bottom: var(--spacing-large);
        }
        
        .highlight {
            background-color: var(--purple-light);
            padding: var(--spacing-small);
            border-radius: var(--border-radius-small);
            border-left: 3px solid var(--primary-color);
        }
        
        .step-number {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
            background-color: var(--primary-color);
            color: white;
            border-radius: 50%;
            font-weight: bold;
            font-size: var(--font-size-small);
            margin-right: var(--spacing-small);
        }
        
        .step {
            display: flex;
            align-items: flex-start;
            margin-bottom: var(--spacing-normal);
        }
        
        .step-content {
            flex: 1;
        }
        
        .example {
            background-color: var(--background-light);
            padding: var(--spacing-small);
            border-radius: var(--border-radius-small);
            border: 1px solid var(--border-color);
            margin: var(--spacing-small) 0;
            font-style: italic;
        }
    `;

    render() {
        return html`
            <div class="modal-header">
                <h2 class="modal-title">How Group Purchase Proposals Work</h2>
            </div>
            
            <div class="content">
                <div class="section">
                    <p><strong>Group Purchase Proposals</strong> let you coordinate with friends and family to split the cost of expensive gifts together.</p>
                </div>
                
                <div class="section">
                    <h3>How it works:</h3>
                    
                    <div class="step">
                        <div class="step-number">1</div>
                        <div class="step-content">
                            <strong>Create a Proposal</strong>
                            <p>Choose a wishlist item and invite people to contribute. Set how much each person should pay.</p>
                            <div class="example">
                                Example: A $200 tablet split between 4 people = $50 each
                            </div>
                        </div>
                    </div>
                    
                    <div class="step">
                        <div class="step-number">2</div>
                        <div class="step-content">
                            <strong>Invite Contributors</strong>
                            <p>Select friends and family members who might want to chip in. They'll receive notifications about the proposal.</p>
                        </div>
                    </div>
                    
                    <div class="step">
                        <div class="step-number">3</div>
                        <div class="step-content">
                            <strong>Contributors Respond</strong>
                            <p>Invited people can accept or decline the proposal. They'll see the item details and their contribution amount.</p>
                        </div>
                    </div>

                    <div class="step">
                        <div class="step-number">4</div>
                        <div class="step-content">
                            <strong>Accept Proposal</strong>
                            <p>If the proposal is accepted by everyone, it will be marked as <strong>gotten</strong> by each of them.</p>
                        </div>
                    </div>
                    
                    <div class="step">
                        <div class="step-number">5</div>
                        <div class="step-content">
                            <strong>Coordinate Purchase</strong>
                            <p>One person will be designated as the buyer and they will purchase the gift. </p>
                        </div>
                    </div>

                    <div class="highlight">
                        <strong>💡 Tip:</strong> All proposal participants will see the gift tracking status that the <strong>buyer</strong> updates in <a href="/events">events</a>.
                    </div>
                </div>
                
                
            </div>
        `;
    }
}

customElements.define('proposal-details', ProposalDetails);
