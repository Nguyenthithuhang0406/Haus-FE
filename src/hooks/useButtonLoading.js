import { useState, useCallback } from "react";

/**
 * Custom hook để quản lý loading state của button
 * Ngăn chặn multiple clicks khi đang xử lý request
 * @param {Function} asyncFunction - Hàm async để thực thi
 * @returns {Object} { isLoading, execute }
 */
export const useButtonLoading = (asyncFunction) => {
  const [isLoading, setIsLoading] = useState(false);

  const execute = useCallback(
    async (...args) => {
      // Nếu đang loading, không cho phép click tiếp
      if (isLoading) {
        return;
      }

      setIsLoading(true);
      try {
        await asyncFunction(...args);
      } catch (error) {
        console.error("Button loading error:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [asyncFunction, isLoading]
  );

  return { isLoading, execute };
};
