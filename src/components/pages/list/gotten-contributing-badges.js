import {LitElement, html, css} from 'lit';
import buttonStyles from "../../../css/buttons";
import '../../../svg/cart.js';
import '../../../svg/group.js';
import '../../../svg/dot.js';
import {getUserImageIdByUserId, getUsernameById} from "../../../helpers/generalHelpers.js";
import {observeState} from "lit-element-state";
import {userState} from "../../../state/userStore.js";

export class GottenContributingBadges extends observeState(LitElement) {
    static properties = {
        itemData: {type: Object},
    };

    constructor() {
        super();
        this.itemData = {};
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    position: absolute;
                    top: 0;
                    right: 0;
                    left: 0;
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    gap: var(--spacing-x-small);
                    padding: var(--spacing-x-small);
                }
                
                .badge {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 12px;
                    font-weight: 500;
                }
                
                .gotten-badge {
                    background-color: var(--green-normal);
                    color: var(--light-text-color);
                }
                
                .contributing-badge {
                    background-color: var(--purple-normal);
                    color: var(--light-text-color);
                }
                
                dot-icon {
                    font-size: 4px;
                    color: var(--info-yellow);
                }
                
                .contributor-list,
                .gotten-list {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-x-small);
                }
                
                .tooltip {
                    h3 {
                        margin: 0;
                        font-size: var(--font-size-normal);
                    }
                    
                    ul {
                        list-style: none;
                        display: flex;
                        flex-direction: column;
                        padding-left: 0;
                    }
                    
                    li {
                        display: flex;
                        align-items: center;
                        gap: var(--spacing-x-small);
                    }
                }
            `
        ];
    }

    getContributors() {
        return this.itemData?.goInOn
    }

    getGetting() {
        return this.itemData?.getting;
    }

    gotten() {
        return this.getGetting()?.length > 0;
    }

    contributing() {
        return this.getContributors()?.length > 0;
    }

    isCurrentUserContributing() {
        return this.getContributors()?.some(contributor => {
            return contributor.giverId === userState.userData?.id;
        });
    }

    isCurrentUserGetting() {
        return this.getGetting()?.some(contributor => {
            return contributor.giverId === userState.userData?.id;
        });
    }


    render() {
        return html`
            ${this.gotten() ? html`
                <div class="badge gotten-badge">
                    <cart-icon></cart-icon>
                    <span>${this.getGetting().length}</span>
                    ${this.isCurrentUserGetting() ? html`<dot-icon></dot-icon>` : ''}
                </div>
                <custom-tooltip style="min-width: 200px" class="tooltip">
                    <h3>Gotten By:</h3>
                    <ul class="gotten-list">
                        ${this.getGetting().map(contributor => html`
                            <li>
                                <custom-avatar
                                        username="${getUsernameById(contributor.giverId)}"
                                        imageId="${getUserImageIdByUserId(contributor.giverId)}"
                                        size="20"
                                ></custom-avatar>
                                ${getUsernameById(contributor.giverId)}
                            </li>
                        `)}
                    </ul>
                </custom-tooltip>
            ` : ''}
            
            ${this.contributing() ? html`
                <div class="badge contributing-badge">
                    <group-icon></group-icon>
                    <span>${this.getContributors().length}</span>
                    ${this.isCurrentUserContributing() ? html`<dot-icon></dot-icon>` : ''}
                </div>
                <custom-tooltip style="min-width: 200px" class="tooltip">
                    <h3>Wants to go in on:</h3>
                    <ul class="contributor-list">
                        ${this.getContributors().map(contributor => html`
                            <li>
                                <custom-avatar
                                        username="${getUsernameById(contributor.giverId)}"
                                        imageId="${getUserImageIdByUserId(contributor.giverId)}"
                                        size="20"
                                ></custom-avatar>
                                ${getUsernameById(contributor.giverId)}
                            </li>
                        `)}
                    </ul>
                </custom-tooltip>
            ` : ''}
        `;
    }
}
customElements.define('gotten-contributing-badges', GottenContributingBadges);
