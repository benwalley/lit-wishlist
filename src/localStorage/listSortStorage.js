import {getItem, setItem} from "./helpers.js";

const LIST_SORT_OPTION_NAME = 'listSortOption';

export function getListSortOption() {
    const defaultValue = 'name-asc'; // A-Z as default
    const savedValue = getItem(LIST_SORT_OPTION_NAME);
    if(savedValue) {
        return savedValue;
    }
    setListSortOption(defaultValue);
    return defaultValue;
}

/**
 * Set the list sort option preference
 * @param {string} value - The sort option: 'name-asc', 'name-desc', 'wanted-desc', 'date-asc'
 */
export function setListSortOption(value) {
    setItem(LIST_SORT_OPTION_NAME, value);
}