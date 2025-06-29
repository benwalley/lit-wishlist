import {LitElement, html, css} from 'lit';
import buttonStyles from "../../../css/buttons";
import helperStyles from "../../../css/helpers";
import '../../groups/group-list-display-item.js';
import {createGroup, getUserGroups} from '../../../helpers/api/groups.js';
import {messagesState} from "../../../state/messagesStore.js";
import '../../global/custom-modal.js';
import '../../groups/create-group-form.js';
import {listenGroupUpdated} from "../../../events/eventListeners.js";
import '../../../svg/group.js';
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
                    max-height: 250px;
                    overflow: auto;
                }
                
                .empty-state {
                    padding: 48px 24px;
                    text-align: center;
                    color: var(--text-color-medium-dark);
                    background-color: var(--background-light);
                    border-radius: var(--border-radius-normal);
                    border: 2px dashed var(--border-color);
                }

                .empty-state-icon {
                    width: 48px;
                    height: 48px;
                    margin: 0 auto 16px;
                    opacity: 0.5;
                    color: var(--text-color-medium-dark);
                }

                .empty-state-title {
                    font-size: var(--font-size-large);
                    font-weight: 600;
                    margin: 0 0 8px 0;
                    color: var(--text-color-dark);
                }

                .empty-state-description {
                    font-size: var(--font-size-normal);
                    margin: 0;
                    line-height: 1.5;
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
                @modal-closed="${(e) => this.isCreateModalOpen = false}"
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
            return html`
                <div class="empty-state">
                    <group-icon class="empty-state-icon"></group-icon>
                    <h3 class="empty-state-title">No Groups Yet</h3>
                    <p class="empty-state-description">
                        Create your first group to start collaborating with others on wishlists and gift giving.
                    </p>
                </div>
            `;
        }

        return html`
            <div class="groups-container">
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
