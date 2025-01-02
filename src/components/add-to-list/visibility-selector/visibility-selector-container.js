import {LitElement, html, css} from 'lit';
import '../../global/custom-toggle.js'
import '../../global/custom-tooltip.js'
import '../../groups/your-groups-list.js'

class VisibilitySelectorContainer extends LitElement {
    static styles = css`
        .container {
            font-family: Arial, sans-serif;
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 16px;
            max-width: 600px;
        }
        
        .public-toggle-label {
            font-weight: bold;
            font-size: var(--font-size-normal);
        }

        .section {
            margin-bottom: 16px;
        }

        .collapsible {
            cursor: pointer;
            background: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 10px;
        }

        .content {
            display: none;
            padding: 10px 10px 0 10px;
            border-top: 1px solid #ddd;
        }

        .content.active {
            display: block;
        }

        .toggle-section {
            margin-top: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        select-by-group,
        select-by-user {
            display: block;
            margin-top: 10px;
        }

        .disabled {
            opacity: 0.5;
            pointer-events: none;
        }
    `;

    static properties = {
        isPublic: {type: Boolean},
        isDetailsExpanded: {type: Boolean},
    };

    constructor() {
        super();
        this.isPublic = true;
        this.isDetailsExpanded = false;
    }

    toggleDetails() {
        this.isDetailsExpanded = !this.isDetailsExpanded;
    }

    togglePublic() {
        this.isPublic = !this.isPublic;
    }

    render() {
        return html`
            <div class="container">
                <h3>Who is this item visible to?</h3>
                <div class="section">
                    <div
                        class="collapsible"
                        @click="${this.toggleDetails}"
                    >
                        ${this.isDetailsExpanded ? 'Hide Details' : 'Show Details'}
                    </div>
                    <div
                            class="content ${this.isDetailsExpanded ? 'active' : ''}"
                    >
                        <p>You can select who can see this item in a few ways:</p>
                        <ul>
                            <li><strong>Public</strong> - Anyone who has access to the list can see the item.</li>
                            <li><strong>By Group</strong> - Select which groups have access to see this item.</li>
                            <li><strong>By User</strong> - Select which users have access to see this item.</li>
                        </ul>
                        <p>
                            If a group is selected, all of the users in that group will be able
                            to see it, even if they are not selected under "Users".
                        </p>
                        <p>You will always be able to see items you create.</p>
                    </div>
                </div>

                <div class="toggle-section">
                    <custom-toggle
                            id="is-public-toggle"
                            @change="${this.togglePublic}"
                            .checked="${this.isPublic}"
                    ></custom-toggle>
                    <label class="public-toggle-label" for="is-public-toggle">Match List</label>
                </div>

                <div class="section ${this.isPublic ? 'disabled' : ''}">
                    <h4>By Group</h4>
                    <your-groups-list></your-groups-list>
                </div>

                <div class="section ${this.isPublic ? 'disabled' : ''}">
                    <h4>By User</h4>
                    <select-by-user></select-by-user>
                </div>
            </div>
        `;
    }
}

customElements.define('visibility-selector-container', VisibilitySelectorContainer);
