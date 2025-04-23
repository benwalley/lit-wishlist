
export function isGroupAdmin(group, userId) {
    try {

        if (!group || !userId) return false;
        if(parseInt(group.ownerId) === parseInt(userId)) return true;
        return group.adminIds?.includes(parseInt(userId));
    } catch(e) {
        return false;
    }
}

export function isGroupOwner(group, userId) {
    try {

        if (!group || !userId) return false;
        return (parseInt(group.ownerId) === parseInt(userId))
    } catch(e) {
        return false;
    }
}
