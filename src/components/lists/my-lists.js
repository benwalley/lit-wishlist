import { LitElement, html, css } from 'lit';
import buttonStyles from "../../css/buttons";
import formStyles from "../../css/forms.js";
import { customFetch } from "../../helpers/fetchHelpers.js";
import './list-item.js';
import '../create-list/create-list-button.js';
import { cachedFetch, invalidateCache } from "../../helpers/caching.js";
import {messagesState} from "../../state/messagesStore.js";
import {listenUpdateList} from "../../events/eventListeners.js";

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
            formStyles,
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
                    max-height: 300px;
                    overflow-y: auto;
                }
                
                .section-header {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;
                }
            `,
        ];
    }

    connectedCallback() {
        super.connectedCallback();
        // Fetch lists when the component is added to the DOM.
        this.fetchLists();
        listenUpdateList(this.fetchLists.bind(this));
    }

    async fetchLists() {
        try {
            const response = await cachedFetch('/lists/mine', {}, true);
            if(response.success) {
                this.lists = response.data.filter(list => list.id !== 0);
            } else {
                messagesState.addMessage('error fetching lists', 'error');
            }
        } catch (error) {
            console.error('Error fetching lists:', error);
        }
    }

    render() {
        return html`
            <div>
                <div class="section-header">
                    <h2>My Lists</h2>
                    <a href="/list/0">unassigned items</a>
                </div>
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
