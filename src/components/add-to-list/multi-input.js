import { LitElement, html, css } from 'lit';

class MultiInput extends LitElement {
    static properties = {
        values: { type: String }, // Comma-separated string for initial values
        sectionName: { type: String }, // Name of the section
        placeholder: { type: String }, // Comma-separated string for placeholders
    };

    constructor() {
        super();
        this.values = ''; // Default to empty string
        this.sectionName = 'Default Section'; // Default section name
        this.placeholder = 'Column 1'; // Default placeholder string
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

        input {
            flex: 1;
            padding: 5px;
            font-size: 1rem;
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

    _getValuesArray() {
        // Convert the comma-separated `values` string into an array of rows
        return this.values
            ? this.values.split(';').map((row) => row.split(','))
            : [[]];
    }

    _getPlaceholderArray() {
        // Convert the comma-separated `placeholder` string into an array
        return this.placeholder ? this.placeholder.split(',') : ['Column 1'];
    }

    _addRow() {
        const valuesArray = this._getValuesArray();
        const placeholderArray = this._getPlaceholderArray();
        const emptyRow = placeholderArray.map(() => ''); // Create an empty row
        this.values = [...valuesArray, emptyRow.map((_) => '')]
            .map((row) => row.join(','))
            .join(';');
        this._emitChange();
    }

    _removeRow(index) {
        const valuesArray = this._getValuesArray();
        valuesArray.splice(index, 1);
        this.values = valuesArray.map((row) => row.join(',')).join(';');
        this._emitChange();
    }

    _updateValue(rowIndex, colIndex, event) {
        const valuesArray = this._getValuesArray();
        valuesArray[rowIndex][colIndex] = event.target.value;
        this.values = valuesArray.map((row) => row.join(',')).join(';');
        this._emitChange();
    }

    _emitChange() {
        this.dispatchEvent(
            new CustomEvent('values-change', {
                detail: { values: this._getValuesArray() },
                bubbles: true,
                composed: true,
            })
        );
    }

    render() {
        const valuesArray = this._getValuesArray();
        const placeholderArray = this._getPlaceholderArray();

        return html`
      <div class="container">
        <div class="header">${this.sectionName}</div>
        ${valuesArray.map(
            (row, rowIndex) => html`
            <div class="row">
              ${placeholderArray.map(
                (placeholder, colIndex) => html`
                  <input
                    type="text"
                    .value=${row[colIndex] || ''}
                    @input=${(e) => this._updateValue(rowIndex, colIndex, e)}
                    placeholder=${placeholder}
                  />
                `
            )}
              <button @click=${() => this._removeRow(rowIndex)}>Delete</button>
            </div>
          `
        )}
        <button class="add-button" @click=${this._addRow}>Add Row</button>
      </div>
    `;
    }
}

customElements.define('multi-input', MultiInput);
