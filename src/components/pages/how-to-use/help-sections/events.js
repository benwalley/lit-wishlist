import { LitElement, html, css } from 'lit';

export class EventsHelp extends LitElement {
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
                <h2 class="section-title">What Are Events?</h2>
                <div class="help-content">
                    <p>Events are special occasions where gift-giving happens. They help coordinate group gift-giving and ensure everyone knows about upcoming celebrations:</p>
                    <ul class="help-list">
                        <li><strong>Birthdays:</strong> Personal birthday celebrations</li>
                        <li><strong>Holidays:</strong> Christmas, Hanukkah, Valentine's Day</li>
                        <li><strong>Special Occasions:</strong> Weddings, graduations, baby showers</li>
                        <li><strong>Anniversaries:</strong> Work anniversaries, relationship milestones</li>
                        <li><strong>Group Celebrations:</strong> Office parties, family reunions</li>
                    </ul>
                </div>
            </div>

            <div class="help-section">
                <h2 class="section-title">Creating an Event</h2>
                <div class="help-content">
                    <p>To create a new event:</p>
                    <ul class="help-list">
                        <li>Go to <a href="/events" class="help-link">Events</a> in the sidebar</li>
                        <li>Click "Create New Event"</li>
                        <li>Choose a descriptive title (e.g., "Sarah's Birthday 2024")</li>
                        <li>Set the event date and time</li>
                        <li>Add a description with event details</li>
                        <li>Choose who the event is celebrating (the honoree)</li>
                        <li>Invite attendees who might want to give gifts</li>
                    </ul>
                </div>
            </div>

            <div class="tip-box">
                <div class="tip-title">📅 Planning Tip</div>
                <p>Create events well in advance! This gives people time to browse lists, coordinate gifts, and plan their participation. Aim for at least 2-3 weeks notice for birthdays and holidays.</p>
            </div>

            <div class="help-section">
                <h2 class="section-title">Event Types and Settings</h2>
                <div class="help-content">
                    <p>Different events have different needs:</p>
                    <ul class="help-list">
                        <li><strong>Birthday Events:</strong> Focus on one person's wishlist</li>
                        <li><strong>Holiday Events:</strong> Multiple people might have lists to share</li>
                        <li><strong>Wedding Events:</strong> Usually feature a couple's registry</li>
                        <li><strong>Group Events:</strong> Multiple honorees (like office celebrations)</li>
                    </ul>
                    
                    <p>You can customize each event with:</p>
                    <ul class="help-list">
                        <li>Privacy settings (public, private, or invite-only)</li>
                        <li>RSVP requirements</li>
                        <li>Gift coordination features</li>
                        <li>Deadline reminders</li>
                    </ul>
                </div>
            </div>

            <div class="help-section">
                <h2 class="section-title">Managing Event Attendees</h2>
                <div class="help-content">
                    <p>Once you've created an event, you can manage who participates:</p>
                    <ul class="help-list">
                        <li><strong>Send Invitations:</strong> Invite specific users to the event</li>
                        <li><strong>Manage RSVPs:</strong> Track who's planning to attend</li>
                        <li><strong>Share Lists:</strong> Make relevant wishlists visible to attendees</li>
                        <li><strong>Send Reminders:</strong> Notify people about upcoming deadlines</li>
                    </ul>
                </div>
            </div>

            <div class="help-section">
                <h2 class="section-title">Participating in Events</h2>
                <div class="help-content">
                    <p>When you're invited to an event:</p>
                    <ul class="help-list">
                        <li>You'll receive a notification about the invitation</li>
                        <li>RSVP to let the organizer know you'll participate</li>
                        <li>View the honoree's wishlist(s) for gift ideas</li>
                        <li>Use the gift tracking features to coordinate with others</li>
                        <li>Mark items as "getting" to avoid duplicate gifts</li>
                    </ul>
                </div>
            </div>

            <div class="help-section">
                <h2 class="section-title">Event Timeline and Reminders</h2>
                <div class="help-content">
                    <p>Events work best with good timing:</p>
                    <ul class="help-list">
                        <li><strong>3-4 weeks before:</strong> Create and send invitations</li>
                        <li><strong>2 weeks before:</strong> Send reminder to RSVP</li>
                        <li><strong>1 week before:</strong> Final reminder about gift coordination</li>
                        <li><strong>Day of event:</strong> Enjoy the celebration!</li>
                    </ul>
                </div>
            </div>

            <div class="tip-box">
                <div class="tip-title">🎉 Success Secret</div>
                <p>The best events combine wishlist sharing with social coordination. Don't just focus on the gifts - use the event to bring people together and celebrate the honoree!</p>
            </div>

            <div class="help-section">
                <h2 class="section-title">Recurring Events</h2>
                <div class="help-content">
                    <p>For events that happen annually:</p>
                    <ul class="help-list">
                        <li>Consider creating template events for birthdays</li>
                        <li>Copy previous year's events as a starting point</li>
                        <li>Update dates and refresh invitation lists</li>
                        <li>Keep historical events for reference</li>
                    </ul>
                </div>
            </div>

            <div class="help-section">
                <h2 class="section-title">Event Privacy and Sharing</h2>
                <div class="help-content">
                    <p>Choose the right privacy level for your event:</p>
                    <ul class="help-list">
                        <li><strong>Public Events:</strong> Open celebrations anyone can join</li>
                        <li><strong>Private Events:</strong> Close family and friends only</li>
                        <li><strong>Group Events:</strong> Limited to specific groups or organizations</li>
                    </ul>
                </div>
            </div>
        `;
    }
}

customElements.define('events-help', EventsHelp);