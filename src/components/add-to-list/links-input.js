import { LitElement, html, css } from 'lit';
import { arrayConverter } from '../../helpers/arrayHelpers.js';
import '../global/custom-input.js'
import buttonStyles from "../../css/buttons.js";
import '../../svg/delete.js'
import '../../svg/plus.js'

class LinksInput extends LitElement {
    static properties = {
        values: {
            type: Array,
            reflect: true,
            converter: arrayConverter,
        },
    };

    constructor() {
        super();
        this.values = [{ url: '', label: '' }];
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                .container {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-small);
                }

                .header {
                    font-size: var(--font-size-normal);
                    font-weight: bold;
                }

                .row {
                    display: grid;
                    grid-template-columns: 1fr auto;
                    gap: 10px;
                    align-items: start;
                    margin-bottom: 10px;
                }
                
                .inputs-container {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                
                .delete-button {
                    grid-column: 2;
                    align-self: center;
                }
                
                @media (min-width: 550px) {
                    .row {
                        grid-template-columns: 1fr 1fr auto;
                        align-items: center;
                        margin-bottom: 0;
                    }
                    
                    .inputs-container {
                        grid-column: span 2;
                        flex-direction: row;
                        gap: 10px;
                    }
                    
                    .delete-button {
                        grid-column: 3;
                        align-self: center;
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
     * Add a new link row with empty url and label.
     */
    _addLink() {
        const newLink = { url: '', label: '' };
        this.values = [...this.values, newLink];
        this._emitChange();
    }

    /**
     * Remove the link at the specified index.
     */
    _removeLink(index) {
        const newValues = [...this.values];
        newValues.splice(index, 1);
        this.values = newValues;
        this._emitChange();
    }

    /**
     * Update the URL of a link at the specified index.
     */
    _updateUrl(index, event) {
        const newValues = [...this.values];
        const linkCopy = { ...newValues[index] };
        linkCopy.url = event.target.value;
        newValues[index] = linkCopy;

        this.values = newValues;
        this._emitChange();
    }

    /**
     * Update the label of a link at the specified index.
     */
    _updateLabel(index, event) {
        const newValues = [...this.values];
        const linkCopy = { ...newValues[index] };
        linkCopy.label = event.target.value;
        newValues[index] = linkCopy;

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
        return html`
            <div class="container">
                <div class="header">Link(s)</div>
                ${this.values.map((link, index) => html`
                    <div class="row">
                        <div class="inputs-container">
                            <custom-input
                                type="url"
                                size="small"
                                placeholder="https://..."
                                .value=${link.url || ''}
                                @input=${(e) => this._updateUrl(index, e)}
                            ></custom-input>
                            <custom-input
                                type="text"
                                size="small"
                                placeholder="Label"
                                .value=${link.label || ''}
                                @input=${(e) => this._updateLabel(index, e)}
                            ></custom-input>
                        </div>
                        <button 
                            aria-label="Delete Link"
                            style="--icon-color: var(--delete-red);
                                 --icon-color-hover: var(--delete-red-darker);
                                 --icon-hover-background: var(--delete-red-light);"
                            class="icon-button delete-button"
                            @click=${() => this._removeLink(index)}
                        >
                            <delete-icon></delete-icon>
                        </button>
                    </div>
                `)}

                <button class="small-link-button add-row-button" @click=${this._addLink}>
                    <plus-icon></plus-icon>
                    <span>Add Another Link</span>
                </button>
            </div>
        `;
    }
}

customElements.define('links-input', LinksInput);
