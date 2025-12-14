import React from "react";
import { Modal, Input, Select, Checkbox, Button, message } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useFormik } from "formik";
import * as Yup from "yup";

const { TextArea } = Input;
const { Option } = Select;

const CancelOrderModal = ({ visible, order, onCancel, onConfirm }) => {
  const cancelReasons = [
    "Tìm được sản phẩm tốt hơn với giá rẻ hơn",
    "Thay đổi ý định mua hàng",
    "Thời gian giao hàng quá lâu",
    "Muốn thay đổi địa chỉ giao hàng",
    "Muốn thay đổi sản phẩm/màu sắc/kích thước",
    "Tìm thấy mã giảm giá tốt hơn",
    "Đặt nhầm sản phẩm",
    "Lý do khác",
  ];

  // Validation schema với Yup
  const validationSchema = Yup.object({
    selectedReason: Yup.string().required("Vui lòng chọn lý do hủy đơn"),
    customReason: Yup.string().when("selectedReason", {
      is: "Lý do khác",
      then: (schema) =>
        schema
          .required("Vui lòng nhập lý do hủy đơn")
          .min(10, "Lý do phải có ít nhất 10 ký tự")
          .max(500, "Lý do không được vượt quá 500 ký tự"),
      otherwise: (schema) =>
        schema.max(300, "Ghi chú không được vượt quá 300 ký tự"),
    }),
    agreePolicy: Yup.boolean().oneOf(
      [true],
      "Vui lòng đồng ý với chính sách hủy đơn"
    ),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      selectedReason: "",
      customReason: "",
      agreePolicy: false,
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const cancelData = {
          orderId: order?.id,
          reason:
            values.selectedReason === "Lý do khác"
              ? values.customReason
              : values.selectedReason,
          note:
            values.selectedReason !== "Lý do khác" && values.customReason
              ? values.customReason
              : null,
          timestamp: new Date().toISOString(),
        };

        await new Promise((resolve) => setTimeout(resolve, 500));

        onConfirm(order?.id, cancelData);

        // Hiển thị thông báo thành công
        message.success("Hủy đơn hàng thành công!");

        // Reset form và đóng modal
        handleClose();
      } catch (error) {
        message.error("Có lỗi xảy ra, vui lòng thử lại!");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleClose = () => {
    formik.resetForm();
    onCancel();
  };

  // Tính phí hủy (nếu có)
  const getCancellationFee = () => {
    if (!order) return 0;

    if (order.status === "Đang chờ") {
      return 0;
    } else if (order.status === "Đang giao") {
      return order.total * 0.1;
    }
    return 0;
  };

  const cancellationFee = getCancellationFee();

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 text-red-600">
          <ExclamationCircleOutlined className="text-2xl" />
          <span className="text-lg font-semibold">Xác nhận hủy đơn hàng</span>
        </div>
      }
      open={visible}
      onCancel={handleClose}
      footer={null}
      width={600}
      centered
    >
      <form onSubmit={formik.handleSubmit}>
        <div className="space-y-4 mt-4">
          {/* Thông tin đơn hàng */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Thông tin đơn hàng</h4>
            <div className="space-y-1 text-sm">
              <p>
                <span className="text-gray-600">Mã đơn:</span>{" "}
                <span className="font-medium">{order?.orderNumber}</span>
              </p>
              <p>
                <span className="text-gray-600">Sản phẩm:</span>{" "}
                <span className="font-medium">{order?.name}</span>
              </p>
              <p>
                <span className="text-gray-600">Tổng tiền:</span>{" "}
                <span className="font-medium text-red-600">
                  {(order?.total || order?.totalAmount || 0).toLocaleString()}đ
                </span>
              </p>
              <p>
                <span className="text-gray-600">Trạng thái:</span>{" "}
                <span className="font-medium">{order?.status}</span>
              </p>
            </div>
          </div>

          {/* Cảnh báo phí hủy */}
          {cancellationFee > 0 && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <p className="text-yellow-800 font-medium">
                Phí hủy đơn:{" "}
                <span className="text-red-600">
                  {cancellationFee.toLocaleString()}đ
                </span>
              </p>
              <p className="text-sm text-yellow-700 mt-1">
                Do đơn hàng đang được giao, bạn sẽ bị tính phí hủy 10% giá trị
                đơn hàng
              </p>
            </div>
          )}

          {/* Chọn lý do hủy */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Lý do hủy đơn <span className="text-red-500">*</span>
            </label>
            <Select
              placeholder="Chọn lý do hủy đơn"
              value={formik.values.selectedReason || undefined}
              onChange={(value) =>
                formik.setFieldValue("selectedReason", value)
              }
              onBlur={() => formik.setFieldTouched("selectedReason", true)}
              className="w-full"
              size="large"
              status={
                formik.touched.selectedReason && formik.errors.selectedReason
                  ? "error"
                  : ""
              }
            >
              {cancelReasons.map((reason) => (
                <Option key={reason} value={reason}>
                  {reason}
                </Option>
              ))}
            </Select>
            {formik.touched.selectedReason && formik.errors.selectedReason && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.selectedReason}
              </div>
            )}
          </div>

          {/* Nhập lý do chi tiết nếu chọn "Lý do khác" */}
          {formik.values.selectedReason === "Lý do khác" && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Chi tiết lý do <span className="text-red-500">*</span>
              </label>
              <TextArea
                placeholder="Vui lòng nhập lý do hủy đơn của bạn..."
                name="customReason"
                value={formik.values.customReason}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                rows={4}
                maxLength={500}
                showCount
                status={
                  formik.touched.customReason && formik.errors.customReason
                    ? "error"
                    : ""
                }
              />
              {formik.touched.customReason && formik.errors.customReason && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.customReason}
                </div>
              )}
            </div>
          )}

          {/* Ghi chú thêm */}
          {formik.values.selectedReason &&
            formik.values.selectedReason !== "Lý do khác" && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Ghi chú thêm (không bắt buộc)
                </label>
                <TextArea
                  placeholder="Bạn có thể thêm ghi chú..."
                  name="customReason"
                  value={formik.values.customReason}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  rows={3}
                  maxLength={300}
                  showCount
                  status={
                    formik.touched.customReason && formik.errors.customReason
                      ? "error"
                      : ""
                  }
                />
                {formik.touched.customReason && formik.errors.customReason && (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.customReason}
                  </div>
                )}
              </div>
            )}

          {/* Chính sách hoàn tiền */}
          <div className="bg-blue-50 p-4 rounded-lg text-sm">
            <h5 className="font-semibold text-blue-900 mb-2">
              📋 Chính sách hoàn tiền:
            </h5>
            <ul className="space-y-1 text-blue-800">
              <li>• Đơn hàng "Đang chờ": Hoàn 100% giá trị</li>
              <li>
                • Đơn hàng "Đang giao": Hoàn 90% giá trị (trừ 10% phí vận
                chuyển)
              </li>
              <li>• Thời gian hoàn tiền: 3-5 ngày làm việc</li>
            </ul>
          </div>

          {/* Checkbox đồng ý */}
          <div>
            <Checkbox
              name="agreePolicy"
              checked={formik.values.agreePolicy}
              onChange={(e) =>
                formik.setFieldValue("agreePolicy", e.target.checked)
              }
              onBlur={() => formik.setFieldTouched("agreePolicy", true)}
            >
              <span className="text-sm">
                Tôi đã đọc và đồng ý với{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  chính sách hủy đơn hàng
                </a>
              </span>
            </Checkbox>
            {formik.touched.agreePolicy && formik.errors.agreePolicy && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.agreePolicy}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              size="large"
              onClick={handleClose}
              className="flex-1"
              disabled={formik.isSubmitting}
            >
              Quay lại
            </Button>
            <Button
              type="primary"
              danger
              size="large"
              htmlType="submit"
              loading={formik.isSubmitting}
              className="flex-1"
            >
              Xác nhận hủy đơn
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default CancelOrderModal;
