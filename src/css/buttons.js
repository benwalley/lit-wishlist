import {css} from 'lit';

export default css`
    button,
    .button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.5rem 1rem;
        border: none;
        border-radius: var(--border-radius-normal);
        font-size: 1rem;
        text-decoration: none;
        font-weight: 500;
        cursor: pointer;
        gap: 7px;
        transition: var(--transition-normal);
        
        &.shadow {
            box-shadow: var(--button-box-shadow);
            &:hover,
            &:active,
            &:focus {
                box-shadow: var(--button-box-shadow-hover);
                transform: scale(1.01);
            }
        }


        &.fullWidth {
            width: 100%;
        }

        &.primary {
            background-color: var(--primary-button-background);
            color: var(--primary-button-text);
            border-radius: var(--border-radius-normal);

            &:hover,
            &:focus {
                background-color: var(--primary-button-hover-background);
            }

            &.fancy {
                background-image: linear-gradient(to right, #4f46e5, #9333ea);

            }
        }

        &.secondary {
            background-color: transparent;
            color: var(--secondary-color);
            border: 1px solid var(--secondary-color);
            font-weight: 500;

            &:hover {
                background-color: var(--blue-light);
                color: var(--blue-darker);
                border-color: var(--blue-darker);
            }
        }

        &.ghost {
            border: 1px solid var(--ghost-button-border-color);
            color: var(--text-color-dark);
            background: none;

            &:hover,
            &:focus,
            &:active {
                background: rgba(204, 204, 204, .1);
            }
        }
        
        &.danger {
            background-color: var(--danger-button-background);
            color: var(--danger-button-text);
            border-radius: var(--border-radius-normal);

            &:hover,
            &:focus {
                background-color: var(--danger-button-hover-background);
            }
        }

        &.blue {
            background-color: var(--blue-normal);
            color: var(--light-text-color);
            border-radius: var(--border-radius-normal);

            &:hover,
            &:focus {
                background-color: var(--blue-normal);
            }
        }

        &.green {
            background-color: var(--green-normal);
            color: var(--light-text-color);
            border-radius: var(--border-radius-normal);

            &:hover,
            &:focus {
                background-color: var(--green-normal);
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

        &.icon-button,
        &.link-button {
            --icon-color: var(--link-button-text);
            --icon-color-hover: var(--link-button-hover-text);
            --icon-hover-background: var(--link-button-hover-background);
            border-radius: var(--border-radius-normal);
            color: var(--icon-color);
            padding: 8px;
            background: none;

            &:hover,
            &:focus,
            &:active {
                background: var(--icon-hover-background);
                color: var(--icon-color-hover);
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
        
        &:hover,
        &:active,
        &:focus {
            transform: scale(1.01);
        }
    }

`;
