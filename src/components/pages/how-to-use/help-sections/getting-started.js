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
                    <p>For a quick overview of getting started, you can watch <a  class="help-link" href="https://www.loom.com/share/220cdfb0302f463192d9e34bfb1fd27a?sid=1a58f102-a911-481f-a049-d36d55e5df4e">
                        <strong>this video.</strong>
                    </a></p>
                </div>
            </div>

            <div class="help-section">
                <h2 class="section-title">Account Setup</h2>
                <div class="help-content">
                    <p>Your account is the foundation of your wishlist experience. Here's what you need to know:</p>
                    <ul class="help-list">
                        <li>Your username is how others will find and identify you</li>
                        <li>You can upload a profile picture to personalize your account</li>
                        <li>You can change your password anytime in Settings</li>
                    </ul>
                </div>
            </div>

            <div class="help-section">
                <h2 class="section-title">Quick Start Steps</h2>
                <div class="help-content">
                    <p>Ready to dive in? Follow these steps to get started:</p>
                    <ul class="help-list">
                        <li>When you create an account, a default list will be created for you. You can edit the name, description, and image if you'd like.</li>
                        <li>Join or create a group to share your list with friends or family</li>
                        <li>Add some items to your list/li>
                    </ul>
                </div>
            </div>
        `;
    }
}

customElements.define('getting-started-help', GettingStartedHelp);
