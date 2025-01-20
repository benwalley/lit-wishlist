import {LitElement, html, css} from 'lit';
import buttonStyles from "../../css/buttons";
import {customFetch} from "../../helpers/fetchHelpers.js";
import './select-list-item.js'

export class CustomElement extends LitElement {
    static properties = {
        lists: {type: Array}, // Track lists fetched from the server
        selectedListIds: {type: Array}
    };

    constructor() {
        super();
        this.lists = []; // Initialize lists
        this.selectedListIds = [];
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

    _handleItemClick(event) {
        const itemData = event.detail.itemData;
        const index = this.selectedListIds.indexOf(itemData.id);
        if (index > -1) {
            this.selectedListIds.splice(index, 1);
        } else {
            this.selectedListIds.push(itemData.id);
        }
        this.requestUpdate();
        this._emitChangeEvent(this.selectedListIds);
    }

    _emitChangeEvent(selectedListIds) {
        this.dispatchEvent(new CustomEvent('change', {
            detail: { selectedListIds }
        }));
    }

    render() {
        return html`
            <div>
                ${this.lists.length > 0
                        ? html`
                            <ul>
                                ${this.lists.map(
                                        list => html`
                                            <select-list-item
                                                    .itemData=${list}
                                                    .isSelected="${this.selectedListIds.includes(list.id)}"
                                                    @item-clicked="${this._handleItemClick}"
                                            ></select-list-item>
                                        `
                                )}
                            </ul>
                        `
                        : html`<p>No lists available.</p>`}
            </div>
        `;
    }
}

customElements.define('select-my-lists', CustomElement);
