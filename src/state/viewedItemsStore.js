import { LitState } from 'lit-element-state';

class ViewedItemsState extends LitState {
    static get stateVars() {
        return {
            viewedItems: [],
            viewedItemsLoaded: false
        };
    }
}

export const viewedItemsState = new ViewedItemsState();