import {listenToCustomEvent, triggerCustomEvent} from "./custom-events.js";
import {invalidateCache} from "../helpers/caching.js";

const UPDATE_LIST_EVENT = 'update-list';
const UPDATE_ITEM_EVENT = 'update-item';
const UPDATE_QA_EVENT = 'update-qa';
const UPDATE_USER_EVENT = 'update-user';
const USER_UPDATED_EVENT = 'user-updated';
const USER_LOADED_EVENT = 'user-loaded';
const USER_LIST_LOADED_EVENT = 'user-list-loaded';
const GROUP_UPDATED_EVENT = 'group-updated';
const imageUploadEvents = {
    imageSelected: 'image-selected',
    cropConfirmed: 'crop-confirmed'
}

export function triggerUpdateList() {
    invalidateCache('/lists/*')
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

export function triggerInitialUserLoaded() {
    triggerCustomEvent(USER_LOADED_EVENT);
    triggerUserUpdated()
}

export function listenInitialUserLoaded(callback) {
    return listenToCustomEvent(USER_LOADED_EVENT, callback);
}

export function triggerUserListLoaded() {
    triggerCustomEvent(USER_LIST_LOADED_EVENT);
}

export function listenUserListLoaded(callback) {
    return listenToCustomEvent(USER_LIST_LOADED_EVENT, callback);
}

export function triggerUserUpdated() {
    triggerCustomEvent(USER_UPDATED_EVENT);
}

export function listenUserUpdated(callback) {
    return listenToCustomEvent(USER_UPDATED_EVENT, callback);
}

export function triggerGroupUpdated() {
    invalidateCache("/groups/*")
    triggerCustomEvent(GROUP_UPDATED_EVENT);
}

export function listenGroupUpdated(callback) {
    return listenToCustomEvent(GROUP_UPDATED_EVENT, callback);
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
    invalidateCache("/qa/*")
    triggerCustomEvent(UPDATE_QA_EVENT);
}

export function listenUpdateQa(callback) {
    return listenToCustomEvent(UPDATE_QA_EVENT, callback);
}
