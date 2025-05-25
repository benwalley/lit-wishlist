
import {css} from 'lit';

export default css`
    input,
    select {
        &:focus-visible {
            box-shadow: 0 0 2px var(--focus-color) !important;
            outline: none !important;
        }    
    }
    
    input[type="checkbox"],
    input[type="radio"] {
        position: absolute;
        opacity: 0;
        cursor: pointer;
        height: 0;
        width: 0;
    }

    input[type="checkbox"] + label,
    input[type="radio"] + label {
        display: inline-flex;
        align-items: center;
        position: relative;
        cursor: pointer;
        padding-left: 1.8em;
        min-height: 1.5em;
        line-height: 1.5;
        margin-bottom: var(--spacing-x-small);
        margin-right: var(--spacing-normal);
        font-size: var(--font-size-normal);
        color: var(--text-color-dark);
        user-select: none;
        transition: color var(--transition-normal);
    }

    input[type="checkbox"] + label::before,
    input[type="radio"] + label::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 1.1em;
        height: 1.1em;
        border: 1px solid var(--border-color);
        background-color: var(--input-background-color);
        transition: background-color var(--transition-normal), border-color var(--transition-normal);
        flex-shrink: 0;
    }

    input[type="checkbox"] + label::before {
        border-radius: var(--border-radius-small);
    }

    input[type="radio"] + label::before {
        border-radius: 50%;
    }

    input[type="checkbox"] + label:hover::before,
    input[type="radio"] + label:hover::before {
        border-color: var(--primary-color);
    }

    input[type="checkbox"]:focus-visible + label::before,
    input[type="radio"]:focus-visible + label::before {
        box-shadow: 0 0 2px var(--focus-color);
        outline: none;
    }

    input[type="checkbox"]:checked + label::before,
    input[type="radio"]:checked + label::before {
        background-color: var(--primary-color);
        border-color: var(--primary-color);
    }

    input[type="checkbox"] + label::after {
        content: '';
        position: absolute;
        left: 30%;
        top: 10%;
        width: 30%;
        height: 50%;
        border: solid var(--light-text-color);
        border-width: 0 2px 2px 0;
        transform: rotate(45deg) scale(0);
        transition: transform 150ms ease-in-out;
        pointer-events: none;
    }

    input[type="checkbox"]:checked + label::after {
        transform: rotate(45deg) scale(1);
    }

    input[type="radio"] + label::after {
        content: '';
        position: absolute;
        left: 0.3em;
        top: 50%;
        transform: translateY(-50%) scale(0);
        width: 0.5em;
        height: 0.5em;
        border-radius: 50%;
        background-color: var(--light-text-color);
        transition: transform 150ms ease-in-out;
        pointer-events: none;
    }

    input[type="radio"]:checked + label::after {
        transform: translateY(-50%) scale(1);
    }

    input[type="checkbox"]:disabled + label,
    input[type="radio"]:disabled + label {
        cursor: not-allowed;
        color: var(--medium-text-color);
        opacity: 0.7;
    }

    /* Standalone checkbox styles (without label) */
    input[type="checkbox"]:not([type="checkbox"] + label),
    input[type="radio"]:not([type="radio"] + label) {
        position: relative;
        opacity: 1;
        cursor: pointer;
        height: 1.1em;
        width: 1.1em;
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        border: 1px solid var(--border-color);
        background-color: var(--input-background-color);
        transition: background-color var(--transition-normal), border-color var(--transition-normal);
        margin: 0;
    }

    input[type="checkbox"]:not([type="checkbox"] + label) {
        border-radius: var(--border-radius-small);
    }

    input[type="radio"]:not([type="radio"] + label) {
        border-radius: 50%;
    }

    input[type="checkbox"]:not([type="checkbox"] + label):hover,
    input[type="radio"]:not([type="radio"] + label):hover {
        border-color: var(--primary-color);
    }

    input[type="checkbox"]:not([type="checkbox"] + label):focus-visible,
    input[type="radio"]:not([type="radio"] + label):focus-visible {
        box-shadow: 0 0 2px var(--focus-color);
        outline: none;
    }

    input[type="checkbox"]:not([type="checkbox"] + label):checked,
    input[type="radio"]:not([type="radio"] + label):checked {
        background-color: var(--primary-color);
        border-color: var(--primary-color);
    }

    input[type="checkbox"]:not([type="checkbox"] + label):checked::after {
        content: '';
        position: absolute;
        left: 30%;
        top: 10%;
        width: 30%;
        height: 50%;
        border: solid var(--light-text-color);
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
        pointer-events: none;
    }

    input[type="radio"]:not([type="radio"] + label):checked::after {
        content: '';
        position: absolute;
        left: 0.3em;
        top: 50%;
        transform: translateY(-50%);
        width: 0.5em;
        height: 0.5em;
        border-radius: 50%;
        background-color: var(--light-text-color);
        pointer-events: none;
    }

    input[type="checkbox"]:not([type="checkbox"] + label):disabled,
    input[type="radio"]:not([type="radio"] + label):disabled {
        cursor: not-allowed;
        opacity: 0.7;
    }

    a {
        text-decoration: none;
        color: var(--link-color);
        
        &:hover {
            text-decoration: underline;
        }
    }
`;
