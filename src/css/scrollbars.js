import {css} from 'lit';

export default css`
    /* Firefox scrollbar styles */
    .scrollable,
    .custom-scrollbar {
        scrollbar-width: thin;
        scrollbar-color: var(--grayscale-400) transparent;
    }
    
    /* Webkit scrollbar styles */
    .scrollable::-webkit-scrollbar,
    .custom-scrollbar::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }
    
    .scrollable::-webkit-scrollbar-track,
    .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
        border-radius: 4px;
    }
    
    .scrollable::-webkit-scrollbar-thumb,
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: var(--grayscale-400);
        border-radius: 4px;
        border: 2px solid transparent;
        background-clip: content-box;
    }
    
    .scrollable::-webkit-scrollbar-thumb:hover,
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background-color: var(--grayscale-500);
    }
`;