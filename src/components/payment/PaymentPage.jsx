import React, { useState } from "react";
import DeliveryAddress from "./DeliveryAddress";
import PaymentMethod from "./PaymentMethod";
import ProductPayment from "./ProductPayment";
import Header from "@/components/commons/Header";
import Footer from "@/components/commons/Footer";
import { useSelector } from "react-redux";
import { setOrderList } from "@/store/orderSlice";

const PaymentPage = () => {
  const [selectedDeliveryAddress, setSelectedDeliveryAddress] = useState(null);
  const orderListItem = useSelector((state) => state.order.orderList);
  const [itemsPayment, setItemsPayment] = useState(orderListItem || []);

  console.log("orderList:", orderListItem);

  return (
    <>
      <Header />
      <div className="max-w-[1400px] mx-auto p-5 flex flex-col md:flex-row gap-5 pt-[180px] pb-[50px]">
        <div className="flex-1 flex flex-col justify-between items-center md:items-start min-w-[300px]">
          <DeliveryAddress onAddressSelect={setSelectedDeliveryAddress} />
          <PaymentMethod selectedAddress={selectedDeliveryAddress} />
        </div>
        <div className="w-full md:w-[500px] flex justify-center items-center">
          <ProductPayment listProducts={itemsPayment} />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PaymentPage;
