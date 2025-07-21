import { userState } from '../state/userStore.js';

export function canUserContribute(user, item) {
    if(!user || !item) {
        return false;
    }

    if(user.id === item.createdById) {
        return false;
    }

    if(!isSubuserSecure()) {
        return false;
    }

    return true;
}

export function canUserEditList(user, list) {
    if(!user || !list) {
        return false;
    }

    if(user.id === list.ownerId) {
        return true;
    }

    return false;
}

export function isSubuserSecure() {
    return true;
}

// Group helper functions
export function getGroupNameById(groupId) {
    if (!userState.myGroups || !groupId) {
        return null;
    }
    const group = userState.myGroups.find(group => group && group.id === groupId);
    return group ? group.groupName : null;
}

export function getGroupImageIdByGroupId(groupId) {
    if (!userState.myGroups || !groupId) {
        return 0;
    }
    const group = userState.myGroups.find(group => group && group.id === groupId);
    return group ? group.groupImage : 0;
}

export function getGroupById(groupId) {
    if (!userState.myGroups || !groupId) {
        return null;
    }
    return userState.myGroups.find(group => group && group.id === groupId) || null;
}
