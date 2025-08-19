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
        
        &.bold {
            font-weight: 600;
        }
        
        &.shadow {
            box-shadow: var(--button-box-shadow);
            &:hover,
            &:active,
            &:focus {
                box-shadow: var(--button-box-shadow-hover);
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
                background-image: var(--fancy-gradient-two);
            }
            
            &.fancy-alt {
                background-image: var(--fancy-purple-gradient);
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

            &.danger-text {
                color: var(--delete-red);
                border-color: var(--delete-red);
                
                &:hover,
                &:focus,
                &:active {
                    background: var(--delete-red-light);
                    color: var(--delete-red-darker);
                }
            }
            
            &.blue-text {
                color: var(--blue-normal);
                border-color: var(--blue-normal);
                
                &:hover,
                &:focus,
                &:active {
                    background: var(--blue-light);
                    color: var(--blue-darker);
                }
            }
            
            &.green-text {
                color: var(--green-normal);
                border-color: var(--green-normal);
                
                &:hover,
                &:focus,
                &:active {
                    background: var(--green-light);
                }
            }
            
            &.purple-text {
                color: var(--purple-normal);
                border-color: var(--purple-normal);
                
                &:hover,
                &:focus,
                &:active {
                    background: var(--purple-light);
                }
            }

            &.white-text {
                color: var(--light-text-color);
                border-color: var(--light-text-color);

                &:hover,
                &:focus,
                &:active {
                    background: var(--dark-text-color);
                }
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

        /* Dropdown item styles */
        &.danger-text.danger-text {
            color: var(--delete-red);
            &:hover,
            &:focus {
                background-color: var(--delete-red-light);
                color: var(--delete-red-darker);
            }
        }
        
        &.blue-text.blue-text {
            color: var(--blue-normal);
            &:hover,
            &:focus {
                background-color: var(--blue-light);
                color: var(--blue-darker);
            }
        }

        &.green-text {
            color: var(--green-normal);
            &:hover,
            &:focus {
                background-color: var(--green-light);
            }
        }

        &.purple-text {
            color: var(--purple-normal);
            &:hover,
            &:focus {
                background-color: var(--purple-light);
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
            font-size: var(--font-size-medium);
        }

        &.icon-button,
        &.link-button {
            --icon-color: var(--link-button-text);
            --icon-background: transparent;
            --icon-color-hover: var(--link-button-hover-text);
            --icon-hover-background: var(--link-button-hover-background);
            border-radius: var(--border-radius-normal);
            color: var(--icon-color);
            padding: 8px;
            background: var(--icon-background);

            &:hover,
            &:focus,
            &:active {
                background: var(--icon-hover-background);
                color: var(--icon-color-hover);
            }

            &.danger-text {
                --icon-color: var(--delete-red);
                --icon-hover-background: var(--delete-red-light);
            }
            
            &.blue-text {
                --icon-color: var(--blue-normal);
                --icon-hover-background: var(--blue-light);
            }
            
            &.green-text {
                --icon-color: var(--green-normal);
                --icon-hover-background: var(--green-light);
            }
            
            &.purple-text {
                --icon-color: var(--purple-normal);
                --icon-hover-background: var(--purple-light);
            }
            
            &.white-text {
                --icon-color: var(--background-light-light);
                --icon-hover-background: var(--background-light-dark);
            }
            
            &.primary-text {
                --icon-color: var(--primary-color);
                --icon-hover-background: var(--primary-color-light);
            }
        }
        
        &.small-link-button {
            color: var(--purple-normal);
            background: none;
            padding: 2px;
            border: none;
            font-size: var(--font-size-x-small);
            gap: 2px;


            &:hover {
                transform: none;
                color: var(--purple-darker);
            }
        }


        &:disabled {
            cursor: not-allowed;
            pointer-events: none;
            opacity: 0.5;
        }

        &.button-as-link {
            border: none;
            padding: 0;
            background: none;
            border-radius: 0;
            color: var(--link-color);
        }
        
        &:hover,
        &:active,
        &:focus {
            
        }
    }

`;
