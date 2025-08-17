import {LitElement, html, css} from 'lit';
import modalSections from '../../css/modal-sections.js';

export class EventInstructions extends LitElement {
    static properties = {};

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
            
            .section {
                margin-bottom: var(--spacing-large);
            }
            
            .highlight {
                background-color: var(--purple-light);
                padding: var(--spacing-small);
                border-radius: var(--border-radius-small);
                border-left: 3px solid var(--primary-color);
            }
            
            .example {
                background-color: var(--background-dark);
                padding: var(--spacing-small);
                border-radius: var(--border-radius-small);
                border: 1px solid var(--border-color);
                font-style: italic;
            }
        `
    ];

    render() {
        return html`
            <div class="modal-header">
                <h2>About Events</h2>
            </div>
            
            <div class="modal-content">
                <div class="content">
                    <div class="section">
                        <p><strong>Events</strong> help you organize gift-giving occasions with specific people and due dates.</p>
                        <ul>
                            <li>Perfect for birthdays, holidays, anniversaries, and special occasions</li>
                            <li>Track what gifts you need to buy and for whom</li>
                            <li>Set due dates to stay organized and never miss an occasion</li>
                            <li>Share events with family members or gift-giving partners</li>
                        </ul>
                    </div>
                    
                    <div class="section">
                        <p><strong>How Events Work:</strong></p>
                        <ul>
                            <li><strong>Create an Event:</strong> Give it a name and set a due date</li>
                            <li><strong>Add Participants:</strong> Select who you'll be buying gifts for</li>
                            <li><strong>Track Progress:</strong> See which participants still need gifts</li>
                            <li><strong>Stay Organized:</strong> View all upcoming events in one place</li>
                        </ul>
                    </div>
                    
                    <div class="section">
                        <div class="example">
                            <p><strong>Example:</strong> "Mom's Birthday - December 15th" with participants: Mom</p>
                            <p><strong>Example:</strong> "Christmas 2024" with participants: Mom, Dad, Sister, Brother</p>
                        </div>
                    </div>
                    
                    <div class="highlight">
                        <p><strong>Pro Tip:</strong> Use events to plan ahead for recurring occasions like birthdays and holidays. You can create events well in advance to give yourself time to find the perfect gifts!</p>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('event-instructions', EventInstructions);