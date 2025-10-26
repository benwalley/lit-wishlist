import {LitElement, html, css} from 'lit';
import buttonStyles from "../../../css/buttons";
import {listenUpdateItem, triggerProposalModal} from "../../../events/eventListeners.js";
import '../../../svg/success.js';
import '../../../svg/share.js';
import '../../../svg/dots.js';
import '../../pages/account/avatar.js';
import '../../global/action-dropdown.js';
import {messagesState} from "../../../state/messagesStore.js";
import {copyCurrentPageUrl, copyUrlToClipboard} from "../../../helpers/shareHelpers.js";
import {showConfirmation} from "../../global/custom-confirm/confirm-helper.js";
import '../../../svg/edit.js';
import '../../../svg/delete.js';
import '../../../svg/group.js';
import {openEditItemModal} from "../../add-to-list/edit-item-modal.js";
import {openEditCustomItemModal} from "../../add-to-list/add-custom-item-modal.js";
import {deleteItem} from "../../../helpers/api/listItems.js";
import '../../global/contributor-stack/contributor-stack-container.js'
import {canUserContribute, canUserEditItem} from "../../../helpers/userHelpers.js";
import {userState} from "../../../state/userStore.js";
import {observeState} from "lit-element-state";

export class ContributorsTopBar extends observeState(LitElement) {
    static properties = {
        itemData: {type: Object},
        contributors: {type: Array},
        listId: {type: String},
        itemId: {type: String},
        amountPledged: {type: Number},
        actionItems: {type: Array},
    };

    constructor() {
        super();
        this.itemData = {};
        this.listId = '';
        this.itemId = '';
        this.amountPledged = 0;
    }

    handleEditItem() {
        if (!this.itemData) {
            messagesState.addMessage('Error editing item. Please reload page and try again.', 'error');
            return;
        }
        if (this.itemData.isCustom) {
            openEditCustomItemModal(this.itemData);
        } else {
            openEditItemModal(this.itemData);
        }
    }

    handleCopyLink() {
        copyUrlToClipboard(`/public/item/${this.itemId}`,)
    }

    async handleDeleteItem() {
        try {
            const confirmed = await showConfirmation({
                heading: 'Delete Item',
                message: 'Are you sure you want to delete this item?',
                confirmLabel: 'Delete',
                cancelLabel: 'Cancel'
            });

            if (!confirmed) return
            const response = await deleteItem(this.itemId);
            if (response.success) {
                messagesState.addMessage('Item deleted successfully');
                window.location.href = `/list/${this.listId}`;
            } else {
                messagesState.addMessage('Error deleting item. Please try again.', 'error');
            }
        } catch (error) {
            messagesState.addMessage('Error deleting item. Please try again.', 'error');
        }
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    display: block;
                    padding: var(--spacing-small);
                    background: linear-gradient(
                            to right,
                            rgb(99 102 241 / 0.1),
                            rgb(168 85 247 / 0.1),
                            rgb(236 72 153 / 0.1)
                    );
                    border-bottom: 1px solid var(--border-color);
                    overflow: hidden;
                    height: min-content;
                }

                @media (min-width: 800px) {
                    :host {
                        padding: var(--spacing-normal);
                    }
                }

                .top-row {
                    gap: var(--spacing-small);
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    justify-content: space-between;
                    transition: opacity 0.3s ease-in-out;
                }

                @media (min-width: 1000px) {
                    .top-row {

                    }
                }

                a.back-arrow.button {
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    gap: var(--spacing-x-small);
                    color: var(--primary-color);
                    text-decoration: none;
                    transition: transform 0.3s ease, color 0.3s ease;
                }

                a.back-arrow.button:hover,
                a.back-arrow.button:focus,
                a.back-arrow.button:active {
                    color: var(--blue-normal);
                    transform: scale(1.03);
                    background: none;
                }

                a.back-arrow.button:hover arrow-long-left-icon,
                a.back-arrow.button:focus arrow-long-left-icon,
                a.back-arrow.button:active arrow-long-left-icon {
                    animation: bounce 1s;
                }


                @media (max-width: 1000px) {
                    .desktop-only.desktop-only {
                        display: none;
                    }
                }


                .contributor-details {
                    display: flex;
                    padding-left: 10px;
                    flex-direction: column;
                    align-items: center;
                    gap: var(--spacing-small);
                    margin-right: auto;
                }

                @media (min-width: 1000px) {
                    .contributor-details {
                        flex-direction: row;
                        margin-right: auto;
                        margin-left: 0;
                    }
                }

                .avatar {
                    margin-left: -5px;
                }

                .avatar-stack {
                    display: flex;
                }

                .contributor-count {
                    white-space: nowrap;
                    font-weight: bold;
                    font-size: 0.9em;
                    transition: opacity 0.3s ease;
                }

                .amount-gotten {
                    grid-row: 2;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    font-weight: bold;
                    background: var(--blue-light);
                    color: var(--blue-normal);
                    font-size: var(--font-size-small);
                    padding: var(--spacing-x-small) var(--spacing-small);
                    border-radius: 50px;
                    transition: opacity 0.3s ease;

                    &.none-gotten {
                        background: var(--text-color-light);
                        color: var(--text-color-dark);
                    }
                }

                success-icon {
                    font-size: 1.2em;
                }

                .contributors-right {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                    transition: opacity 0.3s ease;
                }

                .contributors-right .title {
                    font-weight: bold;
                    font-size: 0.9em;
                    line-height: 1;
                }

                .contributors-right .amount {
                    font-size: 0.8em;
                    line-height: 1;
                }

                .actions-container {
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-end;
                }
                
                @media (max-width: 400px) {
                    .actions-container {
                        margin-left: auto;
                    }
                }

                .action-button {
                    font-size: 1.3em;
                    transition: transform 0.3s ease;
                }

                .action-button:hover {
                    transform: scale(1.1);
                }
                

                /* Fade In Transition */

                .fade-in {
                    animation: fadeIn 0.4s ease forwards;
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                .popup-contents {
                    max-width: 200px;
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-normal);
                    padding: var(--spacing-small);


                    .qty {
                        margin-left: auto;
                    }

                    .popup-username {
                        border-bottom: 1px solid var(--border-color);
                    }

                    .amount-contributed {
                        font-size: var(--font-size-small);
                        align-items: center;
                        display: flex;
                        background: var(--green-light);
                        border-radius: var(--border-radius-normal);
                        color: var(--green-normal);
                        padding: 5px;
                        gap: 4px;
                        font-weight: bold;

                    }

                    dollar-icon {
                        font-size: var(--font-size-small);
                        color: var(--green-normal);
                        display: flex;
                    }

                }
            `
        ];
    }

    get totalNumberGotten() {
        let totalNumber = 0;
        for(const contributor of this.itemData?.getting || []) {
            totalNumber += contributor.numberGetting;
        }
        return totalNumber;
    }

    get getters() {
        return this.itemData?.getting || [];
    }

    get wantToGet() {
        return this.itemData?.goInOn || [];
    }

    get actionItems() {
        const baseActions = []

        if(canUserEditItem(userState.userData, this.itemData)) baseActions.push(
            {
                id: 'edit',
                label: 'Edit Item',
                icon: html`<edit-icon></edit-icon>`,
                classes: 'blue-text',
                action: () => this.handleEditItem()
            }
        );

        // Only add share action if item is public
        if (this.itemData?.isPublic) {
            baseActions.push({
                id: 'share',
                label: 'Copy public link',
                icon: html`<share-icon></share-icon>`,
                classes: 'purple-text',
                action: () => this.handleCopyLink()
            });
        }

        // Add remaining actions
        if(canUserEditItem(userState.userData, this.itemData)) {
            baseActions.push(
                {
                    id: 'delete',
                    label: 'Delete Item',
                    icon: html`<delete-icon></delete-icon>`,
                    classes: 'danger-text',
                    action: () => this.handleDeleteItem()
                }
            )
        }
        baseActions.push(
            {
                id: 'proposal',
                label: 'Create Proposal',
                icon: html`<group-icon></group-icon>`,
                classes: 'green-text',
                action: () => triggerProposalModal(this.itemData)
            }
        );

        return baseActions;
    }

    render() {
        return html`
            <div class="top-row fade-in">
                ${this.listId ? html`<a
                        href="/list/${this.listId}"
                        class="back-arrow button link-button"
                        aria-label="Back to List"
                >
                    <arrow-long-left-icon aria-hidden="true"></arrow-long-left-icon>
                    <span class="desktop-only">Back To List</span>
                </a>` : html`<span></span>`}

                ${canUserContribute(userState.userData, this.itemData, this.itemData?.listOwnerId) ? html`<div class="contributor-details">
                    ${this.itemData
                            ? html`
                                <div class="avatar-stack fade-in">
                                    <contributor-stack-container .itemData="${this.itemData}"></contributor-stack-container>
                                </div>

                            `
                            : html`
                                <div class="avatar-stack">
                                    <div class="skeleton skeleton-circle"></div>
                                    <div class="skeleton skeleton-circle" style="margin-left: -8px;"></div>
                                </div>
                                <div class="contributors-right">
                                    <div class="skeleton skeleton-text" style="width: 120px; margin-top: 5px;"></div>
                                    <div class="skeleton skeleton-text" style="width: 80px; margin-top: 5px;"></div>
                                </div>
                `}
                </div>` : ''}

                ${canUserContribute(userState.userData, this.itemData, this.itemData?.listOwnerId) ? html`<div class="amount-gotten fade-in ${this.totalNumberGotten === 0 ? 'none-gotten' : ''}">
                    ${this.itemData
                            ? html`
                                
                                <success-icon></success-icon>
                                <span>${this.totalNumberGotten}</span>
                                <span>of</span>
                                <span>
                                  ${Math.max(
                                          this.itemData?.amountWanted,
                                          this.itemData?.maxAmountWanted
                                  ) || 1}
                                </span>
                                <span class="desktop-only">gotten</span>
                            `
                            : html`
                                <div class="skeleton skeleton--on-green skeleton-text"
                                     style="width: 40px; height: 20px;"></div>
                                <span>of</span>
                                <div class="skeleton skeleton--on-green skeleton-text"
                                     style="width: 40px; height: 20px;"></div>
                                <span>gotten</span>
                            `}
                </div>` : ''}

                <!-- Action Buttons -->
                ${this.actionItems.length > 0 ? html`
                <div class="actions-container">
                    <action-dropdown .items=${this.actionItems} placement="bottom-start">
                        <button
                                class="button icon-button action-button fade-in"
                                aria-label="Actions"
                                slot="toggle"
                        >
                            <dots-icon></dots-icon>
                        </button>
                    </action-dropdown>
                </div>
                ` : ''}
            </div>
        `;
    }
}

customElements.define('contributors-top-bar', ContributorsTopBar);
