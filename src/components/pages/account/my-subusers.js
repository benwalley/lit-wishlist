import { LitElement, html, css } from 'lit';
import { observeState } from 'lit-element-state';
import '../subusers/sub-users-list.js';
import '../subusers/edit-subuser-modal.js';

export class MySubusers extends observeState(LitElement) {
    static get properties() {
        return {};
    }

    static get styles() {
        return css`
            :host {
                display: block;
            }

            .subusers-header {
                margin-bottom: var(--spacing-normal);
            }

            .subusers-title {
                font-size: var(--font-size-large);
                font-weight: 600;
                color: var(--text-color-dark);
                margin: 0;
            }
        `;
    }

    constructor() {
        super();
    }

    getEditModal() {
        return this.shadowRoot?.querySelector('edit-subuser-modal') || null;
    }

    render() {
        return html`
            <div class="subusers-header">
                <h2 class="subusers-title">My Subusers</h2>
            </div>
            
            <sub-users-list .editModal="${this.getEditModal()}"></sub-users-list>
            
            <edit-subuser-modal></edit-subuser-modal>
        `;
    }
}

customElements.define('my-subusers', MySubusers);