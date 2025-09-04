import { LitElement, html, css } from 'lit';
import { observeState } from 'lit-element-state';
import { deleteSubuser } from '../../../helpers/api/subusers.js';
import { messagesState } from '../../../state/messagesStore.js';
import { triggerUpdateUser } from '../../../events/eventListeners.js';
import { showConfirmation } from '../../global/custom-confirm/confirm-helper.js';
import buttonStyles from '../../../css/buttons.js';
import '../../../svg/user.js';
import '../../../svg/delete.js';
import '../../../svg/gear.js';
import '../../../svg/link.js';
import '../../../svg/world.js';
import '../../../svg/lock.js';
import {getGroupImageIdByGroupId} from "../../../helpers/userHelpers.js";

class SubUserDisplayItem extends observeState(LitElement) {
    static get properties() {
        return {
            userData: { type: Object },
            editModal: { type: Object },
            deleting: { type: Boolean }
        };
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    display: block;
                }

                .subuser-card {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-small);
                    background: var(--background-dark);
                    border: 1px solid var(--border-color);
                    border-radius: var(--border-radius-normal);
                    padding: var(--spacing-small);
                    transition: var(--transition-normal);
                    position: relative;
                    background: var(--background-light);
                }

                .subuser-main-content {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-small);
                }

                .subuser-info {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    min-width: 0;
                }

                .subuser-username {
                    font-size: var(--font-size-medium);
                    font-weight: bold;
                    color: var(--text-color-dark);
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    margin: 0;
                    
                    a {
                        color: inherit;
                        text-decoration: none;
                        
                        &:hover {
                            text-decoration: underline;
                        }
                    }
                }

                .username-row {
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                }

                .publicity-indicator {
                    border-radius: var(--border-radius-normal);
                    font-size: var(--font-size-normal);
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    gap: 2px;
                    flex-shrink: 0;
                    
                    span {
                        color: var(--medium-text-color);
                        font-size: var(--font-size-small);
                    }
                }

                .public-indicator {
                    color: var(--primary-color);
                }

                .private-indicator {
                    color: var(--text-color-medium-dark);
                }

                .subuser-badge {
                    background: var(--primary-light);
                    color: var(--primary-color);
                    padding: 3px 0;
                    border-radius: var(--border-radius-normal);
                    font-size: var(--font-size-x-x-x-small);
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    line-height: 1;
                }

                .group-chips {
                    display: flex;
                    flex-wrap: wrap;
                    gap: var(--spacing-x-small);
                }

                .group-chip {
                    background: var(--blue-light);
                    border: 1px solid var(--border-color);
                    color: var(--blue-darker);
                    text-decoration: none;
                    padding: 0px 7px 0px 2px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 3px;
                    border-radius: 12px;
                    font-size: var(--font-size-x-small);
                    font-weight: 500;
                    white-space: nowrap;
                    transition: var(--transition-200);
                    
                    &:hover {
                        background: var(--background-dark);
                    }
                }

                .subuser-actions {
                    display: flex;
                    gap: var(--spacing-x-small);
                    align-items: center;
                }


            `
        ];
    }

    constructor() {
        super();
        this.userData = {};
        this.editModal = null;
        this.deleting = false;
    }

    async handleDelete() {
        const confirmed = await this._confirmDeletion();
        if (!confirmed) return;

        this.deleting = true;

        const response = await deleteSubuser(this.userData.id);

        if (response.success) {
            messagesState.addMessage('Subuser deleted successfully', 'success');
            triggerUpdateUser();
        } else {
            messagesState.addMessage(response.error || 'Failed to delete subuser', 'error');
        }

        this.deleting = false;
    }

    async _confirmDeletion() {
        return await showConfirmation({
            message: `Are you sure you want to delete "${this.userData.name}"?`,
            submessage: 'This action cannot be undone. All of their lists and items will be permanently deleted.',
            heading: 'Delete Subuser?',
            confirmLabel: 'Delete',
            cancelLabel: 'Cancel'
        });
    }

    handleView() {
        window.location.href = `/user/${this.userData.id}`;
    }

    handleManage() {
        if (this.editModal && this.userData) {
            this.editModal.open(this.userData);
        } else {
            console.error('Edit modal not available or missing subuser data');
        }
    }

    render() {
        if (!this.userData?.id) {
            return html``;
        }

        return html`
            <div class="subuser-card">
                <div class="subuser-main-content">
                    <custom-avatar
                        size="40"
                        round
                        username="${this.userData.name}"
                        imageId="${this.userData.image}"
                        shadow
                    ></custom-avatar>
                    
                    <div class="subuser-info">
                        <div class="username-row">
                            <h3 class="subuser-username"><a href="/user/${this.userData.id}">${this.userData.name}</a></h3>
                            ${this.userData.isPublic ? html`
                                <div class="publicity-indicator public-indicator">
                                    <world-icon></world-icon>
                                    <span>Public</span>

                                </div>
                                <custom-tooltip>This subuser's public details will be visible to non-logged in users</custom-tooltip>
                            ` : html`
                                <div class="publicity-indicator private-indicator">
                                    <lock-icon></lock-icon>
                                    <span>Private</span>
                                </div>
                                <custom-tooltip>This subuser's public details will not be visible to non-logged in users</custom-tooltip>
                            `}
                        </div>
                    </div>
                    
                    <div class="subuser-actions">
                        <button 
                            class="icon-button blue-text large"
                            @click="${this.handleManage}"
                            ?disabled="${this.deleting}"
                            aria-label="Manage groups"
                        >
                            <gear-icon></gear-icon>
                        </button>
                        <button 
                            class="icon-button blue-text large"
                            @click="${this.handleView}"
                            ?disabled="${this.deleting}"
                            aria-label="View profile"
                        >
                            <link-icon></link-icon>
                        </button>
                        <button 
                            class="icon-button danger-text large"
                            @click="${this.handleDelete}"
                            ?disabled="${this.deleting}"
                            aria-label="${this.deleting ? 'Deleting...' : 'Delete subuser'}"
                        >
                            <delete-icon></delete-icon>
                        </button>
                    </div>
                </div>

                <div class="group-chips">
                    ${this.userData.groups?.length ? 
                        this.userData.groups.map(group => html`
                            <a href="/group/${group.id}" class="group-chip">
                                <custom-avatar 
                                        username="${group.groupName}"
                                        imageId="${getGroupImageIdByGroupId(group.id)}"
                                        round
                                        shadow
                                        size="16"
                                ></custom-avatar>
                                ${group.groupName}
                            </a>
                        `) : 
                        html`<span class="group-chip">No groups</span>`
                    }
                </div>
            </div>
        `;
    }
}

customElements.define('sub-user-display-item', SubUserDisplayItem);
