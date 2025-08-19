import {getItem, setItem} from "./helpers.js";
import {triggerThemeChanged} from "../events/eventListeners.js";
const DARK_LIGHT_MODE_NAME = 'darkLightMode';

export function getDarkLightMode() {
    let defaultValue = 'light';
    if (isBrowserDarkMode()) {
        defaultValue = 'dark';
    }
    const savedValue = getItem(DARK_LIGHT_MODE_NAME);
    if(savedValue) {
        return savedValue;
    }
    setDarkLightMode(defaultValue);
    return defaultValue;
}

function isBrowserDarkMode() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

/**
 *
 * @param value
 */
export function setDarkLightMode(value) {
    setItem(DARK_LIGHT_MODE_NAME, value);
    document.body.dataset.mode = value;
    
    // Trigger theme changed event
    triggerThemeChanged(value);
}
