import {listenToCustomEvent, triggerCustomEvent} from "./custom-events.js";

const UPDATE_LIST_EVENT = 'update-list';
const UPDATE_ITEM_EVENT = 'update-list';
const UPDATE_QA_EVENT = 'update-qa';
const UPDATE_USER_EVENT = 'update-user';
const USER_UPDATED_EVENT = 'user-updated';
const imageUploadEvents = {
    imageSelected: 'image-selected',
    cropConfirmed: 'crop-confirmed'
}

export function triggerUpdateList() {
    triggerCustomEvent(UPDATE_LIST_EVENT);
}

export function listenUpdateList(callback) {
    return listenToCustomEvent(UPDATE_LIST_EVENT, callback);
}

export function triggerUpdateItem() {
    triggerCustomEvent(UPDATE_ITEM_EVENT);
}

export function listenUpdateItem(callback) {
    return listenToCustomEvent(UPDATE_ITEM_EVENT, callback);
}

export function triggerUpdateUser() {
    triggerCustomEvent(UPDATE_USER_EVENT);
}

export function listenUpdateUser(callback) {
    return listenToCustomEvent(UPDATE_USER_EVENT, callback);
}

export function triggerUserUpdated() {
    triggerCustomEvent(USER_UPDATED_EVENT);
}

export function listenUserUpdated(callback) {
    return listenToCustomEvent(USER_UPDATED_EVENT, callback);
}

export function triggerImageSelected(details) {
    triggerCustomEvent(imageUploadEvents.imageSelected, details);
}

export function listenImageSelected(callback) {
    return listenToCustomEvent(imageUploadEvents.imageSelected, callback);
}

export function triggerImageCropConfirmed(details) {
    triggerCustomEvent(imageUploadEvents.cropConfirmed, details);
}

export function listenImageCropConfirmed(callback) {
    return listenToCustomEvent(imageUploadEvents.cropConfirmed, callback);
}


export function triggerUpdateQa() {
    console.log('triggered')
    triggerCustomEvent(UPDATE_QA_EVENT);
}

export function listenUpdateQa(callback) {
    return listenToCustomEvent(UPDATE_QA_EVENT, callback);
}
