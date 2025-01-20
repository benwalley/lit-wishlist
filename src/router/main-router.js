// router.js
import { Router } from '@vaadin/router';
import '../components/pages/guest-home/guest-home-container.js';
import '../components/pages/account/account-container.js'
import '../components/pages/list/list-view-container.js'
import '../components/pages/listItem/item-view-container.js'
import '../components/pages/not-found.js';


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
        path: '/list/:listId',
        component: 'list-view-container',
    },
    {
        path: '/list/:listId/item/:itemId',
        component: 'item-view-container',
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
