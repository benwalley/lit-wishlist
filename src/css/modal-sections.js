import { css } from 'lit';

export default css`
    .modal-header {
        background-color: var(--background-dark);
        border-bottom: 1px solid var(--border-color);
        padding: var(--spacing-normal);
    }

    .modal-header h2 {
        margin: 0;
        font-size: var(--font-size-large);
        font-weight: 600;
        color: var(--text-color-dark);
    }
    
    .modal-content {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        padding: var(--spacing-normal);
        box-sizing: border-box;
    }

    .modal-footer {
        position: sticky;
        bottom: 0;
        z-index: 10;
        background-color: var(--background-light);
        border-top: 1px solid var(--border-color);
        padding: var(--spacing-normal);
        display: flex;
        justify-content: flex-end;
        gap: var(--spacing-small);
    }

    .modal-footer button {
        width: auto;
        min-width: 100px;
    }

    /* Ensure the modal container uses flexbox properly */
    .modal-container {
        display: flex;
        flex-direction: column;
        height: 100%;
        max-height: 85vh;
    }
`;
