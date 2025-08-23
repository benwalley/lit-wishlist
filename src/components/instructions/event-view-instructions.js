import {LitElement, html, css} from 'lit';
import modalSections from '../../css/modal-sections.js';

export class EventViewInstructions extends LitElement {
    static properties = {
        eventName: {type: String}
    };

    constructor() {
        super();
        this.eventName = '';
    }

    static styles = [
        modalSections,
        css`
            :host {
                display: block;
            }
            
            .content p {
                margin: 0 0 var(--spacing-normal) 0;
                line-height: 1.6;
            }
            
            .content ul {
                margin: 0 0 var(--spacing-normal) 0;
                padding-left: var(--spacing-normal);
            }
            
            .content li {
                margin-bottom: var(--spacing-small);
                line-height: 1.6;
            }
            
            .highlight {
                background-color: var(--purple-light);
                padding: var(--spacing-small);
                border-radius: var(--border-radius-small);
                border-left: 3px solid var(--primary-color);
                margin-top: var(--spacing-normal);
            }
            
            .highlight p {
                margin: 0;
            }
        `
    ];

    render() {
        return html`
            <div class="modal-header">
                <h2>Event Gift Tracking</h2>
            </div>
            
            <div class="modal-content">
                <div class="content">
                    <p>Event gift tracking helps you manage all the gifts you're giving for an event such as Christmas or a birthday. You can:</p>
                    <ul>
                        <li>Track gift status (purchased, wrapped, given, etc.)</li>
                        <li>Record how much you spent on each gift</li>
                        <li>Add private notes for each recipient</li>
                        <li>See accepted <a href="/proposals">proposals</a> you're participating in</li>
                        <li>View gifts you want to contribute to but haven't marked as <strong>gotten</strong></li>
                        <li>Create proposals for gifts you want others to help purchase</li>
                        <li>Remove <strong>gotten</strong> or <strong>go in on</strong> statuses as needed</li>
                    </ul>
                    
                    <div class="highlight">
                        <p><strong>💡 Note:</strong> Deleting items and updating notes save immediately, but other changes require clicking <strong>Save Changes</strong> to apply.</p>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('event-view-instructions', EventViewInstructions);
