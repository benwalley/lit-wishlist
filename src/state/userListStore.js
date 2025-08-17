import { LitState } from 'lit-element-state';

class UserListState extends LitState {
    static get stateVars() {
        return {
            users: [], // all accessible users
            usersLoaded: false
        };
    }
}

export const userListState = new UserListState();
