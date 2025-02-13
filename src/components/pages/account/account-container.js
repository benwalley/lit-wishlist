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
import '../../global/image-upload/image-uploader.js'
import '../../global/custom-image.js'
import '../../lists/my-lists.js'

// TODO: Add logout link
export class AccountContainer extends LitElement {
    static styles = css`
        .account-container {
            display: grid;
            gap: var(--spacing-normal);
            padding: var(--spacing-normal) 0;
        }

        @media (min-width: 768px) {
            .account-container {
                grid-template-columns: 400px 1fr;
            }
        }

        .username-section {
            display: flex;
            flex-direction: column;
            border: none;
        }
        
        section {
            padding: 1rem;
            box-shadow: var(--shadow-1-soft);
            border-radius: var(--border-radius-large);
            background: var(--background-light);
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
                    <image-uploader size="200"></image-uploader>
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
                    <my-lists></my-lists>
                </section>

                <section>
                    <account-secondary-lists></account-secondary-lists>
                </section>
            </main>
        `;
    }
}

customElements.define('account-container', AccountContainer);

