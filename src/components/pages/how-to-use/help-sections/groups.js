import { LitElement, html, css } from 'lit';

export class GroupsHelp extends LitElement {
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
        `;
    }

    render() {
        return html`
            <div class="help-section">
                <h2 class="section-title">What Are Groups?</h2>
                <div class="help-content">
                    <p>Groups make it easy to share your lists with multiple people at once. Instead of adding individual users to every list, you can create groups for different contexts:</p>
                    <ul class="help-list">
                        <li><strong>Family Group:</strong> Parents, siblings, grandparents</li>
                        <li><strong>Close Friends:</strong> Your inner circle of friends</li>
                        <li><strong>Work Team:</strong> Colleagues for office gift exchanges</li>
                        <li><strong>College Friends:</strong> Friends from school</li>
                    </ul>
                </div>
            </div>

            <div class="help-section">
                <h2 class="section-title">Creating a Group</h2>
                <div class="help-content">
                    <p>To create a new group:</p>
                    <ul class="help-list">
                        <li>Go to <a href="/groups" class="help-link">Groups</a> in the sidebar</li>
                        <li>Click "New Group"</li>
                        <li>Choose a name for your group</li>
                        <li>Add a description explaining the group's purpose (optional)</li>
                        <li>Upload a group image (optional but helpful)</li>
                    </ul>
                </div>
            </div>

            <div class="help-section">
                <h2 class="section-title">Inviting People to Your Group</h2>
                <div class="help-content">
                    <p>Once you've created a group, you can invite others to join:</p>
                    <ul class="help-list">
                        <li>Open your group from the <a href="/groups" class="help-link">Groups</a> page</li>
                        <li>Click "Invite User"</li>
                        <li>Enter one or more email addresses separated by commas.</li>
                        <li>If they don't have an account yet, they'll receive an email inviting them to create an account.</li>
                    </ul>
                </div>
            </div>

            <div class="tip-box">
                <div class="tip-title">👥 Group Management Tip</div>
                <p>As the group creator, you're automatically the administrator. You can manage members, manage admin privileges, update group settings, and remove members if necessary.</p>
            </div>

            <div class="help-section">
                <h2 class="section-title">Joining Existing Groups</h2>
                <div class="help-content">
                    <p>You can also join groups created by others:</p>
                    <ul class="help-list">
                        <li>Check your notifications for group invitations</li>
                        <li>Ask friends to invite you to their groups</li>
                        <li>Accept invitations to become an active member</li>
                    </ul>
                </div>
            </div>

            <div class="help-section">
                <h2 class="section-title">Sharing Lists with Groups</h2>
                <div class="help-content">
                    <p>The real power of groups comes when sharing your lists:</p>
                    <ul class="help-list">
                        <li>When creating or editing a list, go to the sharing settings</li>
                        <li>Select "Share with Groups" instead of individual users</li>
                        <li>Choose which groups should have access to your list</li>
                        <li>All current and future group members will automatically see your list</li>
                    </ul>
                    
                    <p>This is especially useful for:</p>
                    <ul class="help-list">
                        <li>Birthday wishlists shared with family</li>
                        <li>Holiday lists shared with your friend group</li>
                    </ul>
                </div>
            </div>

            <div class="help-section">
                <h2 class="section-title">Managing Your Group Membership</h2>
                <div class="help-content">
                    <p>As a group member, you can:</p>
                    <ul class="help-list">
                        <li>View all lists shared with the group</li>
                        <li>See other group members' public information</li>
                        <li>Leave the group at any time</li>
                    </ul>
                    
                    <p>Group administrators can additionally:</p>
                    <ul class="help-list">
                        <li>Invite new members</li>
                        <li>Remove inactive or problematic members</li>
                        <li>Update group settings description, and image</li>
                        <li>Delete the group if needed</li>
                    </ul>
                </div>
            </div>
        `;
    }
}

customElements.define('groups-help', GroupsHelp);
