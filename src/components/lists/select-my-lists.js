import {LitElement, html, css} from 'lit';
import './select-list-item.js'
import '../../svg/check.js'
import {listenInitialUserLoaded, listenUpdateList} from "../../events/eventListeners.js";
import {fetchMyLists} from "../../helpers/api/lists.js";
import '../../components/global/selectable-list/selectable-list.js';
import {messagesState} from "../../state/messagesStore.js";
import {userState} from "../../state/userStore.js";
import {observeState} from "lit-element-state";

export class CustomElement extends observeState(LitElement) {
    static properties = {
        selectedListIds: {type: Array},
    };

    constructor() {
        super();
        this.selectedListIds = [];
    }

    static get styles() {
        return css`
            :host {
                display: block;
            }
        `;
    }

    reset() {
        this.selectedListIds = [];
    }

    connectedCallback() {
        super.connectedCallback();
    }

    _handleSelectionChange(event) {
        this.selectedListIds = event.detail.selectedItemIds;

        // Forward the event with our component's naming convention
        this.dispatchEvent(new CustomEvent('change', {
            detail: {
                selectedListIds: this.selectedListIds,
                selectedLists: event.detail.selectedItems,
                count: event.detail.count
            },
            bubbles: true,
            composed: true
        }));
    }

    // Custom renderer for the select-list-item component
    _renderItem(item, isSelected, handleClick) {
        return html`
            <select-list-item
                .itemData=${item}
                .isSelected=${isSelected}
                @item-clicked=${() => handleClick(item)}
            ></select-list-item>
        `;
    }

    render() {
        console.log('rendering')
        return html`
            <selectable-list
                .items=${userState.myLists}
                .selectedItemIds=${this.selectedListIds}
                .loading=${false}
                .itemRenderer=${this._renderItem}
                .title=${"Lists"}
                .customEmptyMessage=${"No lists available."}
                @selection-changed=${this._handleSelectionChange}
            ></selectable-list>
        `;
    }
}

customElements.define('select-my-lists', CustomElement);
