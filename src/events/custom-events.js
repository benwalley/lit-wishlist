
export const ADD_MODAL_EVENT = 'open-add-modal';
export const EDIT_LIST_EVENT = 'open-edit-list-modal';
export const EDIT_ITEM_EVENT = 'open-edit-item-modal';
export const ADD_QUESTION_EVENT = 'open-add-question-modal';
export const VIEW_ANSWERS_EVENT = 'open-view-answers-modal';


export function triggerCustomEvent(eventName, detail = {}, target = document, options = { bubbles: true, composed: true }) {
    if (!(target instanceof EventTarget)) {
        throw new Error('The target must be an instance of EventTarget.');
    }

    const event = new CustomEvent(eventName, {
        detail,
        bubbles: options.bubbles,
        composed: options.composed,
    });

    target.dispatchEvent(event);
}


export function listenToCustomEvent(eventName, callback, target = document, options = { capture: false, once: false, passive: false }) {
    if (typeof callback !== 'function') {
        throw new Error('The callback must be a function.');
    }

    if (!(target instanceof EventTarget)) {
        throw new Error('The target must be an instance of EventTarget.');
    }

    target.addEventListener(eventName, callback, options);

    // Return a function to remove the event listener
    return () => {
        target.removeEventListener(eventName, callback, options);
    };
}


export function triggerAddModalEvent() {
    triggerCustomEvent(ADD_MODAL_EVENT);
}

export function listenAddModalEvent(callback) {
    return listenToCustomEvent(ADD_MODAL_EVENT, callback);
}

export function triggerEditListEvent(listData) {
    triggerCustomEvent(EDIT_LIST_EVENT, { listData });
}

export function listenEditListEvent(callback) {
    return listenToCustomEvent(EDIT_LIST_EVENT, callback);
}

export function triggerEditItemEvent(itemData) {
    triggerCustomEvent(EDIT_ITEM_EVENT, { itemData });
}

export function listenEditItemEvent(callback) {
    return listenToCustomEvent(EDIT_ITEM_EVENT, callback);
}

export function triggerAddQuestionEvent(editData) {
    triggerCustomEvent(ADD_QUESTION_EVENT, { editData });
}

export function listenAddQuestionEvent(callback) {
    return listenToCustomEvent(ADD_QUESTION_EVENT, callback);
}

export function triggerViewAnswersEvent(questionData) {
    triggerCustomEvent(VIEW_ANSWERS_EVENT, { questionData });
}

export function listenViewAnswersEvent(callback) {
    return listenToCustomEvent(VIEW_ANSWERS_EVENT, callback);
}

