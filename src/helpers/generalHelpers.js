export function formatDate(dateString) {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'long',  // Full month name (e.g., March)
        day: 'numeric',  // Day of the month (e.g., 15)
        year: 'numeric'  // Full year (e.g., 2024)
    });
}
