import { useState, useEffect } from "react";

/**
 * Custom hook for debounced input that syncs with external filter state
 * @param {string} initialValue - Initial value for the input
 * @param {string} filterKey - Key in the filters object
 * @param {object} filters - Current filters object
 * @param {function} setFilters - Function to update filters
 * @param {function} setCurrentPage - Function to reset page to 1
 * @param {number} delay - Debounce delay in milliseconds (default: 500)
 * @returns {[string, function]} - [inputValue, setInputValue]
 */
const useDebouncedInput = (
  initialValue,
  filterKey,
  filters,
  setFilters,
  setCurrentPage,
  delay = 500
) => {
  const [inputValue, setInputValue] = useState(initialValue || "");
  const currentFilterValue = filters[filterKey];

  // Debounce effect - updates filter after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== currentFilterValue) {
        setFilters((prev) => ({
          ...prev,
          [filterKey]: inputValue,
        }));
        setCurrentPage(1);
      }
    }, delay);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue, filterKey, currentFilterValue]);

  // Sync with external filter changes (e.g., when filters are cleared)
  useEffect(() => {
    setInputValue(currentFilterValue || "");
  }, [currentFilterValue]);

  return [inputValue, setInputValue];
};

export default useDebouncedInput;

