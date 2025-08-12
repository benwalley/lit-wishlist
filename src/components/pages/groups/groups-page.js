import { LitElement, html, css } from 'lit';
import { observeState } from 'lit-element-state';
import { userState } from '../../../state/userStore.js';
import { isSubuser } from '../../../helpers/generalHelpers.js';
import '../account/my-groups-list.js';
import '../account/invited-groups.js';

class GroupsPage extends observeState(LitElement) {
    static get styles() {
        return css`
            :host {
                display: block;
                padding: var(--spacing-normal);
            }

            h1 {
                margin: 0 0 24px 0;
                font-size: var(--font-size-x-large);
                color: var(--text-color-dark);
            }

            .page-description {
                color: var(--text-color-medium-dark);
                margin-bottom: 24px;
            }

            my-groups-list {
                max-height: none;
            }

            my-groups-list .groups-container {
                max-height: none;
                display: grid;
                grid-template-columns: 1fr;
                gap: 16px;
            }

            @media (min-width: 930px) {
                my-groups-list .groups-container {
                    grid-template-columns: repeat(2, 1fr);
                }
            }

            @media (min-width: 1200px) {
                my-groups-list .groups-container {
                    grid-template-columns: repeat(3, 1fr);
                }
            }

            .invitations-section {
                margin-top: 48px;
                padding-top: 24px;
                border-top: 1px solid var(--border-color);
            }
        `;
    }

    render() {
        return html`
            <my-groups-list lightTiles></my-groups-list>
            
            ${!isSubuser(userState?.userData?.id) ? html`
                <div class="invitations-section">
                    <invited-groups></invited-groups>
                </div>
            ` : ''}
        `;
    }
}

customElements.define('groups-page', GroupsPage);
