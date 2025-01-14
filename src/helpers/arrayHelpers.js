export const arrayConverter = {
    toAttribute: (value) => {
        // Convert the array to a JSON string.
        // e.g. [1,42,1337] => "[1,42,1337]"
        return JSON.stringify(value ?? []);
    },
    fromAttribute: (value) => {
        // Convert the JSON string back to an array of numbers.
        try {
            return JSON.parse(value || '[]');
        } catch (e) {
            return [];
        }
    }
};
