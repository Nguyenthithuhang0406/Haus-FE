import React, { lazy, Suspense, useEffect } from "react";
import { useRoutes } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import AOS from "aos";
import "aos/dist/aos.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

const App = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Thời gian hiệu ứng (ms)
      once: true, // Chỉ chạy một lần khi cuộn
    });
  }, []);

  const ProtectedRoute = ({ children, allowedRoles }) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
      return <Navigate to="/" replace />;
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
    {
      path: "/admin",
      element: <LayoutAdmin />,
      // element: (
      //   <ProtectedRoute allowedRoles={["admin"]}>
      //     <LayoutAdmin />
      //   </ProtectedRoute>
      // ),
      children: [
        { path: "managerCategory", element: <ManagerCategory /> },
        { path: "managerProduct", element: <ManagerProduct /> },
        { path: "managerPromotion", element: <Promotion /> },
      ],
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
