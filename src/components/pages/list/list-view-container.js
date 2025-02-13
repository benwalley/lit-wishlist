import { LitElement, html, css } from 'lit';
import {customFetch} from "../../../helpers/fetchHelpers.js";
import '../../pages/account/avatar.js'
import './item-tile.js'

export class ListViewContainer extends LitElement {
    static properties = {
        listId: { type: String },
        listData: {type: Object},
        loading: {type: Boolean},
        selectedItem: {type: String}
    };

    constructor() {
        super();
        this.listId = '';
        this.listData = {};
        this.loading = true;
        this.selectedItem = '';
    }

    connectedCallback() {
        super.connectedCallback();
        if(!this.listId?.length) {
            this.loading = false;
            return;
        }
        this.fetchListData();
    }

    async fetchListData() {
        try {
            const response = await customFetch(`/lists/${this.listId}`, {}, true);
            if(response?.responseData?.error) {
                console.log('error');
                return;
            }
            this.listData = response;
            this.loading = false;
            console.log(response)
            this.requestUpdate();

        } catch (error) {
            console.error('Error fetching groups:', error);
            this.loading = false
        }
    }

    static get styles() {
        return [
            css`
                :host {
                    padding-bottom: var(--spacing-large);
                }
                .list-header {
                    display: flex;
                    align-items: flex-start;
                    gap: 1rem;
                    padding: 1rem;
                    
                    h1 {
                        margin: 0;
                    }
                }

                .list-items {
                    display: grid;
                    grid-template-columns: repeat(1, 1fr);
                    gap: var(--spacing-normal);
                }

                @media (min-width: 450px) {
                    .list-items {
                        grid-template-columns: repeat(1, 1fr);
                    }
                }

                @media (min-width: 768px) {
                    .list-items {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }

                @media (min-width: 1024px) {
                    .list-items {
                        grid-template-columns: repeat(3, 1fr);
                    }
                }
            `
        ];
    }


    // Vaadin Router will call this automatically when navigating to this route
    onBeforeEnter(location, commands, router) {
        this.listId = location.params.listId;
    }

    _navigateToItem(event) {
        const { itemId } = event.detail;
    }

    render() {
        // If this.loading is true, show a loading message
        if (this.loading) {
            return html`<p>Loading...</p>`;
        }

        // Otherwise, show the list data
        return html`
            <div class="list-header">
                <custom-avatar size="100" username="${this.listData?.listName}"></custom-avatar>
                <div>
                    <h1>${this.listData?.listName}</h1>
                    <div>${this.listData?.description}</div>
                </div>
            </div>
            <div class="list-items">
                ${this.listData.listItems.map(item => html`
                <item-tile .itemData="${item}" .listId="${this.listId}" @navigate="${this._navigateToItem}"></item-tile>
            `)}
            </div>
        `;
    }
}

customElements.define('list-view-container', ListViewContainer);
