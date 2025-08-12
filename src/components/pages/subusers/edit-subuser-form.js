import { LitElement, html, css } from 'lit';
import { observeState } from 'lit-element-state';
import { updateSubuser } from '../../../helpers/api/subusers.js';
import { messagesState } from '../../../state/messagesStore.js';
import { triggerUpdateUser } from '../../../events/eventListeners.js';
import '../../groups/your-groups-list.js';
import '../../global/custom-toggle.js';
import '../../../svg/world.js';
import '../../../svg/lock.js';
import buttonStyles from '../../../css/buttons.js';

class EditSubuserForm extends observeState(LitElement) {
    static get properties() {
        return {
            subuserData: { type: Object },
            selectedGroups: { type: Array },
            originalGroupIds: { type: Array },
            isPublic: { type: Boolean },
            loading: { type: Boolean }
        };
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    display: block;
                    padding: 24px;
                }
                
                your-groups-list {
                    border: 1px solid var(--border-color);
                    border-radius: var(--border-radius-normal);
                    background: var(--background-dark);
                }

                .form-header {
                    margin-bottom: 24px;
                }

                .form-title {
                    font-size: var(--font-size-x-large);
                    font-weight: 600;
                    color: var(--text-color-dark);
                    margin: 0 0 8px 0;
                }

                .form-description {
                    color: var(--text-color-medium-dark);
                    font-size: var(--font-size-medium);
                }

                .form-grid {
                    display: grid;
                    gap: 20px;
                    margin-bottom: 32px;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .form-label {
                    font-weight: 600;
                    color: var(--text-color-dark);
                    font-size: var(--font-size-medium);
                }

                .form-actions {
                    display: flex;
                    gap: 12px;
                    justify-content: flex-end;
                }
                
                .warning-message {
                    background: var(--delete-red-light);
                    border: 1px solid var(--delete-red);
                    padding: var(--spacing-small);
                    margin: var(--spacing-normal);
                    color: var(--delete-red-darker);
                    font-size: var(--font-size-small);
                    line-height: 1.4;
                }
                
                .warning-message strong {
                    display: block;
                    margin-bottom: var(--spacing-x-small);
                    font-weight: 600;
                }

                .subuser-header {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-small);
                    margin-bottom: var(--spacing-normal);
                }

                .subuser-name {
                    font-size: var(--font-size-large);
                    font-weight: 600;
                    color: var(--text-color-dark);
                    margin: 0;
                }

                .publicity-indicator {
                    padding: var(--spacing-x-small) var(--spacing-small);
                    background: var(--background-dark);
                    border: 1px solid var(--border-color);
                    border-radius: var(--border-radius-large);
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-x-small);
                    font-size: var(--font-size-small);
                    font-weight: 500;
                }

                .public-indicator {
                    color: var(--primary-color);
                }

                .private-indicator {
                    color: var(--text-color-dark);
                }

            `
        ];
    }

    constructor() {
        super();
        this.subuserData = null;
        this.selectedGroups = [];
        this.originalGroupIds = [];
        this.isPublic = false;
        this.loading = false;
    }

    updated(changedProperties) {
        if (changedProperties.has('subuserData') && this.subuserData) {
            // Initialize with subuser's current group IDs if available
            const groupIds = this.subuserData.groups
                ? this.subuserData.groups.map(group => group.id)
                : [];
            this.selectedGroups = [...groupIds];
            this.originalGroupIds = [...groupIds];
            this.isPublic = this.subuserData.isPublic || false;
        }
    }

    handleGroupSelectionChange(e) {
        // Extract IDs from the selected groups
        this.selectedGroups = e.detail.selectedGroups.map(group => group.id);
    }

    _onPublicToggleChanged(e) {
        this.isPublic = e.detail.checked;
    }

    async handleSubmit(e) {
        e.preventDefault();

        this.loading = true;

        const subuserData = {
            groupIds: this.selectedGroups,
            isPublic: this.isPublic
        };

        const response = await updateSubuser(this.subuserData.id, subuserData);

        if (response.success) {
            messagesState.addMessage('Subuser updated successfully', 'success');
            triggerUpdateUser();
            this.dispatchEvent(new CustomEvent('subuser-updated', {
                bubbles: true,
                composed: true
            }));
        } else {
            messagesState.addMessage(response.error || 'Failed to update subuser', 'error');
        }

        this.loading = false;
    }

    handleCancel() {
        this.dispatchEvent(new CustomEvent('cancel', {
            bubbles: true,
            composed: true
        }));
    }

    _getDeselectedGroups() {
        if (!this.subuserData?.groups) return [];

        // Find groups that were originally selected but are no longer selected
        const deselectedGroups = this.subuserData.groups.filter(group =>
            this.originalGroupIds.includes(group.id) && !this.selectedGroups.includes(group.id)
        );

        return deselectedGroups;
    }

    render() {
        if (!this.subuserData) {
            return html``;
        }

        return html`
            <div class="form-header">
                <h2 class="form-title">Manage Subuser Details</h2>
                <p class="form-description">
                    Configure the subuser's profile visibility and select which groups they should have access to.
                </p>
            </div>

            <div class="subuser-header">
                <h3 class="subuser-name">${this.subuserData.name}</h3>
            </div>

            <form @submit="${this.handleSubmit}">
                <div class="form-grid">
                    <div class="form-group">
                        <custom-toggle
                            label="Make Profile Public"
                            ?checked="${this.isPublic}"
                            @change="${this._onPublicToggleChanged}"
                        ></custom-toggle>
                    </div>
                    
                    <div class="form-group">
                        <your-groups-list
                            .selectedGroups="${this.selectedGroups}"
                            @selection-changed="${this.handleGroupSelectionChange}"
                        ></your-groups-list>
                        ${this._getDeselectedGroups().length > 0 ? html`
                            <div class="warning-message">
                                <strong>Warning:</strong>
                                Removing this subuser from the following group(s) will unshare any lists and items that were shared with these groups:
                                <ul>
                                    ${this._getDeselectedGroups().map(group => html`
                                        <li><strong>${group.groupName}</strong></li>
                                    `)}
                                </ul>
                            </div>
                        ` : ''}
                    </div>
                </div>
                
                <div class="form-actions">
                    <button 
                        type="button" 
                        class="button secondary"
                        @click="${this.handleCancel}"
                        ?disabled="${this.loading}"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        class="button primary"
                        ?disabled="${this.loading}"
                    >
                        ${this.loading ? 'Updating...' : 'Update Subuser'}
                    </button>
                </div>
            </form>
        `;
    }
}

customElements.define('edit-subuser-form', EditSubuserForm);
