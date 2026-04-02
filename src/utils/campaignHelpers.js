/**
 * Formats a date string to a readable format.
 * Fixes "Invalid Date" bug.
 */
export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

/**
 * Converts a timeline string like "2 weeks" or "1 month" to startDate and endDate.
 */
export const convertTimeline = (timeline) => {
  if (!timeline) return { startDate: new Date(), endDate: new Date() };

  const today = new Date();
  let endDate = new Date(today);

  const match = timeline.match(/(\d+)\s*(week|month|day)s?/i);
  if (match) {
    const value = parseInt(match[1]);
    const unit = match[2].toLowerCase();

    if (unit === 'week') {
      endDate.setDate(today.getDate() + (value * 7));
    } else if (unit === 'month') {
      endDate.setMonth(today.getMonth() + value);
    } else if (unit === 'day') {
      endDate.setDate(today.getDate() + value);
    }
  } else {
    // Default to 1 week if no match
    endDate.setDate(today.getDate() + 7);
  }

  return {
    startDate: today.toISOString(),
    endDate: endDate.toISOString()
  };
};
