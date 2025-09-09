import React, { lazy, Suspense, useEffect } from "react";
import { useRoutes } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import AOS from "aos";
import "aos/dist/aos.css";

const Home = lazy(() => import("@/pages/Home"));
const ForgotPassword = lazy(() => import("@/components/auth/ForgotPassword"));
const ChangePassword = lazy(() => import("@/pages/ChangePassword"));
const ViewEditInfor = lazy(() => import("@/pages/ViewEditInfor"));
const Promotion = lazy(()=> import("@/pages/Promotion")) ;
const ListProductByCategory = lazy(() =>
  import("@/pages/ListProductByCategory")
);
const App = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Thời gian hiệu ứng (ms)
      once: true, // Chỉ chạy một lần khi cuộn
    });
  }, []);

  const routes = useRoutes([
    { path: "/", element: <Home /> },
    { path: "/forgot-password", element: <ForgotPassword /> },
    { path: "/change-password", element: <ChangePassword /> },
    { path: "/view-infor", element: <ViewEditInfor /> },
    { path: "/listProductByCategory", element: <ListProductByCategory /> },
    {path:"/promotion",element:<Promotion/>},
  ]);

  return <Suspense fallback={<div>Loading...</div>}>{routes}</Suspense>;
};

export default App;
