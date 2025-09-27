import * as Yup from "yup";

const getPlainTextLength = (html) =>
  html ? html.replace(/<[^>]*>/g, "").trim().length : 0;

export const ProductSchema = () =>
  Yup.object().shape({
    productName: Yup.string().required("Tên sản phẩm bắt buộc"),
    categories: Yup.string().required("Danh mục bắt buộc"),
    description: Yup.string()
      .required("Mô tả ngắn bắt buộc")
      .max(100, "Mô tả ngắn tối đa 1000 ký tự"),
    detailDescription: Yup.string()
      .required("Mô tả chi tiết bắt buộc")
      .test("max-plain-text", "Mô tả chi tiết tối đa 2000 ký tự", (value) => {
        if (!value) return false;
        return getPlainTextLength(value) <= 2000;
      }),
    price: Yup.number()
      .min(1000, "Giá tối thiểu 1000đ")
      .required("Giá bắt buộc"),
    images: Yup.array()
      .min(2, "Cần ít nhất 2 ảnh cho sản phẩm")
      .required("Ảnh bắt buộc"),
  });
