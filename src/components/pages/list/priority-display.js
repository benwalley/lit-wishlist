import {LitElement, html, css} from 'lit';
import '../../../svg/heart.js';
import buttonStyles from '../../../css/buttons.js';

class PriorityDisplay extends LitElement {
    static get styles() {
        return [
            buttonStyles,
            css`
                .contents {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }
                .hearts {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    
                    heart-icon {
                        cursor: default;
                    }
                }
            `
        ];
    }

    static properties = {
        value: {type: Number, reflect: true},
        showLabel: {type: Boolean},
        heartSize: {type: String},
    };

    constructor() {
        super();
        this.value = 0;
        this.showLabel = false;
        this.heartSize = '30px';
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
                        active="false"
                        style="--heart-size: ${this.heartSize};"
                ></heart-icon>
            `);
        }
        return hearts;
    }

    render() {
        return (this.value && this.value > 0) ? html`
            ${this.showLabel ? html`<h3>Priority</h3>` : ''}
            <div class="contents">
                <div class="hearts">${this.renderHearts()}</div>
            </div>
        ` : '';
    }
}

customElements.define('priority-display', PriorityDisplay);
