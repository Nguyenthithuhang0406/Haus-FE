import pc2 from "@/assets/icons/anhthietke1.webp";
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { login, register } from "@/api/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LoginSchema, RegisterSchema } from "@/utils/validation/authValidation";
import Layout from "../commons/Layout";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    if (isLogin) {
      try {
        const response = await login(values);
        if (response.status === 200) {
          toast.success("Đăng nhập thành công!");
          navigate("/");
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          switch (error.response.status) {
            case 500:
              toast.error("Lỗi hệ thống");
              break;
            case 400:
              toast.error("Dữ liệu không hợp lệ");
              break;
            case 404:
              toast.error("Email hoặc mật khẩu không đúng");
              break;
            default:
              toast.error("Đã xảy ra lỗi, vui lòng kiểm tra lại kết nối!");
          }
        }
        console.log(error);
      }
    } else {
      try {
        const response = await register(values);
        if (
          response.status === 201 ||
          response.message ===
            "Register successful. OTP has been sent to your email"
        ) {
          toast.success(
            "Đăng ký thành công! Mã OTP đã được gửi tới email của bạn."
          );

          navigate("/auth/verifyOTP", { state: { email: values.email } });
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          switch (error.response.status) {
            case 500:
              toast.error("Lỗi hệ thống");
              break;
            case 400:
              toast.error("Dữ liệu không hợp lệ");
              break;
            case 404:
              toast.error("Đăng ký thất bại");
              break;
            case 409:
              toast.error("Tên đăng nhập đã tồn tại");
              break;
            default:
              toast.error("Đã xảy ra lỗi, vui lòng kiểm tra lại kết nối!");
          }
        }
        console.log(error);
      }
    }
  };

  return (
    <Layout>
      <div
        className={`${
          isLogin ? "h-[120vh]" : "h-[140vh]"
        } flex justify-center items-center min-h-screen bg-gray-100 p-4`}
      >
        <div className="bg-white shadow-lg rounded-lg flex flex-col md:flex-row overflow-hidden w-full max-w-md md:max-w-4xl">
          {/* Cột bên trái */}
          <div
            key={isLogin ? "left-login" : "left-register"}
            className={`hidden md:flex w-full md:w-1/2 bg-gray-50 flex-col p-6 md:p-8 gap-4 
                    ${
                      isLogin
                        ? "justify-center items-center"
                        : "justify-start items-center"
                    }`}
            data-aos="fade-right"
          >
            <h2 className="text-2xl font-bold text-[#ad7555] mb-4">
              {isLogin ? "Đăng ký" : "Đăng nhập"}
            </h2>
            <p className="text-gray-600 text-base mb-6 text-center">
              {isLogin
                ? "Chào mừng bạn đến với Haüs. Nếu bạn chưa có tài khoản, có thể đăng ký tại ô dưới đây."
                : "Chào mừng bạn đến với Haüs. Nếu bạn đã có tài khoản, có thể đăng nhập tại ô dưới đây."}
            </p>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="bg-[#ad7555] hover:bg-[#8c5c3f] text-white px-4 py-2 rounded-md transition duration-300 cursor-pointer"
            >
              {isLogin ? "Tạo tài khoản" : "Tôi có tài khoản"}
            </button>
            <img
              src={pc2}
              alt="Decor"
              className="mt-6 rounded-lg shadow-md w-32 h-32 md:w-full md:h-60 object-contain"
              data-aos="flip-left"
            />
          </div>

          {/* Form bên phải */}
          <div
            key={isLogin ? "right-login" : "right-register"}
            className="w-full md:w-1/2 p-6 md:p-8"
            data-aos="fade-left"
          >
            <h2 className="text-xl md:text-2xl font-bold text-[#ad7555] mb-4 md:mb-6 text-center">
              {isLogin ? "Đăng nhập" : "Đăng ký"}
            </h2>

            <Formik
              initialValues={{
                firstName: "",
                lastName: "",
                email: "",
                username: "",
                password: "",
                confirmPassword: "",
              }}
              validationSchema={isLogin ? LoginSchema : RegisterSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-3 md:space-y-4">
                  {!isLogin && (
                    <div className="space-y-3 md:space-y-4">
                      <div>
                        <Field
                          type="text"
                          name="firstName"
                          placeholder="Họ"
                          className="w-full p-2 border border-gray-400 rounded-xl focus:outline-none focus:border-[#ad7555] shadow-sm focus:shadow-md"
                        />
                        <ErrorMessage
                          name="firstName"
                          component="p"
                          className="text-red-500 text-sm"
                        />
                      </div>
                      <div>
                        <Field
                          type="text"
                          name="lastName"
                          placeholder="Tên"
                          className="w-full p-2 border border-gray-400 rounded-xl focus:outline-none focus:border-[#ad7555] shadow-sm focus:shadow-md"
                        />
                        <ErrorMessage
                          name="lastName"
                          component="p"
                          className="text-red-500 text-sm"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <Field
                      type="email"
                      name="email"
                      placeholder="Email"
                      className="w-full p-2 border border-gray-400 rounded-xl focus:outline-none focus:border-[#ad7555] shadow-sm focus:shadow-md"
                    />
                    <ErrorMessage
                      name="email"
                      component="p"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {!isLogin && (
                    <div>
                      <Field
                        type="username"
                        name="username"
                        placeholder="Tên đăng nhập"
                        className="w-full p-2 border border-gray-400 rounded-xl focus:outline-none focus:border-[#ad7555] shadow-sm focus:shadow-md"
                      />
                      <ErrorMessage
                        name="username"
                        component="p"
                        className="text-red-500 text-sm"
                      />
                    </div>
                  )}

                  <div className="relative">
                    <Field
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Mật khẩu"
                      className="w-full p-2 border border-gray-400 rounded-xl focus:outline-none focus:border-[#ad7555] shadow-sm focus:shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-[10px] text-gray-600 text-base"
                    >
                      {showPassword ? (
                        <i className="fa-solid fa-eye"></i>
                      ) : (
                        <i className="fa-solid fa-eye-slash"></i>
                      )}
                    </button>
                    <ErrorMessage
                      name="password"
                      component="p"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {!isLogin && (
                    <div className="relative">
                      <Field
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="Xác nhận lại mật khẩu"
                        className="w-full p-2 border border-gray-400 rounded-xl focus:outline-none focus:border-[#ad7555] shadow-sm focus:shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-[10px] text-gray-600 text-base"
                      >
                        {showConfirmPassword ? (
                          <i className="fa-solid fa-eye"></i>
                        ) : (
                          <i className="fa-solid fa-eye-slash"></i>
                        )}
                      </button>
                      <ErrorMessage
                        name="confirmPassword"
                        component="p"
                        className="text-red-500 text-sm"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#ad7555] hover:bg-[#8c5c3f] text-white py-2 rounded-md transition duration-300 cursor-pointer"
                    data-aos="zoom-in"
                  >
                    {isLogin ? "Đăng nhập" : "Đăng ký"}
                  </button>

                  <div
                    className="text-center text-sm md:text-base"
                    data-aos="fade-up"
                  >
                    {isLogin ? (
                      <p>
                        Bạn chưa có tài khoản?{" "}
                        <span
                          onClick={() => setIsLogin(false)}
                          className="text-[#ad7555] cursor-pointer"
                        >
                          Đăng ký
                        </span>
                      </p>
                    ) : (
                      <p>
                        Bạn đã có tài khoản?{" "}
                        <span
                          onClick={() => setIsLogin(true)}
                          className="text-[#ad7555] cursor-pointer"
                        >
                          Đăng nhập
                        </span>
                      </p>
                    )}
                  </div>

                  {isLogin && (
                    <p
                      className="text-center text-sm text-gray-500 cursor-pointer hover:underline"
                      onClick={() => navigate("/forgot-password")}
                    >
                      Quên mật khẩu?
                    </p>
                  )}

                  <div
                    className="flex items-center my-3 md:my-4"
                    data-aos="fade-up"
                  >
                    <hr className="flex-grow border-gray-300" />
                    <span className="mx-2 text-gray-500 text-sm md:text-base">
                      Hoặc
                    </span>
                    <hr className="flex-grow border-gray-300" />
                  </div>

                  <button
                    type="button"
                    className="w-full border border-gray-300 py-2 rounded-md flex justify-center items-center gap-2 cursor-pointer text-sm md:text-base hover:bg-gray-100 transition"
                    data-aos="flip-up"
                  >
                    <img
                      src="https://www.svgrepo.com/show/355037/google.svg"
                      alt="Google"
                      className="w-5 h-5"
                    />
                    Đăng nhập bằng Google
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </Layout>
  );
}
