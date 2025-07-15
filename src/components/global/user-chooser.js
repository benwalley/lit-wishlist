import {LitElement, html, css} from 'lit';
import {userState} from '../../state/userStore.js';
import '../users/user-list-item.js';

export class UserChooser extends LitElement {
    static properties = {
        label: {type: String},
        value: {type: String},
        selectedUser: {type: Object},
        placeholder: {type: String},
        required: {type: Boolean},
        filteredUsers: {type: Array},
        showDropdown: {type: Boolean},
        focused: {type: Boolean}
    };

    constructor() {
        super();
        this.label = '';
        this.value = '';
        this.selectedUser = null;
        this.placeholder = '';
        this.required = false;
        this.filteredUsers = [];
        this.showDropdown = false;
        this.focused = false;
    }

    static styles = css`
        :host {
            display: block;
            position: relative;
            font-family: var(--font-family);
        }

        .input-container {
            position: relative;
            width: 100%;
        }

        .input-wrapper {
            display: flex;
            align-items: center;
            position: relative;
            width: 100%;
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius-small);
            background: var(--input-background-color);
            transition: border-color 0.2s ease;
        }

        .input-wrapper:focus-within {
            border-color: var(--focus-color);
            box-shadow: 0 0 2px 1px var(--focus-color);
        }

        .input-wrapper.has-selection {
            border-color: var(--purple-normal);
            background: var(--purple-light);
        }

        label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
            color: var(--text-color-dark);
            font-size: var(--font-size-small);
        }

        input {
            flex: 1;
            border: none;
            outline: none;
            padding: 0.75rem;
            font-size: var(--font-size-small);
            background: transparent;
            color: var(--text-color-dark);
        }

        input::placeholder {
            color: var(--text-color-light);
        }

        .clear-button {
            padding: 0.5rem;
            border: none;
            background: none;
            cursor: pointer;
            color: var(--text-color-medium);
            font-size: 1rem;
            margin-right: 0.25rem;
        }

        .clear-button:hover {
            color: var(--text-color-dark);
        }

        .dropdown {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            max-height: 200px;
            overflow-y: auto;
            background: white;
            border: 1px solid var(--border-color);
            border-top: none;
            border-radius: 0 0 var(--border-radius-small) var(--border-radius-small);
            box-shadow: var(--shadow-2-soft);
            z-index: 1000;
        }

        .dropdown-content {
            padding: 0.5rem 0;
        }

        .no-results {
            padding: 1rem;
            text-align: center;
            color: var(--text-color-medium);
            font-size: var(--font-size-small);
        }


        .selected-indicator {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem;
            background: var(--purple-light);
            color: var(--purple-normal);
            font-size: var(--font-size-x-small);
            font-weight: 500;
        }

        user-list-item {
            --user-container-padding: 0.5rem;
        }
    `;

    connectedCallback() {
        super.connectedCallback();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
    }

    filterUsers() {
        if (!this.value || this.value.length < 1) {
            this.filteredUsers = [];
            return;
        }

        const searchTerm = this.value.toLowerCase();
        const myUsers = userState.myUsers || [];
        this.filteredUsers = myUsers.filter(user =>
            user.name && user.name.toLowerCase().includes(searchTerm)
        ).slice(0, 10); // Limit to 10 results
    }

    handleInputChange(e) {
        this.value = e.target.value;
        this.selectedUser = null; // Clear selection when typing
        this.filterUsers();
        this.showDropdown = this.focused && this.filteredUsers.length > 0;

        this.dispatchEvent(new CustomEvent('value-changed', {
            detail: { value: this.value, selectedUser: null },
            bubbles: true,
            composed: true
        }));
    }

    handleFocus() {
        this.focused = true;
        this.filterUsers();
        this.showDropdown = this.filteredUsers.length > 0;
    }

    handleBlur() {
        // Delay hiding dropdown to allow for clicks
        console.log('bluring')
        setTimeout(() => {
            this.focused = false;
            this.showDropdown = false;
        }, 150);
    }

    handleUserSelect(e) {
        console.log('user selecting')
        const user = e.detail.user;
        this.selectedUser = user;
        this.value = user.name;
        this.showDropdown = false;
        this.focused = false;

        this.dispatchEvent(new CustomEvent('value-changed', {
            detail: { value: this.value, selectedUser: user },
            bubbles: true,
            composed: true
        }));

        this.dispatchEvent(new CustomEvent('user-selected', {
            detail: { user },
            bubbles: true,
            composed: true
        }));
    }

    handleClear() {
        this.value = '';
        this.selectedUser = null;
        this.filteredUsers = [];
        this.showDropdown = false;

        this.dispatchEvent(new CustomEvent('value-changed', {
            detail: { value: '', selectedUser: null },
            bubbles: true,
            composed: true
        }));

        // Focus the input after clearing
        setTimeout(() => {
            const input = this.shadowRoot.querySelector('input');
            if (input) input.focus();
        }, 0);
    }

    handleClickOutside(e) {
        console.log('clicked outside')
        if (!this.contains(e.target)) {
            this.showDropdown = false;
            this.focused = false;
        }
    }

    render() {
        const hasValue = this.value && this.value.length > 0;
        const hasSelection = this.selectedUser !== null;

        return html`
            <div class="input-container">
                ${this.label ? html`<label>${this.label}${this.required ? ' *' : ''}</label>` : ''}
                
                <div class="input-wrapper ${hasSelection ? 'has-selection' : ''}">
                    <input
                        type="text"
                        .value="${this.value}"
                        placeholder="${this.placeholder}"
                        @input="${this.handleInputChange}"
                        @focus="${this.handleFocus}"
                        @blur="${this.handleBlur}"
                        ?required="${this.required}"
                    />
                    ${hasValue ? html`
                        <button class="clear-button" @click="${this.handleClear}" type="button">
                            ×
                        </button>
                    ` : ''}
                </div>

                ${hasSelection ? html`
                    <div class="selected-indicator">
                        Selected user: ${this.selectedUser.name}
                    </div>
                ` : ''}

                ${this.showDropdown ? html`
                    <div class="dropdown">
                        <div class="dropdown-content">
                            ${this.filteredUsers.length === 0 ? html`
                                <div class="no-results">No users found</div>
                            ` : ''}
                            
                            ${this.filteredUsers.map(user => html`
                                <user-list-item
                                    .userData="${user}"
                                    .isSelected="${false}"
                                    @user-selected="${this.handleUserSelect}"
                                ></user-list-item>
                            `)}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }
}

customElements.define('user-chooser', UserChooser);
