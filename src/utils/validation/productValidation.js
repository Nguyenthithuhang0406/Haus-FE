import * as Yup from "yup";

export const ProductSchema = (isEdit, previews) =>
  Yup.object().shape({
    productName: Yup.string().required("Tên sản phẩm bắt buộc"),
    categories: Yup.string().required("Danh mục bắt buộc"),
    material: Yup.string().required("Chất liệu bắt buộc"),
    description: Yup.string()
      .required("Mô tả ngắn bắt buộc")
      .max(500, "Mô tả ngắn tối đa 500 ký tự"),
    detailDescription: Yup.string()
      .required("Mô tả chi tiết bắt buộc")
      .max(2000, "Mô tả chi tiết tối đa 2000 ký tự"),
    price: Yup.number()
      .min(1000, "Giá tối thiểu 1000đ")
      .required("Giá bắt buộc"),
    images: Yup.array()
      .test("min-images", "Cần ít nhất 2 ảnh cho sản phẩm", function (value) {
        // value = ảnh mới đang chọn trong form
        // previews = ảnh cũ đã load (từ component truyền vào)
        const total = (value?.length || 0) + (previews?.length || 0);
        return total >= 2;
      })
      .required("Ảnh bắt buộc"),
  });
