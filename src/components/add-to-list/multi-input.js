import { LitElement, html, css } from 'lit';
import { arrayConverter } from '../../helpers/arrayHelpers.js';
import '../global/custom-input.js'

class MultiInput extends LitElement {
    static properties = {

        values: {
            type: Array,
            reflect: true,
            converter: arrayConverter,
        },
        /**
         * Name of the section, e.g. "My Links"
         */
        sectionName: { type: String },
        /**
         * Each key corresponds to a property in the row object.
         */
        placeholder: { type: String },
    };

    constructor() {
        super();
        // Default to an empty array of objects
        this.values = [];
        this.sectionName = 'Default Section';
        // By default, we only have one key named "Column 1".
        this.placeholder = 'Column 1';
    }

    static styles = css`
        .container {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .header {
            font-size: 1.2rem;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .row {
            display: flex;
            gap: 10px;
            align-items: center;
        }

        button {
            padding: 5px 10px;
            font-size: 1rem;
            cursor: pointer;
        }

        .add-button {
            margin-top: 10px;
            align-self: flex-start;
        }
    `;

    /**
     * Parse the comma-separated `placeholder` into an array of keys.
     * e.g. "url,displayName" => ["url", "displayName"]
     */
    _getPlaceholderArray() {
        return this.placeholder
            ? this.placeholder.split(',').map((p) => p.trim())
            : ['Column1'];
    }

    /**
     * Add a new row object with the keys defined in placeholder.
     */
    _addRow() {
        const keys = this._getPlaceholderArray();
        // Create a new object where each key is an empty string
        const newRow = {};
        keys.forEach((k) => {
            newRow[k] = '';
        });

        this.values = [...this.values, newRow];
        this._emitChange();
    }

    /**
     * Remove the row object at index `index`.
     */
    _removeRow(index) {
        const newValues = [...this.values];
        newValues.splice(index, 1);
        this.values = newValues;
        this._emitChange();
    }

    /**
     * Update a specific key on the row object at (rowIndex).
     */
    _updateValue(rowIndex, key, event) {
        // Make a shallow copy of the array
        const newValues = [...this.values];
        // Copy the row object we want to mutate
        const rowCopy = { ...newValues[rowIndex] };
        // Update the chosen key
        rowCopy[key] = event.target.value;
        // Put the updated object back in the array
        newValues[rowIndex] = rowCopy;

        this.values = newValues;
        this._emitChange();
    }

    /**
     * Dispatch an event so parent components can react to changes.
     */
    _emitChange() {
        this.dispatchEvent(
            new CustomEvent('values-change', {
                detail: { values: this.values },
                bubbles: true,
                composed: true,
            })
        );
    }

    render() {
        const keys = this._getPlaceholderArray();

        return html`
            <div class="container">
                <div class="header">${this.sectionName}</div>
                ${this.values.map((row, rowIndex) => html`
                    <div class="row">
                        ${keys.map((key) => html`
                            <custom-input
                                    type="text"
                                    placeholder=${key}
                                    .value=${row[key] ?? ''}
                                    @input=${(e) => this._updateValue(rowIndex, key, e)}
                            />
                        `)}
                        <button @click=${() => this._removeRow(rowIndex)}>Delete</button>
                    </div>
                `)}

                <button class="add-button" @click=${this._addRow}>Add Row</button>
            </div>
        `;
    }
}

customElements.define('multi-input', MultiInput);
