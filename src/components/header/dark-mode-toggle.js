import { LitElement, html, css } from 'lit';
import buttonStyles from "../../css/buttons";
import "../../svg/moon.js";
import "../../svg/sun.js";
import '../global/custom-tooltip.js';
import {getDarkLightMode, setDarkLightMode} from "../../localStorage/themeStorage.js";

export class DarkModeToggle extends LitElement {
    static properties = {
        mode: { type: String }
    };

    constructor() {
        super();
        this.mode = 'light';
        this.initMode()
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    display: inline-block;
                }
                /* The button acts as a container for the icon */
                .button.icon-button {
                    position: relative;
                    width: 2em;  /* adjust as needed */
                    height: 2em; /* adjust as needed */
                    border: none;
                    background: transparent;
                    cursor: pointer;
                    overflow: hidden;
                }
                /* Container wrapping the icon so we can assign a view transition name */
                .icon-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    /* This attribute marks the element for view transitions */
                }
            `
        ];
    }

    initMode() {
        const mode = getDarkLightMode();
        this.setModeClass(mode)
        this.mode = mode;
    }

    setModeClass(mode) {
        document.body.dataset.mode = mode;
    }

    switchMode() {
        let newMode = 'light';
        if(this.mode === 'light') {
            newMode = 'dark';
        }
        if(this.mode === 'dark') {
            newMode = 'light';
        }
        this.mode = newMode;
        setDarkLightMode(newMode);
        this.setModeClass(newMode);
    }

    toggleMode() {
        if (document.startViewTransition) {
            document.startViewTransition(() => {
                this.switchMode()
            });
        } else {
            this.switchMode();
        }
    }

    render() {
        return html`
      <button @click="${this.toggleMode}" class="button icon-button">
        <!-- Wrap the icon in a container with a view-transition-name -->
        <div class="icon-container" view-transition-name="icon">
          ${this.mode === 'dark'
            ? html`<sun-icon></sun-icon>`
            : html`<moon-icon></moon-icon>`}
        </div>
      </button>
      <custom-tooltip>
        ${this.mode === 'dark' ? 'Use light theme' : 'Use dark theme'}
      </custom-tooltip>
    `;
    }
}

customElements.define('dark-mode-toggle', DarkModeToggle);
