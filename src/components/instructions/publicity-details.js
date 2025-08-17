import {LitElement, html, css} from 'lit';

export class PublicityDetails extends LitElement {
    static properties = {};

    static styles = css`
        :host {
            display: block;
        }
        
        .modal-header {
            position: sticky;
            top: 0;
            z-index: 10;
            background-color: var(--background-dark);
            border-bottom: 1px solid var(--border-color);
        }
        
        .modal-title {
            padding: var(--spacing-normal);
            margin: 0;
            text-align: center;
            font-size: var(--font-size-large);
            color: var(--primary-color);
        }
        
        .content {
            padding: var(--spacing-normal);
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
    `;

    render() {
        return html`
            <div class="modal-header">
                <h2 class="modal-title">Publicity Settings</h2>
            </div>
            
            <div class="content">
                <div class="section">
                    <p><strong>Public Lists</strong> can be viewed by anyone with the link. They appear in search results and can be shared freely.</p>
                    <ul>
                        <li>Visible to all users</li>
                        <li>Searchable by others</li>
                        <li>Can be shared with groups</li>
                        <li>Great for gift registries and public wishlists</li>
                    </ul>
                </div>
                
                <div class="section">
                    <p><strong>Private Lists</strong> are only visible to you and people you specifically share them with.</p>
                    <ul>
                        <li>Only visible to you by default</li>
                        <li>Not searchable by others</li>
                        <li>You control who can see them</li>
                        <li>Perfect for personal planning and private wishlists</li>
                    </ul>
                </div>
                
                <div class="highlight">
                    <p><strong>Tip:</strong> You can change a list's publicity setting at any time from the list settings page.</p>
                </div>
            </div>
        `;
    }
}

customElements.define('publicity-details', PublicityDetails);