import { LitElement, html, css } from 'lit';
import aiFetchImage from '../../../../assets/ai-fetch.jpg';
import shareWithAppGif from '../../../../assets/share-with-app.gif';
import installAppGif from '../../../../assets/install-app.gif';

export class AddingItemsHelp extends LitElement {
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

            .method-box {
                background: var(--background-medium);
                border: 1px solid var(--border-color);
                border-radius: var(--border-radius-normal);
                padding: var(--spacing-normal);
                margin: var(--spacing-normal) 0;
            }

            .method-box .method-title {
                font-weight: 600;
                color: var(--text-color-dark);
                margin: 0 0 var(--spacing-small) 0;
                display: flex;
                align-items: center;
                gap: var(--spacing-small);
                font-size: var(--font-size-medium);
            }

            .method-box .method-description {
                margin: 0 0 var(--spacing-small) 0;
                color: var(--text-color-medium-dark);
            }

            .tip-box {
                background: var(--green-light);
                border: 1px solid var(--green-normal);
                border-radius: var(--border-radius-normal);
                padding: var(--spacing-normal);
                margin: var(--spacing-normal) 0;
            }

            .tip-box .tip-title {
                font-weight: 600;
                color: var(--green-darker);
                margin: 0 0 var(--spacing-small) 0;
                display: flex;
                align-items: center;
                gap: var(--spacing-x-small);
            }

            .tip-box p {
                margin: 0;
                color: var(--text-color-dark);
            }

            .ai-box {
                background: var(--blue-light);
                border: 1px solid var(--blue-normal);
                border-radius: var(--border-radius-normal);
                padding: var(--spacing-normal);
                margin: var(--spacing-normal) 0;
            }

            .ai-box .ai-title {
                font-weight: 600;
                color: var(--blue-darker);
                margin: 0 0 var(--spacing-small) 0;
                display: flex;
                align-items: center;
                gap: var(--spacing-x-small);
            }

            .ai-box p {
                margin: 0 0 var(--spacing-normal) 0;
                color: var(--text-color-dark);
            }

            .ai-box p:last-child {
                margin-bottom: 0;
            }

            .demo-image {
                width: 100%;
                max-width: 500px;
                height: auto;
                border-radius: var(--border-radius-normal);
                border: 1px solid var(--border-color);
                box-shadow: var(--shadow-1-soft);
                margin: var(--spacing-normal) 0 var(--spacing-small) 0;
            }

            .image-caption {
                font-size: var(--font-size-small);
                color: var(--text-color-medium-dark);
                font-style: italic;
                text-align: center;
                margin: 0;
            }

            .steps-list {
                list-style: none;
                padding: 0;
                margin: var(--spacing-normal) 0;
                counter-reset: step-counter;
            }

            .steps-list li {
                padding: var(--spacing-x-small) 0;
                padding-left: var(--spacing-large);
                position: relative;
                counter-increment: step-counter;
            }

            .steps-list li::before {
                content: counter(step-counter);
                color: var(--primary-color);
                font-weight: bold;
                position: absolute;
                left: 0;
                top: var(--spacing-x-small);
                background: var(--primary-color);
                color: white;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: var(--font-size-x-small);
            }

            .method-with-image {
                display: flex;
                gap: var(--spacing-normal);
                align-items: flex-start;
            }

            .method-content {
                flex: 1;
            }

            .method-image {
                flex-shrink: 0;
                width: 200px;
                max-width: 200px;
            }

            .share-demo-gif {
                width: 100%;
                height: auto;
                border-radius: var(--border-radius-normal);
                border: 1px solid var(--border-color);
                box-shadow: var(--shadow-1-soft);
            }

            .gif-caption {
                font-size: var(--font-size-x-small);
                color: var(--text-color-medium-dark);
                font-style: italic;
                text-align: center;
                margin: var(--spacing-x-small) 0 0 0;
            }

            @media (max-width: 768px) {
                .method-with-image {
                    flex-direction: column;
                }

                .method-image {
                    width: 100%;
                    max-width: 300px;
                    align-self: center;
                }
            }

            .instruction-showcase {
                background: var(--background-medium);
                border: 1px solid var(--border-color);
                border-radius: var(--border-radius-normal);
                padding: var(--spacing-normal);
                margin: var(--spacing-large) 0;
            }

            .showcase-title {
                font-size: var(--font-size-medium);
                font-weight: 600;
                color: var(--text-color-dark);
                margin: 0 0 var(--spacing-normal) 0;
                text-align: center;
                border-bottom: 2px solid var(--purple-light);
                padding-bottom: var(--spacing-small);
            }

            .instruction-note {
                font-size: var(--font-size-small);
                color: var(--text-color-medium-dark);
                text-align: center;
                margin: 0 0 var(--spacing-normal) 0;
                font-style: italic;
            }

            .instructions-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: var(--spacing-large);
                margin-top: var(--spacing-normal);
            }

            .instruction-card {
                background: var(--background-light);
                border: 1px solid var(--border-color);
                border-radius: var(--border-radius-normal);
                padding: var(--spacing-normal);
                text-align: center;
            }

            .instruction-card .card-title {
                font-size: var(--font-size-normal);
                font-weight: 600;
                color: var(--text-color-dark);
                margin: 0 0 var(--spacing-normal) 0;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: var(--spacing-x-small);
            }

            .instruction-image {
                width: 100%;
                max-width: 250px;
                height: auto;
                border-radius: var(--border-radius-normal);
                border: 1px solid var(--border-color);
                box-shadow: var(--shadow-1-soft);
                margin: 0 auto var(--spacing-small) auto;
                display: block;
            }

            .instruction-description {
                font-size: var(--font-size-small);
                color: var(--text-color-medium-dark);
                line-height: 1.5;
                margin: 0;
            }

            @media (max-width: 768px) {
                .instructions-grid {
                    grid-template-columns: 1fr;
                    gap: var(--spacing-normal);
                }
                
                .instruction-image {
                    max-width: 200px;
                }
            }
        `;
    }

    render() {
        return html`
            <div class="help-section">
                <h2 class="section-title">Three Ways to Add Items</h2>
                <div class="help-content">
                    <p>There are three main ways to add items to your wishlists. Each method has its own advantages depending on what you're trying to add and where you found it.</p>
                </div>
            </div>

            <div class="method-box">
                <div class="method-title">📝 Method 1: Add Item Popup</div>
                <div class="method-description">
                    The most common way to add items is using the Add Item popup which is available on every page of the site.
                </div>
                
                <p><strong>How to use it:</strong></p>
                <ol class="steps-list">
                    <li>On any page, click the "+" button</li>
                    <li>Enter at least an item name</li>
                    <li>Select the list(s) you want to add the item to.</li>
                    <li>If you want, you can add price information, links to purchase, priority level, notes, etc</li>
                    <li>Save the item to your list</li>
                </ol>
            </div>

            <div class="ai-box">
                <div class="ai-title">🤖 AI-Powered URL Fetch</div>
                <p>When using the Add Item popup, you can paste a product URL and let AI fetch the details automatically. This feature uses artificial intelligence to extract product information, images, and pricing from most online stores.</p>
                
                <img src="${aiFetchImage}" alt="AI Fetch demonstration" class="demo-image" loading="lazy">
                <p class="image-caption">Enter the URL of a product here, and click the AI button.</p>
            </div>

            <div class="method-box">
                <div class="method-title">📋 Method 2: Import Wishlist</div>
                <div class="method-description">
                    Perfect for bringing existing wishlists from other platforms or adding multiple items at once.
                </div>
                
                <p><strong>How to use it:</strong></p>
                <ol class="steps-list">
                    <li>Go to <a href="/import" class="help-link">Import Wishlist</a> in the sidebar</li>
                    <li>Copy the URL of your wishlist (on Amazon for instance)</li>
                    <li>Make sure the wishlist is publicly visible (you can test this by opening the URL in an incognito tab and make sure you can see it)</li>
                    <li>Wait for 1 - 2 minutes for the items to be loaded.</li>
                    <li>Edit the item names, priority, and public/private status.</li>
                    <li>Select the items you want to add to your list</li>
                    <li>Choose which list to add the items to</li>
                </ol>
            </div>

            <div class="tip-box">
                <div class="tip-title">⚠️ Important Tip</div>
                <p>Make sure a list is selected when adding an item! If no list is selected, your item won't be saved. You can always change which list an item belongs to later.</p>
            </div>

            <div class="method-box">
                <div class="method-title">📱 Method 3: Share from App</div>
                <div class="method-description">
                    The fastest way to add items while browsing in mobile apps.
                </div>
                
                <div class="method-with-image">
                    <div class="method-content">
                        <p><strong>How to use it:</strong></p>
                        <ol class="steps-list">
                            <li>Ensure that the website is installed as an app on your device</li>
                            <li>Find an item you want while browsing in an app</li>
                            <li>Use your device's share button and find the wishlist app</li>
                            <li>The system will try to fetch product details automatically</li>
                            <li>Review and edit the details as needed</li>
                            <li>Choose which list to add it to and save</li>
                        </ol>
                    </div>
                </div>
            </div>

            <div class="instruction-showcase">
                <h3 class="showcase-title">📱 Mobile App Instructions</h3>
                <p class="instruction-note">Note: The exact steps may look different depending on your device type and operating system (iOS, Android, etc.).</p>
                <div class="instructions-grid">
                    <div class="instruction-card">
                        <div class="card-title">📲 Install App</div>
                        <img src="${installAppGif}" alt="Install app demonstration" class="instruction-image" loading="lazy">
                        <p class="instruction-description">
                            Learn how to install this website as an app on your mobile device for easier access and sharing capabilities.
                        </p>
                    </div>
                    <div class="instruction-card">
                        <div class="card-title">📤 Share with App</div>
                        <img src="${shareWithAppGif}" alt="Share with app demonstration" class="instruction-image" loading="lazy">
                        <p class="instruction-description">
                            Once the app is installed, you can easily share items from other apps directly to your wishlists using your device's share menu.
                        </p>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('adding-items-help', AddingItemsHelp);
