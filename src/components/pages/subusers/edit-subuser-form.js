import { LitElement, html, css } from 'lit';
import { observeState } from 'lit-element-state';
import { updateSubuserGroups } from '../../../helpers/api/subusers.js';
import { messagesState } from '../../../state/messagesStore.js';
import { triggerUpdateUser } from '../../../events/eventListeners.js';
import '../../groups/your-groups-list.js';
import buttonStyles from '../../../css/buttons.js';

class EditSubuserForm extends observeState(LitElement) {
    static get properties() {
        return {
            subuserData: { type: Object },
            selectedGroups: { type: Array },
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

            `
        ];
    }

    constructor() {
        super();
        this.subuserData = null;
        this.selectedGroups = [];
        this.loading = false;
    }

    updated(changedProperties) {
        if (changedProperties.has('subuserData') && this.subuserData) {
            // Initialize with subuser's current group IDs if available
            this.selectedGroups = this.subuserData.groups 
                ? this.subuserData.groups.map(group => group.id) 
                : [];
        }
    }

    handleGroupSelectionChange(e) {
        // Extract IDs from the selected groups
        this.selectedGroups = e.detail.selectedGroups.map(group => group.id);
    }

    async handleSubmit(e) {
        e.preventDefault();

        this.loading = true;

        const response = await updateSubuserGroups(this.subuserData.id, this.selectedGroups);

        if (response.success) {
            messagesState.addMessage('Subuser groups updated successfully', 'success');
            triggerUpdateUser();
            this.dispatchEvent(new CustomEvent('subuser-updated', {
                bubbles: true,
                composed: true
            }));
        } else {
            messagesState.addMessage(response.error || 'Failed to update subuser groups', 'error');
        }

        this.loading = false;
    }

    handleCancel() {
        this.dispatchEvent(new CustomEvent('cancel', {
            bubbles: true,
            composed: true
        }));
    }

    render() {
        if (!this.subuserData) {
            return html``;
        }

        return html`
            <div class="form-header">
                <h2 class="form-title">Manage Subuser Groups</h2>
                <p class="form-description">
                    Select which groups this subuser should have access to.
                </p>
            </div>

            <form @submit="${this.handleSubmit}">
                <div class="form-grid">
                    <div class="form-group">
                        <your-groups-list
                            .selectedGroups="${this.selectedGroups}"
                            @selection-changed="${this.handleGroupSelectionChange}"
                        ></your-groups-list>
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
                        ${this.loading ? 'Updating...' : 'Update Groups'}
                    </button>
                </div>
            </form>
        `;
    }
}

customElements.define('edit-subuser-form', EditSubuserForm);
