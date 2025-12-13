// ResetNewPassword.jsx
import { updatePassword } from "@/api/user";
import { updatePasswordSchema } from "@/utils/validation/authValidation";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AiFillEye } from "react-icons/ai";
import { AiFillEyeInvisible } from "react-icons/ai";

export default function UpdatePassword() {
  const location = useLocation();
  const { email } = location.state || {};
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  const initialValues = {
    password: "",
    confirmPassword: "",
  };

  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      const response = await updatePassword({
        email,
        newPassword: values.password,
      });
      if (response.status === 200) {
        toast.success("Cập nhật mật khẩu thành công!");
        navigate("/auth");
      }
    } catch (error) {
      toast.error("Cập nhật mật khẩu thất bại!");
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-[200px] p-[2%] flex justify-center">
        <div className="w-[400px] rounded-md shadow-lg bg-gray-50 flex items-center justify-center py-6 px-4">
          <Formik
            initialValues={initialValues}
            validationSchema={updatePasswordSchema}
            onSubmit={handleSubmit}
            className="w-full"
          >
            {({ values }) => (
              <Form className="w-full flex flex-col gap-4">
                <p className="text-[#ad7555] font-semibold text-[25px] text-center">
                  Đặt lại mật khẩu
                </p>
                <div className="w-full relative flex flex-col gap-2">
                  <p className="text-gray-600 text-sm font-medium">
                    Mật khẩu mới <span className="text-red-500">*</span>
                  </p>
                  <Field
                    name="password"
                    type={showPassword.password ? "text" : "password"}
                    placeholder="Mật khẩu mới"
                    value={values.password}
                    className="w-full p-2 border border-gray-400 rounded-xl focus:outline-none focus:border-[#ad7555] shadow-sm focus:shadow-md"
                  />
                  {showPassword.password ? (
                    <AiFillEye
                      className="absolute right-3 top-[40px] text-gray-600 text-base cursor-pointer"
                      onClick={() =>
                        setShowPassword((prev) => ({
                          ...prev,
                          password: !prev.password,
                        }))
                      }
                    />
                  ) : (
                    <AiFillEyeInvisible
                      className="absolute right-3 top-[40px] text-gray-600 text-base cursor-pointer"
                      onClick={() =>
                        setShowPassword((prev) => ({
                          ...prev,
                          password: !prev.password,
                        }))
                      }
                    />
                  )}
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="w-full relative flex flex-col gap-2">
                  <p className="text-gray-600 text-sm font-medium">
                    Xác nhận mật khẩu <span className="text-red-500">*</span>
                  </p>
                  <Field
                    name="confirmPassword"
                    type={showPassword.confirmPassword ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu"
                    value={values.confirmPassword}
                    className="w-full p-2 border border-gray-400 rounded-xl focus:outline-none focus:border-[#ad7555] shadow-sm focus:shadow-md"
                  />
                  {showPassword.confirmPassword ? (
                    <AiFillEye
                      className="absolute right-3 top-[40px] text-gray-600 text-base cursor-pointer"
                      onClick={() =>
                        setShowPassword((prev) => ({
                          ...prev,
                          confirmPassword: !prev.confirmPassword,
                        }))
                      }
                    />
                  ) : (
                    <AiFillEyeInvisible
                      className="absolute right-3 top-[40px] text-gray-600 text-base cursor-pointer"
                      onClick={() =>
                        setShowPassword((prev) => ({
                          ...prev,
                          confirmPassword: !prev.confirmPassword,
                        }))
                      }
                    />
                  )}
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <button type="submit" className="w-full bg-[#ad7555] text-white py-2 rounded-lg font-medium shadow-md hover:bg-[#8c5c3f] hover:shadow-lg transition cursor-pointer">
                  Cập nhật mật khẩu
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
  );
}
