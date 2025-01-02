import {LitElement, html, css} from 'lit';
import '../pages/account/avatar.js'

class GroupItemComponent extends LitElement {
    static properties = {
        group: {type: Object},
        isSelected: {type: Boolean}
    };

    // get isSelected() {
    //     return this.selectedGroups?.has(this.group.id);
    // }

    static styles = css`
        :host {

        }

        .group-container {
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

        .group-container.selected {
            filter: opacity(1);
            background: white;
        }

        .group-name {
            font-size: var(--font-size-normal);
            font-weight: bold;
        }
    `;

    render() {
        return html`
            <button
                    class="group-container ${this.isSelected ? 'selected' : ''}">
                <custom-avatar size="24" username="${this.group.groupName}"></custom-avatar>
                <div class="group-name">${this.group.groupName}</div>
            </button>
        `;
    }

}

customElements.define('group-list-item', GroupItemComponent);
