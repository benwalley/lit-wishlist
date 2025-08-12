export const envVars = {
    API_URL: import.meta.env.DEV
        ? `http://localhost:3000/api`
        : `https://node-wishlist-website-1d9acdcb5bdb.herokuapp.com/api`,
    STORAGE_ITEM_NAME: 'wishlist',
    LIST_ITEM_MAX_LENGTH: 70,
}
