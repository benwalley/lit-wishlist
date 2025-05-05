import {LitElement, html, css} from 'lit';
import buttonStyles from "../../../css/buttons";
import {customFetch} from "../../../helpers/fetchHelpers.js";
import './mini-item-tile.js';
import {cachedFetch} from "../../../helpers/caching.js";
import '../../../svg/chevron-left.js';
import {listenUpdateList} from "../../../events/eventListeners.js";
import {messagesState} from "../../../state/messagesStore.js";

export class CustomElement extends LitElement {
    static properties = {
        value: { type: String },
        listData: { type: Array },
        expanded: { type: Boolean, reflect: true }
    };

    constructor() {
        super();
        this.value = '';
        this.listData = [];
        this.expanded = true;
    }

    connectedCallback() {
        super.connectedCallback();
        if (!this.listId?.length) {
            console.log('no list ID');
            this.loading = false;
            return;
        }
        this.fetchListData();
        listenUpdateList(this.fetchListData.bind(this))

    }

    async fetchListData() {
        try {
            const response = await cachedFetch(`/lists/${this.listId}`, {}, true);
            if(response.success) {
                this.listData = response.data;
                return;
            }
            messagesState.addMessage('Failed to load list data', 'error');
        } catch (error) {
            console.error('Error fetching groups:', error);
            messagesState.addMessage('Failed to load list data', 'error');
        } finally {
            this.loading = false;
        }
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-small);
                }

                .items-container {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-small);
                }
                
                h2 {
                    margin: 0;
                    color: var(--text-color-dark);
                }
            `
        ];
    }

    render() {
        return html`
            <!-- Wrap the mini-item-tiles in a container that becomes inert when collapsed -->
            <div
                    id="mini-items"
                    class="items-container"
                    @mouseenter="${this._handleMouseEnter}"
                    aria-hidden="${!this.expanded ? 'true' : 'false'}"
            >
                <h2>${this.listData?.listName}</h2>
                ${this.listData?.listItems?.map(
                        item => html`
                            <mini-item-tile
                                    .itemData="${item}"
                                    .listId="${this.listData.id}"
                            ></mini-item-tile>
                        `
                )}
            </div>
        `;
    }
}
customElements.define('list-sidebar', CustomElement);
