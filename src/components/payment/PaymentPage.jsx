import React, { useState } from "react";
import DeliveryAddress from "./DeliveryAddress";
import PaymentMethod from "./PaymentMethod";
import ProductPayment from "./ProductPayment";
import Header from "@/components/commons/Header";
import Footer from "@/components/commons/Footer";
import { useSelector } from "react-redux";

const PaymentPage = () => {
  const [selectedDeliveryAddress, setSelectedDeliveryAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [orderNote, setOrderNote] = useState(""); // Ghi chú khi đặt hàng
  const orderListItem = useSelector((state) => state.order.orderList);

  return (
    <>
      <Header />
      <div className="max-w-[1400px] mx-auto p-5 flex flex-col md:flex-row gap-5 pt-[180px] pb-[50px]">
        <div className="flex-1 flex flex-col justify-between items-center md:items-start min-w-[300px]">
          <DeliveryAddress onAddressSelect={setSelectedDeliveryAddress} />
          <PaymentMethod
            selectedAddress={selectedDeliveryAddress}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
          />
        </div>
        <div className="w-full md:w-[500px] flex justify-center items-center">
          <ProductPayment
            listProducts={orderListItem}
            diliveryAddress={selectedDeliveryAddress}
            paymentMethod={paymentMethod}
            orderNote={orderNote}
            setOrderNote={setOrderNote}
          />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PaymentPage;
