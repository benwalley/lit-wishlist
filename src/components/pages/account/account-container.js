import {LitElement, html, css} from 'lit';

import './avatar.js';
import './account-username.js';
import './account-public-description.js';
import './account-qa.js';
import './account-notifications.js';
import './account-navigation.js';
import './account-private-notes.js';
import './account-comments.js';
import './account-lists.js';
import './account-secondary-lists.js';
import './logout-button.js'

// TODO: Add logout link
export class AccountContainer extends LitElement {
    static styles = css`
        .account-container {
            display: grid;
            grid-template-columns: 400px 1fr;
            gap: var(--spacing-normal);
            padding: var(--spacing-normal) 0;
        }

        .username-section {
            display: flex;
            flex-direction: column;
            border: none;
        }
        
        section {
            border: 1px solid #ccc;
            padding: 1rem;
            border-radius: 4px;
        }
    `;

    render() {
        return html`
            <main class="account-container">
                <section class="username-section">
                    <custom-avatar size="150" username="Ben"></custom-avatar>
                    <account-username></account-username>
                    <account-public-description></account-public-description>
                </section>
                
                <section>
                    <logout-button></logout-button>
                </section>

                <section>
                    <account-qa></account-qa>
                </section>

                <section>
                    <account-notifications></account-notifications>
                </section>

                <section>
                    <account-navigation></account-navigation>
                </section>

                <section>
                    <account-private-notes></account-private-notes>
                </section>

                <section>
                    <account-comments></account-comments>
                </section>

                <section>
                    <account-lists></account-lists>
                </section>

                <section>
                    <account-secondary-lists></account-secondary-lists>
                </section>
            </main>
        `;
    }
}

customElements.define('account-container', AccountContainer);

