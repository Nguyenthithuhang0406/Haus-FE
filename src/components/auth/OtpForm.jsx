import { verifyOTPRegister } from "@/api/auth";
import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import { FaUserLock } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AuthenOTP = () => {
  const location = useLocation();
  const { email } = location.state || {};
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputRefs = useRef([]);
  const [timeLeft, setTimeLeft] = useState(120);

  const navigate = useNavigate();
  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleSubmit = async () => {
    const data = {
      email,
      otp: otp.join(""),
    };

    try {
      const response = await verifyOTPRegister(data);
      if (response.status === 200) {
        toast.success("Xác thực OTP thành công!");
        navigate("/");
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
          case 404:
            toast.error("OTP không hợp lệ.");
            break;
          default:
            toast.error("Đã xảy ra lỗi, vui lòng kiểm tra lại kết nối!");
        }
      }
      console.log(error);
    }
  };

  const handleResend = () => {
    setTimeLeft(120);
    setOtp(new Array(6).fill(""));
    inputRefs.current[0].focus();
    // onResend();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-[400px] text-center">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <FaUserLock className="text-[#ad7555] drop-shadow-md" size={80} />
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-[#ad7555] mb-2">XÁC THỰC OTP</h2>
        <p className="text-sm text-gray-600 mb-6">
          Vui lòng nhập mã số chúng tôi đã gửi cho bạn qua{" "}
          <span className="font-medium">{email}</span>. Mã xác thực có giá trị
          trong <span className="font-semibold text-red-500">{timeLeft}s</span>
        </p>

        {/* OTP Input */}
        <div className="flex justify-center gap-3 mb-6">
          {otp.map((value, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength="1"
              value={value}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-12 text-center text-lg border border-gray-400 rounded-xl shadow-sm 
                                       focus:outline-none focus:border-[#ad7555] focus:shadow-md"
            />
          ))}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-[#ad7555] text-white py-2 rounded-lg font-semibold shadow-md 
                               hover:bg-[#8c5c3f] hover:shadow-lg transition cursor-pointer"
        >
          Tiếp tục
        </button>

        {/* Resend OTP */}
        <p className="text-sm text-gray-600 mt-4">
          {timeLeft > 0 ? (
            <>
              Chưa nhận được mã?{" "}
              <span className="text-gray-400">Gửi lại sau {timeLeft}s</span>
            </>
          ) : (
            <>
              Chưa nhận được mã?{" "}
              <span
                onClick={handleResend}
                className="text-[#ad7555] cursor-pointer hover:underline"
              >
                Gửi lại
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default AuthenOTP;
