// router.js
import { Router } from '@vaadin/router';
import { userState } from '../state/userStore.js';
import '../components/pages/guest-home/guest-home-container.js';
import '../components/pages/account/account-container.js'
import '../components/pages/list/list-view-container.js'
import '../components/pages/listItem/item-view-container.js'
import '../components/pages/not-found.js';
import '../components/pages/account/qa/qa-page-container.js';
import '../components/pages/groups/group-view-container.js';
import '../components/pages/user/user-view-container.js';
import '../components/pages/lists/all-lists-container.js';
import '../components/pages/events/event-view-container.js';
import '../components/pages/events/events-page.js';
import '../components/pages/gift-tracking/gift-tracking-proposals.js';
import '../components/pages/groups/groups-page.js';
import '../components/pages/import/import-wishlist-container.js';
import '../components/pages/ai/ai-test-container.js';
import '../components/pages/subusers/subusers-page.js';
import '../components/pages/bulk-actions/bulk-actions-page.js';
import '../components/pages/my-lists/my-lists-container.js';
import '../components/pages/money-tracking/money-tracking-page.js';
import '../components/pages/password-reset/password-reset-container.js';

// Authentication guard function
const requireAuth = (context, commands) => {
    // If still loading user data, allow navigation (auth-container will handle)
    if (userState.loadingUser) {
        return undefined;
    }
    
    // If no authenticated user, redirect to login page
    if (!userState.userData?.id) {
        return commands.redirect('/');
    }
    
    // User is authenticated, allow access
    return undefined;
};


const routes = [
    {
        path: '/',
        component: 'guest-home',
    },
    {
        path: '/reset-password',
        component: 'password-reset-container',
    },
    {
        path: '/account',
        component: 'account-container',
        action: requireAuth,
    },
    {
        path: '/user/:userId',
        component: 'user-view-container',
        action: requireAuth,
    },
    {
        path: '/group/:groupId',
        component: 'group-view-container',
        action: requireAuth,
    },
    {
        path: '/lists',
        component: 'all-lists-container',
        action: requireAuth,
    },
    {
        path: '/list/:listId',
        component: 'list-view-container',
        action: requireAuth,
    },
    {
        path: '/item/:itemId',
        component: 'item-view-container',
        action: requireAuth,
    },
    {
        path: '/list/:listId/item/:itemId',
        component: 'item-view-container',
        action: requireAuth,
    },
    {
        path: '/qa',
        component: 'qa-page-container',
        action: requireAuth,
    },
    {
        path: '/events/:eventId',
        component: 'event-view-container',
        action: requireAuth,
    },
    {
        path: '/events',
        component: 'events-page',
        action: requireAuth,
    },
    {
        path: '/proposals',
        component: 'gift-tracking-proposals',
        action: requireAuth,
    },
    {
        path: '/groups',
        component: 'groups-page',
        action: requireAuth,
    },
    {
        path: '/import',
        component: 'import-wishlist-container',
        action: requireAuth,
    },
    {
        path: '/subusers',
        component: 'subusers-page',
        action: requireAuth,
    },
    {
        path: '/bulk-actions',
        component: 'bulk-actions-page',
        action: requireAuth,
    },
    {
        path: '/my-lists',
        component: 'my-lists-container',
        action: requireAuth,
    },
    {
        path: '/ai',
        component: 'ai-test-container',
        action: requireAuth,
    },
    {
        path: '/money-tracking',
        component: 'money-tracking-page',
        action: requireAuth,
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
