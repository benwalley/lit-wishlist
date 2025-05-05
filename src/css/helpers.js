import {css} from 'lit';

export default css`
    .fade-out-container {
        position: relative;

        &:after {
            content: ''; /* Required for pseudo-elements */
            position: sticky; /* Make the element stick to the viewport of the scrolling container */
            bottom: 0;      /* Stick to the bottom edge */
            left: 0;        /* Stretch across the width */
            right: 0;       /* Stretch across the width (alternative to width: 100%) */
            height: 50px;   /* Height of the fade effect - adjust as needed */
            background: linear-gradient(to bottom, oklch(1 0 0 / 0), oklch(1 0 0 / 1));
            pointer-events: none; /* Allows clicking/scrolling through the fade */
            display: block;
        }
    }
`;
