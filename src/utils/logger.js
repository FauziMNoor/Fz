/**
 * Safe logger utility
 * Only logs in development environment
 * Prevents sensitive data exposure in production
 */

const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  /**
   * Log general information (development only)
   */
  log: (...args) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },

  /**
   * Log errors (always logged for monitoring)
   */
  error: (...args) => {
    console.error(...args);
  },

  /**
   * Log warnings (always logged for monitoring)
   */
  warn: (...args) => {
    console.warn(...args);
  },

  /**
   * Log info (development only)
   */
  info: (...args) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },

  /**
   * Log debug information (development only)
   */
  debug: (...args) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  },
};
