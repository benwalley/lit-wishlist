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
