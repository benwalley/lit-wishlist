import {LitElement, html, css} from 'lit';
import buttonStyles from "../../css/buttons";
import '../global/custom-modal';
import {listenBulkAddToGroupModal, triggerGroupUpdated, triggerUpdateList} from '../../events/eventListeners';
import '../../svg/check.js';
import '../pages/account/avatar.js';
import '../pages/account/qa/select-my-questions.js';
import '../lists/select-my-lists.js';
import { bulkShareWithGroup } from '../../helpers/api/groups.js';
import { messagesState } from '../../state/messagesStore.js';
import {userState} from "../../state/userStore.js";
import {observeState} from "lit-element-state";
import {navigate} from "../../router/main-router.js";

export class BulkAddToGroupModal extends observeState(LitElement) {
    static properties = {
        isOpen: {type: Boolean},
        selectedListIds: {type: Array},
        selectedQuestionIds: {type: Array},
        group: {type: Object},
        isLoading: {type: Boolean}
    };

    constructor() {
        super();
        this.isOpen = false;
        this.selectedListIds = [];
        this.selectedQuestionIds = [];
        this.group = null;
        this.isLoading = false;
    }

    connectedCallback() {
        super.connectedCallback();
        listenBulkAddToGroupModal((event) => {
            if (event && event.detail && event.detail.group) {
                this.group = event.detail.group;
                this.isOpen = true;
            } else {
                console.error('No group data provided to bulk-add-to-group-modal');
                messagesState.addMessage('Error: No group data provided', 'error');
            }
        });
    }

    disconnectedCallback() {
        super.disconnectedCallback();
    }

    handleModalClose(e) {
        this.isOpen = false;
        this.selectedListIds = [];
        this.selectedQuestionIds = [];
    }

    navigateToGroupPage() {
        const url = `/group/${this.group.id}`;
        navigate(url);
    }

    async handleAddToGroup() {
        if (!this.group || !this.group.id) {
            messagesState.addMessage('Error: Unable to add items to group. Missing group information.', 'error');
            return;
        }

        this.isLoading = true;

        try {
            const listIds = this.selectedListIds || [];
            const questionIds = this.selectedQuestionIds || [];

            // Skip the API call if there's nothing to add
            if (listIds.length === 0 && questionIds.length === 0) {
                this._handleCancel();
                return;
            }

            // Use the helper function to share items with the group
            const result = await bulkShareWithGroup(this.group.id, listIds, questionIds);

            if (result.success) {
                messagesState.addMessage(`Successfully joined ${this.group.groupName}! You can now share items with this group.`);
                triggerGroupUpdated(); // Trigger event to update other components
                this.navigateToGroupPage()
                this.isOpen = false;
            } else {
                messagesState.addMessage(`Error sharing items with group: ${result.error || 'Unknown error'}`, 'error');
            }
        } catch (error) {
            console.error('Error sharing items with group:', error);
            messagesState.addMessage('Error sharing items with group', 'error');
        } finally {
            this.isLoading = false;
        }
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    display: block;
                }
                
                .modal-header {
                    position: sticky;
                    top: 0;
                    z-index: 10;
                    background-color: var(--background-dark);
                    border-bottom: 1px solid var(--border-color);
                }
                
                .modal-title {
                    padding: var(--spacing-normal) var(--spacing-normal) var(--spacing-small) var(--spacing-normal);
                    margin: 0;
                    text-align: center;
                    font-size: var(--font-size-large);
                }
                
                .modal-subtitle {
                    padding: 0 var(--spacing-normal) var(--spacing-normal) var(--spacing-normal);
                    margin: 0;
                    text-align: center;
                    font-size: var(--font-size-small);
                    color: var(--text-secondary);
                }
                
                .group-name {
                    color: var(--primary-color);
                    font-weight: bold;
                }
                
                .modal-footer {
                    position: sticky;
                    bottom: 0;
                    z-index: 10;
                    background-color: var(--modal-background-color);
                    padding: var(--spacing-normal);
                    border-top: 1px solid var(--border-color);
                    display: flex;
                    justify-content: flex-end;
                    gap: var(--spacing-small);
                }
                
                .modal-content {
                    padding: var(--spacing-normal);
                    max-height: 70vh;
                    overflow-y: auto;
                }
                
                .scrolling-contents {
                    display: grid;
                    gap: var(--spacing-normal);
                    grid-template-columns: 1fr;
                    padding: var(--spacing-normal);
                    overflow-y: auto;
                    overflow-x: hidden;
                    flex: 1;
                    width: 100%;
                    box-sizing: border-box;
                }
                
                @media (min-width: 768px) {
                    .scrolling-contents {
                        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
                    }
                }
                
                .left-column, .right-column {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-normal);
                }

        
            `
        ];
    }

    _handleselectedListIdsChange(e) {
        const {selectedListIds} = e.detail;
        this.selectedListIds = selectedListIds;
    }

    _handleSelectedQuestionsChange(e) {
        const {selectedQuestions} = e.detail;
        this.selectedQuestionIds = selectedQuestions ? selectedQuestions.map(q => q.id) : [];
    }

    _handleCancel() {
        this.isOpen = false;
        this.navigateToGroupPage();
    }

    render() {
        return html`
            <custom-modal 
                triggerEvent="open-bulk-add-to-group-modal"
                ?isOpen=${this.isOpen}
                @modal-closed=${this.handleModalClose}
                noPadding="true"
            >
                <div class="modal-container">
                    <div class="modal-header">
                        <h2 class="modal-title">
                            ${this.group ? 
                                html`You've joined <span class="group-name">${this.group.groupName}</span>!` : 
                                'Successfully joined group!'
                            }
                        </h2>
                        <p class="modal-subtitle">You can now share your lists and questions with this group.</p>
                    </div>
                    
                    <div class="scrolling-contents">
                        <select-my-lists @change="${this._handleselectedListIdsChange}"></select-my-lists>
                        <select-my-questions @change="${this._handleSelectedQuestionsChange}"></select-my-questions>
                    </div>
                    
                    <div class="modal-footer">
                        <button class="secondary" @click=${this._handleCancel}>Cancel</button>
                        <button class="primary" 
                                ?disabled=${this.isLoading}
                                @click=${this.handleAddToGroup}>
                            ${this.isLoading ? 'Adding...' : 'Add to Group'}
                        </button>
                    </div>
                </div>
            </custom-modal>
        `;
    }
}
customElements.define('bulk-add-to-group-modal', BulkAddToGroupModal);
