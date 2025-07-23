export const envVars = {
    API_URL: import.meta.env.DEV 
        ? `http://localhost:3000/api`  // Development
        : `https://node-wishlist-website.herokuapp.com/api`,  // Production
    STORAGE_ITEM_NAME: 'wishlist',
}
