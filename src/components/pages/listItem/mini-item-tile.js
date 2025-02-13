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

export class MiniItemTile extends LitElement {
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
                }

                .item-link {
                    display: flex;
                    gap: var(--spacing-small);
                    align-items: center;
                    text-decoration: none;
                    color: inherit;
                    background: var(--background-light);
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
                    max-width: 70%;
                }

                .status-line {
                    margin-top: 4px;
                    font-size: 12px;
                    color: #999999;
                }

                .status-line.purchased {
                    color: green;
                }

                .status-line.interested {
                    color: #db7700; /* orange-ish */
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

    _renderStatus() {
        // Example logic: if an item is purchased or if someone is interested.
        // Adjust as needed based on how your data is structured
        if (this.itemData?.purchased) {
            return html`<span class="status-line purchased">Purchased</span>`;
        } else if (this.itemData?.someoneInterested) {
            return html`<span class="status-line interested">Someone Interested</span>`;
        }
        return html`<span class="status-line">None</span>`;
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
                    <h3 class="item-name">${this.itemData?.name}</h3>
                    <div class="row">
                        <priority-display
                                .value="${this.itemData.priority}"
                                heartSize="18px"
                        ></priority-display>
                        <price-display .itemData="${this.itemData}"></price-display>
                    </div>
                    ${this._renderStatus()}
                </div>
                <arrow-long-left-icon></arrow-long-left-icon>
            </a>
        `;
    }
}

customElements.define('mini-item-tile', MiniItemTile);
