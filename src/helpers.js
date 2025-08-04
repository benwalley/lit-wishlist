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
    const hue = Math.abs(hash) % 360;

    // Tunables
    const saturation = 75;     // vibrant but not neon
    const baseLightness = 46;  // mid-dark for good white-text contrast
    const lightnessDelta = 18; // separation between the two colors
    const hueJitter = 14;      // small hue offset for clearer distinction

    // Deterministic direction so not all strings lean the same way
    const dir = ((hash >>> 1) & 1) ? 1 : -1;

    const l1 = clamp(baseLightness - Math.ceil(lightnessDelta / 2), 28, 72);
    const l2 = clamp(baseLightness + Math.floor(lightnessDelta / 2), 28, 72);

    const s1 = saturation;
    const s2 = clamp(saturation - 6, 0, 100); // slightly less saturated

    const h1 = hue;
    const h2 = wrapHue(hue + dir * hueJitter);

    const color1 = hslToHex(h1, s1, l1);
    const color2 = hslToHex(h2, s2, l2);
    return [color2, color1];
}

// helpers (add if you don't already have them)
function clamp(n, min, max) { return Math.min(max, Math.max(min, n)); }
function wrapHue(h) { return (h % 360 + 360) % 360; }


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

export function formatDate(dateString) {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}
