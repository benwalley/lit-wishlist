import { LitElement, html, css } from 'lit';

export class GettingStartedHelp extends LitElement {
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
        `;
    }

    render() {
        return html`
            <div class="help-section">
                <h2 class="section-title">Welcome to Your Wishlist</h2>
                <div class="help-content">
                    <p>Welcome! This guide will help you get started with creating and managing your wishlists, sharing them with friends and family, and making the most of all available features.</p>
                </div>
            </div>

            <div class="help-section">
                <h2 class="section-title">Account Setup</h2>
                <div class="help-content">
                    <p>Your account is the foundation of your wishlist experience. Here's what you need to know:</p>
                    <ul class="help-list">
                        <li>Your username is how others will find and identify you</li>
                        <li>You can upload a profile picture to personalize your account</li>
                        <li>Your email is used for notifications and account recovery</li>
                        <li>You can change your password anytime in Settings</li>
                    </ul>
                </div>
            </div>

            <div class="help-section">
                <h2 class="section-title">Navigation Basics</h2>
                <div class="help-content">
                    <p>The sidebar on the left is your main navigation tool:</p>
                    <ul class="help-list">
                        <li><strong>Dashboard:</strong> Your personal overview and quick actions</li>
                        <li><strong>All Lists:</strong> Browse all lists you have access to</li>
                        <li><strong>My Lists:</strong> Lists you've created</li>
                        <li><strong>Groups:</strong> Manage and join user groups</li>
                        <li><strong>Events:</strong> Create and manage gift-giving events</li>
                        <li><strong>Users:</strong> Find and connect with other users</li>
                    </ul>
                </div>
            </div>

            <div class="help-section">
                <h2 class="section-title">Quick Start Steps</h2>
                <div class="help-content">
                    <p>Ready to dive in? Follow these steps to get started:</p>
                    <ul class="help-list">
                        <li>Create your first list by going to <a href="/my-lists" class="help-link">My Lists</a></li>
                        <li>Add some items to your list with descriptions and links</li>
                        <li>Set up your privacy preferences for who can see your lists</li>
                        <li>Invite friends by finding them in <a href="/users" class="help-link">All Users</a></li>
                        <li>Join or create groups for easier sharing</li>
                    </ul>
                </div>
            </div>

            <div class="tip-box">
                <div class="tip-title">💡 Pro Tip</div>
                <p>Start by creating a "Birthday Wishlist" or "Holiday Wishlist" - these are great first lists that you can share with family and friends throughout the year!</p>
            </div>

            <div class="help-section">
                <h2 class="section-title">Need Help?</h2>
                <div class="help-content">
                    <p>If you get stuck or have questions:</p>
                    <ul class="help-list">
                        <li>Check the other sections in this help guide</li>
                        <li>Visit <a href="/qa" class="help-link">Questions & Answers</a> to see common questions</li>
                        <li>Contact support at benwalleyorigami@gmail.com</li>
                    </ul>
                </div>
            </div>
        `;
    }
}

customElements.define('getting-started-help', GettingStartedHelp);