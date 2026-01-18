// In-memory holder for access token with auto-refresh
// Short-lived token pattern: ~10-15 minutes
// Resets on page reload for security (prevents XSS persistence)

let accessTokenMemory = null;
let tokenExpirationTimer = null;
let tokenExpiresAt = null;

// Callback function to handle token refresh
let onTokenExpired = null;

export const getAccessToken = () => accessTokenMemory;

/**
 * Check if token is still valid
 * Considers token expired if less than 60 seconds remaining
 */
export const isTokenValid = () => {
  if (!accessTokenMemory || !tokenExpiresAt) {
    return false;
  }
  const now = Date.now();
  return now < tokenExpiresAt - 60000;
};

/**
 * Get remaining time in seconds
 */
export const getTokenRemainingTime = () => {
  if (!tokenExpiresAt) return 0;
  return Math.max(0, Math.floor((tokenExpiresAt - Date.now()) / 1000));
};

/**
 * Set callback to trigger when token is about to expire
 * @param {Function} callback - Function to call when token is expiring
 */
export const setOnTokenExpired = (callback) => {
  onTokenExpired = callback;
};

/**
 * Store access token with auto-refresh before expiration
 * Implements short-lived token pattern for XSS protection:
 * - Token stored in memory only (not localStorage/sessionStorage)
 * - Auto-refreshes 60 seconds before expiration
 * - Resets on page reload (cannot be persisted)
 *
 * @param {string} token - Access token from BE
 * @param {number} expiresIn - Token expiration time in seconds (e.g., 600 for 10 minutes)
 */
export const setAccessToken = (token, expiresIn = 600) => {
  accessTokenMemory = token || null;

  // Clear existing timer
  if (tokenExpirationTimer) {
    clearTimeout(tokenExpirationTimer);
    tokenExpirationTimer = null;
  }

  if (token && expiresIn > 0) {
    // Set expiration time (now + expiresIn seconds)
    tokenExpiresAt = Date.now() + expiresIn * 1000;

    // Schedule refresh 60 seconds before expiration
    // This gives BE time to refresh and FE time to update token
    const refreshTime = Math.max(0, (expiresIn - 60) * 1000);

    if (refreshTime > 0) {
      tokenExpirationTimer = setTimeout(() => {
        if (onTokenExpired) {
          onTokenExpired();
        }
      }, refreshTime);
    }
  } else {
    tokenExpiresAt = null;
  }
};

/**
 * Clear access token and cancel any pending refresh
 */
export const clearAccessToken = () => {
  accessTokenMemory = null;
  tokenExpiresAt = null;
  if (tokenExpirationTimer) {
    clearTimeout(tokenExpirationTimer);
    tokenExpirationTimer = null;
  }
};
