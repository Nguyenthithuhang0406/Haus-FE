import React, { lazy, Suspense, useEffect } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import AOS from "aos";
import "aos/dist/aos.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getCookie } from "./utils/cookies";

const Home = lazy(() => import("@/pages/Home"));
const AuthForm = lazy(() => import("@/components/auth/AuthForm"));
const OTPForm = lazy(() => import("@/components/auth/OtpForm"));
const ForgotPassword = lazy(() => import("@/components/auth/ForgotPassword"));
const UpdatePassword = lazy(() => import("@/pages/UpdatePassword"));
const ChangePassword = lazy(() => import("@/pages/ChangePassword"));
const ViewEditInfor = lazy(() => import("@/pages/ViewEditInfor"));
const Promotion = lazy(() => import("@/pages/Promotion"));
const LayoutAdmin = lazy(() => import("@/components/admin/Layouta"));
const ManagerCategory = lazy(() =>
  import("@/components/admin/Category/CategoriesPage")
);
const ManagerProduct = lazy(() =>
  import("@/components/admin/Product/ProductsPage")
);
const ListProductByCategory = lazy(() =>
  import("@/pages/ListProductByCategory")
);
const DetailProduct = lazy(() => import("@/pages/DetailProduct"));
const Search = lazy(() => import("@/pages/Search"));

const PaymentPage = lazy(() => import("@/components/payment/PaymentPage"))
const WishList = lazy(()=> import("@/pages/WishList"))
const App = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Thời gian hiệu ứng (ms)
      once: true, // Chỉ chạy một lần khi cuộn
    });
  }, []);

  const ProtectedRoute = ({ children, allowedRoles }) => {
    const role = getCookie("role");

    if (!role) {
      return <Navigate to="/login" replace />;
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
    { path: "/", element: <Home /> },
    { path: "/auth", element: <AuthForm /> },
    { path: "/auth/verifyOTP", element: <OTPForm /> },
    { path: "/forgot-password", element: <ForgotPassword /> },
    { path: "/update-password", element: <UpdatePassword /> },
    { path: "/change-password", element: <ChangePassword /> },
    { path: "/view-infor", element: <ViewEditInfor /> },
    { path: "/listProductByCategory", element: <ListProductByCategory /> },
    { path: "/detailProduct/:id", element: <DetailProduct /> },
    { path: "/search", element: <Search /> },
    { path: "/paymentPage", element: <PaymentPage /> },
    { path: "/promotion", element: <Promotion /> },
    {
      path: "/admin",
      // element: <LayoutAdmin />,
      element: (
        <ProtectedRoute allowedRoles={["ADMIN"]}>
          <LayoutAdmin />
        </ProtectedRoute>
      ),
      children: [
        { path: "managerCategory", element: <ManagerCategory /> },
        { path: "managerProduct", element: <ManagerProduct /> },
        { path: "managerPromotion", element: <Promotion /> },
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
    {path:"/wishlist",element:<WishList />},
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
