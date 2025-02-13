/**
 * Simple string-to-hash function for deterministic results.
 */
function generateHashFromString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
}

/**
 * Convert HSL to hex string (e.g., "#A1B2C3").
 * h: 0-360, s: 0-100, l: 0-100
 */
function hslToHex(h, s, l) {
    // Convert s & l to fractions of 1
    s /= 100;
    l /= 100;

    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n => {
        const color = l - a * Math.max(Math.min(k(n) - 3, 9 - k(n), 1), -1);
        return Math.round(255 * color)
            .toString(16)
            .padStart(2, '0');
    };

    return `#${f(0)}${f(8)}${f(4)}`;
}

/**
 * Generate two colorful but dark-enough-for-white-text colors
 * from a string, ensuring the gradient is subtle but distinct.
 */
export function generateTwoSimilarColorsFromString(str) {
    // Deterministic hue from the string
    const hash = generateHashFromString(str);
    const hue = Math.abs(hash) % 360; // 0 <= hue < 360

    // Adjust these to shift darkness/brightness to taste
    // - Too bright => white text can wash out.
    // - Too dark => loses “fun” vibrancy.
    const saturation = 80;        // Vibrant without being neon
    const baseLightness = 45;     // Mid-dark; helps white text stand out
    const secondLightness = 60;   // Slightly lighter for the second color

    const color1 = hslToHex(hue, saturation, baseLightness);
    const color2 = hslToHex(hue, saturation, secondLightness);

    return [color1, color2];
}

export function currencyHelper(price) {
    const number = parseFloat(price);
    if (isNaN(number)) {
        return price;
    }
    return number.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
    });
}
