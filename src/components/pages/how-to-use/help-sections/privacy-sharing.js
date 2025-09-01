import { LitElement, html, css } from 'lit';

export class PrivacySharingHelp extends LitElement {
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

            .privacy-level {
                background: var(--background-medium);
                border: 1px solid var(--border-color);
                border-radius: var(--border-radius-normal);
                padding: var(--spacing-normal);
                margin: var(--spacing-small) 0;
            }

            .privacy-level .level-title {
                font-weight: 600;
                color: var(--text-color-dark);
                margin: 0 0 var(--spacing-x-small) 0;
            }

            .privacy-level .level-description {
                font-size: var(--font-size-small);
                margin: 0;
                color: var(--text-color-medium-dark);
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
        `;
    }

    render() {
        return html`
            <div class="help-section">
                <h2 class="section-title">Understanding Privacy Levels</h2>
                <div class="help-content">
                    <p>Your privacy is important. The platform offers several levels of privacy control for your lists and items:</p>
                    
                    <div class="privacy-level">
                        <div class="level-title">🌍 Public</div>
                        <div class="level-description">Anyone can find and view your lists, even without an account. Great for wedding registries or general wishlists you want to share widely.</div>
                    </div>
                    
                    <div class="privacy-level">
                        <div class="level-title">👥 Shared with Groups/Users</div>
                        <div class="level-description">Only specific people or groups you choose can see your lists. Perfect for family wishlists or close friend groups.</div>
                    </div>
                    
                    <div class="privacy-level">
                        <div class="level-title">🔒 Private</div>
                        <div class="level-description">Only you can see your lists. Useful for personal planning or draft lists you're not ready to share yet.</div>
                    </div>
                </div>
            </div>

            <div class="warning-box">
                <div class="warning-title">🚨 Important Privacy Note</div>
                <p>Once you make something public, search engines might index it and it could be visible to anyone on the internet. Be careful about including personal information like addresses, phone numbers, or financial details.</p>
            </div>

            <div class="help-section">
                <h2 class="section-title">List-Level vs Item-Level Privacy</h2>
                <div class="help-content">
                    <p>You have two levels of privacy control:</p>
                    
                    <p><strong>List Privacy:</strong></p>
                    <ul class="help-list">
                        <li>Determines who can see that the list exists</li>
                        <li>Controls who can browse the list of items</li>
                        <li>Set when creating or editing a list</li>
                    </ul>
                    
                    <p><strong>Item Privacy:</strong></p>
                    <ul class="help-list">
                        <li>Individual items can have different privacy settings</li>
                        <li>Can override the list's default privacy level</li>
                        <li>Useful for keeping some items more private than others</li>
                    </ul>
                    
                    <p>For example, you might have a public birthday list but keep expensive items private to share only with close family.</p>
                </div>
            </div>

            <div class="help-section">
                <h2 class="section-title">Managing Who Sees What</h2>
                <div class="help-content">
                    <p>Here's how to control access to your content:</p>
                    
                    <p><strong>For Lists:</strong></p>
                    <ul class="help-list">
                        <li>Edit any list and go to the "Privacy & Sharing" section</li>
                        <li>Choose between Public, Private, or Shared</li>
                        <li>If sharing, select specific users or groups</li>
                        <li>Save your changes</li>
                    </ul>
                    
                    <p><strong>For Items:</strong></p>
                    <ul class="help-list">
                        <li>Edit individual items to set their privacy</li>
                        <li>Choose "Match List Privacy" or set a custom level</li>
                        <li>Use <a href="/bulk-actions" class="help-link">Bulk Actions</a> to change many items at once</li>
                    </ul>
                </div>
            </div>

            <div class="help-section">
                <h2 class="section-title">Group Sharing Best Practices</h2>
                <div class="help-content">
                    <p>When sharing with groups, consider these practices:</p>
                    
                    <ul class="help-list">
                        <li><strong>Family Groups:</strong> Great for birthday and holiday lists</li>
                        <li><strong>Friend Groups:</strong> Perfect for casual gift exchanges</li>
                        <li><strong>Work Groups:</strong> Suitable for office celebrations</li>
                        <li><strong>Special Event Groups:</strong> Ideal for weddings, graduations, etc.</li>
                    </ul>
                    
                    <p>Remember that when you share with a group, all current and future group members will see your list.</p>
                </div>
            </div>

            <div class="tip-box">
                <div class="tip-title">🎯 Sharing Strategy</div>
                <p>Start conservative with your privacy settings. You can always make things more public later, but it's harder to make something private again once it's been widely shared.</p>
            </div>

            <div class="help-section">
                <h2 class="section-title">What Information Is Visible</h2>
                <div class="help-content">
                    <p>Depending on privacy settings, others might see:</p>
                    
                    <p><strong>Always Visible (to people with access):</strong></p>
                    <ul class="help-list">
                        <li>List name and description</li>
                        <li>Item names and descriptions</li>
                        <li>Item prices and store links</li>
                        <li>Your username and profile picture</li>
                    </ul>
                    
                    <p><strong>Never Visible to Others:</strong></p>
                    <ul class="help-list">
                        <li>Your email address</li>
                        <li>Your password</li>
                        <li>Private lists you haven't shared</li>
                        <li>Personal notes marked as private</li>
                    </ul>
                    
                    <p><strong>Visible Only to List/Group Members:</strong></p>
                    <ul class="help-list">
                        <li>Gift tracking and proposal information</li>
                        <li>Who's planning to get what</li>
                        <li>Comments and coordination notes</li>
                    </ul>
                </div>
            </div>

            <div class="help-section">
                <h2 class="section-title">Children and Family Accounts</h2>
                <div class="help-content">
                    <p>Special considerations for family sharing:</p>
                    
                    <ul class="help-list">
                        <li>Set up subuser accounts for children with appropriate privacy defaults</li>
                        <li>Review children's lists before making them public</li>
                        <li>Educate family members about what information to include</li>
                        <li>Use family groups to keep sharing within the family</li>
                        <li>Regularly review and update privacy settings</li>
                    </ul>
                </div>
            </div>

            <div class="help-section">
                <h2 class="section-title">Troubleshooting Privacy Issues</h2>
                <div class="help-content">
                    <p>If you have privacy concerns:</p>
                    
                    <ul class="help-list">
                        <li><strong>Someone sees content they shouldn't:</strong> Check your sharing settings and group memberships</li>
                        <li><strong>Content appears in search engines:</strong> It may take time for search engines to update after privacy changes</li>
                        <li><strong>Group members see private items:</strong> Individual item privacy overrides list privacy</li>
                        <li><strong>Lost control of sharing:</strong> Remove users from groups or change list privacy immediately</li>
                    </ul>
                </div>
            </div>

            <div class="warning-box">
                <div class="warning-title">⚠️ Privacy Recovery</div>
                <p>If you accidentally made something public that should be private, change the privacy setting immediately. However, remember that people may have already seen or saved the information.</p>
            </div>

            <div class="help-section">
                <h2 class="section-title">Account Security</h2>
                <div class="help-content">
                    <p>Protect your account with good security practices:</p>
                    
                    <ul class="help-list">
                        <li>Use a strong, unique password</li>
                        <li>Don't share your account credentials</li>
                        <li>Log out from shared or public computers</li>
                        <li>Review your account activity regularly</li>
                        <li>Contact support if you notice suspicious activity</li>
                    </ul>
                </div>
            </div>

            <div class="tip-box">
                <div class="tip-title">🔐 Security Reminder</div>
                <p>Your privacy settings are only as strong as your account security. Keep your login credentials safe and review your sharing settings periodically to make sure they still match your preferences.</p>
            </div>
        `;
    }
}

customElements.define('privacy-sharing-help', PrivacySharingHelp);