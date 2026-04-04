/* eslint-disable */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  sentEmailForgotPassword,
  verifyOTPForForgotPassword,
} from "@/api/auth";
import { toast } from "react-toastify";
import { formatTime } from "@/utils/function";

const ForgotPassword = () => {
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [forgotEmailError, setForgotEmailError] = useState("");
  const [accountNotFound, setAccountNotFound] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [countdown, setCountdown] = useState(300);
  const [canResend, setCanResend] = useState(false);

  const navigate = useNavigate();
  // Countdown timer effect
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0 && resetEmailSent) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [countdown, resetEmailSent]);

  const validateEmail = (email, isForForgot = false) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.includes("@")) {
      const errorMsg =
        "Vui lòng bao gồm '@' trong địa chỉ email. " + email + " bị thiếu '@'.";
      if (isForForgot) {
        setForgotEmailError(errorMsg);
      } else {
        setEmailError(errorMsg);
      }
      return false;
    }
    if (!emailRegex.test(email)) {
      const errorMsg = "Vui lòng nhập địa chỉ email hợp lệ.";
      if (isForForgot) {
        setForgotEmailError(errorMsg);
      } else {
        setEmailError(errorMsg);
      }
      return false;
    }
    if (isForForgot) {
      setForgotEmailError("");
    } else {
      setEmailError("");
    }
    return true;
  };

  const handleSendEmail = async () => {
    try {
      const response = await sentEmailForgotPassword({
        email: forgotEmail,
      });
      if (response?.status === 202) {
        setResetEmailSent(true);
        setAccountNotFound(false);
        setCanResend(false);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        switch (error.response.status) {
          case 500:
            toast.error("Lỗi hệ thống");
            break;
          case 400:
            toast.error("Email không hợp lệ");
            break;
          case 404:
            setAccountNotFound(true);
            toast.error("Không tìm thấy tài khoản");
            break;
          default:
            toast.error("Đã xảy ra lỗi, vui lòng kiểm tra lại kết nối!");
        }
        setResetEmailSent(false);
      }
    }
  };

  const verifyOTP = async () => {
    const data = {
      email: forgotEmail,
      otp,
    };
    try {
      const response = await verifyOTPForForgotPassword(data);
      if (response.status === 200) {
        setResetEmailSent(false);
        setAccountNotFound(false);
        navigate("/update-password", { state: { email: forgotEmail } });
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        switch (error.response.status) {
          case 500:
            toast.error("Lỗi hệ thống");
            break;
          case 400:
            toast.error("OTP không hợp lệ");
            break;
          default:
            toast.error("Đã xảy ra lỗi, vui lòng kiểm tra lại kết nối!");
        }
        setResetEmailSent(false);
      }
    }
  };

  const handleForgotPassword = async () => {
    if (resetEmailSent) {
      verifyOTP();
    } else {
      if (validateEmail(forgotEmail, true)) {
        handleSendEmail();
      }
    }
  };

  const handleResendOTP = () => {
    handleSendEmail();
  };

  const handleForgotEmailChange = (e) => {
    setForgotEmail(e.target.value);
    setForgotEmailError("");
    setAccountNotFound(false);
    setResetEmailSent(false);
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-[200px] p-[2%]">
        <div className="bg-gray-50 flex items-center justify-center py-8 px-4">
          <div className="max-w-sm w-full bg-white rounded-lg shadow-md p-6">
            <div className="text-center mb-6">
              <h1 className="text-xl font-bold text-gray-800 mb-2">
                QUÊN MẬT KHẨU
              </h1>
              <p className="text-gray-600">
                Nếu bạn chưa có tài khoản,{" "}
                <a
                  href="#"
                  onClick={() => navigate("/auth")}
                  className="text-[#b4805d] hover:text-gray-600"
                >
                  đăng ký tại đây
                </a>
              </p>
            </div>

            <div className="space-y-4">
              {accountNotFound && (
                <div className="mb-4">
                  <p className="text-red-600 text-sm font-medium">
                    Không tìm thấy tài khoản tương ứng với email này.
                  </p>
                </div>
              )}

              {resetEmailSent && (
                <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded-md">
                  <p className="text-green-800 text-sm">
                    Chúng tôi đã gửi OTP đến email của bạn. Vui lòng kiểm tra để
                    đặt lại mật khẩu
                  </p>
                </div>
              )}

              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={forgotEmail}
                  onChange={handleForgotEmailChange}
                  className={`w-full px-3 py-2.5 bg-gray-100 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent text-sm ${
                    forgotEmailError
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-200 focus:ring-[#b4805d]"
                  }`}
                />
                {forgotEmailError && (
                  <div className="mt-2 p-2 bg-orange-100 border border-orange-300 rounded-md">
                    <div className="flex items-start">
                      <span className="text-orange-600 font-bold mr-2">!</span>
                      <span className="text-orange-800 text-sm">
                        {forgotEmailError}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {resetEmailSent && (
                <div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Nhập mã OTP"
                      value={otp}
                      onChange={handleOtpChange}
                      className="w-full px-3 py-2.5 pr-10 bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b4805d] focus:border-transparent text-sm"
                      maxLength="6"
                    />
                    <button
                      onClick={handleResendOTP}
                      disabled={!canResend}
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                        canResend
                          ? "text-[#b4805d] hover:text-[#ad7555] cursor-pointer"
                          : "text-gray-400 cursor-not-allowed"
                      }`}
                      title="Gửi lại OTP"
                    >
                      <i className="fas fa-redo text-sm"></i>
                    </button>
                  </div>
                  <div className="mt-2 text-center">
                    {countdown > 0 ? (
                      <p className="text-gray-600 text-xs">
                        Gửi lại OTP sau:{" "}
                        <span className="font-medium text-[#b4805d]">
                          {formatTime(countdown)}
                        </span>
                      </p>
                    ) : (
                      <p className="text-green-600 text-xs">
                        Bạn có thể gửi lại OTP ngay bây giờ
                      </p>
                    )}
                  </div>
                </div>
              )}

              <button
                onClick={handleForgotPassword}
                className="w-full bg-[#ad7555] text-white font-medium py-2.5 rounded-md border border-[#ad7555] hover:bg-white hover:text-[#ad7555] transition duration-200 text-sm"
              >
                {resetEmailSent ? "Xác nhận OTP" : "Lấy lại mật khẩu"}
              </button>

              <div className="text-center">
                <p className="text-gray-600 mb-3 text-sm">
                  Hoặc đăng nhập bằng
                </p>
                <div className="flex">
                  <div className="flex-1 px-4">
                    <button className="w-full bg-[#3b5998] hover:bg-blue-700 text-white py-1 flex items-center justify-center space-x-3 transition duration-200 text-sm">
                      <span className="pr-3 border-r border-[#2a498c]">
                        <i className="fa-brands fa-facebook-f"></i>
                      </span>
                      <span>Facebook</span>
                    </button>
                  </div>
                  <div className="flex-1 px-4">
                    <button className="w-full bg-[#e14b33] hover:bg-red-600 text-white py-1 flex items-center justify-center space-x-3 transition duration-200 text-sm">
                      <span className="pr-3 border-r border-[#ce452f]">
                        <i className="fa-brands fa-google"></i>
                      </span>
                      <span>Google</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default ForgotPassword;
