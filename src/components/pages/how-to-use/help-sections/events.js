import { LitElement, html, css } from 'lit';
import eventDemoImage from '../../../../assets/event-demo.jpg';

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

            .demo-image {
                width: 100%;
                max-width: 800px;
                height: auto;
                border-radius: var(--border-radius-normal);
                box-shadow: var(--shadow-1-soft);
                margin: var(--spacing-normal) 0;
                display: block;
            }
        `;
    }

    render() {
        return html`
            <div class="help-section">
                <h2 class="section-title">What Are Events?</h2>
                <div class="help-content">
                    <p>Events are an easy way to track what you've gotten for an event (such as a birthday or Christmas) as well as who you still need to get a gift for</p>
                </div>
            </div>

            <div class="help-section">
                <h2 class="section-title">Creating an Event</h2>
                <div class="help-content">
                    <p>To create a new event:</p>
                    <ul class="help-list">
                        <li>Go to <a href="/events" class="help-link">Events</a> in the sidebar</li>
                        <li>Click "Create Event"</li>
                        <li>Choose a descriptive title (e.g., "Sarah's Birthday 2024", "Christmas 2024")</li>
                        <li>Set the event date if you want</li>
                        <li>Select everyone who you will be getting gifts for (you can edit this later)</li>
                    </ul>
                </div>
            </div>

            <div class="help-section">
                <h2 class="section-title">How Events Work</h2>
                <div class="help-content">
                    <p>Events are designed for <strong>personal gift tracking</strong> - they help you organize and track your gift-giving for special occasions. Once you create an event, you'll see a personalized overview showing:</p>
                    
                    <ul class="help-list">
                        <li><strong>List of People:</strong> Everyone you want to get gifts for in this event</li>
                        <li><strong>Their Gifts:</strong> All the items you've marked as "gotten" or "go in on" from their wishlists</li>
                        <li><strong>Gift Status Tracking:</strong> Progress indicators for each gift you're handling</li>
                        <li><strong>Personal Notes:</strong> Private notes for each person to help with your planning</li>
                        <li><strong>Price:</strong> Privately keep track of how much you actually paid for each gift</li>
                    </ul>

                    <img src="${eventDemoImage}" alt="Event demo showing gift tracking interface" class="demo-image" loading="lazy">

                </div>
            </div>

            <div class="help-section">
                <h2 class="section-title">Video Demo</h2>
                <div class="help-content">
                    <p>Here is a video where I go over the event functionality:</p>
                    
                    <a href="https://www.loom.com/share/28346d4b2dee48db8b6c8549afc515dd?sid=801e4eae-7058-4970-8715-eac01c7e5e43"  class="help-link">(Link to video)</a>
                </div>
            </div>
        `;
    }
}

customElements.define('events-help', EventsHelp);
