import * as Yup from "yup";

export const addressSchema = Yup.object({
  name: Yup.string().required("Vui lòng nhập tên người nhận"),
  phoneNumber: Yup.string()
    .matches(/^[0-9]{10}$/, "Số điện thoại phải có 10 chữ số")
    .required("Vui lòng nhập số điện thoại"),
  province: Yup.string().required("Vui lòng chọn tỉnh/thành phố"),
  district: Yup.string().required("Vui lòng chọn quận/huyện"),
  ward: Yup.string().required("Vui lòng chọn phường/xã"),
  detailedAddress: Yup.string().required("Vui lòng nhập địa chỉ chi tiết"),
});
