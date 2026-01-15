import * as Yup from "yup";

export const VariantSchema = Yup.object().shape({
  color: Yup.string().required("Vui lòng chọn màu"),
  size: Yup.string().required("Vui lòng chọn kích thước"),
  price: Yup.number()
    .typeError("Giá phải là số")
    .positive("Giá phải lớn hơn 0")
    .required("Vui lòng nhập giá"),
  inventoryQuantity: Yup.number()
    .typeError("Số lượng phải là số")
    .min(0, "Tồn kho không được âm")
    .required("Vui lòng nhập số lượng"),
  images: Yup.mixed()
    .required("Ảnh bắt buộc")
    .test("fileType", "Chỉ chấp nhận file ảnh (jpg, png, jpeg)", (value) => {
      if (!value) return false;
      if (typeof value === "string") return true; // Hỗ trợ URL cũ
      return ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(value.type);
    })
    .test("fileSize", "Ảnh phải nhỏ hơn 5MB", (value) => {
      if (!value) return false;
      if (typeof value === "string") return true; // Hỗ trợ URL cũ
      return value.size <= 5 * 1024 * 1024;
    }),
});
