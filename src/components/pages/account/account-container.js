import {LitElement, html, css} from 'lit';

import './avatar.js';
import './account-public-description.js';
import './account-qa.js';
import './account-notifications.js';
import './account-private-notes.js';
import './user-details.js';
import './account-lists.js';
import './logout-button.js'
import './invited-groups.js'
import '../../global/image-upload/image-uploader.js'
import '../../global/custom-image.js'
import '../../lists/user-lists.js'
import '../../lists/edit-list-modal.js'
import './my-groups-list.js'
import './my-subusers.js'
import '../../../svg/edit.js'
import buttonStyles from '../../../css/buttons.js'
import '../../users/edit-user-form.js';
import {observeState} from "lit-element-state";
import {isCurrentUserSubuser} from "../../../helpers/generalHelpers.js";
import {groupInvitationsState} from "../../../state/groupInvitationsStore.js";

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
                    padding: var(--spacing-normal-variable);
                    max-width: 1200px;
                    padding-bottom: 100px;
                }

                @media (min-width: 900px) {
                    .account-container {
                        grid-template-columns: 1fr 1fr;
                    }
                }

                section {
                    padding: var(--spacing-normal-variable);
                    box-shadow: var(--shadow-2-soft);
                    border-radius: var(--border-radius-large);
                    background: var(--background-light);
                    position: relative;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    
                    
                    &.no-padding {
                        padding: 0;
                    }
                }
                
                .view-page-link {
                    display: block;
                    text-align: center;
                    padding: var(--spacing-normal) 0 0 0;
                    font-weight: 500;
                    color: var(--purple-normal);
                    text-decoration: none;
                    margin-top: auto;
                    
                    &:hover {
                        text-decoration: underline;
                        color: var(--purple-darker);
                    }
                }

                
            `
        ];
    }


    render() {
        return html`
            <main class="account-container">
                <section class="no-padding">
                    <user-details></user-details>
                </section>

                <section>
                    <account-qa></account-qa>
                </section>

                ${!isCurrentUserSubuser() && groupInvitationsState.invitations && groupInvitationsState.invitations.length > 0 ? html`<section>
                    <invited-groups></invited-groups>
                </section>` : ''}

                <section>
                    <my-groups-list></my-groups-list>
                    <a href="/groups" class="view-page-link">Groups page</a>
                </section>

                ${!isCurrentUserSubuser() ? html`<section>
                    <my-subusers></my-subusers>
                    <a href="/subusers" class="view-page-link">Subusers page</a>

                </section>` : ''}

                <section>
                    <user-lists></user-lists>
                    <a href="/my-lists" class="view-page-link">My lists</a>

                </section>

                <section>
                    <account-private-notes></account-private-notes>
                </section>
            </main>
        `;
    }
}

customElements.define('account-container', AccountContainer);

