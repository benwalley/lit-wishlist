import { LitState } from 'lit-element-state';

class CropperState extends LitState {
    static get stateVars() {
        return {
            modalOpen: false,
            selectedImageId: 0,
            cropConfirmed: false,
            cropCanceled: false,
            uniqueId: 0,
        };
    }
}

export const cropperState = new CropperState();
