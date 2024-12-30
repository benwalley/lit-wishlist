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
 * Generate two similar, darker colors from a string
 * so white text remains visible on top.
 */
export function generateTwoSimilarColorsFromString(str) {
    // Generate a deterministic hue from the string
    const hash = generateHashFromString(str);
    const hue = Math.abs(hash) % 360; // 0 <= hue < 360

    // For darker backgrounds, keep lightness relatively low.
    // We'll choose two close lightness values for the gradient
    // so it's subtle but still distinct.
    const saturation = 70;          // fairly vibrant
    const lightnessBase = 30;       // darker base
    const lightnessVariance = 25;   // how much we increase for second color

    // If you want them even darker, reduce lightnessBase.
    // If you want them a bit lighter, increase lightnessBase or saturation.

    const color1 = hslToHex(hue, saturation, lightnessBase);
    const color2 = hslToHex(hue, saturation, lightnessBase + lightnessVariance);

    return [color1, color2];
}
