import { LitElement, html, css } from 'lit';

export class TroubleshootingHelp extends LitElement {
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

            .problem-solution {
                background: var(--background-medium);
                border: 1px solid var(--border-color);
                border-radius: var(--border-radius-normal);
                padding: var(--spacing-normal);
                margin: var(--spacing-normal) 0;
            }

            .problem-solution .problem-title {
                font-weight: 600;
                color: var(--text-color-dark);
                margin: 0 0 var(--spacing-small) 0;
                display: flex;
                align-items: center;
                gap: var(--spacing-x-small);
            }

            .problem-solution .solution {
                margin: 0;
                color: var(--text-color-medium-dark);
            }

            .contact-box {
                background: var(--blue-light);
                border: 1px solid var(--blue-normal);
                border-radius: var(--border-radius-normal);
                padding: var(--spacing-normal);
                margin: var(--spacing-normal) 0;
                text-align: center;
            }

            .contact-box .contact-title {
                font-weight: 600;
                color: var(--blue-darker);
                margin: 0 0 var(--spacing-small) 0;
            }

            .contact-box p {
                margin: 0;
                color: var(--text-color-dark);
            }

            .contact-box .email-link {
                color: var(--blue-darker);
                font-weight: 600;
                text-decoration: none;
            }

            .contact-box .email-link:hover {
                text-decoration: underline;
            }
        `;
    }

    render() {
        return html`
            <div class="help-section">
                <h2 class="section-title">Common Issues and Solutions</h2>
                <div class="help-content">
                    <p>Having trouble with the platform? Here are solutions to the most common issues:</p>
                </div>
            </div>

            <div class="problem-solution">
                <div class="problem-title">🔐 Can't log in or forgot password</div>
                <div class="solution">
                    Use the "Forgot Password" link on the login page. If you don't receive a reset email, check your spam folder. If you still can't access your account, contact support with your username or email address.
                </div>
            </div>

            <div class="problem-solution">
                <div class="problem-title">📝 Items not saving or changes disappearing</div>
                <div class="solution">
                    This usually happens due to connection issues. Make sure you have a stable internet connection, try refreshing the page, and attempt to save again. If the problem persists, try using a different browser or clearing your browser cache.
                </div>
            </div>

            <div class="problem-solution">
                <div class="problem-title">🔗 URL import not working</div>
                <div class="solution">
                    Not all websites support automatic import. Try copying the item details manually instead. Make sure the URL is publicly accessible (not behind a login). Some sites block automated access, which prevents import features from working.
                </div>
            </div>

            <div class="problem-solution">
                <div class="problem-title">👥 Can't find other users</div>
                <div class="solution">
                    Make sure you're searching for the exact username. Users might have privacy settings that hide them from search. Ask them to share their direct profile link with you, or have them invite you to a group instead.
                </div>
            </div>

            <div class="problem-solution">
                <div class="problem-title">📱 Mobile app or browser issues</div>
                <div class="solution">
                    Try refreshing the page, clearing your browser cache, or using a different browser. On mobile, make sure you're using a supported browser like Chrome, Safari, Firefox, or Edge. Older browsers might not work properly.
                </div>
            </div>

            <div class="problem-solution">
                <div class="problem-title">🔄 Lists or items not updating</div>
                <div class="solution">
                    Sometimes changes take a moment to sync. Try refreshing the page. If you're working with shared lists, make sure you have the proper permissions to make changes. Contact the list owner if you think you should have edit access.
                </div>
            </div>

            <div class="problem-solution">
                <div class="problem-title">📧 Not receiving notifications</div>
                <div class="solution">
                    Check your spam folder first. Verify your email address in your account settings. You might also have notification preferences turned off - check your settings to make sure notifications are enabled for the events you want to hear about.
                </div>
            </div>

            <div class="help-section">
                <h2 class="section-title">Browser and Device Compatibility</h2>
                <div class="help-content">
                    <p>The platform works best with modern browsers:</p>
                    
                    <p><strong>Recommended browsers:</strong></p>
                    <ul class="help-list">
                        <li>Google Chrome (latest version)</li>
                        <li>Mozilla Firefox (latest version)</li>
                        <li>Apple Safari (latest version)</li>
                        <li>Microsoft Edge (latest version)</li>
                    </ul>
                    
                    <p><strong>If you're having browser issues:</strong></p>
                    <ul class="help-list">
                        <li>Update your browser to the latest version</li>
                        <li>Clear your browser cache and cookies</li>
                        <li>Disable browser extensions that might interfere</li>
                        <li>Try using an incognito/private browsing window</li>
                    </ul>
                </div>
            </div>

            <div class="help-section">
                <h2 class="section-title">Performance Issues</h2>
                <div class="help-content">
                    <p>If the platform feels slow or unresponsive:</p>
                    
                    <ul class="help-list">
                        <li>Check your internet connection speed</li>
                        <li>Close other browser tabs or applications</li>
                        <li>Try using the platform during off-peak hours</li>
                        <li>Clear your browser cache and restart your browser</li>
                        <li>If you have many items, try using search or filters instead of browsing everything</li>
                    </ul>
                </div>
            </div>

            <div class="help-section">
                <h2 class="section-title">Privacy and Sharing Problems</h2>
                <div class="help-content">
                    <p>Common privacy-related issues:</p>
                    
                    <ul class="help-list">
                        <li><strong>Lists appearing in wrong places:</strong> Check your privacy settings and group memberships</li>
                        <li><strong>People can't see shared lists:</strong> Make sure they're added to the right groups or user lists</li>
                        <li><strong>Items missing from shared lists:</strong> Individual items might have different privacy settings than the list</li>
                        <li><strong>Unwanted access:</strong> Remove users from groups or change list privacy settings immediately</li>
                    </ul>
                </div>
            </div>

            <div class="help-section">
                <h2 class="section-title">Gift Tracking Issues</h2>
                <div class="help-content">
                    <p>Problems with proposals and gift coordination:</p>
                    
                    <ul class="help-list">
                        <li><strong>Can't join a proposal:</strong> Check if it's still active or if there are participation restrictions</li>
                        <li><strong>Payment tracking confusion:</strong> Remember that the platform only tracks commitments, not actual payments</li>
                        <li><strong>Duplicate proposals:</strong> Communicate with other proposers to merge or cancel duplicates</li>
                        <li><strong>Proposal disappeared:</strong> The organizer might have cancelled it, or the item might have been removed from the list</li>
                    </ul>
                </div>
            </div>

            <div class="help-section">
                <h2 class="section-title">Account and Data Issues</h2>
                <div class="help-content">
                    <p>Problems with your account or data:</p>
                    
                    <ul class="help-list">
                        <li><strong>Missing lists or items:</strong> Check if they were accidentally made private or deleted</li>
                        <li><strong>Can't delete account:</strong> Contact support for account deletion assistance</li>
                        <li><strong>Want to export data:</strong> Use the export features or contact support for help</li>
                        <li><strong>Account appears hacked:</strong> Change your password immediately and contact support</li>
                    </ul>
                </div>
            </div>

            <div class="help-section">
                <h2 class="section-title">Getting Help</h2>
                <div class="help-content">
                    <p>If you can't find a solution here:</p>
                    
                    <ul class="help-list">
                        <li>Check the <a href="/qa" class="help-link">Questions & Answers</a> section for community solutions</li>
                        <li>Ask other users in your groups for help</li>
                        <li>Contact support with specific details about your problem</li>
                        <li>Include your username, browser type, and steps to reproduce the issue</li>
                    </ul>
                </div>
            </div>

            <div class="contact-box">
                <div class="contact-title">Need More Help?</div>
                <p>If you're still having trouble, don't hesitate to reach out:</p>
                <p><a href="mailto:benwalleyorigami@gmail.com" class="email-link">benwalleyorigami@gmail.com</a></p>
                <p>Include details about what you were trying to do, what happened instead, and what browser you're using.</p>
            </div>

            <div class="help-section">
                <h2 class="section-title">Reporting Bugs</h2>
                <div class="help-content">
                    <p>Help improve the platform by reporting bugs:</p>
                    
                    <ul class="help-list">
                        <li>Describe what you expected to happen vs. what actually happened</li>
                        <li>Include step-by-step instructions to reproduce the problem</li>
                        <li>Mention your browser, device type, and operating system</li>
                        <li>Take screenshots if they help illustrate the problem</li>
                        <li>Include your username (but never your password)</li>
                    </ul>
                </div>
            </div>
        `;
    }
}

customElements.define('troubleshooting-help', TroubleshootingHelp);