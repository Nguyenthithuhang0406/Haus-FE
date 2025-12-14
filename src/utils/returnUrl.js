/**
 * Utility functions để lưu và lấy return URL sau khi đăng nhập
 */

const RETURN_URL_KEY = "returnUrl";

/**
 * Lưu URL hiện tại vào sessionStorage để quay lại sau khi đăng nhập
 * @param {string} url - URL cần lưu (mặc định là window.location.pathname + search)
 */
export const saveReturnUrl = (url = null) => {
  const urlToSave = url || window.location.pathname + window.location.search;
  sessionStorage.setItem(RETURN_URL_KEY, urlToSave);
};

/**
 * Lấy return URL từ sessionStorage và xóa nó
 * @returns {string|null} - Return URL hoặc null nếu không có
 */
export const getReturnUrl = () => {
  const returnUrl = sessionStorage.getItem(RETURN_URL_KEY);
  if (returnUrl) {
    sessionStorage.removeItem(RETURN_URL_KEY);
    return returnUrl;
  }
  return null;
};

/**
 * Xóa return URL (nếu cần)
 */
export const clearReturnUrl = () => {
  sessionStorage.removeItem(RETURN_URL_KEY);
};
