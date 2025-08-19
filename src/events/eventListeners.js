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
const BULK_ADD_TO_GROUP_MODAL_EVENT = 'open-bulk-add-to-group-modal';
const BULK_ADD_TO_LIST_MODAL_EVENT = 'open-bulk-add-to-list-modal';
const DELETE_LIST_EVENT = 'delete-list';
const PROPOSAL_MODAL_EVENT = 'open-proposal-modal';
const PROPOSAL_CREATED_EVENT = 'proposal-created';
const EDIT_PROPOSAL_MODAL_EVENT = 'open-edit-proposal-modal';
const DELETE_PROPOSAL_EVENT = 'delete-proposal';
const PROPOSAL_DELETED_EVENT = 'proposal-deleted';
const UPDATE_EVENTS_EVENT = 'update-events';
const EDIT_EVENT_EVENT = 'edit-event';
const VIEWED_ITEMS_UPDATED_EVENT = 'viewed-items-updated';
const VIEWED_ITEMS_LOADED_EVENT = 'viewed-items-loaded';
const UPDATE_MONEY_EVENT = 'update-money';
const UPDATE_NOTIFICATIONS_EVENT = 'update-notifications';
const THEME_CHANGED_EVENT = 'theme-changed';
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
    invalidateCache('/giftTracking/*');
    invalidateCache('/proposals/*');
    invalidateCache('/listItems/*');
    invalidateCache('/lists/*');
    invalidateCache('/events/*');
    triggerCustomEvent(UPDATE_ITEM_EVENT);
}

export function listenUpdateItem(callback) {
    return listenToCustomEvent(UPDATE_ITEM_EVENT, callback);
}

export function triggerUpdateUser() {
    invalidateCache('/users/*')
    triggerCustomEvent(UPDATE_USER_EVENT);
}

export function listenUpdateUser(callback) {
    console.log('heard an update user')
    return listenToCustomEvent(UPDATE_USER_EVENT, callback);
}

export function triggerInitialUserLoaded() {
    triggerCustomEvent(USER_LOADED_EVENT);
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

export function triggerGroupUpdated() {
    invalidateCache("/groups/*")
    invalidateCache("/users/accessible")
    triggerCustomEvent(GROUP_UPDATED_EVENT);
}

export function listenGroupUpdated(callback) {
    return listenToCustomEvent(GROUP_UPDATED_EVENT, callback);
}

export function triggerBulkAddToGroupModal(group) {
    triggerCustomEvent(BULK_ADD_TO_GROUP_MODAL_EVENT, { group });
}

export function listenBulkAddToGroupModal(callback) {
    return listenToCustomEvent(BULK_ADD_TO_GROUP_MODAL_EVENT, callback);
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

export function triggerBulkAddToListModal(list) {
    triggerCustomEvent(BULK_ADD_TO_LIST_MODAL_EVENT, { list });
}

export function listenBulkAddToListModal(callback) {
    return listenToCustomEvent(BULK_ADD_TO_LIST_MODAL_EVENT, callback);
}

export function triggerDeleteList(listData) {
    triggerCustomEvent(DELETE_LIST_EVENT, { listData });
}

export function listenDeleteList(callback) {
    return listenToCustomEvent(DELETE_LIST_EVENT, callback);
}

export function triggerProposalModal(itemData) {
    triggerCustomEvent(PROPOSAL_MODAL_EVENT, { itemData });
}

export function listenProposalModal(callback) {
    return listenToCustomEvent(PROPOSAL_MODAL_EVENT, callback);
}

export function triggerProposalCreated(proposal) {
    triggerCustomEvent(PROPOSAL_CREATED_EVENT, { proposal });
}

export function listenProposalCreated(callback) {
    return listenToCustomEvent(PROPOSAL_CREATED_EVENT, callback);
}

export function triggerEditProposalModal(proposalData) {
    triggerCustomEvent(PROPOSAL_MODAL_EVENT, { proposalData, isEditMode: true });
}

export function triggerDeleteProposal(proposal) {
    triggerCustomEvent(DELETE_PROPOSAL_EVENT, { proposal });
}

export function listenDeleteProposal(callback) {
    return listenToCustomEvent(DELETE_PROPOSAL_EVENT, callback);
}

export function triggerProposalDeleted(proposalId) {
    triggerCustomEvent(PROPOSAL_DELETED_EVENT, { proposalId });
}

export function listenProposalDeleted(callback) {
    return listenToCustomEvent(PROPOSAL_DELETED_EVENT, callback);
}

export function triggerUpdateEvents() {
    invalidateCache('/events');
    invalidateCache('/events/*');
    triggerCustomEvent(UPDATE_EVENTS_EVENT);
}

export function listenUpdateEvents(callback) {
    return listenToCustomEvent(UPDATE_EVENTS_EVENT, callback);
}

export function triggerEditEvent(eventData) {
    triggerCustomEvent(EDIT_EVENT_EVENT, { eventData });
}

export function listenEditEvent(callback) {
    return listenToCustomEvent(EDIT_EVENT_EVENT, callback);
}

export function triggerUpdateViewedItems() {
    invalidateCache('/listItems/viewed');
    triggerCustomEvent(VIEWED_ITEMS_UPDATED_EVENT);
}

export function listenUpdateViewedItems(callback) {
    return listenToCustomEvent(VIEWED_ITEMS_UPDATED_EVENT, callback);
}

export function triggerViewedItemsLoaded() {
    triggerCustomEvent(VIEWED_ITEMS_LOADED_EVENT);
}

export function listenViewedItemsLoaded(callback) {
    return listenToCustomEvent(VIEWED_ITEMS_LOADED_EVENT, callback);
}

export function triggerUpdateMoney() {
    invalidateCache('/money/*');
    triggerCustomEvent(UPDATE_MONEY_EVENT);
}

export function listenUpdateMoney(callback) {
    return listenToCustomEvent(UPDATE_MONEY_EVENT, callback);
}

export function triggerUpdateNotifications() {
    invalidateCache('/notifications');
    invalidateCache('/notifications/*');
    triggerCustomEvent(UPDATE_NOTIFICATIONS_EVENT);
}

export function listenUpdateNotifications(callback) {
    return listenToCustomEvent(UPDATE_NOTIFICATIONS_EVENT, callback);
}

export function triggerThemeChanged(theme) {
    triggerCustomEvent(THEME_CHANGED_EVENT, { theme });
}

export function listenThemeChanged(callback) {
    return listenToCustomEvent(THEME_CHANGED_EVENT, callback);
}
