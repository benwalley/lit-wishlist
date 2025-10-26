import { LitElement, html, css } from 'lit';
import buttonStyles from "../../../css/buttons";
import '../../../svg/hash.js'
import '../../../svg/success.js'
import {listenUpdateItem} from "../../../events/eventListeners.js";
import {cachedFetch} from "../../../helpers/caching.js";
import '../../loading/skeleton-loader.js'
import {canUserContribute} from "../../../helpers/userHelpers.js";
import {userState} from "../../../state/userStore.js";
import {observeState} from "lit-element-state";

export class CustomElement extends observeState(LitElement) {
    static properties = {
        itemData: { type: Object },
        publicView: { type: Boolean },
    };

    constructor() {
        super();
        this.itemData = {};
        this.publicView = false;
    }

    _getAmountGotten() {
        let total = 0;
        if(!this.itemData.getting || !Array.isArray(this.itemData.getting)) return 0;
        for(const contributor of this.itemData.getting) {
            total += parseFloat(contributor.numberGetting || 0);
        }
        return total;
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    gap: var(--spacing-small);
                }
                
                
                .regular-qty {
                    font-size: var(--font-size-medium);
                    font-weight: bold;
                    color: var(--text-color-dark);
                }
                
                .number-icon {
                    font-size: 20px;
                    color: var(--primary-color);
                    background: var(--purple-light);
                    height: 40px;
                    width: 40px;
                    border-radius: var(--border-radius-normal);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .min-max-section {
                    font-size: var(--font-size-small);
                    color: var(--text-color-medium-dark);
                }
                
                .amount-gotten-section {
                    background: var(--green-light);
                    color: var(--green-normal);
                    border-radius: 50px;
                    padding: var(--spacing-x-small) var(--spacing-small);
                    align-items: center;
                    display: flex;
                    gap: var(--spacing-x-small);
                    margin-left: auto;
                    min-width: 100px;
                }
            `
        ];
    }

    _canViewAmountGotten() {
        if(this.publicView) return false;
        if(canUserContribute(userState.userData, this.itemData, this.itemData?.listOwnerId)) return true;
    }

    render() {
        return html`
            <div class="number-icon">
                <hash-icon></hash-icon>
            </div>
            <div>
                <div class="regular-qty">${this.itemData.amountWanted || 1}</div>

                ${(parseFloat(this.itemData.minAmountWanted) || parseFloat(this.itemData.maxAmountWanted)) ? html`<div class="min-max-section">
                    <span>Range:</span>
                    <span>${this.itemData?.minAmountWanted || '1'}</span>
                    <span>-</span>
                    <span>${this.itemData?.maxAmountWanted || '--'}</span>
                </div>` : ''}
            </div>
            ${this._canViewAmountGotten() ? html`
                <div class="amount-gotten-section">
                    ${this.loading ? html`
                                <skeleton-loader width="100%" height="20px"></skeleton-loader>
                            ` : html`
                                <success-icon></success-icon>
                                <span>${this._getAmountGotten()}</span>
                                <span>gotten</span>
                            `}
                </div>
            ` : ''}
            
        `;
    }
}

customElements.define('amount-wanted-display', CustomElement);
