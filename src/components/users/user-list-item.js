import {LitElement, html, css} from 'lit';
import '../pages/account/avatar.js'

class UserItemComponent extends LitElement {
    static properties = {
        userData: {type: Object},
        isSelected: {type: Boolean}
    };

    static styles = css`
        :host {

        }

        .user-container {
            display: flex;
            gap: var(--spacing-small);
            align-items: center;
            padding: 5px;
            filter: opacity(0.4);
            background: lightgrey;
            border: none;
            border-bottom: 1px solid var(--border-color-light);
            border-radius: 0;
            width: 100%;
            cursor: pointer;

            &:hover {
                filter: opacity(0.7);
                background: #f4f4f4;
            }
        }

        .user-container.selected {
            filter: opacity(1);
            background: white;
        }

        .user-name {
            font-size: var(--font-size-normal);
            font-weight: bold;
        }
    `;

    render() {
        return html`
            <button
                    class="user-container ${this.isSelected ? 'selected' : ''}">
                <custom-avatar size="24" username="${this.userData.name}"></custom-avatar>
                <div class="user-name">${this.userData.name}</div>
            </button>
        `;
    }

}

customElements.define('user-list-item', UserItemComponent);
