import { userState } from '../state/userStore.js';

export function canUserContribute(user, item) {
    if(!user || !item) {
        return false;
    }

    // if item is owned by the parent user or a subuser of the parent user, you can't contribute
    const parentId = user.parentId;
    // if you are the creator or your parent is the creator, you can't contribute
    if(item.createdById === parentId || item.createdById === user.id) {
        return false;
    }

    return true;
}

export function isParentUserItem(user, item) {
    if(!user || !item) {
        return false;
    }
    const parentId = user.parentId;
    return item.createdById === parentId
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

export function canUserEditItem(user, itemData) {
    if(!user || !itemData) return false;
    if (itemData?.createdById && itemData?.createdById === user.id) {
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
