import { LitElement, html, css } from 'lit';
import { arrayConverter } from '../../helpers/arrayHelpers.js';
import '../global/custom-input.js'
import buttonStyles from "../../css/buttons.js";
import '../../svg/delete.js'
import '../../svg/plus.js'

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

    static get styles() {
        return [
            buttonStyles,
            css`
                .container {
                    display: flex;
                    flex-direction: column;
                }

                .header {
                    font-size: var(--font-size-normal);
                    font-weight: bold;
                }

                .row {
                    display: grid;
                    grid-template-columns: 1fr 1fr auto;
                    gap: 10px;
                    align-items: center;
                    
                }
                
                custom-input {
                    grid-column: span 2;
                }
                
                .delete-button {
                    grid-column: 3;
                    grid-row: 1 / span 2;                    
                }
                
                @media (min-width: 550px) {
                    custom-input {
                        grid-column: span 1;
                    }

                    .delete-button {
                        grid-row: 1;
                    }
                }

                .add-row-button {
                    align-self: flex-start;
                    margin-right: auto;
                }
            `
        ];
    }

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
                                    size="small"
                                    placeholder=${key}
                                    .value=${row[key] ?? ''}
                                    @input=${(e) => this._updateValue(rowIndex, key, e)}
                            />
                        `)}
                        <button 
                                aria-label="Delete Row"
                                style="--icon-color: var(--delete-red);
                                 --icon-color-hover: var(--delete-red-darker);
                                 --icon-hover-background: var(--delete-red-light);"
                                class="icon-button delete-button"
                                @click=${() => this._removeRow(rowIndex)}
                        >
                            <delete-icon></delete-icon>
                        </button>
                    </div>
                `)}

                <button class="small-link-button add-row-button" @click=${this._addRow}>
                    <plus-icon></plus-icon>
                    <span>Add Another Link</span>
                </button>
            </div>
        `;
    }
}

customElements.define('multi-input', MultiInput);
