import {LitElement, html, css} from 'lit';
import buttonStyles from "../../../css/buttons";
import '../../global/custom-image.js';
import {currencyHelper} from "../../../helpers.js";
import './priority-display.js';
import '../../../svg/new-tab.js';
import '../../global/custom-tooltip.js'
import '../listItem/price-display.js'
import { navigate} from "../../../router/main-router.js";


export class ItemTile extends LitElement {
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
                    
                }
                
                p {
                    margin: 0;
                }
                
                .small custom-image {
                    width: 50px;
                }

                .item-name {
                    margin: 0;
                    border-bottom: 1px solid var(--border-color);
                }
                
                .small .item-name {
                    border-bottom: none;
                    padding-right: 30px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                
                .right-side-container {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-small);
                }
                
                .small .right-side-container {
                    justify-content: center;
                    min-width: 100px;
                }

                .open-button {
                    position: absolute;
                    bottom: 0;
                    right: 0;
                }
                
                .small .open-button {
                    top: 50%;
                    transform: translateY(-50%);
                }
                
                priority-display {
                    margin-top: auto;
                    padding-right: 30px;
                }
                
                custom-tooltip {
                    min-width: 250px;
                }

                .item-link {
                    transition: all 200ms;
                    cursor: pointer;
                    box-shadow: var(--medium-box-shadow);
                    display: grid;
                    grid-template-columns: 120px 1fr;
                    padding: var(--spacing-small);
                    gap: var(--spacing-small);
                    position: relative;
                    border-radius: var(--border-radius-small);
                    color: var(--text-color-dark);
                    text-decoration: none;
                    
                    &:hover {
                        box-shadow: var(--large-box-shadow);
                        transform: scale(1.01);
                    }
                }
                
                .small.item-link {
                    padding: var(--spacing-x-small);
                    box-shadow: none;
                    border-bottom: 1px solid var(--border-color);
                    grid-template-columns: 50px 1fr;
                    border-radius: 0;
                    transition: all 200ms;
                    
                    &:hover {
                        box-shadow: none;
                        transform: none;
                        background: var(--lavender-300);
                    }
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
            if (links?.length === 0) return;
            const firstLinkJson = JSON.parse(links[0]);
            if(!firstLinkJson?.url) return false;
            return firstLinkJson;
        } catch (error) {
            return false;
        }
    }


    render() {
        const link = this.getLink();

        return html`<a class="item-link ${this.small ? 'small' : ''}" href="/list/${this.listId}/item/${this.itemData?.id}">
            <custom-image
                    imageId="${this.itemData?.imageIds?.[0]}"
                    alt="${this.itemData?.name}"
                    width="200"
                    height="200"
            ></custom-image>
            <div class="right-side-container">
                <h3 class="item-name">${this.itemData?.name}</h3>
                ${!this.small ? html`<div>
                    <price-display .itemData="${this.itemData}"></price-display>
                </div>` : ''}
                ${!this.small ? html`<priority-display
                        .value="${this.itemData.priority}"
                        heartSize="20px"
                ></priority-display>` : ''}
                ${link ? html`<a
                                class="button open-button icon-button"
                                aria-label="Open link to product"
                                style="--icon-color: var(--blue)"
                                href="${link.url}"
                                target="_blank"
                                rel="noopener noreferrer"
                        >
                            <new-tab-icon></new-tab-icon>
                        </a>
                        <custom-tooltip>Link to ${link.displayName ?? link.url} (opens in new tab)</custom-tooltip>
                        ` : ''}
            </div>
        </a>
        `;
    }
}

customElements.define('item-tile', ItemTile);
