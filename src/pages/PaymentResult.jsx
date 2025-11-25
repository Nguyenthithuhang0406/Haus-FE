import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, XCircle } from "lucide-react";
import Layout from "@/components/commons/Layout";
import { Link } from "react-router-dom";

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const status = searchParams.get("status"); // "success" hoặc "failed"
  const message = searchParams.get("message") || "";
  const orderId = searchParams.get("orderId") || "";

  const isSuccess = status === "success";

  return (
    <Layout>
      <div className="max-w-2xl mx-auto mt-[120px] px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {isSuccess ? (
            <>
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Thanh toán thành công!
              </h1>
              <p className="text-lg text-gray-600 mb-2">
                Đơn hàng của bạn đã được xác nhận và đang được xử lý.
              </p>
              {message && (
                <p className="text-sm text-gray-500 mb-4">{message}</p>
              )}
              {orderId && (
                <p className="text-sm text-gray-500 mb-6">
                  Mã đơn hàng: <span className="font-semibold">{orderId}</span>
                </p>
              )}
            </>
          ) : (
            <>
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="w-12 h-12 text-red-600" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Thanh toán thất bại
              </h1>
              <p className="text-lg text-gray-600 mb-2">
                Có lỗi xảy ra trong quá trình thanh toán.
              </p>
              {message && (
                <p className="text-sm text-red-500 mb-4">{message}</p>
              )}
              {orderId && (
                <p className="text-sm text-gray-500 mb-6">
                  Mã đơn hàng: <span className="font-semibold">{orderId}</span>
                </p>
              )}
            </>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link
              to="/"
              className="px-6 py-3 bg-[#ad7555] hover:bg-[#945f46] text-white font-semibold rounded-lg transition-colors"
            >
              Về trang chủ
            </Link>
            <Link
              to="/order-infor"
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors"
            >
              Xem đơn hàng
            </Link>
            {!isSuccess && (
              <button
                onClick={() => navigate("/paymentPage")}
                className="px-6 py-3 bg-[#ad7555] hover:bg-[#945f46] text-white font-semibold rounded-lg transition-colors"
              >
                Thử lại
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentResult;

