/**
 * Calculates expiration time based on given minutes
 * @param {number} minutes - Expiration time in minutes
 * @returns {Date} - Expiry timestamp
 */
export const getExpirationTime = (minutes) => {
    return new Date(Date.now() + minutes * 60 * 1000);
  }
  