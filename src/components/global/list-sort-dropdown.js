import {LitElement, html, css} from 'lit';

export class ListSortDropdown extends LitElement {
    static properties = {
        selectedValue: {type: String},
    };

    static styles = css`
        :host {
            display: inline-block;
        }

        .sort-wrapper {
            display: flex;
            align-items: center;
            gap: var(--spacing-small);
            font-size: var(--font-size-small);
        }

        .sort-label {
            color: var(--text-color-dark);
            font-weight: 500;
        }

        select {
            padding: 8px 32px 8px 12px;
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius-small);
            background-color: var(--background-color);
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
            background-position: right 8px center;
            background-repeat: no-repeat;
            background-size: 16px;
            appearance: none;
            color: var(--text-color-dark);
            font-size: var(--font-size-small);
            cursor: pointer;
            min-width: 160px;
        }

        select:focus {
            outline: 2px solid var(--purple-normal);
            outline-offset: 1px;
        }

        select:hover {
            border-color: var(--purple-normal);
        }
    `;

    constructor() {
        super();
        this.selectedValue = 'name-asc';
        this.sortOptions = [
            { value: 'name-asc', label: 'A-Z' },
            { value: 'name-desc', label: 'Z-A' },
            { value: 'wanted-desc', label: 'Most Wanted First' },
            { value: 'date-asc', label: 'Date Added' },
            { value: 'gotten', label: 'Gotten' },
            { value: 'not-gotten', label: 'Not Gotten' },
            { value: 'want-to-go-in-on', label: 'Want to Go In On' }
        ];
    }

    handleChange(e) {
        this.selectedValue = e.target.value;
        this.dispatchEvent(new CustomEvent('sort-changed', {
            detail: { value: this.selectedValue }
        }));
    }

    render() {
        return html`
            <div class="sort-wrapper">
                <span class="sort-label">Sort:</span>
                <select 
                    .value=${this.selectedValue}
                    @change=${this.handleChange}
                    aria-label="Sort list items"
                >
                    ${this.sortOptions.map((option) => html`
                        <option 
                            value="${option.value}"
                            ?selected=${option.value === this.selectedValue}
                        >
                            ${option.label}
                        </option>
                    `)}
                </select>
            </div>
        `;
    }
}

customElements.define('list-sort-dropdown', ListSortDropdown);
