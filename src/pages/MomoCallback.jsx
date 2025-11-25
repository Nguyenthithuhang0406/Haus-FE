import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { momoCallback } from "@/api/payment";
import Layout from "@/components/commons/Layout";

const MomoCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Lấy tất cả query params từ URL
        const params = new URLSearchParams(searchParams).toString();
        
        // Gọi API momoCallback
        const response = await momoCallback(params);
        
        console.log("Momo callback response:", response);

        // Xác định kết quả và navigate đến PaymentResult
        const isSuccess = response?.status === 200 || response?.data?.resultCode === 0;
        const orderId = response?.data?.orderId || searchParams.get("orderId") || "";
        const message = response?.data?.message || response?.message || "";

        navigate(
          `/payment-result?status=${isSuccess ? "success" : "failed"}&orderId=${orderId}&message=${encodeURIComponent(message)}`
        );
      } catch (error) {
        console.error("Momo callback error:", error);
        const orderId = searchParams.get("orderId") || "";
        const errorMessage = error?.response?.data?.message || "Có lỗi xảy ra khi xử lý thanh toán";
        
        navigate(
          `/payment-result?status=failed&orderId=${orderId}&message=${encodeURIComponent(errorMessage)}`
        );
      } finally {
        setLoading(false);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto mt-[120px] px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ad7555]"></div>
            </div>
            <p className="mt-4 text-gray-600">Đang xử lý thanh toán...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return null;
};

export default MomoCallback;

