import { LitElement, html, css } from 'lit';
import proposalGif from '../../../../assets/proposal.gif';
import miniGottenImage from '../../../../assets/mini-gotten.jpg';
import largeGottenImage from '../../../../assets/large-gotten.jpg';

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

            .demo-gif {
                width: 100%;
                max-width: 800px;
                height: auto;
                border-radius: var(--border-radius-normal);
                box-shadow: var(--shadow-1-soft);
                margin: var(--spacing-normal) 0;
                display: block;
            }

            .images-container {
                display: flex;
                gap: var(--spacing-normal);
                margin: var(--spacing-normal) 0;
                flex-wrap: wrap;
                justify-content: center;
            }

            .demo-image {
                max-width: 400px;
                width: 100%;
                height: auto;
                border-radius: var(--border-radius-normal);
                box-shadow: var(--shadow-1-soft);
                flex: 1;
                min-width: 250px;
            }

            .image-caption {
                font-size: var(--font-size-small);
                color: var(--text-color-medium-dark);
                font-style: italic;
                text-align: center;
                margin: var(--spacing-x-small) 0 0 0;
            }

            @media (max-width: 768px) {
                .images-container {
                    flex-direction: column;
                    align-items: center;
                }
                
                .demo-image {
                    max-width: 100%;
                }
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
                        <li>Avoiding duplicate gifts</li>
                        <li>Organizing group contributions for big purchases</li>
                        <li>Tracking who's responsible for what</li>
                        <li>Managing gift-giving within families and friend groups</li>
                    </ul>
                </div>
            </div>

            <div class="help-section">
                <h2 class="section-title">Marking Items as Gotten or Go In On</h2>
                <div class="help-content">
                    <p>When you find an item on someone's wishlist that you want to get for them, you have two main options:</p>
                    
                    <ul class="help-list">
                        <li><strong>"Get This" (Mark as Gotten):</strong> Use this when you plan to buy the entire gift yourself</li>
                        <li><strong>"Go In On" (Contribute):</strong> Use this when you want to split the cost with others</li>
                    </ul>
                    
                    <p><strong>How to mark an item:</strong></p>
                    <ul class="help-list">
                        <li>Go to any item item or list page from someone's wishlist</li>
                        <li>Look for the buttons seen in the images below</li>
                        <li>Click "I'll Get This" if you want to buy it alone</li>
                        <li>Click "Contribute" if you want to let other people know you're interested in going in on it as a group.</li>
                    </ul>
                    
                    <div class="images-container">
                        <div>
                            <img src="${largeGottenImage}" alt="Large view showing gotten buttons on individual item page" class="demo-image" loading="lazy">
                            <p class="image-caption">Gotten buttons on item detail page</p>
                        </div>
                        <div>
                            <img src="${miniGottenImage}" alt="Small view showing gotten buttons on wishlist items" class="demo-image" loading="lazy">
                            <p class="image-caption">Gotten buttons in list view</p>
                        </div>
                    </div>
                    
                    <p>When you mark an item as "gotten" or "go in on", other people can see that someone is planning to get this gift, which helps avoid duplicate purchases.</p>
                </div>
            </div>

            <div class="help-section">
                <h2 class="section-title">The Proposal System</h2>
                <div class="help-content">
                    <p>When someone wants to get an item from a wishlist, they create a "proposal":</p>
                    <ul class="help-list">
                        <li>Find an item you want to help purchase</li>
                        <li>On the top right of the item page, click the three dots, then click "Create Proposal"</li>
                        <li>Select the people you want to go in on the gift with.</li>
                        <li>Specify who will actually buy the gift</li>
                        <li>Submit the proposal</li>
                    </ul>
                    
                    <img src="${proposalGif}" alt="Animated demonstration of creating a proposal" class="demo-gif" loading="lazy">
                    
                    <p>Each of the participants of the proposal will get a notification in the website, telling them about the proposal.</p>
                    
                    <ul class="help-list">
                        <li>Go to <a href="/proposals" class="help-link">Proposals</a> to see all active proposals</li>
                        <li>Click the X or Check to accept or reject a propsal</li>
                    </ul>

                    <p>If everyone accepts a proposal, all the participants will get marked as "getting" the gift.</p>
                    
                </div>
            </div>
        `;
    }
}

customElements.define('gift-tracking-help', GiftTrackingHelp);
