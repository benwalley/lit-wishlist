import { LitState } from 'lit-element-state';

class UserState extends LitState {
    static get stateVars() {
        return {
            userData: false,
            myUsers: [],
            loadingUser: true,
        };
    }
}

export const userState = new UserState();
