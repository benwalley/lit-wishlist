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
                    align-items: center;
                    gap: var(--spacing-small);
                    background: var(--background-dark);
                    border: 1px solid var(--border-color);
                    border-radius: var(--border-radius-normal);
                    padding: var(--spacing-small);
                    transition: var(--transition-normal);
                    position: relative;
                    background: var(--background-light);
                }

                .subuser-card:hover {
                    box-shadow: var(--shadow-1-soft);
                    border-color: var(--primary-color);
                }

                .subuser-info {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    min-width: 0;
                }

                .subuser-username {
                    font-size: var(--font-size-medium);
                    font-weight: bold;
                    color: var(--text-color-dark);
                    margin: 0 0 2px 0;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
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
                <custom-avatar
                    size="40"
                    username="${this.userData.name}"
                    imageId="${this.userData.image}"
                    shadow
                ></custom-avatar>
                
                <div class="subuser-info">
                    <h3 class="subuser-username">${this.userData.name}</h3>
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
        `;
    }
}

customElements.define('sub-user-display-item', SubUserDisplayItem);
