import { LitState } from 'lit-element-state';

class GlobalState extends LitState {
    static get stateVars() {
        return {
            menuExpanded: false,
            landingPage: '/lists',
        };
    }
}

export const globalState = new GlobalState();
