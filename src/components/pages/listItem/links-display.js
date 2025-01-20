import {LitElement, html, css} from 'lit';
import buttonStyles from "../../../css/buttons";
import '../../global/custom-tooltip.js'
import '../../../svg/new-tab.js'

export class CustomElement extends LitElement {
    static properties = {
        itemData: {type: Object},
        onlyFirst: {type: Boolean}
    };

    constructor() {
        super();
        this.itemData = {};
        this.onlyFirst = false;
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    /* Add any host styles if needed */
                }

                .link-container a {
                    display: inline-flex;
                    align-items: center;
                    text-decoration: none;
                    gap: 5px;
                    color: var(--link-color);
                }

                .link-container a:hover {
                    text-decoration: underline;
                }
            `
        ];
    }

    /**
     * Parses the JSON strings from itemData.links into an array of link objects.
     * @returns {Array} Array of valid link objects.
     */
    parseLinks() {
        const rawLinks = this.itemData?.links || [];
        return rawLinks.reduce((acc, linkString) => {
            try {
                const linkObj = JSON.parse(linkString);
                if (linkObj?.url && linkObj?.displayName) {
                    acc.push(linkObj);
                }
            } catch (e) {
                console.error('Error parsing link:', linkString, e);
            }
            return acc;
        }, []);
    }

    /**
     * Computes which links to display based on the onlyFirst property.
     * @returns {Array} Array of link objects to display.
     */
    get linksToDisplay() {
        const parsedLinks = this.parseLinks();
        return this.onlyFirst ? parsedLinks.slice(0, 1) : parsedLinks;
    }

    render() {
        return html`
            <div class="link-container">
                ${this.linksToDisplay.map(link => html`
                    <div>
                        <a href="${link.url.startsWith('http') ? link.url : `https://${link.url}`}"
                           target="_blank"
                           rel="noopener noreferrer">
                            ${link.displayName}
                            <new-tab-icon></new-tab-icon>
                        </a>
                        <custom-tooltip>${link.url}</custom-tooltip>
                    </div>
                `)}
            </div>
        `;
    }
}

customElements.define('links-display', CustomElement);
