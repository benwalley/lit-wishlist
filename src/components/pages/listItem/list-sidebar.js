import {LitElement, html, css} from 'lit';
import buttonStyles from "../../../css/buttons";
import {customFetch} from "../../../helpers/fetchHelpers.js";
import '../list/item-tile.js'
import {cachedFetch} from "../../../helpers/caching.js";

export class CustomElement extends LitElement {
    static properties = {
        value: {type: String},
        listData: {type: Array}
    };

    constructor() {
        super();
        this.value = '';
        this.listData = [];
    }

    connectedCallback() {
        super.connectedCallback();
        if(!this.listId?.length) {
            console.log('no list ID');
            this.loading = false;
            return;
        }
        this.fetchListData();
    }

    async fetchListData() {
        try {
            const response = await cachedFetch(`/lists/${this.listId}`, {}, true);
            if(response?.responseData?.error) {
                console.log('error');
                return;
            }
            this.listData = response;
            this.loading = false;
            this.requestUpdate();

        } catch (error) {
            console.error('Error fetching groups:', error);
            this.loading = false
        }
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {

                }
            `
        ];
    }

    render() {
        return html`
            ${this.listData?.listItems?.map(item => html`
                <item-tile .itemData="${item}" .listId="${this.listData.id}" small></item-tile>
            `)}
        `;
    }
}
customElements.define('list-sidebar', CustomElement);
