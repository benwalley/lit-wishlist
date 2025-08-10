import { LitElement, html, css } from 'lit';
import { observeState } from 'lit-element-state';
import buttonStyles from '../../../css/buttons.js';
import { userState } from '../../../state/userStore.js';
import '../../lists/user-lists.js';

class MyListsContainer extends observeState(LitElement) {
    static get properties() {
        return {
            loading: { type: Boolean },
        };
    }

    constructor() {
        super();
        this.loading = false;
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    display: block;
                    padding: var(--spacing-normal);
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .page-header {
                    margin-bottom: var(--spacing-large);
                }

                .page-title {
                    font-size: var(--font-size-x-large);
                    color: var(--text-color-dark);
                    margin: 0 0 var(--spacing-small) 0;
                }

                .page-description {
                    color: var(--text-color-medium);
                    margin: 0 0 var(--spacing-normal) 0;
                    font-size: var(--font-size-normal);
                }

                user-lists {
                    --max-height: none;
                }
            `
        ];
    }

    render() {
        if (!userState.userData?.id) {
            return html`
                <div class="page-header">
                    <h1 class="page-title">My Lists</h1>
                    <p class="page-description">Please log in to view your lists.</p>
                </div>
            `;
        }

        return html`
            <div class="page-header">
                <h1 class="page-title">My Lists</h1>
                <p class="page-description">
                    Manage and organize your personal wishlists. Create new lists, edit existing ones, and keep track of all your items.
                </p>
            </div>

            <div class="lists-container">
                <user-lists lightTiles></user-lists>
            </div>
        `;
    }
}

customElements.define('my-lists-container', MyListsContainer);
