// Simple in-memory holder for the access token
// Resets on page reload; intended for temporary use until BE changes
let accessTokenMemory = null;

export const getAccessToken = () => accessTokenMemory;

export const setAccessToken = (token) => {
  accessTokenMemory = token || null;
};

export const clearAccessToken = () => {
  accessTokenMemory = null;
};
