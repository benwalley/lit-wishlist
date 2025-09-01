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
                </div>
            </div>

            <div class="tip-box">
                <div class="tip-title">⚡ Efficiency Tip</div>
                <p>Before using bulk actions, use the filters to narrow down to the items you want to modify. This makes selection much faster and reduces the risk of accidentally changing the wrong items.</p>
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
                        <li>Manual copy-paste from websites</li>
                    </ul>
                    
                    <p><strong>Import process:</strong></p>
                    <ul class="help-list">
                        <li>Go to the Import page</li>
                        <li>Choose your import source</li>
                        <li>Provide the wishlist URL or upload file</li>
                        <li>Review imported items before saving</li>
                        <li>Edit any items that didn't import correctly</li>
                    </ul>
                    
                    <p><strong>Exporting your data:</strong></p>
                    <ul class="help-list">
                        <li>You can export your lists to CSV format</li>
                        <li>Useful for backup or moving to other platforms</li>
                        <li>Includes all item details and metadata</li>
                    </ul>
                </div>
            </div>

            <div class="help-section">
                <h2 class="section-title">Subuser Management</h2>
                <div class="help-content">
                    <p>If you have access to <a href="/subusers" class="help-link">Subusers</a>, you can manage accounts for family members:</p>
                    
                    <p><strong>What are subusers?</strong></p>
                    <ul class="help-list">
                        <li>Additional accounts under your primary account</li>
                        <li>Perfect for children or family members</li>
                        <li>You maintain control over privacy settings</li>
                        <li>Separate wishlists but shared family access</li>
                    </ul>
                    
                    <p><strong>Managing subusers:</strong></p>
                    <ul class="help-list">
                        <li>Create subuser accounts with appropriate permissions</li>
                        <li>Set privacy defaults for each subuser</li>
                        <li>Monitor and approve sharing settings</li>
                        <li>Coordinate gift-giving within the family</li>
                    </ul>
                </div>
            </div>

            <div class="warning-box">
                <div class="warning-title">👨‍👩‍👧‍👦 Family Account Note</div>
                <p>Subuser features may not be available to all accounts. Check with the platform administrators if you need family account management capabilities.</p>
            </div>

            <div class="help-section">
                <h2 class="section-title">API and Integration</h2>
                <div class="help-content">
                    <p>For power users, there may be API access available:</p>
                    
                    <p><strong>Potential integrations:</strong></p>
                    <ul class="help-list">
                        <li>Browser extensions for easy item addition</li>
                        <li>Mobile app synchronization</li>
                        <li>Third-party service connections</li>
                        <li>Automated price tracking</li>
                    </ul>
                    
                    <p><strong>Custom solutions:</strong></p>
                    <ul class="help-list">
                        <li>If you have specific integration needs, contact support</li>
                        <li>Bulk data operations may be possible via API</li>
                        <li>Custom reporting and analytics might be available</li>
                    </ul>
                </div>
            </div>

            <div class="help-section">
                <h2 class="section-title">Advanced Sharing and Permissions</h2>
                <div class="help-content">
                    <p>Fine-tune who can see and interact with your content:</p>
                    
                    <p><strong>Granular permissions:</strong></p>
                    <ul class="help-list">
                        <li>Set different privacy levels for different lists</li>
                        <li>Give some users "edit" access to help maintain lists</li>
                        <li>Create time-limited access for special events</li>
                        <li>Restrict certain items to specific user groups</li>
                    </ul>
                    
                    <p><strong>Advanced group management:</strong></p>
                    <ul class="help-list">
                        <li>Create nested groups (groups within groups)</li>
                        <li>Set up automatic group membership rules</li>
                        <li>Schedule group access changes</li>
                        <li>Bulk manage group memberships</li>
                    </ul>
                </div>
            </div>

            <div class="help-section">
                <h2 class="section-title">Automation and Scheduling</h2>
                <div class="help-content">
                    <p>Automate repetitive tasks:</p>
                    
                    <p><strong>Recurring events:</strong></p>
                    <ul class="help-list">
                        <li>Set up annual birthday events that create automatically</li>
                        <li>Schedule holiday reminder notifications</li>
                        <li>Auto-archive old events after they're completed</li>
                    </ul>
                    
                    <p><strong>List maintenance:</strong></p>
                    <ul class="help-list">
                        <li>Schedule reminders to review and update lists</li>
                        <li>Auto-remove items that are no longer available</li>
                        <li>Set up price change notifications</li>
                    </ul>
                </div>
            </div>

            <div class="tip-box">
                <div class="tip-title">🚀 Power User Secret</div>
                <p>Combine multiple advanced features for maximum efficiency: use bulk actions to update items imported from other platforms, then organize them with advanced group sharing, and set up automation to maintain everything!</p>
            </div>

            <div class="help-section">
                <h2 class="section-title">Performance Optimization</h2>
                <div class="help-content">
                    <p>As your wishlist collection grows, optimize performance:</p>
                    
                    <ul class="help-list">
                        <li>Archive old lists instead of deleting them</li>
                        <li>Use specific search terms instead of browsing everything</li>
                        <li>Organize items with good descriptions for better searchability</li>
                        <li>Regularly clean up unused groups and inactive events</li>
                        <li>Use filters effectively in bulk operations</li>
                    </ul>
                </div>
            </div>
        `;
    }
}

customElements.define('advanced-features-help', AdvancedFeaturesHelp);