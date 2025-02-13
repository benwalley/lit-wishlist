import { LitState } from 'lit-element-state';

class GlobalState extends LitState {
    static get stateVars() {
        return {
            menuExpanded: false,
        };
    }
}

export const globalState = new GlobalState();
