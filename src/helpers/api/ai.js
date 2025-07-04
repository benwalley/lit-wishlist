import {customFetch} from "../fetchHelpers.js";

/**
 * Generate AI response from a prompt
 * @param {string} prompt - The prompt to send to the AI
 * @returns {Promise<{success: boolean, data: Object}|{success: boolean, error: Error}>}
 */
export async function generateAiResponse(prompt) {
    try {
        if (!prompt) {
            throw new Error('Prompt is required');
        }

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: prompt
            }),
        };

        const result = await customFetch('/ai/generate', options, true);
        return result;
    } catch (error) {
        console.error('Error generating AI response:', error);
        return { success: false, error };
    }
}