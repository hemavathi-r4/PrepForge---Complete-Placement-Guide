/**
 * Formats an ISO date string into a friendly readable date format.
 * @param {string} dateString 
 * @returns {string} Formatted date (e.g. "Jul 20, 2026")
 */
export const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Truncates a string to a specific limit and appends ellipses if truncated.
 * @param {string} text 
 * @param {number} limit 
 * @returns {string} Truncated text
 */
export const truncateText = (text, limit = 100) => {
  if (!text) return "";
  if (text.length <= limit) return text;
  return `${text.slice(0, limit)}...`;
};

/**
 * Capitalizes the first letter of a string.
 * @param {string} str 
 * @returns {string} Capitalized string
 */
export const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};
