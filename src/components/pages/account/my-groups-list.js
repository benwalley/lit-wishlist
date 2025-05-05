import {LitElement, html, css} from 'lit';
import buttonStyles from "../../../css/buttons";
import helperStyles from "../../../css/helpers";
import '../../groups/group-list-display-item.js';
import {createGroup, getUserGroups} from '../../../helpers/api/groups.js';
import {messagesState} from "../../../state/messagesStore.js";
import '../../global/custom-modal.js';
import '../../groups/create-group-form.js';
import {listenGroupUpdated} from "../../../events/eventListeners.js";
export class MyGroupsList extends LitElement {
    static properties = {
        groups: { type: Array },
        loading: { type: Boolean },
        error: { type: String },
        isCreateModalOpen: { type: Boolean },
    };

    constructor() {
        super();
        this.groups = [];
        this.loading = true;
        this.error = '';
        this.isCreateModalOpen = false;
    }

    connectedCallback() {
        super.connectedCallback();
        this.fetchGroups();
        listenGroupUpdated(this.fetchGroups.bind(this))
    }

    async fetchGroups() {
        try {
            this.loading = true;
            const result = await getUserGroups();

            if (result.error) {
                this.error = 'Failed to load groups';
                messagesState.addMessage('Failed to load groups', 'error');
            } else {
                this.groups = result;
            }
        } catch (err) {
            this.error = 'An error occurred loading groups';
            messagesState.addMessage('An error occurred loading groups', 'error');
        } finally {
            this.loading = false;
        }
    }

    static get styles() {
        return [
            buttonStyles,
            helperStyles,
            css`
                :host {
                    display: block;
                    width: 100%;
                }
                
                .section-header {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: space-between;
                }
                
                .title {
                    font-weight: bold;
                }
                
                .groups-container {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-normal);
                    margin-top: var(--spacing-small);
                    max-height: 200px;
                    overflow-y: auto;
                }
                
                .empty-state {
                    padding: var(--spacing-small);
                    background-color: var(--background-light);
                    border-radius: var(--border-radius-small);
                    font-size: var(--font-size-small);
                    color: var(--text-color-medium-dark);
                    text-align: center;
                }
                
                .loading {
                    height: 100px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--text-color-medium-dark);
                }
                
                .new-group-button {
                    margin: auto 0;
                }
            `
        ];
    }
    _handleOpenNewGroupPopup() {
        this.isCreateModalOpen = true;
    }

    _handleCloseModal() {
        this.isCreateModalOpen = false;
    }

    async _handleGroupCreated(e) {
        const newGroup = e.detail.group;
        this._handleCloseModal();
    }

    render() {
        return html`
            <div class="section-header">
                <h2 class="title">My Groups</h2>
                <button 
                    class="primary new-group-button"
                    @click="${this._handleOpenNewGroupPopup}"
                >
                    Create new group
                </button>
            </div>
            
            ${this.loading ? 
                html`<div class="loading">Loading groups...</div>` :
                this.renderGroups()
            }
            
            <custom-modal
                ?isOpen="${this.isCreateModalOpen}"
                maxWidth="600px"
                @modal-changed="${(e) => this.isCreateModalOpen = e.detail.isOpen}"
            >
                <create-group-form
                    @close-modal="${this._handleCloseModal}"
                    @group-created="${this._handleGroupCreated}"
                ></create-group-form>
            </custom-modal>
        `;
    }

    renderGroups() {
        if (this.error) {
            return html`<div class="empty-state">${this.error}</div>`;
        }

        if (!this.groups || this.groups.length === 0) {
            return html`<div class="empty-state">You don't have any groups yet.</div>`;
        }

        return html`
            <div class="groups-container fade-out-container">
                ${this.groups.map(group => html`
                    <group-list-display-item 
                        .group=${group}
                    ></group-list-display-item>
                `)}
            </div>
        `;
    }
}

customElements.define('my-groups-list', MyGroupsList);
