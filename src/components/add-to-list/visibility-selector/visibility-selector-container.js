import {LitElement, html, css} from 'lit';
import '../../global/custom-toggle.js'
import '../../global/custom-tooltip.js'
import '../../groups/your-groups-list.js'
import '../../users/your-users-list.js'
import buttonStyles from "../../../css/buttons.js";
import '../../../svg/chevron-down.js';
import '../../../svg/chevron-up.js';
import {observeState} from "lit-element-state";
import {userState} from "../../../state/userStore.js";

class VisibilitySelectorContainer extends observeState(LitElement) {
    static get styles() {
        return [
            buttonStyles,
            css`
                .container {
                    border-radius: var(--border-radius-normal);
                    display: grid;
                    gap: var(--spacing-normal);
                }

                h3 {
                    margin: 0 0 var(--spacing-small) 0;
                    font-size: var(--font-size-normal);
                    font-weight: 600;
                    text-align: left;
                    color: var(--text-color-dark);
                }
                
                h4 {
                    margin: var(--spacing-small) 0;
                    font-size: var(--font-size-small);
                    font-weight: 600;
                    color: var(--text-color-dark);
                    text-align: left;
                }
                
                .public-toggle-label {
                    font-weight: 500;
                    font-size: var(--font-size-normal);
                }

                .section {
                    background: var(--background-dark);
                    border-radius: var(--border-radius-normal);
                    border: 1px solid var(--border-color);
                }

                .content {
                    display: none;
                    text-align: left;
                    padding: var(--spacing-small);
                    background-color: var(--background-dark);
                    border-radius: var(--border-radius-small);
                    margin-top: var(--spacing-small);
                    font-size: var(--font-size-x-small);
                    border: 1px solid var(--border-color);
                    color: var(--text-color-dark);
                }

                .content.active {
                    display: block;
                }
                
                .content p, .content ul {
                    margin: var(--spacing-x-small) 0;
                }
                
                .content ul {
                    padding-left: var(--spacing-normal);
                }

                .toggle-section {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-small);
                }

                select-by-group,
                select-by-user {
                    display: block;
                    margin-top: var(--spacing-small);
                }

                .disabled {
                    opacity: 0.5;
                    pointer-events: none;
                }
                
                .details-toggle {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    background: none;
                    border: none;
                    color: var(--primary-color);
                    font-size: var(--font-size-x-small);
                    padding: 0;
                    cursor: pointer;
                    font-weight: 500;
                    margin-right: auto;
                }
                
                .details-toggle:hover {
                    text-decoration: underline;
                }
                
                .details-toggle chevron-down-icon,
                .details-toggle chevron-up-icon {
                    width: 12px;
                    height: 12px;
                }
                
                .select-group-list-section {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: var(--spacing-normal);
                }
                
                @media only screen and (min-width: 800px) {
                    .select-group-list-section {
                        grid-template-columns: 1fr 1fr;
                    }
                }
            `
        ];
    }


    static properties = {
        isPublic: {type: Boolean},
        isDetailsExpanded: {type: Boolean},
        users: {type: Array},
        groups: {type: Array},
        selectedGroups: {type: Array},
        selectedUsers: {type: Array},
        matchListVisibility: {type: Boolean},
    };

    constructor() {
        super();
        this.isPublic = true;
        this.isDetailsExpanded = false;
        this.users = [];
        this.groups = [];
        this.selectedGroups = [];
        this.selectedUsers = [];
        this.matchListVisibility = true;
    }

    reset() {
        this.selectedUsers = [];
        this.selectedGroups = [];
        this.matchListVisibility = true;
    }

    toggleDetails() {
        this.isDetailsExpanded = !this.isDetailsExpanded;
    }

    togglePublic() {
        this.matchListVisibility = !this.matchListVisibility;

        this.selectedGroups = [];
        this.selectedUsers = [userState.userData.id];

        this.dispatchVisibilityChangedEvent();
    }

    handleGroupSelectionChanged(e) {
        if (e && e.detail && e.detail.selectedGroups) {
            this.selectedGroups = e.detail.selectedGroups.map(group => group.id);
            this.dispatchVisibilityChangedEvent();
        }
    }

    handleUserSelectionChanged(e) {
        if (e && e.detail && e.detail.selectedUsers) {
            this.selectedUsers = e.detail.selectedUsers.map(user => user.id);
            this.dispatchVisibilityChangedEvent();
        }
    }

    dispatchVisibilityChangedEvent() {
        // When matchListVisibility is true, groups and users are disabled
        const isPublic = this.matchListVisibility ? this.isPublic : false;

        this.dispatchEvent(new CustomEvent('visibility-changed', {
            detail: {
                isPublic,
                selectedGroups: this.selectedGroups,
                selectedUsers: this.selectedUsers,
                matchListVisibility: this.matchListVisibility
            },
            bubbles: true,
            composed: true
        }));
    }

    render() {
        return html`
            <div class="container">
                <div>                
                    <h3>Who is this item visible to?</h3>
                    <button type="button"
                            class="details-toggle"
                            @click="${this.toggleDetails}"
                    >
                        ${this.isDetailsExpanded ? 'Hide details' : 'Show details'}
                        ${this.isDetailsExpanded
                                ? html`<chevron-up-icon></chevron-up-icon>`
                                : html`<chevron-down-icon></chevron-down-icon>`
                        }
                    </button>
                    <div class="content ${this.isDetailsExpanded ? 'active' : ''}">
                        <p>You can select who can see this item in a few ways:</p>
                        <ul>
                            <li><strong>Match List</strong> - Use the same visibility settings as the list itself.</li>
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
                            .checked="${this.matchListVisibility}"
                    ></custom-toggle>
                    <label class="public-toggle-label" for="is-public-toggle">Match List</label>
                </div>

                <div class="select-group-list-section">
                    <div class="section ${this.matchListVisibility ? 'disabled' : ''}">
                        <your-groups-list
                            .selectedGroups="${this.selectedGroups}"
                            @selection-changed="${this.handleGroupSelectionChanged}"
                        ></your-groups-list>
                    </div>

                    <div class="section ${this.matchListVisibility ? 'disabled' : ''}">
                        <your-users-list
                                class="full-width"
                                apiEndpoint="/users/accessible"
                                .selectedUserIds="${this.selectedUsers}"
                                @selection-changed="${this.handleUserSelectionChanged}"
                                requireCurrentUser
                        ></your-users-list>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('visibility-selector-container', VisibilitySelectorContainer);
