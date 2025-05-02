import {LitElement, html, css} from 'lit';
import '../../../svg/heart.js';
import buttonStyles from '../../../css/buttons.js';

class PriorityDisplay extends LitElement {
    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    container-type: inline-size;
                    container-name: priority-display;
                    display: block;
                }
                
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
                
                .compact-display {
                    display: none;
                    align-items: center;
                    gap: 4px;
                }
                
                .compact-heart {
                    display: flex;
                    align-items: center;
                }
                
                .priority-value {
                    font-weight: bold;
                    font-size: 14px;
                    color: var(--text-color-dark);
                }
                
                /* Container query for smaller containers */
                @container priority-display (max-width: 175px) {
                    .hearts {
                        display: none;
                    }
                    
                    .compact-display {
                        display: flex;
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
                
                <!-- Compact display for small containers -->
                <div class="compact-display">
                    <div class="compact-heart">
                        <heart-icon
                            state="full"
                            active="false"
                            style="--heart-size: 18px;"
                        ></heart-icon>
                    </div>
                    <div class="priority-value">${this.value}</div>
                </div>
            </div>
        ` : '';
    }
}


customElements.define('priority-display', PriorityDisplay);
