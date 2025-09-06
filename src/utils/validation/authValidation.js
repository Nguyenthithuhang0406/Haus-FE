import * as Yup from "yup";

const passwordRules =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#~()[\]{}<>.,:;'"|\\/+=_-]).{8,}$/;

export const LoginSchema = Yup.object({
  email: Yup.string()
    .email("Email không hợp lệ")
    .required("Vui lòng nhập email"),
  password: Yup.string()
    .matches(
      passwordRules,
      "Mật khẩu phải ≥ 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt"
    )
    .required("Vui lòng nhập mật khẩu"),
});

export const RegisterSchema = Yup.object({
  firstName: Yup.string().required("Vui lòng nhập họ"),
  lastName: Yup.string().required("Vui lòng nhập tên"),
  email: Yup.string()
    .email("Email không hợp lệ")
    .required("Vui lòng nhập email"),
  password: Yup.string()
    .matches(
      passwordRules,
      "Mật khẩu phải ≥ 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt"
    )
    .required("Vui lòng nhập mật khẩu"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Mật khẩu nhập lại không khớp")
    .required("Vui lòng nhập lại mật khẩu"),
});

export const updatePasswordSchema = Yup.object({
  password: Yup.string()
    .matches(
      passwordRules,
      "Mật khẩu phải ≥ 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt"
    )
    .required("Vui lòng nhập mật khẩu"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Mật khẩu nhập lại không khớp")
    .required("Vui lòng nhập lại mật khẩu"),
});
