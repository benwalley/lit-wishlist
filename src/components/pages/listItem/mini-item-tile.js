import {LitElement, html, css} from 'lit';
import buttonStyles from "../../../css/buttons";
import '../../global/custom-image.js';
import {currencyHelper} from "../../../helpers.js";
import '../list/priority-display.js';
import '../../../svg/new-tab.js';
import '../../global/custom-tooltip.js'
import '../listItem/price-display.js'
import {navigate} from "../../../router/main-router.js";
import '../../../svg/arrow-long-left.js'
import '../../../svg/cart.js'
import '../../../svg/group.js'
import {canUserContribute} from "../../../helpers/userHelpers.js";
import {observeState} from "lit-element-state";
import {userState} from "../../../state/userStore.js";
import {maxLength} from "../../../helpers/generalHelpers.js";
import {envVars} from "../../../config.js";

export class MiniItemTile extends observeState(LitElement) {
    static properties = {
        itemData: {type: Object},
        listId: {type: String},
        small: {type: Boolean}
    };

    constructor() {
        super();
        this.itemData = {};
        this.listId = '';
        this.small = false;
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    display: block;
                    position: relative;
                }

                .item-link {
                    display: flex;
                    gap: var(--spacing-small);
                    align-items: center;
                    text-decoration: none;
                    color: inherit;
                    background: var(--background-dark);
                    border: 1px solid var(--light-border-color);
                    border-radius: var(--border-radius-normal);
                    padding: var(--spacing-small);
                    transition: var(--transition-normal);
                }

                .item-link:hover {
                    //box-shadow: var(--shadow-1-soft);
                    //transform: scale(1.01);
                    border: 1px solid var(--primary-color);
                    background: #f9fafb;
                    
                    custom-image {
                        transform: scale(1.1);
                    }

                    arrow-long-left-icon {
                        opacity: 1;
                    }
                }

                .item-link.small {
                    padding: 8px;
                }
                
                .image-wrapper {
                    width: 60px;
                    height: 60px;
                    border-radius: var(--border-radius-normal);
                    overflow: hidden;
                }

                custom-image {
                    transition: var(--transition-normal);
                    width: 100%;
                    height: 100%;
                }

                .right-side-container {
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                    min-width: 0;
                    margin-bottom: auto;
                }

                .row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;
                }

                .item-name {
                    margin: 0;
                    font-size: 14px;
                    font-weight: 500;
                    line-height: 1.3;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                    max-width: 100%;
                }
                
                price-display {
                    margin-top: 4px;
                }
                
                arrow-long-left-icon {
                    transform: rotate(180deg);
                    opacity: 0;
                    transition: var(--transition-normal);
                    color: var(--medium-text-color);
                }
                
                .status-indicators {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    position: absolute;
                    top: var(--spacing-x-small);
                    right: var(--spacing-x-small);
                }
                
                .status-indicator {
                    display: flex;
                    align-items: center;
                    gap: 2px;
                    font-size: 12px;
                    font-weight: 500;
                    padding: 2px 6px;
                    border-radius: 10px;
                }
                
                .gotten-indicator {
                    background-color: var(--green-normal);
                    color: var(--light-text-color);
                }
                
                .contributing-indicator {
                    background-color: var(--purple-normal);
                    color: var(--light-text-color);
                }
                
                .status-indicator cart-icon,
                .status-indicator group-icon {
                    width: 12px;
                    height: 12px;
                }
            `
        ];
    }

    /**
     * Get the first valid link from the item data.
     * @returns {string|null} The URL of the first link, or null if no valid link is found.
     */
    getLink() {
        try {
            const links = this.itemData.links;
            if (!links?.length) return null;
            const firstLinkJson = JSON.parse(links[0]);
            if (!firstLinkJson?.url) return false;
            return firstLinkJson;
        } catch (error) {
            return false;
        }
    }

    _handleNavigate(e) {
        e.preventDefault();
        navigate(`/list/${this.listId}/item/${this.itemData?.id}`);
    }

    /**
     * Check if someone is getting this item
     */
    isGotten() {
        return this.itemData?.getting?.length > 0;
    }

    /**
     * Check if someone wants to contribute to this item
     */
    isContributing() {
        return this.itemData?.goInOn?.length > 0;
    }

    render() {
        const link = this.getLink();

        return html`
            <a
                    @click="${this._handleNavigate}"
                    class="item-link ${this.small ? 'small' : ''}"
                    href="/list/${this.listId}/item/${this.itemData?.id}"
            >
                <div class="image-wrapper">
                    <custom-image
                            imageId="${this.itemData?.imageIds?.[0]}"
                            alt="${this.itemData?.name}"
                    ></custom-image>
                </div>

                <div class="right-side-container">
                    <h3 class="item-name">${maxLength(this.itemData?.name, envVars.LIST_ITEM_MAX_LENGTH)}</h3>
                    <div class="row">
                        <priority-display
                                .value="${this.itemData.priority}"
                                heartSize="18px"
                        ></priority-display>
                        <price-display .itemData="${this.itemData}" size="small"></price-display>
                    </div>
                </div>
                
                ${canUserContribute(userState.userData, this.itemData) ? html`
                    <div class="status-indicators">
                        ${this.isGotten() ? html`
                            <div class="status-indicator gotten-indicator">
                                <cart-icon></cart-icon>
                            </div>
                        ` : ''}
                        
                        ${this.isContributing() ? html`
                            <div class="status-indicator contributing-indicator">
                                <group-icon></group-icon>
                            </div>
                        ` : ''}
                    </div>
                ` : ''}
                
                <arrow-long-left-icon></arrow-long-left-icon>
            </a>
        `;
    }
}

customElements.define('mini-item-tile', MiniItemTile);
