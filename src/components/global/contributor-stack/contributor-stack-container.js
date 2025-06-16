import {LitElement, html, css} from 'lit';
import './getting-stack.js';
import './go-in-on-stack.js';
import {observeState} from "lit-element-state";

export class ContributorStackContainer extends observeState(LitElement) {
    static properties = {
        itemData: {type: Object},
        maxDisplayed: {type: Number},
        simple: {type: Boolean, reflect: true},
        showAvatars: {type: Boolean},
        showGetting: {type: Boolean},
        showGoInOn: {type: Boolean}
    };

    constructor() {
        super();
        this.itemData = {};
        this.maxDisplayed = 5;
        this.simple = false;
        this.showAvatars = true;
        this.showGetting = true;
        this.showGoInOn = true;
    }

    get hasGetting() {
        return (this.itemData?.getting || []).length > 0;
    }

    get hasGoInOn() {
        return (this.itemData?.goInOn || []).length > 0;
    }

    get shouldShowSeparator() {
        return this.hasGetting && this.hasGoInOn && this.showGetting && this.showGoInOn;
    }

    static get styles() {
        return css`
            :host {
                display: inline-block;
            }
            
            .contributor-container {
                display: flex;
                align-items: center;
                gap: var(--spacing-normal);
                flex-wrap: wrap;
            }
            
            .separator {
                color: var(--border-color);
                font-size: 0.875rem;
            }
            
            :host([simple]) .contributor-container {
                gap: var(--spacing-small);
            }
            
            :host([simple]) .separator {
                font-size: 0.75rem;
            }
        `;
    }

    render() {
        if (!this.hasGetting && !this.hasGoInOn) {
            return html``;
        }

        return html`
            <div class="contributor-container">
                ${this.showGetting && this.hasGetting ? html`
                    <getting-stack
                        .itemData="${this.itemData}"
                        .maxDisplayed="${this.maxDisplayed}"
                        ?simple="${this.simple}"
                        ?showAvatars="${this.showAvatars}"
                    ></getting-stack>
                ` : ''}
                
                ${this.shouldShowSeparator ? html`
                    <span class="separator">"</span>
                ` : ''}
                
                ${this.showGoInOn && this.hasGoInOn ? html`
                    <go-in-on-stack
                        .itemData="${this.itemData}"
                        .maxDisplayed="${this.maxDisplayed}"
                        ?simple="${this.simple}"
                        ?showAvatars="${this.showAvatars}"
                    ></want-to-go-in-on-stack>
                ` : ''}
            </div>
        `;
    }
}

customElements.define('contributor-stack-container', ContributorStackContainer);
