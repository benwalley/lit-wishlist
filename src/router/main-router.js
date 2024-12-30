// router.js
import { Router } from '@vaadin/router';
import '../components/pages/guest-home/guest-home-container.js';
import '../components/pages/account/account-container.js'
import '../components/pages/not-found.js';
import { userState } from '../state/userStore.js'; // Adjust the path as necessary


const routes = [
    {
        path: '/',
        component: 'guest-home',
    },
    {
        path: '/account',
        component: 'account-container',
    },
    {
        path: '(.*)',
        component: 'not-found'
    }
];

// Initialize the router
export const initRouter = (outlet) => {
    const router = new Router(outlet);
    router.setRoutes(routes);
    return router;
};

// Helper to navigate programmatically
export const navigate = (path) => {
    Router.go(path);
};
