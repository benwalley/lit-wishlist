import { LitState } from 'lit-element-state';

class UserState extends LitState {
    static get stateVars() {
        return {
            userData: false,
            myUsers: [],
            subusers: [],
            loadingUser: true,
        };
    }
}

export const userState = new UserState();
