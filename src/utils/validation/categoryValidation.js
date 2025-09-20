import * as Yup from "yup";

export const CategorySchema = Yup.object().shape({
  name: Yup.string().required("Tên danh mục không được để trống"),
  room: Yup.string().required("Phòng bắt buộc chọn"),
  description: Yup.string()
    .min(5, "Mô tả ít nhất 5 ký tự")
    .required("Mô tả không được để trống"),
});
