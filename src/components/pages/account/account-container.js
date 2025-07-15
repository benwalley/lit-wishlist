import {LitElement, html, css} from 'lit';

import './avatar.js';
import './account-public-description.js';
import './account-qa.js';
import './account-notifications.js';
import './account-navigation.js';
import './account-private-notes.js';
import './account-comments.js';
import './user-details.js';
import './account-lists.js';
import './logout-button.js'
import './invited-groups.js'
import '../../global/image-upload/image-uploader.js'
import '../../global/custom-image.js'
import '../../lists/my-lists.js'
import '../../lists/edit-list-modal.js'
import './my-groups-list.js'
import '../../../svg/edit.js'
import buttonStyles from '../../../css/buttons.js'
import '../../users/edit-user-form.js';
import {userState} from "../../../state/userStore.js";
import {observeState} from "lit-element-state";
import {isCurrentUserSubuser} from "../../../helpers/generalHelpers.js";
export class AccountContainer extends observeState(LitElement) {
    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    
                }
                .account-container {
                    display: grid;
                    gap: var(--spacing-normal);
                    padding: var(--spacing-normal);
                    max-width: 1200px;
                }

                @media (min-width: 768px) {
                    .account-container {
                        grid-template-columns: 400px 1fr;
                    }
                }

                section {
                    padding: 1rem;
                    box-shadow: var(--shadow-1-soft);
                    border-radius: var(--border-radius-large);
                    background: var(--background-light);
                    position: relative;
                }

                
            `
        ];
    }


    render() {
        return html`
            <main class="account-container">
                <section>
                    <user-details></user-details>
                </section>

                <section>
                    <account-qa></account-qa>
                </section>

                ${!isCurrentUserSubuser() ? html`<section>
                    <invited-groups></invited-groups>
                </section>` : ''}

                <section>
                    <my-groups-list></my-groups-list>
                </section>

                <section>
                    <account-notifications></account-notifications>
                </section>

                <section>
                    <my-lists></my-lists>
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
            </main>
        `;
    }
}

customElements.define('account-container', AccountContainer);

