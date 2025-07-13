import {LitElement, html, css} from 'lit';
import buttonStyles from "../../../css/buttons";
import '../../global/custom-tooltip.js'
import '../../../svg/new-tab.js'
import '../../../svg/link.js'
import { maxLength } from '../../../helpers/generalHelpers.js';

export class CustomElement extends LitElement {
    static properties = {
        itemData: {type: Object},
        onlyFirst: {type: Boolean},
        condensed: {type: Boolean}
    };

    constructor() {
        super();
        this.itemData = {};
        this.onlyFirst = false;
        this.condensed = false;
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    /* Add any host styles if needed */
                }
                
                .condensed link-icon {
                    font-size: var(--font-size-large);
                }

                .link-container a {
                    display: inline-flex;
                    align-items: center;
                    text-decoration: none;
                    gap: 5px;
                    color: var(--blue-normal);
                    
                    link-icon {
                        transition: var(--transition-normal);
                    }
                    
                    &:hover link-icon {
                        transform: rotate(45deg)
                    }
                }

                .link-container a:hover {
                    text-decoration: underline;
                }
            `
        ];
    }


    /**
     * Computes which links to display based on the onlyFirst property.
     * @returns {Array} Array of link objects to display.
     */
    get linksToDisplay() {
        return this.onlyFirst ? this.itemData?.itemLinks.slice(0, 1) : this.itemData?.itemLinks;
    }

    render() {
        return html`
            <div class="link-container ${this.condensed ? ' condensed' : ''}">
                ${this.linksToDisplay.map(link => html`
                    <div>
                        <a href="${link.url.startsWith('http') ? link.url : `https://${link.url}`}"
                           target="_blank"
                           rel="noopener noreferrer">
                            <link-icon></link-icon>
                            ${!this.condensed ? 
                            html`${link.label} <new-tab-icon></new-tab-icon>` : ''}
                        </a>
                        <custom-tooltip>${maxLength(link.url, 100)}</custom-tooltip>
                    </div>
                `)}
            </div>
        `;
    }
}

customElements.define('links-display', CustomElement);
