import { LitElement, html, css } from 'lit';

export class AdvancedFeaturesHelp extends LitElement {
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
                background: var(--purple-light);
                border: 1px solid var(--purple-normal);
                border-radius: var(--border-radius-normal);
                padding: var(--spacing-normal);
                margin: var(--spacing-normal) 0;
            }

            .tip-box .tip-title {
                font-weight: 600;
                color: var(--purple-darker);
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
                <h2 class="section-title">Bulk Actions</h2>
                <div class="help-content">
                    <p>When managing many items across multiple lists, <a href="/bulk-actions" class="help-link">Bulk Actions</a> can save you significant time:</p>
                    
                    <p><strong>What you can do in bulk:</strong></p>
                    <ul class="help-list">
                        <li>Update privacy settings for multiple items</li>
                        <li>Change priority levels across many items</li>
                        <li>Move items from one list to another</li>
                        <li>Delete multiple items at once</li>
                        <li>Update visibility settings</li>
                    </ul>
                    
                    <p><strong>How to use bulk actions:</strong></p>
                    <ul class="help-list">
                        <li>Go to the Bulk Actions page</li>
                        <li>Select items using the checkboxes</li>
                        <li>Choose the action you want to perform</li>
                        <li>Review and confirm your changes</li>
                    </ul>
                    
                    <p><a href="https://www.loom.com/share/1fc2f24386c94198802faf4434c479f4?sid=28449e57-3f8a-4d37-ac69-6d35355bcc0e"  class="help-link"><strong>Video Demo</strong> </a></p>
                </div>
            </div>

            <div class="help-section">
                <h2 class="section-title">Import and Export</h2>
                <div class="help-content">
                    <p>The <a href="/import" class="help-link">Import Wishlist</a> feature helps you bring existing wishlists into the platform:</p>
                    
                    <p><strong>Supported import sources:</strong></p>
                    <ul class="help-list">
                        <li>Amazon wishlists (public lists only)</li>
                        <li>CSV files with item data</li>
                        <li>Other wishlist platforms (varies)</li>
                    </ul>
                    
                    <p><strong>Import process:</strong></p>
                    <ul class="help-list">
                        <li>Go to the Import page</li>
                        <li>Choose your import source</li>
                        <li>Provide the wishlist URL or upload file</li>
                        <li>Review imported items and set name, publicity, and priority</li>
                        <li>Select the list(s) you want to add the items to</li>
                        <li>Click Import Items</li>
                    </ul>
                </div>
            </div>

            <div class="help-section">
                <h2 class="section-title">Subuser Management</h2>
                <div class="help-content">
                    <p>With the <a href="/subusers" class="help-link">Subusers</a> feature, you can manage accounts for family members:</p>
                    
                    <p><strong>What are subusers?</strong></p>
                    <ul class="help-list">
                        <li>Additional accounts under your primary account</li>
                        <li>Perfect for children or family members</li>
                        <li>Separate wishlists</li>
                        <li>You maintain control over child user's groups</li>
                        <li>Child can have their own login details, but you can also log in directly from parent account</li>
                    </ul>
                    
                    <p><a href="https://www.loom.com/share/a01290a6d0d44c798bed1c14a60b7f29?sid=c3ab52fd-6d99-4efc-9c82-b29e51d8be46"  class="help-link">
                        <strong>Video Details</strong>
                    </a></p>
                </div>
            </div>
        `;
    }
}

customElements.define('advanced-features-help', AdvancedFeaturesHelp);
