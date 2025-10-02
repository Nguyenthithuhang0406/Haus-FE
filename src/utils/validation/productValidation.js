import * as Yup from "yup";

export const ProductSchema = () =>
  Yup.object().shape({
    productName: Yup.string().required("Tên sản phẩm bắt buộc"),
    categories: Yup.string().required("Danh mục bắt buộc"),
    description: Yup.string()
      .required("Mô tả ngắn bắt buộc")
      .max(100, "Mô tả ngắn tối đa 1000 ký tự"),
    detailDescription: Yup.string()
      .required("Mô tả chi tiết bắt buộc")
      .max(1000, "Mô tả chi tiết tối đa 2000 ký tự"),
    price: Yup.number()
      .min(1000, "Giá tối thiểu 1000đ")
      .required("Giá bắt buộc"),
    images: Yup.array().required("Ảnh bắt buộc"),
    // images: Yup.array()
    //   .test("min-images", "Cần ít nhất 2 ảnh cho sản phẩm", function (value) {
    //     // value = ảnh đang chọn trong form
    //     // previews = ảnh cũ (đã load sẵn khi edit)
    //     const total = (value?.length || 0) + (previews?.length || 0);
    //     if (isEdit) {
    //       return total >= 2;
    //     }
    //     return (value?.length || 0) >= 2;
    //   })
    //   .required("Ảnh bắt buộc"),
  });
