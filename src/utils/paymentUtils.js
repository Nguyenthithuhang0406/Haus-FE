/**
 * Tạo orderNumber duy nhất với thông tin phương thức thanh toán
 * @param {string} paymentMethod - Phương thức thanh toán (COD, VNPAY, MOMO)
 * @returns {string} Order number theo format: ORDER + PaymentCode + YYYYMMDD + HHMMSS + random 4 digits
 */
export const generateOrderNumber = (paymentMethod) => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  const date = new Date(timestamp);
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
  const timeStr = date.toTimeString().slice(0, 8).replace(/:/g, "");

  const paymentCode =
    paymentMethod === "COD"
      ? "COD"
      : paymentMethod === "VNPAY"
      ? "VNP"
      : paymentMethod === "MOMO"
      ? "MOM"
      : "";

  return `ORDER${paymentCode}${dateStr}${timeStr}${random}`;
};

/**
 * Xác định paymentGateway và paymentType dựa trên paymentMethod
 * @param {string} paymentMethod - Phương thức thanh toán
 * @returns {Object} { paymentGateway, paymentType }
 */
export const getPaymentConfig = (paymentMethod) => {
  let paymentGateway = null;
  let paymentType = "CASH_ON_DELIVERY";

  if (paymentMethod === "VNPAY") {
    paymentGateway = "VNPAY";
    paymentType = "ONLINE_PAYMENT";
  } else if (paymentMethod === "MOMO") {
    paymentGateway = "MOMO";
    paymentType = "ONLINE_PAYMENT";
  }

  return { paymentGateway, paymentType };
};

