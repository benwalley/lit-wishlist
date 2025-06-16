import { LitElement, html, css } from 'lit';
import buttonStyles from "../../css/buttons";
import formStyles from "../../css/forms.js";
import { customFetch } from "../../helpers/fetchHelpers.js";
import './list-item.js';
import '../create-list/create-list-button.js';
import { cachedFetch, invalidateCache } from "../../helpers/caching.js";
import {messagesState} from "../../state/messagesStore.js";
import {listenUpdateList} from "../../events/eventListeners.js";
import {observeState} from "lit-element-state";
import {userState} from "../../state/userStore.js";

export class CustomElement extends observeState(LitElement) {
    static properties = {
        userId: { type: Number },
        lists: { type: Array },
    };

    constructor() {
        super();
        this.userId = 0;
        this.lists = [];

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

    _isListOwner() {
        if(!this.userId) return true;
        const userId = userState.userData?.id;
        if(this.userId === userId) {
            return true;
        }
        return false;
    }

    connectedCallback() {
        super.connectedCallback();
        // Fetch lists when the component is added to the DOM.
        this.fetchLists();
        listenUpdateList(this.fetchLists.bind(this));
    }

    async fetchLists() {
        try {
            const url = this.userId ? `/lists/user/${this.userId}` : '/lists/mine';
            const response = await cachedFetch(url, {}, true);
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
                    <h2>Lists</h2>
                    ${this._isListOwner() ? html`<a href="/list/0">unassigned items</a>` : ''}
                </div>
                ${this.lists.length > 0
                        ? html`
                            <ul>
                                ${this.lists.map((list) => html`
                                    <list-item
                                        .itemData=${list}
                                    ></list-item>`
                                )}
                            </ul>
                        `
                        : html`<p>No lists available.</p>`}
                 ${this._isListOwner() ? html`<create-list-button></create-list-button>` : ''}
            </div>
        `;
    }
}

customElements.define('my-lists', CustomElement);
