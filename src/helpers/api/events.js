import {cachedFetch} from "../caching.js";
import {customFetch} from "../fetchHelpers.js";

/**
 * Fetches all events
 * @returns {Promise<Object>} Object containing events data or error
 */
export async function fetchEvents() {
    try {
        return await cachedFetch('/events', {}, true);
    } catch (error) {
        console.error('Error fetching events:', error);
        return {
            success: false,
            error: 'An error occurred while fetching events.'
        };
    }
}

/**
 * Fetches a single event by ID
 * @param {string} eventId - The ID of the event to fetch
 * @returns {Promise<Object>} Object containing event data or error
 */
export async function fetchEvent(eventId) {
    try {
        return await cachedFetch(`/events/${eventId}`, {}, true);
    } catch (error) {
        console.error('Error fetching event:', error);
        return {
            success: false,
            error: 'An error occurred while fetching the event.'
        };
    }
}

/**
 * Creates a new event
 * @param {Object} eventData - The event data to create
 * @returns {Promise<Object>} Object containing created event data or error
 */
export async function createEvent(eventData) {
    try {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(eventData),
        };

        return await customFetch('/events', options, true);
    } catch (error) {
        console.error('Error creating event:', error);
        return {
            success: false,
            error: 'An error occurred while creating the event.'
        };
    }
}

/**
 * Updates an existing event
 * @param {Object} eventData - The event data to update including eventId
 * @returns {Promise<Object>} Object containing updated event data or error
 */
export async function updateEvent(eventData) {
    try {
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(eventData),
        };

        return await customFetch(`/events/${eventData.eventId}`, options, true);
    } catch (error) {
        console.error('Error updating event:', error);
        return {
            success: false,
            error: 'An error occurred while updating the event.'
        };
    }
}

/**
 * Deletes an event
 * @param {string} eventId - The ID of the event to delete
 * @returns {Promise<Object>} Object containing success status or error
 */
export async function deleteEvent(eventId) {
    try {
        const options = {
            method: 'DELETE',
        };

        return await customFetch(`/events/${eventId}`, options, true);
    } catch (error) {
        console.error('Error deleting event:', error);
        return {
            success: false,
            error: 'An error occurred while deleting the event.'
        };
    }
}