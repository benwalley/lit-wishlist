import { LitElement, html, css } from 'lit';
import '../pages/account/avatar.js'

class GroupItemComponent extends LitElement {
    static properties = {
        group: { type: Object },
        isSelected: { type: Boolean }
    };

    static styles = css`
        :host {
            display: block;
        }
        .group-container {
            display: flex;
            gap: var(--spacing-small);
            align-items: center;
            padding: 5px;
            filter: opacity(0.4);
            background: var(--option-select-background);
            border: none;
            border-bottom: 1px solid var(--border-color);
            border-radius: 0;
            width: 100%;
            cursor: pointer;
        }

        .group-container:hover {
            filter: opacity(0.7);
            background: var(--options-select-background-hover);
        }

        .group-container.selected {
            filter: opacity(1);
            background: var(--background-color);
        }

        .group-name {
            font-size: var(--font-size-normal);
            font-weight: bold;
            color: var(--text-color-dark);
        }

        .checkbox {
            cursor: pointer;
            margin-left: auto;
            /* Scale up the checkbox */
            transform: scale(1.5);
            /* Adjust for spacing when scaling */
            margin-right: 10px;
        }
    `;

    render() {
        return html`
            <button class="group-container ${this.isSelected ? 'selected' : ''}">
                <custom-avatar size="24" username="${this.group.groupName}"></custom-avatar>
                <div class="group-name">${this.group.groupName}</div>
                <!-- The checkbox reflects the current isSelected state -->
                <input class="checkbox" type="checkbox" .checked="${this.isSelected}" />
            </button>
        `;
    }
}

customElements.define('group-list-item', GroupItemComponent);
