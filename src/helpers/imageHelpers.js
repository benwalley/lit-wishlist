import {customFetch} from "./fetchHelpers.js";

export async function uploadImageToDB(dataUrl) {
    const blob = dataURLToBlob(dataUrl);
    const formData = new FormData();
    formData.append('image', blob, 'my_uploaded_image.jpg');

    const res = await customFetch('/images/upload', {
        method: 'POST',
        body: formData,
    });
    if (!res.success) {
        throw new Error(`Server responded with ${res.status}`);
    }
    // e.g. return { success: true, imageId: 42, publicUrl: "..." }
    return res;
}

export function dataURLToBlob(dataUrl) {
    const [header, base64] = dataUrl.split(',');
    const binary = atob(base64);
    const len = binary.length;
    const buffer = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        buffer[i] = binary.charCodeAt(i);
    }
    const match = header.match(/data:(.*);base64/);
    const contentType = match ? match[1] : 'image/jpeg';
    return new Blob([buffer], { type: contentType });
}
