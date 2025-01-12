export function isValidDateString(dateString) {
  const parsedDate = Date.parse(dateString);
  return !isNaN(parsedDate); // If it's not NaN, it's a valid date string
}

