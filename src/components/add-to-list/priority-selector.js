import {LitElement, html, css} from 'lit';
import '../../svg/heart.js'
import '../../svg/plus.js'
import '../../svg/minus.js'
import buttonStyles from '../../css/buttons.js'

class PrioritySelector extends LitElement {
    static get styles() {
        return [
            buttonStyles,
            css`
                
                .contents {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }
                button {
                    border-radius: 50px !important;
                    width: 30px;
                    height: 30px;
                    padding: 0 !important;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }


                .hearts {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }
            `
        ];
    }

    static properties = {
        value: {type: Number},
    };

    constructor() {
        super();
        this.value = 1;
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
                <button class="button primary" @click="${() => (this.value = Math.max(0, this.value - 0.5))}"
                        ?disabled="${this.value <= 0}">
                    <minus-icon style="width: 15px; height: 15px"></minus-icon>
                </button>
                <div class="hearts">${this.renderHearts()}</div>
                <button @click="${() => (this.value = Math.min(5, this.value + 0.5))}" ?disabled="${this.value >= 5}">
                    <plus-icon style="width: 15px; height: 15px"></plus-icon>
                </button>
            </div>
        `;
    }
}

customElements.define('priority-selector', PrioritySelector);

