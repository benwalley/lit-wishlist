import {css} from 'lit';

export default css`
    button,
    .button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        text-decoration: none;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s;
        gap: 7px;
        
        
        &.fullWidth {
            width: 100%;
        }

        &.primary {
            background-color: var(--primary-button-background);
            color: var(--primary-button-text);

            &:hover,
            &:focus{
                background-color: var(--primary-button-hover-background);
                outline: var(--primary-button-hover-border);
                outline-offset: -2px;
            }
        }

        &.secondary {
            background-color: var(--secondary-button-background);
            color: var(--secondary-button-text);
            border: var(--secondary-button-border);

            &:hover {
                background-color: var(--secondary-button-hover-background);
            }

            &:focus {
                box-shadow: 0 0 0 4px rgba(25, 118, 210, 0.2);
            }
        }

        &.small {
            padding: 0.25rem 0.5rem;
            font-size: 0.875rem;
        }

        &.large {
            padding: 0.75rem 1.5rem;
            font-size: 1.25rem;
        }
        
        &.icon-button {
            --icon-color: var(--primary-button-background);
            border-radius: 50px;
            color: var(--icon-color);
            padding: 5px;
            background: none;

            &:hover,
            &:focus,
            &:active {
                background: color-mix(in srgb, var(--icon-color), transparent 80%);
            }
            
        }
        

        &:disabled {
            background-color: #e0e0e0;
            color: #9e9e9e;
            cursor: not-allowed;
            pointer-events: none;
        }
        
        &.button-as-link {
            border: none;
            padding: 0;
            background: none;
            border-radius: 0;
        }
    }

`;
