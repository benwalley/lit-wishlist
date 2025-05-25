import {getUsernameById} from "../../../helpers/generalHelpers.js";

export function processContributionsData(getting, acceptedProposals) {
    const giftGetters = new Map();
    for (const item of getting) {
        const userId = item?.itemData?.createdById;
        if (!userId) continue;
        item.type = 'getting';
        // Check if the item is already in the map
        if (giftGetters.has(userId)) {
            const userItems = giftGetters.get(userId);
            userItems.push(item);
            giftGetters.set(userId, userItems);
        } else {
            giftGetters.set(userId, [item]);
        }
    }

    for (const proposal of acceptedProposals) {
        const userId = proposal?.itemData?.createdById;
        if (!userId) continue;
        proposal.type = 'proposal';
        if (giftGetters.has(userId)) {
            const userItems = giftGetters.get(userId);
            userItems.push(proposal);
            giftGetters.set(userId, userItems);
        } else {
            giftGetters.set(userId, [proposal]);
        }
    }

    // Sort each user's items alphabetically by name
    for (const [userId, items] of giftGetters.entries()) {
        const sortedItems = [...items].sort((a, b) => {
            const aName = a.itemData?.name || '';
            const bName = b.itemData?.name || '';
            return aName.localeCompare(bName);
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

export const statuses = [
    { id: 'none', label: 'Not Started', icon: 'order-icon' },
    { id: 'ordered', label: 'Ordered', icon: 'ordered-icon' },
    { id: 'arrived', label: 'Arrived', icon: 'arrived-icon' },
    { id: 'wrapped', label: 'Wrapped', icon: 'wrapped-icon' },
    { id: 'given', label: 'Given', icon: 'given-icon' }
];
