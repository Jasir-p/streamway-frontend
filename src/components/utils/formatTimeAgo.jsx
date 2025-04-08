import { formatDistanceToNow, parseISO } from "date-fns";

/**
 * Convert UTC timestamp to "time ago" format
 * @param {string} utcTimestamp - The UTC timestamp from the backend
 * @returns {string} - Formatted time ago string
 */
const formatTimeAgo = (utcTimestamp) => {
    if (!utcTimestamp) return "Unknown time";

    const date = parseISO(utcTimestamp); // Convert to Date object
    return formatDistanceToNow(date, { addSuffix: true }); // "2 hours ago"
};

export default formatTimeAgo;
