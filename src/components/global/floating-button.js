import {LitElement, html, css} from 'lit';

class FloatingButton extends LitElement {
    static styles = css`
        :host {
            position: fixed;
            bottom: 24px;
            right: 24px;
            display: inline-block;
            z-index: 1000;
        }

        button {
            background-color: var(--primary-button-background);
            color: var(--primary-button-text);
            border: none;
            border-radius: 50%;
            width: var(--fab-size, 56px);
            height: var(--fab-size, 56px);
            box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.3);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            transition: background-color 0.3s, box-shadow 0.3s;
        }

        button:hover {
            background-color: var(--primary-button-hover-background);
            box-shadow: var(--small-box-shadow);
        }

        button:active {
            box-shadow: var(--medium-box-shadow);
        }

        /* Optional: To allow customization via CSS variables */
    `;

    static properties = {
        label: {type: String}, // Accessible label
    };

    constructor() {
        super();
        this.label = 'Add';
    }

    render() {
        return html`
            <button @click="${this._handleClick}" aria-label="${this.label}">
                <slot></slot>
            </button>
        `;
    }

    _handleClick(event) {
        this.dispatchEvent(new CustomEvent('fab-click', {
            detail: {message: 'Floating button clicked!'},
            bubbles: true,
            composed: true,
        }));
    }
}

customElements.define('floating-button', FloatingButton);
