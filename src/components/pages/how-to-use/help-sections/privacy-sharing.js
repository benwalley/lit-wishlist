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
                <h2 class="section-title">Public vs Private</h2>
                <div class="help-content">
                    <p>Understanding the difference between public and private visibility is essential for controlling who can see your content:</p>
                    
                    <div class="privacy-level">
                        <div class="level-title">🌍 Public</div>
                        <div class="level-description">Public means that a user, list, or item can be accessed by someone who is <strong>not logged in</strong>. For lists or items, anyone in a group with you will also see that list or item.</div>
                    </div>
                    
                    <div class="privacy-level">
                        <div class="level-title">🔒 Private</div>
                        <div class="level-description">Private means that:</div>
                        <ul class="help-list" style="margin-top: var(--spacing-x-small);">
                            <li><strong>Your user profile</strong> is only visible to users in a group with you</li>
                            <li><strong>Your lists</strong> are only visible to groups or users you've shared them with</li>
                            <li><strong>Your items</strong> are only visible to groups/users the list is shared with (if visibility is set to match list) OR groups/users the item is specifically shared with (if visibility is set manually)</li>
                        </ul>
                    </div>
                    
                    <p><strong>Key Point:</strong> Public content can be seen by anyone on the internet, even people without accounts. Private content requires specific sharing permissions.</p>
                </div>
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
                        <li>By default, anyone who can see the list, can see an item.</li>
                        <li>Individual items can override the list's default privacy level</li>
                        <li>Useful for keeping some items more private than others</li>
                    </ul>
                    
                    <p>For example, you might have a public birthday list but keep expensive items private to share only with close family.</p>
                </div>
            </div>
        `;
    }
}

customElements.define('privacy-sharing-help', PrivacySharingHelp);
