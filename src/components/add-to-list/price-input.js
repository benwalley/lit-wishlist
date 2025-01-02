import {LitElement, html, css} from 'lit';
import buttonStyles from '../../css/buttons.js'

class PriceInput extends LitElement {
    static properties = {
        isRange: {type: Boolean},
        singlePrice: {type: Number},
        minPrice: {type: Number},
        maxPrice: {type: Number},
    };

    constructor() {
        super();
        this.isRange = false; // Default to single price mode
        this.singlePrice = null;
        this.minPrice = null;
        this.maxPrice = null;
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                .price-input-container {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 10px;
                }
                
                .single-input {
                    grid-column: 1 / span 2;
                }

                input {
                    padding: 5px;
                    font-size: 1rem;
                    width: 100px;
                }`
        ]
    }
    ;

    _toggleMode() {
        this.isRange = !this.isRange;
        // Reset values when toggling
        this.singlePrice = null;
        this.minPrice = null;
        this.maxPrice = null;
        this._emitChange();
    }

    _onSinglePriceChange(e) {
        this.singlePrice = parseFloat(e.target.value) || null;
        this._emitChange();
    }

    _onMinPriceChange(e) {
        this.minPrice = parseFloat(e.target.value) || null;
        this._emitChange();
    }

    _onMaxPriceChange(e) {
        this.maxPrice = parseFloat(e.target.value) || null;
        this._emitChange();
    }

    _emitChange() {
        this.dispatchEvent(
            new CustomEvent('price-change', {
                detail: {
                    isRange: this.isRange,
                    singlePrice: this.singlePrice,
                    minPrice: this.minPrice,
                    maxPrice: this.maxPrice,
                },
                bubbles: true,
                composed: true,
            })
        );
    }

    render() {
        return html`
            <div class="price-input-container">
                ${this.isRange
                        ? html`
                            <custom-input
                                    type="number"
                                    placeholder="Min Price"
                                    .value=${this.minPrice ?? ''}
                                    @input=${this._onMinPriceChange}
                            ></custom-input>
                            <custom-input
                                    type="number"
                                    placeholder="Max Price"
                                    .value=${this.maxPrice ?? ''}
                                    @input=${this._onMaxPriceChange}
                            ></custom-input>
                        `
                        : html`
                            <custom-input
                                    class="single-input"
                                    type="number"
                                    placeholder="Price"
                                    .value=${this.singlePrice ?? ''}
                                    @input=${this._onSinglePriceChange}
                            ></custom-input>
                        `}
                <button @click=${this._toggleMode} class="button primary">
                    ${this.isRange ? 'Switch to Single Price' : 'Switch to Range'}
                </button>
            </div>
        `;
    }
}

customElements.define('price-input', PriceInput);
