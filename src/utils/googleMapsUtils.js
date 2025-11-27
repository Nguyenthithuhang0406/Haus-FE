let googleMapsLoaderPromise = null;

/**
 * Load Google Maps script vào document
 * @param {string} apiKey - Google Maps API key
 * @returns {Promise} Promise resolve khi script đã load xong
 */
export const loadGoogleMapsScript = (apiKey) => {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Window is undefined"));
  }

  if (window.google?.maps) {
    return Promise.resolve();
  }

  if (!apiKey) {
    return Promise.reject(
      new Error("Google Maps API key is missing while loading script.")
    );
  }

  if (!googleMapsLoaderPromise) {
    googleMapsLoaderPromise = new Promise((resolve, reject) => {
      const existingScript = document.querySelector(
        'script[src^="https://maps.googleapis.com/maps/api/js"]'
      );
      if (existingScript) {
        existingScript.addEventListener("load", resolve);
        existingScript.addEventListener("error", () =>
          reject(new Error("Failed to load Google Maps"))
        );
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = resolve;
      script.onerror = () =>
        reject(new Error("Failed to load Google Maps script"));
      document.head.appendChild(script);
    });
  }

  return googleMapsLoaderPromise;
};

/**
 * Lấy thông tin khoảng cách từ Google Distance Matrix API
 * @param {Object} params - { origins: string[], destinations: string[] }
 * @returns {Promise} Promise resolve với response từ Distance Matrix API
 */
export const getDistanceMatrix = ({ origins, destinations }) => {
  return new Promise((resolve, reject) => {
    if (!window.google?.maps) {
      reject(new Error("Google Maps library not initialized"));
      return;
    }

    const service = new window.google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins,
        destinations,
        travelMode: window.google.maps.TravelMode.DRIVING,
        unitSystem: window.google.maps.UnitSystem.METRIC,
      },
      (response, status) => {
        if (status === "OK") {
          resolve(response);
        } else {
          const errorMessage =
            response?.rows?.[0]?.elements?.[0]?.status ||
            response?.error_message ||
            status;
          reject(
            new Error(`Distance Matrix API error: ${errorMessage || status}`)
          );
        }
      }
    );
  });
};

