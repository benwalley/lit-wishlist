import {LitElement, html, css} from 'lit';
import {observeState} from 'lit-element-state';
import {userState} from "../../state/userStore.js";
import '../global/custom-modal.js';
import './settings-content.js';

export class SettingsModal extends observeState(LitElement) {
    static get properties() {
        return {
            isOpen: { type: Boolean }
        };
    }

    constructor() {
        super();
        this.isOpen = false;
    }

    _handleModalChanged(event) {
        this.isOpen = event.detail.isOpen;
    }

    _handleModalClosed(event) {
        this.isOpen = false;
    }

    open() {
        this.isOpen = true;
    }

    close() {
        this.isOpen = false;
    }

    render() {
        return html`
            <custom-modal 
                triggerEvent="open-settings-modal"
                .isOpen=${this.isOpen}
                @modal-changed=${this._handleModalChanged}
                @modal-closed=${this._handleModalClosed}
                maxWidth="800px"
                noPadding
            >
                <settings-content
                    @close-settings=${() => this.isOpen = false}
                    @logout=${(e) => this._handleEvent(e)}
                    @delete-account=${(e) => this._handleEvent(e)}>
                </settings-content>
            </custom-modal>
        `;
    }

    _handleEvent(e) {
        // Re-dispatch events to parent
        this.dispatchEvent(new CustomEvent(e.type, {
            detail: e.detail,
            bubbles: true,
            composed: true
        }));
        this.close();
    }
}

customElements.define('settings-modal', SettingsModal);
