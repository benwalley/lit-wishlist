import {LitElement, html, css} from 'lit';
import buttonStyles from "../../css/buttons";
import {customFetch} from "../../helpers/fetchHelpers.js";
import './list-item.js'

export class CustomElement extends LitElement {
    static properties = {
        lists: {type: Array}, // Track lists fetched from the server
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
                }
                
            `
        ];
    }

    connectedCallback() {
        super.connectedCallback();
        this.fetchLists(); // Fetch lists when the component is added to the DOM
    }

    async fetchLists() {
        try {
            const response = await customFetch('/lists/mine', {}, true);

            if (response?.responseData?.error) {
                throw new Error(response?.responseData?.error);
            }

            this.lists = response; // Update the `lists` property with the fetched data
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
                                        list => html`
                                            <list-item
                                                    .itemData=${list}
                                            ></list-item>
                                        `
                                )}
                            </ul>
                        `
                        : html`<p>No lists available.</p>`}
            </div>
        `;
    }
}

customElements.define('my-lists', CustomElement);
