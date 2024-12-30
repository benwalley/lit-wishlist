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
        transition: background-color 0.3s, color 0.3s, transform 0.2s;

        &.primary {
            background-color: var(--primary-color); /* Primary blue */
            color: #ffffff;

            &:hover {
                background-color: #1565c0;
            }

            &:focus {
                box-shadow: 0 0 0 4px rgba(25, 118, 210, 0.2);
            }
        }

        &.secondary {
            background-color: var(--secondary-color); /* Light gray */
            color: #1976d2;
            border: 1px solid #1976d2;

            &:hover {
                background-color: #e0e0e0;
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

        &:hover,
        &:focus,
        &:active {
            transform: scale(1.02); /* Slight scale effect for interaction */
        }

        &:disabled {
            background-color: #e0e0e0;
            color: #9e9e9e;
            cursor: not-allowed;
            pointer-events: none;
        }
    }

`;
