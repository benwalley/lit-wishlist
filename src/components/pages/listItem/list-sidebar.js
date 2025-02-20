import {LitElement, html, css} from 'lit';
import buttonStyles from "../../../css/buttons";
import {customFetch} from "../../../helpers/fetchHelpers.js";
import './mini-item-tile.js';
import {cachedFetch} from "../../../helpers/caching.js";
import '../../../svg/chevron-left.js';
import {listenUpdateList} from "../../../events/eventListeners.js";

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
            console.log('asdf')
            const response = await cachedFetch(`/lists/${this.listId}`, {}, true);
            if (response?.responseData?.error) {
                console.log('error');
                return;
            }
            this.listData = response;
            this.loading = false;
            this.requestUpdate();
        } catch (error) {
            console.error('Error fetching groups:', error);
            this.loading = false;
        }
    }

    _toggleSidebar() {
        this.expanded = !this.expanded;
        this.dispatchEvent(
            new CustomEvent('sidebar-toggle', {
                detail: { expanded: this.expanded },
                bubbles: true,
                composed: true,
            })
        );
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
                
                .button.toggle-button {
                    position: absolute;
                    top: 300px;
                    left: -10px;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    padding: 0;
                    font-size: 1em;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: var(--transition-normal);
                    transform-origin: center center;
                    transform: rotate(180deg);
                }

                .button.toggle-button.collapsed {
                    transform: rotate(0);
                }

                .button.toggle-button:hover {
                    scale: 2;
                }
            `
        ];
    }

    render() {
        return html`
            <button
                    class="toggle-button primary button ${this.expanded ? 'expanded' : 'collapsed'}"
                    aria-label="${this.expanded ? 'Collapse' : 'Expand'}"
                    @click="${this._toggleSidebar}"
            >
                <chevron-left-icon></chevron-left-icon>
            </button>
            <!-- Wrap the mini-item-tiles in a container that becomes inert when collapsed -->
            <div
                    id="mini-items"
                    class="items-container"
                    ?inert="${!this.expanded}"
                    aria-hidden="${!this.expanded ? 'true' : 'false'}"
            >
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
