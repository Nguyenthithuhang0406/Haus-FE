import { createOrder } from "@/api/order";
import { getUrlVnpay, paymentCod, paymentMomo } from "@/api/payment";
import { generateOrderNumber, getPaymentConfig } from "@/utils/paymentUtils";
import { toast } from "react-toastify";

/**
 * Tạo orderItems từ listProducts
 * @param {Array} listProducts - Danh sách sản phẩm
 * @returns {Array} Mảng orderItems
 */
export const createOrderItems = (listProducts) => {
  const orderItems = [];
  listProducts.forEach((item) => {
    item.productVariations
      .filter((variant) => variant.isSelected)
      .forEach((variant) => {
        const priceAtSale = Math.round(
          variant.price * ((100 - (variant.discountPercent || 0)) / 100)
        );
        orderItems.push({
          productVariationId: variant.id,
          quantity: variant.cartQuantity,
          priceAtSale: priceAtSale,
        });
      });
  });
  return orderItems;
};

/**
 * Tạo order data để gửi lên API
 * @param {Object} params - { orderItems, shippingFee, total, diliveryAddress, promotion, orderNote, paymentMethod }
 * @returns {Object} Order data
 */
export const buildOrderData = ({
  orderItems,
  shippingFee,
  total,
  diliveryAddress,
  promotion,
  orderNote,
  paymentMethod,
}) => {
  const { paymentGateway, paymentType } = getPaymentConfig(paymentMethod);

  return {
    orderItems: orderItems,
    order: {
      orderNumber: generateOrderNumber(paymentMethod),
      shippingFee: shippingFee,
      totalAmount: total,
      addresses: [
        {
          id: diliveryAddress.id,
          isSelected: true,
        },
      ],
      ...(promotion?.id && { promotionId: promotion.id }),
      ...(orderNote && orderNote.trim() && { note: orderNote.trim() }),
    },
    payment: {
      paymentGateway: paymentGateway,
      paymentType: paymentType,
    },
  };
};

/**
 * Xử lý thanh toán COD
 * @param {Object} params - { orderId, phoneNumber, orderNote, navigate }
 * @returns {Promise<boolean>} true nếu thành công, false nếu thất bại
 */
export const handleCodPayment = async ({
  orderId,
  phoneNumber,
  orderNote,
  navigate,
}) => {
  if (!phoneNumber) {
    toast.error(
      "Không tìm thấy số điện thoại. Vui lòng kiểm tra lại địa chỉ giao hàng."
    );
    return false;
  }

  try {
    const paymentResponse = await paymentCod({
      orderId: orderId,
      phoneNumber: phoneNumber,
      note: orderNote?.trim() || "",
    });

    const isSuccess = paymentResponse?.status === 200 || paymentResponse?.data;

    // Navigate đến trang kết quả thanh toán với thông tin COD
    navigate(
      `/payment-result?paymentMethod=COD&orderId=${orderId}&status=${
        isSuccess ? "success" : "failed"
      }`
    );

    return isSuccess;
  } catch (paymentError) {
    console.error("Failed to process COD payment:", paymentError);
    navigate(
      `/payment-result?paymentMethod=COD&orderId=${orderId}&status=failed`
    );
    return false;
  }
};

/**
 * Xử lý thanh toán MOMO
 * @param {Object} params - { orderId }
 * @returns {Promise<boolean>} true nếu thành công, false nếu thất bại
 */
export const handleMomoPayment = async ({ orderId }) => {
  try {
    const paymentResponse = await paymentMomo({
      orderId: orderId,
    });

    if (paymentResponse?.status === 200 || paymentResponse?.data) {
      const paymentUrl = paymentResponse?.data?.payUrl;
      if (paymentUrl) {
        window.location.href = paymentUrl;
        return true;
      } else {
        toast.success(
          "Đơn hàng đã được tạo thành công! Vui lòng thanh toán qua MoMo."
        );
        return false;
      }
    } else {
      toast.error(
        "Đơn hàng đã được tạo nhưng có lỗi khi xử lý thanh toán MOMO. Vui lòng liên hệ hỗ trợ."
      );
      return false;
    }
  } catch (paymentError) {
    console.error("Failed to process MOMO payment:", paymentError);
    toast.error(
      "Đơn hàng đã được tạo nhưng có lỗi khi xử lý thanh toán MOMO. Vui lòng liên hệ hỗ trợ."
    );
    return false;
  }
};

/**
 * Xử lý thanh toán VNPAY
 * @param {Object} params - { orderId }
 * @returns {Promise<boolean>} true nếu thành công, false nếu thất bại
 */
export const handleVnpayPayment = async ({ orderId }) => {
  try {
    const response = await getUrlVnpay({ orderId: orderId });
    // TODO: Redirect đến VNPay nếu có URL
    window.location.href = response?.data;
    toast.success("Đơn hàng đã được tạo thành công!");
    return true;
  } catch (error) {
    console.log("error in vnpay:", error);
    toast.error("Có lỗi xảy ra khi xử lý thanh toán VNPay.");
    return false;
  }
};

/**
 * Xử lý đặt hàng với các phương thức thanh toán khác nhau
 * @param {Object} params - { listProducts, diliveryAddress, paymentMethod, orderNote, shippingFee, total, promotion, navigate }
 * @returns {Promise<void>}
 */
export const processOrder = async ({
  listProducts,
  diliveryAddress,
  paymentMethod,
  orderNote,
  shippingFee,
  total,
  promotion,
  navigate,
}) => {
  if (!diliveryAddress) {
    toast.error("Vui lòng chọn địa chỉ giao hàng");
    return;
  }

  const orderItems = createOrderItems(listProducts);
  const orderData = buildOrderData({
    orderItems,
    shippingFee,
    total,
    diliveryAddress,
    promotion,
    orderNote,
    paymentMethod,
  });

  try {
    const response = await createOrder(orderData);

    const orderId = response?.data?.orderId || response.data;

    if (!orderId) {
      toast.error("Không thể lấy thông tin đơn hàng. Vui lòng thử lại.");
      return;
    }

    // Xử lý theo phương thức thanh toán
    if (paymentMethod === "COD") {
      await handleCodPayment({
        orderId,
        phoneNumber: diliveryAddress?.phoneNumber,
        orderNote,
        navigate,
      });
    } else if (paymentMethod === "MOMO") {
      await handleMomoPayment({ orderId });
    } else if (paymentMethod === "VNPAY") {
      await handleVnpayPayment({ orderId });
    }
  } catch (error) {
    console.error("Failed to create order:", error);

    // Kiểm tra lỗi 409 với message exception.cart.quantity.invalid
    if (
      error?.response?.status === 409 &&
      error?.response?.data?.message === "exception.cart.quantity.invalid"
    ) {
      toast.error("Mặt hàng đã hết");
    } else {
      toast.error("Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.");
    }
  }
};
