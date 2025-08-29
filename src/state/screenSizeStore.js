import { LitState } from 'lit-element-state';

class ScreenSizeState extends LitState {
    static get stateVars() {
        return {
            width: 0,
            height: 0,
            isInitialized: false,
        };
    }

    constructor() {
        super();
        this.resizeDebounceTimer = null;
        this.initialize();
    }

    // Initialize screen size detection
    initialize() {
        if (typeof window !== 'undefined') {
            this.updateDimensions();
            this.setupEventListeners();
            this.isInitialized = true;
        }
    }

    // Update current window dimensions
    updateDimensions() {
        if (typeof window !== 'undefined') {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
        }
    }

    // Set up resize event listener with debouncing
    setupEventListeners() {
        if (typeof window !== 'undefined') {
            window.addEventListener('resize', this.handleResize.bind(this));
        }
    }

    // Handle window resize with debouncing
    handleResize() {
        if (this.resizeDebounceTimer) {
            clearTimeout(this.resizeDebounceTimer);
        }

        this.resizeDebounceTimer = setTimeout(() => {
            this.updateDimensions();
        }, 300);
    }

    isSmallMobile() {
        return this.width < 600;
    }

    isMobile() {
        return this.width < 768;
    }

    isDesktop() {
        return this.width >= 1024;
    }

    isTablet() {
        return this.width >= 768 && this.width < 1024;
    }

    getBreakpoint() {
        if (this.isMobile()) return 'mobile';
        if (this.isTablet()) return 'tablet';
        return 'desktop';
    }

    destroy() {
        if (typeof window !== 'undefined') {
            window.removeEventListener('resize', this.handleResize.bind(this));
        }
        if (this.resizeDebounceTimer) {
            clearTimeout(this.resizeDebounceTimer);
        }
    }
}

export const screenSizeState = new ScreenSizeState();
