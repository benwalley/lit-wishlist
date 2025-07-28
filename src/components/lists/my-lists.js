import { LitElement, html, css } from 'lit';
import buttonStyles from "../../css/buttons";
import formStyles from "../../css/forms.js";
import './list-item.js';
import '../create-list/create-list-button.js';
import { fetchMyLists, fetchUserLists } from "../../helpers/api/lists.js";
import {messagesState} from "../../state/messagesStore.js";
import {listenUpdateList} from "../../events/eventListeners.js";
import {observeState} from "lit-element-state";
import {userState} from "../../state/userStore.js";

export class CustomElement extends observeState(LitElement) {
    static properties = {
        userId: { type: Number },
        lists: { type: Array },
        lightTiles: { type: Boolean },
    };

    constructor() {
        super();
        this.userId = 0;
        this.lists = [];
        this.lightTiles = false;
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
                    margin: 0;
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-small);
                    max-height: 300px;
                    overflow-y: auto;
                }
                
                .title {
                    margin: 0;
                }
                
                list-item {
                    --item-background: var(--background-dark);
                }
                
                list-item.light-tiles {
                    --item-background: var(--background-light);
                }
                
                create-list-button {
                    display: inline-block;
                }
                
                .section-header {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;
                    padding: var(--spacing-small) 0 var(--spacing-normal) 0;
                }

                @media (min-width: 600px) {
                    .section-header {
                        padding: 0 0 var(--spacing-normal) 0;
                    }
                }
                
                .unassigned-link {
                    display: block;
                    margin-top: var(--spacing-small);
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
            const response = this.userId ?
                await fetchUserLists(this.userId) :
                await fetchMyLists();

            if(response.success) {
                this.lists = response.data;
            } else {
                messagesState.addMessage('Error fetching lists', 'error');
            }
        } catch (error) {
            console.error('Error fetching lists:', error);
            messagesState.addMessage('Error fetching lists', 'error');
        }
    }

    render() {
        return html`
            <div>
                <div class="section-header">
                    <h2 class="title">Lists</h2>
                    ${this._isListOwner() ? html`<create-list-button></create-list-button>` : ''}

                </div>
                ${this.lists.length > 0
                        ? html`
                            <ul>
                                ${this.lists.map((list) => html`
                                    <list-item
                                        class="${this.lightTiles ? 'light-tiles' : ''}"
                                        .itemData=${list}
                                    ></list-item>`
                                )}
                            </ul>
                        `
                        : html`<p>No lists available.</p>`}
                ${this._isListOwner() ? html`<a class="unassigned-link" href="/list/0">unassigned items</a>` : ''}

            </div>
        `;
    }
}

customElements.define('my-lists', CustomElement);
