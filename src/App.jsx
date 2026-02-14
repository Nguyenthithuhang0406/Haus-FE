import React, { lazy, Suspense, useEffect } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import AOS from "aos";
import "aos/dist/aos.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { refreshToken } from "@/api/auth";
import { getAccessToken } from "@/utils/tokenMemory";
import { useDispatch } from "react-redux";
import { loadFavorites } from "./store/favoriteSlice";

const Layout = lazy(() => import("@/components/commons/Layout"));
const Home = lazy(() => import("@/pages/Home"));
const AuthForm = lazy(() => import("@/components/auth/AuthForm"));
const OTPForm = lazy(() => import("@/components/auth/OtpForm"));
const ForgotPassword = lazy(() => import("@/components/auth/ForgotPassword"));
const UpdatePassword = lazy(() => import("@/pages/UpdatePassword"));
const ChangePassword = lazy(() => import("@/pages/ChangePassword"));
const ViewEditInfor = lazy(() => import("@/pages/ViewEditInfor"));
const Promotion = lazy(() => import("@/pages/Promotion"));
const LayoutAdmin = lazy(() => import("@/components/admin/Layouta"));
const ManagerCategory = lazy(
  () => import("@/components/admin/Category/CategoriesPage"),
);
const ManagerProduct = lazy(
  () => import("@/components/admin/Product/ProductsPage"),
);
const ListProductByCategory = lazy(
  () => import("@/pages/ListProductByCategory"),
);
const DashboardPage = lazy(
  () => import("@/components/admin/Dashboard/DashBoardPage"),
);
const Order = lazy(() => import("@/pages/OrderManagerment"));
const DetailProduct = lazy(() => import("@/pages/DetailProduct"));
const Search = lazy(() => import("@/pages/Search"));
const CartPage = lazy(() => import("@/pages/CartPage"));
const PaymentPage = lazy(() => import("@/components/payment/PaymentPage"));
const PaymentResult = lazy(() => import("@/pages/PaymentResult"));
const WishList = lazy(() => import("@/pages/WishList"));
const OrderInfor = lazy(() => import("@/pages/OrderInfor"));
const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    AOS.init({
      duration: 1000, // Thời gian hiệu ứng (ms)
      once: true, // Chỉ chạy một lần khi cuộn
    });

    // Load favorites khi vào trang web
    dispatch(loadFavorites());
    // loadCartQuantity sẽ được gọi trong UserLayout để tránh gọi lại mỗi lần chuyển trang

    // Preload access token into memory if user is logged in (check by role in localStorage)
    const hasUserLogged = localStorage.getItem("role");
    const hasAccess = getAccessToken();
    if (hasUserLogged && !hasAccess) {
      // Silent refresh; ignore errors if BE not ready
      refreshToken().catch(() => {});
    }
  }, [dispatch]);

  const ProtectedRoute = ({ children, allowedRoles }) => {
    const role = localStorage.getItem("role");

    if (!role) {
      return <Navigate to="/auth" replace />;
    }

    if (!allowedRoles.includes(role)) {
      return (
        <div className="text-center text-red-500 text-xl mt-20">
          {" "}
          Page not found
        </div>
      );
    }

    return children;
  };

  const routes = useRoutes([
    {
      element: <Layout />,
      children: [
        { path: "/", element: <Home /> },
        { path: "/auth", element: <AuthForm /> },
        { path: "/auth/verifyOTP", element: <OTPForm /> },
        { path: "/forgot-password", element: <ForgotPassword /> },
        { path: "/update-password", element: <UpdatePassword /> },
        { path: "/change-password", element: <ChangePassword /> },
        { path: "/view-infor", element: <ViewEditInfor /> },
        {
          path: "/listProductByCategory/:categoryId",
          element: <ListProductByCategory />,
        },
        { path: "/detailProduct/:id", element: <DetailProduct /> },
        { path: "/search", element: <Search /> },
        { path: "/paymentPage", element: <PaymentPage /> },
        { path: "/payment-result", element: <PaymentResult /> },
        { path: "/order-infor", element: <OrderInfor /> },
        { path: "/wishlist", element: <WishList /> },
        { path: "/cart", element: <CartPage /> },
      ],
    },
    {
      path: "/admin",
      // element: <LayoutAdmin />,
      element: (
        <ProtectedRoute allowedRoles={["ADMIN"]}>
          <LayoutAdmin />
        </ProtectedRoute>
      ),
      children: [
        { path: "dashboard", element: <DashboardPage /> },
        { path: "managerCategory", element: <ManagerCategory /> },
        { path: "managerProduct", element: <ManagerProduct /> },
        { path: "managerPromotion", element: <Promotion /> },
        { path: "managerOrder", element: <Order /> },
      ],
    },
    {
      path: "*",
      element: (
        <div className="text-center text-red-500 text-xl mt-20">
          {" "}
          Page not found
        </div>
      ),
    },
  ]);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        containerClassName="!z-20"
      />
      <Suspense fallback={<div>Loading...</div>}>{routes}</Suspense>
    </>
  );
};

export default App;
