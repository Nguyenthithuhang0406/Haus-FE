import pc2 from "../../img/anhthietke1.webp";
import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function AuthForm() {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Init AOS
    useEffect(() => {
        AOS.init({ duration: 800, once: false, offset: 100 });
    }, []);
    useEffect(() => {
        AOS.refresh();
    }, [isLogin]);

    // Check trạng thái login từ localStorage
    useEffect(() => {
        const loggedIn = localStorage.getItem("isLoggedIn") === "true";
        setIsLoggedIn(loggedIn);
    }, []);

    // Schema validation
    const LoginSchema = Yup.object({
        email: Yup.string().email("Email không hợp lệ").required("Vui lòng nhập email"),
        password: Yup.string().min(6, "Mật khẩu phải ít nhất 6 ký tự").required("Vui lòng nhập mật khẩu"),
    });

    const RegisterSchema = Yup.object({
        firstName: Yup.string().required("Vui lòng nhập họ"),
        lastName: Yup.string().required("Vui lòng nhập tên"),
        email: Yup.string().email("Email không hợp lệ").required("Vui lòng nhập email"),
        password: Yup.string().min(6, "Mật khẩu phải ít nhất 6 ký tự").required("Vui lòng nhập mật khẩu"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("password"), null], "Mật khẩu nhập lại không khớp")
            .required("Vui lòng nhập lại mật khẩu"),
    });

    const handleSubmit = (values, { setSubmitting, setErrors, resetForm }) => {
        const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

        if (isLogin) {
            const existingUser = storedUsers.find(
                (u) => u.email === values.email && u.password === values.password
            );
            if (!existingUser) {
                setErrors({ email: "Sai email hoặc mật khẩu!" });
                setSubmitting(false);
                return;
            }
            localStorage.setItem("isLoggedIn", "true");
            setIsLoggedIn(true);
        } else {
            const userExists = storedUsers.some((u) => u.email === values.email);
            if (userExists) {
                setErrors({ email: "Email đã tồn tại!" });
                setSubmitting(false);
                return;
            }
            const newUser = {
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                password: values.password,
            };
            storedUsers.push(newUser);
            localStorage.setItem("users", JSON.stringify(storedUsers));
            alert("Đăng ký thành công, mời bạn đăng nhập!");
            setIsLogin(true);
            resetForm();
        }
        setSubmitting(false);
    };

    const logoutHandler = () => {
        localStorage.setItem("isLoggedIn", "false");
        setIsLoggedIn(false);
    };

    if (isLoggedIn) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="bg-white shadow-lg rounded-lg p-8 text-center" data-aos="zoom-in">
                    <h2 className="text-2xl font-bold text-[#ad7555] mb-4">Xin chào!</h2>
                    <p className="mb-4">Bạn đã đăng nhập thành công 🎉</p>
                    <button
                        onClick={logoutHandler}
                        className="bg-[#ad7555] hover:bg-[#8c5c3f] text-white px-4 py-2 rounded-md transition duration-300"
                    >
                        Đăng xuất
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white shadow-lg rounded-lg flex flex-col md:flex-row overflow-hidden w-full max-w-md md:max-w-4xl">

                {/* Cột bên trái */}
                <div
                    key={isLogin ? "left-login" : "left-register"}
                    className={`hidden md:flex w-full md:w-1/2 bg-gray-50 flex-col p-6 md:p-8 gap-4 
                    ${isLogin ? "justify-center items-center" : "justify-start items-center"}`}
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
                                            <ErrorMessage name="firstName" component="p" className="text-red-500 text-sm" />
                                        </div>
                                        <div>
                                            <Field
                                                type="text"
                                                name="lastName"
                                                placeholder="Tên"
                                                className="w-full p-2 border border-gray-400 rounded-xl focus:outline-none focus:border-[#ad7555] shadow-sm focus:shadow-md"
                                            />
                                            <ErrorMessage name="lastName" component="p" className="text-red-500 text-sm" />
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
                                    <ErrorMessage name="email" component="p" className="text-red-500 text-sm" />
                                </div>

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
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 text-base"
                                    >
                                        {showPassword ? (
                                            <i className="fa-solid fa-eye"></i>
                                        ) : (
                                            <i className="fa-solid fa-eye-slash"></i>
                                        )}
                                    </button>
                                    <ErrorMessage name="password" component="p" className="text-red-500 text-sm" />
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
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 text-base"
                                        >
                                            {showConfirmPassword ? (
                                                <i className="fa-solid fa-eye"></i>
                                            ) : (
                                                <i className="fa-solid fa-eye-slash"></i>
                                            )}
                                        </button>
                                        <ErrorMessage name="confirmPassword" component="p" className="text-red-500 text-sm" />
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

                                <div className="text-center text-sm md:text-base" data-aos="fade-up">
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
                                    <p className="text-center text-sm text-gray-500 cursor-pointer">
                                        Quên mật khẩu?
                                    </p>
                                )}

                                <div className="flex items-center my-3 md:my-4" data-aos="fade-up">
                                    <hr className="flex-grow border-gray-300" />
                                    <span className="mx-2 text-gray-500 text-sm md:text-base">Hoặc</span>
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
    );
}
