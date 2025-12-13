import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import IconFixedRight from "./IconFixedRight";
import IconFixedLeft from "./IconFixedLeft";
import { useDispatch } from "react-redux";
import { loadCartQuantity } from "@/store/orderSlice";

const Layout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Load số lượng giỏ hàng khi layout mount (chỉ chạy 1 lần)
    dispatch(loadCartQuantity());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <IconFixedRight />
      <IconFixedLeft />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
