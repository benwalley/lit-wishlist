import { LitElement, html, css } from 'lit';
import buttonStyles from "../../css/buttons";
import { customFetch } from "../../helpers/fetchHelpers.js";
import './list-item.js';
import '../create-list/create-list-button.js';
import { cachedFetch, invalidateCache } from "../../helpers/caching.js";

export class CustomElement extends LitElement {
    static properties = {
        lists: { type: Array }, // Track lists fetched from the server
    };

    constructor() {
        super();
        this.lists = []; // Initialize lists
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    display: block;
                }
                ul {
                    list-style-type: none;
                    padding: 0;
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-small);
                }
            `,
        ];
    }

    connectedCallback() {
        super.connectedCallback();
        // Fetch lists when the component is added to the DOM.
        this.fetchLists();

        // Listen for the custom event to re-fetch lists.
        document.addEventListener('fetch-lists', () => {
            invalidateCache('/lists/mine');
            this.fetchLists();
        });
    }

    async fetchLists() {
        try {
            const response = await cachedFetch('/lists/mine', {}, true);

            if (response?.responseData?.error) {
                throw new Error(response?.responseData?.error);
            }

            // Use the View Transition API if available to animate the DOM changes.
            if (document.startViewTransition) {
                document.startViewTransition(() => {
                    this.lists = response;
                });
            } else {
                this.lists = response;
            }
            console.log(response);
        } catch (error) {
            console.error('Error fetching lists:', error);
        }
    }

    render() {
        return html`
            <div>
                <h2>My Lists</h2>
                ${this.lists.length > 0
                        ? html`
                            <ul>
                                ${this.lists.map(
                                        // Ensure each list item gets a unique view transition name.
                                        (list) => html`
                                            <list-item
                                                    .itemData=${list}
                                                    data-view-transition-name="list-item-${list.id}"
                                            ></list-item>
                                        `
                                )}
                            </ul>
                        `
                        : html`<p>No lists available.</p>`}
                <create-list-button></create-list-button>
            </div>
        `;
    }
}

customElements.define('my-lists', CustomElement);
