import {LitElement, html, css} from 'lit';
import buttonStyles from '../../css/buttons.js'
import '../../svg/chevron-left.js'

class PriceInput extends LitElement {
    static properties = {
        isRange: {type: Boolean, reflect: true},
        singlePrice: {type: Number, reflect: true},
        minPrice: {type: Number, reflect: true},
        maxPrice: {type: Number, reflect: true},
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
                .header {
                    display: flex;
                    justify-content: space-between;
                }
                
                .price-input-container {
                    display: flex;
                    flex-direction: column;
                    
                    .button {
                        margin-left: auto;
                    }

                    chevron-left-icon {
                        transform: rotate(-90deg);
                    }
                }
                
                .two-input-container {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: var(--spacing-small);
                }
                
                .button-text {
                    display: none;
                }
                
                @media (min-width: 768px) {
                    .button-text {
                        display: block;
                    }
                }

                input {
                    padding: 5px;
                    font-size: 1rem;
                    width: 100px;
                }

                double-round-arrows-icon {
                    font-size: 1.2em;
                }
            `
        ]
    }
    ;

    _toggleMode() {
        this.isRange = !this.isRange;
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
                <div class="header">
                    <strong>Price</strong>
                    <button @click=${this._toggleMode} class="button small-link-button">
                    <span class="button-text">
                        ${this.isRange ? 'Switch to Single Price' : 'Switch to Range'}
                    </span>
                        <chevron-left-icon></chevron-left-icon>
                    </button>
                </div>
                
                ${this.isRange
                        ? html`
                            <div class="two-input-container">
                                <custom-input
                                        class="small-input"
                                        type="number"
                                        placeholder="Min Price"
                                        .value=${this.minPrice ?? ''}
                                        @input=${this._onMinPriceChange}
                                ></custom-input>
                                <custom-input
                                        class="small-input"
                                        type="number"
                                        placeholder="Max Price"
                                        .value=${this.maxPrice ?? ''}
                                        @input=${this._onMaxPriceChange}
                                ></custom-input>
                            </div>
                            
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
            </div>
        `;
    }
}

customElements.define('price-input', PriceInput);
