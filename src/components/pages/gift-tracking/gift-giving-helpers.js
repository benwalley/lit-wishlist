import {getUsernameById} from "../../../helpers/generalHelpers.js";

export function processContributionsData(data) {
    const giftGetters = new Map();
    for (const item of data) {
        const userId = item?.itemData?.createdById;
        if (!userId) continue;
        // Check if the item is already in the map
        if (giftGetters.has(userId)) {
            const userItems = giftGetters.get(userId);
            userItems.push(item);
            giftGetters.set(userId, userItems);
        } else {
            giftGetters.set(userId, [item]);
        }
    }

    // Sort each user's items alphabetically by name
    for (const [userId, items] of giftGetters.entries()) {
        const sortedItems = [...items].sort((a, b) => {
            return (a.name || '').localeCompare(b.name || '');
        });
        giftGetters.set(userId, sortedItems);
    }

    // Convert to array and sort alphabetically by username
    const tempArray = [];
    for (const [userId, items] of giftGetters.entries()) {
        const data = {userId: userId, items: items};
        tempArray.push(data);
    }

    // Sort groups alphabetically by username
    const sortedArray = [...tempArray].sort((a, b) => {
        const usernameA = getUsernameById(a.userId) || '';
        const usernameB = getUsernameById(b.userId) || '';
        return usernameA.localeCompare(usernameB);
    });

    return sortedArray;
}
