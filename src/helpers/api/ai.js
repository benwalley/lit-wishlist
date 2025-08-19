/**
 * AI API Helper Functions
 *
 * This module provides helper functions for interacting with AI services including:
 * - Text generation (generateAiResponse)
 * - Image generation with three types: custom, abstract, and animal
 *
 * All functions require JWT authentication and follow the standard API response format:
 * {success: boolean, data?: Object, error?: string}
 *
 * Image generation uses Imagen 4 Fast model producing 500x500 PNG images.
 * Generated images are automatically saved with metadata and accessible via imageId.
 */

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

/**
 * Validates image generation request parameters
 * @param {string} imageType - Type of image: "custom", "abstract", or "animal"
 * @param {string|null} prompt - Text description for custom images
 * @returns {{valid: boolean, error?: string}} - Validation result
 */
export function validateImageGenerationRequest(imageType, prompt) {
    const validTypes = ['custom', 'abstract', 'animal'];

    if (imageType && !validTypes.includes(imageType)) {
        return {
            valid: false,
            error: 'Invalid imageType. Must be one of: custom, abstract, animal'
        };
    }

    return { valid: true };
}

/**
 * Generate an AI image of the specified type
 *
 * @param {string} [imageType='custom'] - Type of image to generate
 * @param {string|null} [prompt=null] - Text description for custom images (required for custom type)
 *
 * @description
 * Generates images using Imagen 4 Fast model. Images are 500x500 pixels in PNG format.
 * - custom: Requires a text prompt describing the desired image
 * - abstract: Random artistic image suitable for profile pictures
 * - animal: Random cute animal with kawaii/cartoon styling
 *
 * @returns {Promise<{success: boolean, imageId?: number, imageType?: string, metadata?: Object, message?: string, error?: string}>}
 *
 * @example
 * // Generate custom image
 * const custom = await generateImage('custom', 'a serene lake at sunset');
 *
 * @example
 * // Generate abstract profile image
 * const abstract = await generateImage('abstract');
 *
 * @example
 * // Generate cute animal
 * const animal = await generateImage('animal');
 *
 * @throws {Error} When request validation fails or API errors occur
 */
export async function generateImage(imageType = 'custom', prompt = null) {
    try {
        // Validate request parameters
        const validation = validateImageGenerationRequest(imageType, prompt);
        if (!validation.valid) {
            return { success: false, error: validation.error, message: validation.error };
        }

        const requestBody = { imageType };
        if (prompt) {
            requestBody.prompt = prompt;
        }

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        };

        const result = await customFetch('/images/generate', options, true);

        // Handle API errors
        if (!result.success) {
            return {
                success: false,
                error: result.message || result.error || 'Failed to generate image'
            };
        }

        return result;
    } catch (error) {
        console.error('Error generating image:', error);
        return { success: false, error: error.message || 'An unexpected error occurred' };
    }
}

/**
 * Generate a custom AI image from a text prompt
 * @param {string} prompt - Text description of the image to generate
 * @returns {Promise<{success: boolean, data?: {imageId: number, imageType: string, metadata: Object}, error?: string}>}
 * @example
 * const result = await generateCustomImage("a beautiful sunset over mountains");
 * if (result.success) {
 *   console.log('Generated image ID:', result.imageId);
 * }
 */
export async function generateCustomImage(prompt) {
    if (!prompt || typeof prompt !== 'string') {
        return { success: false, error: 'Prompt is required and must be a string' };
    }

    return await generateImage('custom', prompt);
}

/**
 * Generate a random abstract profile image
 * @returns {Promise<{success: boolean, data?: {imageId: number, imageType: string, metadata: Object}, error?: string}>}
 * @example
 * const result = await generateAbstractImage();
 * if (result.success) {
 *   console.log('Generated abstract image ID:', result.imageId);
 * }
 */
export async function generateAbstractImage() {
    return await generateImage('abstract');
}

/**
 * Generate a random cute animal image
 * @returns {Promise<{success: boolean, data?: {imageId: number, imageType: string, metadata: Object}, error?: string}>}
 * @example
 * const result = await generateAnimalImage();
 * if (result.success) {
 *   console.log('Generated animal image ID:', result.imageId);
 * }
 */
export async function generateAnimalImage() {
    return await generateImage('animal');
}
