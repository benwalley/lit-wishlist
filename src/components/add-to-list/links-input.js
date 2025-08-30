import { LitElement, html, css } from 'lit';
import '../global/custom-input.js'
import buttonStyles from "../../css/buttons.js";
import '../../svg/delete.js'
import '../../svg/plus.js'

class LinksInput extends LitElement {
    static properties = {
        values: { type: Array },
    };

    constructor() {
        super();
        this.values = [this._createEmptyLink()];
    }

    /**
     * Create a new empty link object with the minimal required structure
     */
    _createEmptyLink() {
        return { url: '', label: '' };
    }

    /**
     * Ensure a link object has the required properties
     */
    _normalizeLink(link) {
        if (!link || typeof link !== 'object') {
            return this._createEmptyLink();
        }
        return {
            ...link,
            url: link.url || '',
            label: link.label || ''
        };
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
        const newLink = this._createEmptyLink();
        this.values = [...(this.values || []), newLink];
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
        if (!this.values || index >= this.values.length) return;
        
        const newValues = [...this.values];
        const existingLink = this._normalizeLink(newValues[index]);
        newValues[index] = {
            ...existingLink,
            url: event.target.value
        };

        this.values = newValues;
        this._emitChange();
    }

    /**
     * Update the label of a link at the specified index.
     */
    _updateLabel(index, event) {
        if (!this.values || index >= this.values.length) return;
        
        const newValues = [...this.values];
        const existingLink = this._normalizeLink(newValues[index]);
        newValues[index] = {
            ...existingLink,
            label: event.target.value
        };

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
                ${(this.values || []).map((link, index) => {
                    const normalizedLink = this._normalizeLink(link);
                    return html`
                    <div class="row">
                        <div class="inputs-container">
                            <custom-input
                                type="url"
                                size="small"
                                placeholder="https://..."
                                .value=${normalizedLink.url}
                                @input=${(e) => this._updateUrl(index, e)}
                            ></custom-input>
                            <custom-input
                                type="text"
                                size="small"
                                placeholder="Label - eg. Amazon"
                                .value=${normalizedLink.label}
                                @input=${(e) => this._updateLabel(index, e)}
                            ></custom-input>
                        </div>
                        <button 
                            aria-label="Delete Link"
                            class="icon-button delete-button danger-text"
                            @click=${() => this._removeLink(index)}
                        >
                            <delete-icon></delete-icon>
                        </button>
                    </div>
                `;
                })}

                <button class="small-link-button add-row-button" @click=${this._addLink}>
                    <plus-icon></plus-icon>
                    <span>Add Another Link</span>
                </button>
            </div>
        `;
    }
}

customElements.define('links-input', LinksInput);
