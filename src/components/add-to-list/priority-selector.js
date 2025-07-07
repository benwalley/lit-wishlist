import {LitElement, html, css} from 'lit';
import '../../svg/heart.js';
import '../../svg/plus.js';
import '../../svg/minus.js';
import buttonStyles from '../../css/buttons.js';

class PrioritySelector extends LitElement {
    static get styles() {
        return [
            buttonStyles,
            css`
                .contents {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                button {
                    border-radius: 50px !important;
                    width: 22px;
                    height: 22px;
                    padding: 0 !important;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .hearts {
                    display: flex;
                    align-items: center;
                }
                
                h3 {
                    margin: 0;
                    font-size: var(--font-size-normal);
                    padding-bottom: var(--spacing-x-small);
                }

                /* Small size styles */
                :host([size="small"]) .contents {
                    gap: 12px;
                }
                
                :host([size="small"]) button {
                    width: 19px;
                    height: 19px;
                }
                
                :host([size="small"]) h3 {
                    font-size: var(--font-size-small);
                    padding-bottom: var(--spacing-x-small);
                }
                
                :host([size="small"]) .hearts heart-icon {
                    --heart-size: 20px;
                }
                
                :host([size="small"]) button minus-icon,
                :host([size="small"]) button plus-icon {
                    width: 12px !important;
                    height: 12px !important;
                }
            `
        ];
    }

    static properties = {
        value: {type: Number, reflect: true},
        size: {type: String, reflect: true}
    };

    constructor() {
        super();
        this.value = 0;
        this.size = 'normal'; // 'normal' or 'small'
    }

    updated(changedProperties) {
        if (changedProperties.has('value')) {
            this.dispatchEvent(
                new CustomEvent('priority-changed', {
                    detail: { value: this.value },
                    bubbles: true,
                    composed: true,
                })
            );
        }
    }

    setValue(index, state) {
        const values = [];
        for (let i = 0; i < 5; i++) {
            if (i < index || (i === index && state === 'full')) {
                values.push(1);
            } else if (i === index && state === 'half') {
                values.push(0.5);
            } else {
                values.push(0);
            }
        }
        this.value = values.reduce((acc, val) => acc + val, 0);
    }

    renderHearts() {
        const hearts = [];
        let remaining = this.value;

        for (let i = 0; i < 5; i++) {
            let state = 'empty';
            if (remaining >= 1) {
                state = 'full';
                remaining -= 1;
            } else if (remaining === 0.5) {
                state = 'half';
                remaining -= 0.5;
            }
            hearts.push(html`
        <heart-icon
          .state="${state}"
          @state-changed="${(e) => this.setValue(i, e.detail)}"
        ></heart-icon>
      `);
        }
        return hearts;
    }

    render() {
        return html`
      <h3>Priority</h3>
      <div class="contents">
        <button
          class="button primary"
          @click="${() => (this.value = Math.max(0, this.value - 0.5))}"
          ?disabled="${this.value <= 0}"
        >
          <minus-icon style="width: 12px; height: 12px"></minus-icon>
        </button>
        <div class="hearts">${this.renderHearts()}</div>
        <button
          @click="${() => (this.value = Math.min(5, this.value + 0.5))}"
          ?disabled="${this.value >= 5}"
        >
          <plus-icon style="width: 12px; height: 12px"></plus-icon>
        </button>
      </div>
    `;
    }
}

customElements.define('priority-selector', PrioritySelector);
